import { UserGalaxyProfile } from '../types/galaxy';
import { calculateStarRadius, getSpectralClass, projectGalacticCoordinates, generateCommitOrbits, getLanguageColor } from '../utils/galaxyMath';

function buildProfile(
  username: string,
  name: string,
  bio: string,
  avatarUrl: string,
  rawRepos: {
    name: string;
    description: string;
    stars: number;
    forks: number;
    primaryLanguage: string;
    commits: number;
    createdAt: string;
    updatedAt: string;
  }[]
): UserGalaxyProfile {
  let totalStars = 0;
  let totalForks = 0;
  let totalCommits = 0;
  const langMap: Record<string, number> = {};
  const yearsSet = new Set<number>();

  const repositories = rawRepos.map((repo, idx) => {
    totalStars += repo.stars;
    totalForks += repo.forks;
    totalCommits += repo.commits;
    langMap[repo.primaryLanguage] = (langMap[repo.primaryLanguage] || 0) + 1;

    const createdYear = new Date(repo.createdAt).getFullYear();
    yearsSet.add(createdYear);

    const radius = calculateStarRadius(repo.commits, repo.stars);
    const position = projectGalacticCoordinates(idx, rawRepos.length, 3);
    const spectralClass = getSpectralClass(radius);

    // Generate dates for commits
    const commitDates: string[] = [];
    const startMs = new Date(repo.createdAt).getTime();
    const endMs = new Date(repo.updatedAt).getTime();
    for (let c = 0; c < Math.min(repo.commits, 40); c++) {
      const t = startMs + Math.random() * (endMs - startMs);
      commitDates.push(new Date(t).toISOString());
    }
    commitDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const commits = generateCommitOrbits(repo.commits, radius, commitDates);

    return {
      id: 1000 + idx,
      name: repo.name,
      fullName: `${username}/${repo.name}`,
      description: repo.description,
      url: `https://github.com/${username}/${repo.name}`,
      stars: repo.stars,
      forks: repo.forks,
      openIssues: Math.floor(repo.stars * 0.02) + 2,
      primaryLanguage: repo.primaryLanguage,
      languageColor: getLanguageColor(repo.primaryLanguage),
      languages: { [repo.primaryLanguage]: repo.commits * 100 },
      createdAt: repo.createdAt,
      updatedAt: repo.updatedAt,
      pushedAt: repo.updatedAt,
      commitCount: repo.commits,
      commits,
      size: repo.commits * 42,
      position,
      coreRadius: radius,
      spectralClass,
      armIndex: idx % 3,
    };
  });

  const totalRepoCount = rawRepos.length;
  const primaryLanguages = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({
      name: lang,
      count,
      color: getLanguageColor(lang),
      percentage: Math.round((count / totalRepoCount) * 100),
    }));

  const timelineYears = Array.from(yearsSet).sort((a, b) => a - b);
  if (timelineYears.length === 0) timelineYears.push(2020, 2021, 2022, 2023, 2024, 2025);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyActivity = months.map((m, idx) => ({
    month: m,
    commits: Math.floor(totalCommits * (0.05 + 0.06 * Math.sin(idx * 0.8 + 1.2))),
    repos: Math.floor(totalRepoCount * 0.3) + (idx % 3),
  }));

  return {
    username,
    name,
    bio,
    avatarUrl,
    htmlUrl: `https://github.com/${username}`,
    publicRepos: totalRepoCount,
    followers: Math.max(120, totalStars * 3),
    following: 12,
    totalStars,
    totalForks,
    totalCommits,
    primaryLanguages,
    timelineYears,
    monthlyActivity,
    repositories,
  };
}

