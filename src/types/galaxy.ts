export interface CommitNode {
  id: string;
  sha: string;
  message: string;
  date: string; // ISO string
  author: string;
  url: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  orbitInclination: number;
}

export interface RepositoryStar {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  primaryLanguage: string;
  languageColor: string;
  languages: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  commitCount: number;
  commits: CommitNode[];
  size: number;
  // 3D coordinate position in galactic coordinates
  position: [number, number, number];
  coreRadius: number;
  spectralClass: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
  armIndex: number;
}

export interface UserGalaxyProfile {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  primaryLanguages: { name: string; count: number; color: string; percentage: number }[];
  timelineYears: number[];
  monthlyActivity: { month: string; commits: number; repos: number }[];
  repositories: RepositoryStar[];
}

export interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
  duration?: number;
}
