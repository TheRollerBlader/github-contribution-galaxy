import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock } from 'lucide-react';

interface TimelineControlsProps {
  years: number[];
  currentYear: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  visibleCount: number;
  totalCount: number;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  years,
  currentYear,
  onYearChange,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  visibleCount,
  totalCount,
}) => {
  const minYear = years[0] || 2018;
  const maxYear = years[years.length - 1] || 2026;

  // Auto progression when playing
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.max(400, Math.floor(1800 / playbackSpeed));
    const timer = setInterval(() => {
      onYearChange(currentYear >= maxYear ? minYear : currentYear + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentYear, minYear, maxYear, playbackSpeed, onYearChange]);

  const cycleSpeed = () => {
    if (playbackSpeed === 1) onChangeSpeed(2);
    else if (playbackSpeed === 2) onChangeSpeed(4);
    else onChangeSpeed(1);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-[92%] max-w-xl">
      <div className="bg-space-950/85 border border-slate-800/90 rounded-2xl p-3 shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-mono text-slate-300 font-semibold text-xs">
              EPOCH: <span className="text-sky-400 text-sm">{currentYear}</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-space-900 text-slate-400 border border-slate-800">
              {visibleCount} of {totalCount} systems active
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onYearChange(minYear)}
              title="Reset Timeline to Big Bang"
              className="p-1 rounded text-slate-400 hover:text-slate-200 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={cycleSpeed}
              title="Playback Velocity"
              className="px-2 py-0.5 rounded bg-space-900 border border-slate-800 text-[10px] font-mono text-sky-400 hover:border-sky-500/50 transition flex items-center gap-0.5"
            >
              <FastForward className="w-3 h-3 inline" />
              {playbackSpeed}x
            </button>
          </div>
        </div>

        {/* Playback Controls & Slider */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause Galaxy Formation' : 'Play Galaxy Formation Over Time'}
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.4)] transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Scrub Slider */}
          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min={minYear}
              max={maxYear}
              step={1}
              value={currentYear}
              onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none"
            />
          </div>

          <span className="text-[11px] font-mono text-slate-400 shrink-0">
            {minYear} - {maxYear}
          </span>
        </div>
      </div>
    </div>
  );
};
