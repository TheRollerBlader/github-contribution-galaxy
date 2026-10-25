import React from 'react';
import { Star, Flame } from 'lucide-react';
import { RepositoryStar } from '../types/galaxy';

interface GalaxyTooltipProps {
  repo: RepositoryStar | null;
  position: { x: number; y: number } | null;
}

export const GalaxyTooltip: React.FC<GalaxyTooltipProps> = ({ repo, position }) => {
  if (!repo || !position) return null;

  return (
    <div
      style={{
        left: `${position.x + 16}px`,
        top: `${position.y + 16}px`,
      }}
      className="fixed z-40 pointer-events-none transform -translate-y-1/2 bg-space-950/90 border border-sky-400/50 rounded-xl p-3 shadow-[0_0_20px_rgba(56,189,248,0.3)] backdrop-blur-md min-w-[220px] max-w-[280px] animate-in fade-in duration-150"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px_currentColor]"
          style={{ backgroundColor: repo.languageColor, color: repo.languageColor }}
        />
        <h4 className="text-xs font-bold text-slate-100 truncate">{repo.name}</h4>
        <span className="text-[9px] font-mono px-1 rounded bg-sky-500/20 text-sky-300 ml-auto border border-sky-500/40 shrink-0">
          Class {repo.spectralClass}
        </span>
      </div>

      <p className="text-[11px] text-slate-300 line-clamp-2 mb-2 leading-tight">
        {repo.description}
      </p>

      <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800/80 pt-1.5 text-slate-400">
        <span className="flex items-center gap-1 text-amber-300">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          {repo.stars.toLocaleString()}
        </span>
        <span className="flex items-center gap-1 text-emerald-300">
          <Flame className="w-3 h-3 text-emerald-400" />
          {repo.commitCount.toLocaleString()}
        </span>
        <span className="text-slate-400">{repo.primaryLanguage}</span>
      </div>
    </div>
  );
};
