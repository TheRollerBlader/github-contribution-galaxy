export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Vue: '#41b883',
  Dart: '#00B4AB',
  Solidity: '#AA6746',
  Lua: '#000080',
  Zig: '#ec915c',
  Elixir: '#6e4a7e',
  Scala: '#c22d40',
  Haskell: '#5e5086',
  R: '#198CE7',
  Julia: '#a270ba',
  Default: '#60a5fa',
};

export function getLanguageColor(lang?: string | null): string {
  if (!lang) return LANGUAGE_COLORS.Default;
  return LANGUAGE_COLORS[lang] || '#a855f7';
}

/**
 * Maps commit count and stars to visual star radius
 * R = R_min + scale * log10(commits + stars * 2 + 1)
 */
export function calculateStarRadius(commits: number, stars: number): number {
  const base = Math.log10(commits + stars * 2 + 1);
  return Math.max(1.8, Math.min(8.0, 1.6 + base * 1.5));
}

/**
 * Assigns a spectral class based on size/activity
 */
export function getSpectralClass(radius: number): 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M' {
  if (radius > 6.0) return 'O'; // Blue giant (hyperactive)
  if (radius > 5.0) return 'B'; // Deep blue
  if (radius > 4.2) return 'A'; // White
  if (radius > 3.4) return 'F'; // Yellow-white
  if (radius > 2.6) return 'G'; // Yellow (Sun-like)
  if (radius > 2.0) return 'K'; // Orange
  return 'M'; // Red dwarf
}

/**
 * Generates logarithmic spiral galaxy coordinates for a collection of repositories
 * Formula: r = a * exp(b * theta)
 * Spreads repositories across 2 to 4 galactic spiral arms with vertical disk thickness
 */
export function projectGalacticCoordinates(
  index: number,
  totalCount: number,
  armCount: number = 3
): [number, number, number] {
  if (index === 0 && totalCount > 1) {
    // Flagship repo placed in the dense inner stellar halo
    return [12 + (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3, 10 + (Math.random() - 0.5) * 4];
  }

  const armIndex = index % armCount;
  const armOffset = (armIndex * 2 * Math.PI) / armCount;

  // Normalized progress along arm
  const t = (index / Math.max(totalCount, 1)) * 1.8 + 0.15;
  const a = 14; // Core exclusion radius
  const b = 0.28; // Spiral tightness coefficient

  // Logarithmic spiral angle and radius
  const theta = t * 2.5 * Math.PI;
  const r = a * Math.exp(b * (theta / (2 * Math.PI)));

  // Add natural cosmic dispersion
  const angleWithArm = theta + armOffset;
  const radialJitter = (Math.sin(index * 9.7) * 0.5 + 0.5) * 12 - 6;
  const tangentialJitter = (Math.cos(index * 13.3) * 0.5 + 0.5) * 8 - 4;

  const finalRadius = Math.max(8, r + radialJitter);
  const finalAngle = angleWithArm + tangentialJitter / finalRadius;

  const x = finalRadius * Math.cos(finalAngle);
  const z = finalRadius * Math.sin(finalAngle);

  // Vertical scale height: thinner at edges, thicker in bulge
  const scaleHeight = Math.max(2, 10 * Math.exp(-finalRadius / 140));
  const y = (Math.sin(index * 7.1) + Math.cos(index * 3.3)) * 0.5 * scaleHeight;

  return [parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2)), parseFloat(z.toFixed(2))];
}

/**
 * Computes Keplerian orbital parameters for commit nodes orbiting their parent star
 */
export function generateCommitOrbits(
  commitCount: number,
  starRadius: number,
  dateStrings: string[]
): {
  id: string;
  sha: string;
  message: string;
  date: string;
  author: string;
  url: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  orbitInclination: number;
}[] {
  const count = Math.min(commitCount, 60); // Cap orbital rendering for optimal 60fps performance
  const commits = [];

  for (let i = 0; i < count; i++) {
    // Commits orbit in concentric shells from inner ring to outer Kuiper belt
    const ringTier = (i / Math.max(count, 1));
    const orbitRadius = starRadius * 1.6 + ringTier * 14.0 + (i % 3) * 0.8;
    // Kepler's third law approximation: speed ~ 1 / sqrt(r)
    const baseSpeed = 0.8 / Math.sqrt(orbitRadius);
    const orbitSpeed = (0.2 + baseSpeed * 0.8) * (i % 2 === 0 ? 1 : -0.85);
    const orbitAngle = (i / count) * 2 * Math.PI + (i * 1.618);
    // Subtle orbital inclination (tilt relative to galactic plane)
    const orbitInclination = ((i * 37) % 30 - 15) * (Math.PI / 180);

    const date = dateStrings[i] || new Date(Date.now() - i * 86400000 * 5).toISOString();
    const sha = Math.random().toString(16).substring(2, 9);

    commits.push({
      id: `c-${i}-${sha}`,
      sha,
      message: `Refactor core pipeline and optimize stellar rendering #${i + 1}`,
      date,
      author: 'contributor',
      url: `https://github.com`,
      orbitRadius,
      orbitSpeed,
      orbitAngle,
      orbitInclination,
    });
  }

  return commits;
}