export const SAMPLE_PROFILES: Record<string, UserGalaxyProfile> = {
  torvalds: buildProfile(
    'torvalds',
    'Linus Torvalds',
    'Creator of Linux and Git. Chief architect of the Linux Kernel.',
    'https://avatars.githubusercontent.com/u/1024025?v=4',
    [
      { name: 'linux', description: 'Linux kernel source tree and core architectural subsystems', stars: 195000, forks: 54000, primaryLanguage: 'C', commits: 1250000, createdAt: '2011-09-04T22:48:48Z', updatedAt: '2026-03-15T10:00:00Z' },
      { name: 'subsurface-for-dirk', description: 'Subsurface dive log program ported to modern architectures', stars: 1980, forks: 420, primaryLanguage: 'C++', commits: 4800, createdAt: '2012-04-12T16:00:00Z', updatedAt: '2025-11-20T14:30:00Z' },
      { name: 'uemacs', description: 'MicroEMACS editor adapted for fast kernel hacking', stars: 1850, forks: 290, primaryLanguage: 'C', commits: 950, createdAt: '2013-05-02T19:22:00Z', updatedAt: '2024-08-11T09:12:00Z' },
      { name: 'pesconvert', description: 'Brother embroidery PES format parser and telemetry visualizer', stars: 450, forks: 60, primaryLanguage: 'C', commits: 120, createdAt: '2012-10-14T18:00:00Z', updatedAt: '2023-01-05T12:00:00Z' },
      { name: 'test-tlb', description: 'TLB invalidation benchmark suite for x86 and ARM processors', stars: 890, forks: 110, primaryLanguage: 'C', commits: 240, createdAt: '2014-06-18T20:00:00Z', updatedAt: '2024-04-12T17:40:00Z' },
      { name: 'libdc-compat', description: 'Compatibility shims for early diving computer USB drivers', stars: 320, forks: 45, primaryLanguage: 'C', commits: 180, createdAt: '2013-02-10T11:15:00Z', updatedAt: '2022-09-30T08:00:00Z' },
      { name: 'audio-vis-dsp', description: 'Experimental low-latency ALSA audio DSP filters', stars: 740, forks: 90, primaryLanguage: 'Rust', commits: 310, createdAt: '2021-08-10T14:00:00Z', updatedAt: '2025-02-14T11:00:00Z' },
      { name: 'k-sched-sim', description: 'Stochastic process scheduler simulator for SMP topologies', stars: 1240, forks: 180, primaryLanguage: 'Python', commits: 420, createdAt: '2019-03-22T08:30:00Z', updatedAt: '2025-06-01T15:20:00Z' },
    ]
  ),

  gaearon: buildProfile(
    'gaearon',
    'Dan Abramov',
    'Co-author of Redux and Create React App. Former React core team member.',
    'https://avatars.githubusercontent.com/u/810438?v=4',
    [
      { name: 'redux', description: 'Predictable state container for JavaScript apps', stars: 60500, forks: 15300, primaryLanguage: 'TypeScript', commits: 3100, createdAt: '2015-05-29T00:00:00Z', updatedAt: '2026-02-28T18:00:00Z' },
      { name: 'react-dnd', description: 'Drag and Drop for React with extensible HTML5 and touch backends', stars: 20200, forks: 2100, primaryLanguage: 'TypeScript', commits: 2200, createdAt: '2014-11-20T12:00:00Z', updatedAt: '2025-10-15T09:00:00Z' },
      { name: 'react-hot-loader', description: 'Tweak React components in real time without losing component state', stars: 13200, forks: 980, primaryLanguage: 'JavaScript', commits: 1650, createdAt: '2014-07-13T10:00:00Z', updatedAt: '2024-05-10T14:00:00Z' },
      { name: 'overreacted.io', description: 'Personal blog by Dan Abramov exploring deep mental models of computing', stars: 6800, forks: 1200, primaryLanguage: 'JavaScript', commits: 890, createdAt: '2018-11-30T15:00:00Z', updatedAt: '2025-12-01T20:00:00Z' },
      { name: 'sublime-react', description: 'Snippets and syntax highlighting for React JSX in Sublime Text', stars: 3400, forks: 450, primaryLanguage: 'JavaScript', commits: 410, createdAt: '2014-01-15T08:00:00Z', updatedAt: '2021-04-12T11:00:00Z' },
      { name: 'normalizr', description: 'Normalizes nested JSON according to a schema for easy state management', stars: 21500, forks: 990, primaryLanguage: 'JavaScript', commits: 760, createdAt: '2015-04-03T18:30:00Z', updatedAt: '2024-07-20T16:00:00Z' },
      { name: 'alchemy-runtime', description: 'Wasm based functional reactive runtime experiment', stars: 2800, forks: 310, primaryLanguage: 'Rust', commits: 540, createdAt: '2022-09-10T12:00:00Z', updatedAt: '2025-08-14T19:00:00Z' },
    ]
  ),

  'rich-harris': buildProfile(
    'rich-harris',
    'Rich Harris',
    'Creator of Svelte and Rollup. Graphics editor, open source craftsman.',
    'https://avatars.githubusercontent.com/u/1162160?v=4',
    [
      { name: 'svelte', description: 'Cybernetically enhanced web apps with compile-time reactivity', stars: 81000, forks: 4300, primaryLanguage: 'TypeScript', commits: 8700, createdAt: '2016-11-16T12:00:00Z', updatedAt: '2026-03-20T17:00:00Z' },
      { name: 'rollup', description: 'Next-generation ES module bundler and tree-shaking engine', stars: 25400, forks: 1500, primaryLanguage: 'Rust', commits: 4200, createdAt: '2015-05-14T10:00:00Z', updatedAt: '2026-01-18T14:30:00Z' },
      { name: 'degit', description: 'Straightforward project scaffolding from git repositories without commit history', stars: 3200, forks: 180, primaryLanguage: 'JavaScript', commits: 350, createdAt: '2017-06-01T14:00:00Z', updatedAt: '2024-03-10T09:00:00Z' },
      { name: 'magic-string', description: 'Manipulate strings like a wizard and generate sourcemaps', stars: 2400, forks: 120, primaryLanguage: 'JavaScript', commits: 480, createdAt: '2014-03-12T18:00:00Z', updatedAt: '2025-04-20T12:00:00Z' },
      { name: 'astring', description: 'Fast and tiny ECMAScript code generator from ESTree AST', stars: 1250, forks: 75, primaryLanguage: 'JavaScript', commits: 290, createdAt: '2015-09-08T11:00:00Z', updatedAt: '2023-11-15T16:00:00Z' },
      { name: 'pancake', description: 'Experimental charts framework designed for high-resolution responsive web graphics', stars: 1890, forks: 95, primaryLanguage: 'Svelte', commits: 410, createdAt: '2018-05-20T19:00:00Z', updatedAt: '2024-09-12T13:45:00Z' },
      { name: 'interactive-globe', description: 'GPU accelerated orthographic planetary projection engine', stars: 3600, forks: 240, primaryLanguage: 'TypeScript', commits: 620, createdAt: '2021-02-14T10:00:00Z', updatedAt: '2025-07-29T18:00:00Z' },
    ]
  ),

  sdras: buildProfile(
    'sdras',
    'Sarah Drasner',
    'Director of Engineering at Google. Author of SVG Animations. Vue core team alumnus.',
    'https://avatars.githubusercontent.com/u/2281088?v=4',
    [
      { name: 'intro-to-vue', description: 'Workshop materials for Frontend Masters Intro to Vue 3', stars: 6200, forks: 1800, primaryLanguage: 'Vue', commits: 520, createdAt: '2017-03-10T12:00:00Z', updatedAt: '2025-02-10T15:00:00Z' },
      { name: 'animista', description: 'CSS animation collection on demand with interactive preview tools', stars: 4500, forks: 620, primaryLanguage: 'CSS', commits: 380, createdAt: '2017-08-15T09:00:00Z', updatedAt: '2024-06-12T11:00:00Z' },
      { name: 'ecommerce-netlify', description: 'Serverless fullstack e-commerce demo with Stripe and Vuex', stars: 2900, forks: 480, primaryLanguage: 'JavaScript', commits: 610, createdAt: '2018-02-01T14:00:00Z', updatedAt: '2024-11-05T17:00:00Z' },
      { name: 'awesome-actions', description: 'Curated list of delightful GitHub Actions and workflow automation tools', stars: 23500, forks: 1600, primaryLanguage: 'Markdown', commits: 1250, createdAt: '2019-08-20T18:00:00Z', updatedAt: '2026-03-01T20:00:00Z' },
      { name: 'vue-vscode-snippets', description: 'Snippets for Vue.js developers in Visual Studio Code', stars: 3100, forks: 340, primaryLanguage: 'TypeScript', commits: 430, createdAt: '2017-10-04T16:00:00Z', updatedAt: '2025-01-19T13:00:00Z' },
      { name: 'svg-generative-art', description: 'Algorithmic procedural SVG patterns and geometric flow fields', stars: 1850, forks: 190, primaryLanguage: 'JavaScript', commits: 340, createdAt: '2020-04-18T10:00:00Z', updatedAt: '2024-08-22T08:30:00Z' },
    ]
  ),

  vibecode: buildProfile(
    'vibecode',
    'Vibecode Galactic Team',
    'Multi-disciplinary autonomous engineering cluster crafting next-gen spatial tools.',
    'https://avatars.githubusercontent.com/u/9919?v=4',
    [
      { name: 'hyper-orbital-engine', description: '3D WebGL physics & cosmic trajectory projection pipeline', stars: 12400, forks: 1850, primaryLanguage: 'TypeScript', commits: 3420, createdAt: '2022-01-15T09:00:00Z', updatedAt: '2026-03-24T18:00:00Z' },
      { name: 'quantum-compiler', description: 'High-throughput bytecode compiler targeting WebAssembly SIMD', stars: 8900, forks: 820, primaryLanguage: 'Rust', commits: 2150, createdAt: '2022-06-10T11:00:00Z', updatedAt: '2026-02-12T14:00:00Z' },
      { name: 'neural-stream-agent', description: 'Distributed stream orchestrator with adaptive backpressure', stars: 7300, forks: 940, primaryLanguage: 'Python', commits: 1640, createdAt: '2023-03-01T15:00:00Z', updatedAt: '2026-03-10T19:00:00Z' },
      { name: 'cosmic-sound-synth', description: 'Procedural WebAudio FM & harmonic drone synthesizer', stars: 3400, forks: 290, primaryLanguage: 'TypeScript', commits: 780, createdAt: '2023-08-22T12:00:00Z', updatedAt: '2025-11-04T10:00:00Z' },
      { name: 'realtime-sync-mesh', description: 'Decentralized CRDT state synchronizer over WebRTC data channels', stars: 5600, forks: 510, primaryLanguage: 'Go', commits: 1320, createdAt: '2023-10-18T14:30:00Z', updatedAt: '2026-01-20T16:00:00Z' },
      { name: 'stellar-telemetry-hud', description: 'Cyberpunk glassmorphic HUD controls and real-time sensor dashboards', stars: 4200, forks: 360, primaryLanguage: 'TypeScript', commits: 910, createdAt: '2024-02-05T08:00:00Z', updatedAt: '2026-03-15T21:00:00Z' },
      { name: 'fast-octree-gpu', description: 'Compute shader Octree spatial partitioning for N-body celestial simulation', stars: 6100, forks: 670, primaryLanguage: 'C++', commits: 1450, createdAt: '2024-05-12T13:00:00Z', updatedAt: '2026-03-18T11:00:00Z' },
    ]
  ),
};
