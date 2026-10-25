import React from 'react';
import {
  X,
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
  Flame,
  Radio,
  Navigation,
  GitCommit,
  Clock,
  Sparkles
} from 'lucide-react';
import { RepositoryStar } from '../types/galaxy';

interface RepoModalProps {
  repo: RepositoryStar | null;
  onClose: () => void;
  onResetView: () => void;
}

export const RepoModal: React.FC<RepoModalProps> = ({ repo, onClose, onResetView }) => {
  if (!repo) return null;

  const [x, y, z] = repo.position;

  return (
    <div className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:w-[420px] z-30 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-space-950/90 border border-sky-500/40 rounded-2xl p-4 shadow-[0_0_30px_rgba(56,189,248,0.25)] backdrop-blur-xl relative overflow-hidden">
        {/* Glow backdrop accent */}
        <div
          className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: repo.languageColor }}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: repo.languageColor, color: repo.languageColor }}
              />
              <h3 className="text-base font-bold text-slate-100 truncate">{repo.name}</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                Class {repo.spectralClass}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{repo.fullName}</p>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              title="Open in GitHub"
              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-space-800 transition"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-space-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 my-3 line-clamp-3 leading-relaxed">
          {repo.description}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 py-2 border-y border-slate-800/80 text-center">
          <div className="p-1.5 rounded-lg bg-space-900/50">
            <div className="text-[10px] text-slate-400">Stars</div>
            <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {repo.stars.toLocaleString()}
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-space-900/50">
            <div className="text-[10px] text-slate-400">Forks</div>
            <div className="text-xs font-bold text-indigo-300 flex items-center justify-center gap-1 mt-0.5">
              <GitFork className="w-3 h-3 text-indigo-400" />
              {repo.forks.toLocaleString()}
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-space-900/50">
            <div className="text-[10px] text-slate-400">Issues</div>
            <div className="text-xs font-bold text-rose-400 flex items-center justify-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3 text-rose-400" />
              {repo.openIssues}
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-space-900/50">
            <div className="text-[10px] text-slate-400">Commits</div>
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
              <Flame className="w-3 h-3 text-emerald-400" />
              {repo.commitCount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Telemetry info */}
        <div className="my-3 space-y-1 text-[11px] font-mono text-slate-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <Radio className="w-3 h-3 text-sky-400" />
              Coordinates (X, Y, Z):
            </span>
            <span className="text-sky-300">[{x.toFixed(1)}, {y.toFixed(1)}, {z.toFixed(1)}]</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <Navigation className="w-3 h-3 text-purple-400" />
              Galactic Arm Sector:
            </span>
            <span className="text-purple-300">Arm #{repo.armIndex + 1} (Centaurus)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3 h-3 text-amber-400" />
              First Spark / Created:
            </span>
            <span className="text-slate-300">{new Date(repo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Sample Orbiting Commits */}
        {repo.commits.length > 0 && (
          <div className="space-y-1.5 mt-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <GitCommit className="w-3 h-3 text-sky-400" />
                Active Orbiting Satellites ({repo.commits.length})
              </span>
              <span>Radius: {repo.commits[0]?.orbitRadius.toFixed(1)} AU</span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {repo.commits.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="p-1.5 rounded bg-space-900/60 border border-slate-800/60 text-[10px] flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                    <span className="font-mono text-sky-300 shrink-0">{c.sha}</span>
                    <span className="text-slate-300 truncate">{c.message}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono shrink-0">
                    {new Date(c.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onResetView}
            className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Reset Camera to Galaxy
          </button>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition shadow-[0_0_15px_rgba(56,189,248,0.3)] flex items-center gap-1"
          >
            Visit Repository
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
