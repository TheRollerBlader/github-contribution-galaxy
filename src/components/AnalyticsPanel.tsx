import React from 'react';
import {
  X,
  Star,
  GitFork,
  Code2,
  Compass,
  ExternalLink,
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from 'recharts';
import { UserGalaxyProfile, RepositoryStar } from '../types/galaxy';

interface AnalyticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserGalaxyProfile;
  onSelectRepo: (repo: RepositoryStar) => void;
  selectedRepo: RepositoryStar | null;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  isOpen,
  onClose,
  profile,
  onSelectRepo,
  selectedRepo,
}) => {
  if (!isOpen) return null;

  // Language breakdown data for donut chart
  const languageChartData = profile.primaryLanguages.slice(0, 6).map((item) => ({
    name: item.name,
    value: item.count,
    color: item.color,
    percentage: item.percentage,
  }));

  // Activity monthly data for area chart
  const activityData = profile.monthlyActivity;

  // Sorted repositories by stars
  const topRepos = [...profile.repositories]
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 8);

  return (
    <aside className="fixed top-0 right-0 bottom-0 z-40 w-full sm:w-[440px] md:w-[480px] bg-space-950/95 border-l border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-space-900/40">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-400" />
          <h2 className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
            Galactic Telemetry & Analytics
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-space-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-xs">
        {/* User Profile Card */}
        <div className="p-4 rounded-xl bg-space-900/60 border border-slate-800/80 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start gap-3">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-14 h-14 rounded-full border-2 border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)] object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 truncate">{profile.name}</h3>
                <a
                  href={profile.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-sky-400"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-[11px] font-mono text-sky-400">@{profile.username}</p>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{profile.bio}</p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
            <div className="p-2 rounded-lg bg-space-950/60 border border-slate-800/50">
              <div className="text-[10px] text-slate-400">Stars</div>
              <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {profile.totalStars.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-space-950/60 border border-slate-800/50">
              <div className="text-[10px] text-slate-400">Forks</div>
              <div className="text-xs font-bold text-indigo-300 flex items-center justify-center gap-1 mt-0.5">
                <GitFork className="w-3 h-3 text-indigo-400" />
                {profile.totalForks.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-space-950/60 border border-slate-800/50">
              <div className="text-[10px] text-slate-400">Commits</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3 h-3 text-emerald-400" />
                {profile.totalCommits.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-space-950/60 border border-slate-800/50">
              <div className="text-[10px] text-slate-400">Systems</div>
              <div className="text-xs font-bold text-purple-300 flex items-center justify-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-purple-400" />
                {profile.publicRepos}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Languages Donut Chart */}
        <div className="p-4 rounded-xl bg-space-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-sky-400" />
              Language Stellar Composition
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Top Systems</span>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {languageChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#030712" strokeWidth={2} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-space-900 border border-slate-700 px-2.5 py-1.5 rounded-lg shadow-lg text-[11px]">
                          <span className="font-semibold text-slate-200">{data.name}: </span>
                          <span className="text-sky-300 font-mono">{data.value} repos ({data.percentage}%)</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Language Legend Pills */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {languageChartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between px-2 py-1 rounded bg-space-950/40 border border-slate-800/40 text-[10px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate">{item.name}</span>
                </div>
                <span className="font-mono text-slate-400">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Over Months Area Chart */}
        <div className="p-4 rounded-xl bg-space-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-emerald-400" />
              Annual Celestial Pulse (Commits)
            </h4>
            <span className="text-[10px] font-mono text-slate-400">Estimated Cycles</span>
          </div>

          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 9 }} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 9 }} tickLine={false} />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-space-900 border border-slate-700 px-2.5 py-1.5 rounded-lg shadow-lg text-[11px]">
                          <div className="font-semibold text-slate-200">{label}</div>
                          <div className="text-sky-300 font-mono">
                            {payload[0].value?.toLocaleString()} commits
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="commits" stroke="#38bdf8" fillOpacity={1} fill="url(#commitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Celestial Systems (Repositories) */}
        <div className="p-4 rounded-xl bg-space-900/60 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-purple-400" />
              Major Star Systems
            </h4>
            <span className="text-[10px] font-mono text-slate-400">{profile.repositories.length} total</span>
          </div>

          <div className="space-y-2">
            {topRepos.map((repo) => {
              const isSelected = selectedRepo?.id === repo.id;
              return (
                <div
                  key={repo.id}
                  onClick={() => onSelectRepo(repo)}
                  className={`p-2.5 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                      : 'bg-space-950/60 border-slate-800/80 hover:bg-space-900 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: repo.languageColor }}
                      />
                      <span className="font-semibold text-xs text-slate-100 truncate">{repo.name}</span>
                      <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-slate-400">
                        Class {repo.spectralClass}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        {repo.stars.toLocaleString()}
                      </span>
                      <span>{repo.commitCount.toLocaleString()} commits</span>
                      <span className="font-mono text-slate-500">{repo.primaryLanguage}</span>
                    </div>
                  </div>

                  <button
                    className="text-[10px] font-mono px-2 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/30 shrink-0"
                  >
                    Fly To
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-slate-500 text-center font-mono py-2">
          Galactic Reference System: EPSG::GALACTIC-2026 • 60 FPS Engine
        </div>
      </div>
    </aside>
  );
};
