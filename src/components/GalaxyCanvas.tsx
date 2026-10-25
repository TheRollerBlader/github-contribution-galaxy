import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RepositoryStar, CommitNode } from '../types/galaxy';
import { cosmicAudio } from '../utils/audioSynth';

interface GalaxyCanvasProps {
  repositories: RepositoryStar[];
  selectedRepo: RepositoryStar | null;
  onSelectRepo: (repo: RepositoryStar | null) => void;
  hoveredRepo: RepositoryStar | null;
  onHoverRepo: (repo: RepositoryStar | null, screenPos?: { x: number; y: number } | null) => void;
  timelineYear: number;
  bloomEnabled: boolean;
  showOrbits: boolean;
  showNebula: boolean;
  userAvatarUrl?: string;
  cameraMode: 'overview' | 'inclined' | 'free';
}

interface StarVisualData {
  mesh: THREE.Mesh;
  glowMesh: THREE.Sprite;
  orbitGroup: THREE.Group;
  commitMeshes: THREE.Mesh[];
  repo: RepositoryStar;
  baseRadius: number;
  color: THREE.Color;
}

export const GalaxyCanvas: React.FC<GalaxyCanvasProps> = ({
  repositories,
  selectedRepo,
  onSelectRepo,
  onHoverRepo,
  timelineYear,
  showOrbits,
  showNebula,
  cameraMode,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const starObjectsRef = useRef<Map<number, StarVisualData>>(new Map());
  const nebulaGroupRef = useRef<THREE.Group | null>(null);
  const orbitsGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Camera transition state
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Texture generator for circular glow sprite
  const createGlowTexture = useCallback((colorHex: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.2, colorHex);
      gradient.addColorStop(0.55, `${colorHex}55`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.0018);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.5, 4000);
    camera.position.set(0, 120, 210);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 600;
    controls.minDistance = 8;
    controls.maxPolarAngle = Math.PI / 2 + 0.3; // Allow slight under-disk view
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.4;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x60a5fa, 3.5, 300, 1.2);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 6. Galactic Core / Supermassive Singularity
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(4.2, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Core accretion aura
    const coreGlowTex = createGlowTexture('#38bdf8');
    const coreGlowMat = new THREE.SpriteMaterial({
      map: coreGlowTex,
      color: 0x38bdf8,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.9,
    });
    const coreGlowSprite = new THREE.Sprite(coreGlowMat);
    coreGlowSprite.scale.set(38, 38, 1);
    coreGroup.add(coreGlowSprite);

    // Accretion disk rings
    const ringGeo = new THREE.RingGeometry(5.0, 16.0, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    coreGroup.add(ringMesh);
    scene.add(coreGroup);

    // 7. Background Starfield
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#93c5fd'),
      new THREE.Color('#c084fc'),
      new THREE.Color('#f472b6'),
      new THREE.Color('#fde047'),
      new THREE.Color('#38bdf8'),
    ];

    for (let i = 0; i < starCount; i++) {
      // Distribute in a spherical envelope
      const radius = 250 + Math.random() * 850;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeo, starMaterial);
    scene.add(starField);

    // 8. Nebulae dust cloud clusters
    const nebulaGroup = new THREE.Group();
    nebulaGroupRef.current = nebulaGroup;
    const nebulaColors = ['#4f46e5', '#9333ea', '#0284c7', '#ec4899'];
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const dist = 30 + Math.random() * 110;
      const nebTex = createGlowTexture(nebulaColors[i % nebulaColors.length]);
      const nebMat = new THREE.SpriteMaterial({
        map: nebTex,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
      });
      const nebSprite = new THREE.Sprite(nebMat);
      nebSprite.position.set(
        Math.cos(angle) * dist + (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 16,
        Math.sin(angle) * dist + (Math.random() - 0.5) * 20
      );
      const s = 45 + Math.random() * 45;
      nebSprite.scale.set(s, s, 1);
      nebulaGroup.add(nebSprite);
    }
    scene.add(nebulaGroup);

    // 9. Orbits Group
    const orbitsGroup = new THREE.Group();
    orbitsGroupRef.current = orbitsGroup;
    scene.add(orbitsGroup);

    // Raycaster & Mouse tracking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveMeshes: THREE.Mesh[] = [];
      starObjectsRef.current.forEach((item) => {
        if (item.mesh.visible) interactiveMeshes.push(item.mesh);
      });

      const intersects = raycaster.intersectObjects(interactiveMeshes);
      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
        const hitMesh = intersects[0].object as THREE.Mesh;
        const repoId = hitMesh.userData.repoId;
        const item = starObjectsRef.current.get(repoId);
        if (item) {
          onHoverRepo(item.repo, { x: e.clientX, y: e.clientY });
        }
      } else {
        container.style.cursor = 'default';
        onHoverRepo(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveMeshes: THREE.Mesh[] = [];
      starObjectsRef.current.forEach((item) => {
        if (item.mesh.visible) interactiveMeshes.push(item.mesh);
      });

      const intersects = raycaster.intersectObjects(interactiveMeshes);
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const repoId = hitMesh.userData.repoId;
        const item = starObjectsRef.current.get(repoId);
        if (item) {
          onSelectRepo(item.repo);
          cosmicAudio.playWarp();
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // Resize listener
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate galaxy core & starfield slowly
      coreGroup.rotation.y = elapsedTime * 0.15;
      starField.rotation.y = elapsedTime * 0.015;
      if (nebulaGroupRef.current) {
        nebulaGroupRef.current.rotation.y = elapsedTime * 0.02;
      }

      // Animate orbiting commits for each repository
      starObjectsRef.current.forEach((item) => {
        if (!item.mesh.visible) return;

        // Subtle star pulsation
        const pulse = 1.0 + Math.sin(elapsedTime * 2.5 + item.repo.id) * 0.05;
        item.mesh.scale.set(pulse, pulse, pulse);

        // Orbit individual commit bodies around their host star
        item.repo.commits.forEach((commit: CommitNode, cIdx: number) => {
          const cMesh = item.commitMeshes[cIdx];
          if (cMesh) {
            const currentAngle = commit.orbitAngle + elapsedTime * commit.orbitSpeed;
            const r = commit.orbitRadius;
            const incl = commit.orbitInclination;

            // Parametric 3D orbit around the star position
            cMesh.position.x = item.mesh.position.x + r * Math.cos(currentAngle);
            cMesh.position.z = item.mesh.position.z + r * Math.sin(currentAngle);
            cMesh.position.y = item.mesh.position.y + r * Math.sin(currentAngle) * Math.sin(incl);
          }
        });
      });

      // Smooth camera interpolation (Fly-to animation)
      if (targetCamPosRef.current && targetLookAtRef.current && controlsRef.current && cameraRef.current) {
        const lerpFactor = 0.05;
        cameraRef.current.position.lerp(targetCamPosRef.current, lerpFactor);
        controlsRef.current.target.lerp(targetLookAtRef.current, lerpFactor);

        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.2) {
          targetCamPosRef.current = null;
          targetLookAtRef.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
    };
  }, [createGlowTexture, onHoverRepo, onSelectRepo]);

  // Update repositories & stars when profile changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clean up previous star objects
    starObjectsRef.current.forEach((item) => {
      scene.remove(item.mesh);
      scene.remove(item.glowMesh);
      scene.remove(item.orbitGroup);
      item.mesh.geometry.dispose();
    });
    starObjectsRef.current.clear();

    const orbitsGroup = orbitsGroupRef.current;
    if (orbitsGroup) {
      while (orbitsGroup.children.length > 0) {
        const obj = orbitsGroup.children[0];
        orbitsGroup.remove(obj);
      }
    }

    // Build star systems for each repository
    repositories.forEach((repo) => {
      const [x, y, z] = repo.position;
      const color = new THREE.Color(repo.languageColor || '#38bdf8');
      const radius = repo.coreRadius;

      // 1. Star core mesh
      const sphereGeo = new THREE.SphereGeometry(radius, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.1,
      });
      const starMesh = new THREE.Mesh(sphereGeo, sphereMat);
      starMesh.position.set(x, y, z);
      starMesh.userData = { repoId: repo.id };
      scene.add(starMesh);

      // 2. Star corona glow sprite
      const glowTex = createGlowTexture(repo.languageColor || '#38bdf8');
      const glowMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: color,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.75,
      });
      const glowSprite = new THREE.Sprite(glowMat);
      glowSprite.position.set(x, y, z);
      const glowScale = radius * 7.5;
      glowSprite.scale.set(glowScale, glowScale, 1);
      scene.add(glowSprite);

      // 3. Orbit group for commit bodies and trails
      const starOrbitGroup = new THREE.Group();
      const commitMeshes: THREE.Mesh[] = [];

      // Orbit ring trails
      if (orbitsGroup) {
        const orbitCurvePoints = 64;
        const maxOrbit = Math.max(...repo.commits.map((c) => c.orbitRadius), radius * 3);
        const ringGeo = new THREE.BufferGeometry();
        const ringPositions = new Float32Array((orbitCurvePoints + 1) * 3);

        for (let i = 0; i <= orbitCurvePoints; i++) {
          const a = (i / orbitCurvePoints) * Math.PI * 2;
          ringPositions[i * 3] = x + maxOrbit * 0.7 * Math.cos(a);
          ringPositions[i * 3 + 1] = y;
          ringPositions[i * 3 + 2] = z + maxOrbit * 0.7 * Math.sin(a);
        }
        ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
        const ringMat = new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.18,
        });
        const ringLine = new THREE.Line(ringGeo, ringMat);
        orbitsGroup.add(ringLine);
      }

      // 4. Commit orbiting bodies
      const commitGeo = new THREE.SphereGeometry(0.38, 12, 12);
      const commitMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });

      repo.commits.forEach(() => {
        const cMesh = new THREE.Mesh(commitGeo, commitMat);
        cMesh.position.set(x, y, z);
        starOrbitGroup.add(cMesh);
        commitMeshes.push(cMesh);
      });

      scene.add(starOrbitGroup);

      starObjectsRef.current.set(repo.id, {
        mesh: starMesh,
        glowMesh: glowSprite,
        orbitGroup: starOrbitGroup,
        commitMeshes,
        repo,
        baseRadius: radius,
        color,
      });
    });
  }, [repositories, createGlowTexture]);

  // Handle timeline year filtering
  useEffect(() => {
    starObjectsRef.current.forEach((item) => {
      const repoYear = new Date(item.repo.createdAt).getFullYear();
      const isVisible = repoYear <= timelineYear;

      item.mesh.visible = isVisible;
      item.glowMesh.visible = isVisible;
      item.orbitGroup.visible = isVisible;

      // Pulse recently born systems
      if (isVisible && repoYear === timelineYear) {
        item.mesh.scale.set(1.4, 1.4, 1.4);
      }
    });
  }, [timelineYear]);

  // Handle orbits visibility toggle
  useEffect(() => {
    if (orbitsGroupRef.current) {
      orbitsGroupRef.current.visible = showOrbits;
    }
  }, [showOrbits]);

  // Handle nebula visibility toggle
  useEffect(() => {
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.visible = showNebula;
    }
  }, [showNebula]);

  // Handle Camera Presets
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (cameraMode === 'overview') {
      targetCamPosRef.current = new THREE.Vector3(0, 150, 190);
      targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
    } else if (cameraMode === 'inclined') {
      targetCamPosRef.current = new THREE.Vector3(140, 40, 140);
      targetLookAtRef.current = new THREE.Vector3(0, 0, 0);
    }
  }, [cameraMode]);

  // Handle Fly-To Selected Repo
  useEffect(() => {
    if (!selectedRepo || !cameraRef.current || !controlsRef.current) return;
    const [x, y, z] = selectedRepo.position;
    // Position camera slightly offset from the star to observe the star and its orbiting commits
    const offset = Math.max(16, selectedRepo.coreRadius * 4.5);
    targetCamPosRef.current = new THREE.Vector3(x + offset, y + offset * 0.5, z + offset);
    targetLookAtRef.current = new THREE.Vector3(x, y, z);

    // Highlight selected star
    starObjectsRef.current.forEach((item) => {
      const isSelected = item.repo.id === selectedRepo.id;
      item.glowMesh.scale.setScalar(isSelected ? item.baseRadius * 12 : item.baseRadius * 7.5);
      const mat = item.mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = isSelected ? 2.5 : 0.9;
      }
    });
  }, [selectedRepo]);

  return (
    <div className="relative w-full h-full select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
