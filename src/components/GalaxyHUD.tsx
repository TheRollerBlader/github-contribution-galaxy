import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Share2,
  HelpCircle,
  BarChart3,
  Orbit,
  Cloud,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { UserGalaxyProfile } from '../types/galaxy';

interface GalaxyHUDProps {
  profile: UserGalaxyProfile;
  onSearchUser: (username: string) => void;
  isLoading: boolean;
  isCached: boolean;
  rateLimited: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  cameraMode: 'overview' | 'inclined' | 'free';
  onChangeCameraMode: (mode: 'overview' | 'inclined' | 'free') => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  showNebula: boolean;
  onToggleNebula: () => void;
  onToggleAnalytics: () => void;
  isAnalyticsOpen: boolean;
  onOpenEmbed: () => void;
  onOpenHelp: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  languages: string[];
}

export const GalaxyHUD: React.FC<GalaxyHUDProps> = ({
  profile,
  onSearchUser,
  isLoading,
  isCached,
  rateLimited,
  soundEnabled,
  onToggleSound,
  cameraMode,
  onChangeCameraMode,
  showOrbits,
  onToggleOrbits,
  showNebula,
  onToggleNebula,
  onToggleAnalytics,
  isAnalyticsOpen,
  onOpenEmbed,
  onOpenHelp,
  searchTerm,
  onSearchTermChange,
  selectedLanguage,
  onSelectLanguage,
  languages,
}) => {
  const [inputUser, setInputUser] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  const sampleUsers = [
    { id: 'torvalds', label: 'Linus Torvalds', role: 'Linux & Git' },
    { id: 'gaearon', label: 'Dan Abramov', role: 'Redux & React' },
    { id: 'rich-harris', label: 'Rich Harris', role: 'Svelte & Rollup' },
    { id: 'sdras', label: 'Sarah Drasner', role: 'Vue & SVG Art' },
    { id: 'vibecode', label: 'Vibecode Universe', role: 'Full-Stack Galaxy' },
  ];

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUser.trim()) {
      onSearchUser(inputUser.trim());
      setShowPresets(false);
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-3 bg-gradient-to-b from-space-950/90 via-space-950/50 to-transparent backdrop-blur-[2px]">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(56,189,248,0.4)] border border-sky-400/30">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-indigo-200 to-purple-200">
              CONTRIBUTION GALAXY
            </h1>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              3D Cosmos
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Cosmic map of</span>
            <a
              href={profile.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sky-300 font-medium hover:underline flex items-center gap-1"
            >
              @{profile.username}
              <svg className="w-3 h-3 inline fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            {isCached && (
              <span
                title={rateLimited ? 'GitHub rate limit exceeded - showing cached archive' : 'Showing cached verified dataset'}
                className="text-[9px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40"
              >
                {rateLimited ? 'Rate-Limit Safe' : 'Cached Archive'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center Search & User switcher */}
      <div className="flex items-center gap-2 pointer-events-auto w-full md:w-auto max-w-lg">
        {/* Username form */}
        <div className="relative flex-1">
          <form onSubmit={handleUserSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="GitHub username..."
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              className="w-full bg-space-900/80 text-xs font-mono text-slate-100 placeholder-slate-500 rounded-lg pl-8 pr-16 py-2 border border-slate-700/60 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-inner"
            />
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400" />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1 text-[11px] font-medium bg-sky-600/80 hover:bg-sky-500 text-white px-2.5 py-1 rounded-md transition flex items-center gap-1"
            >
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Load'}
            </button>
          </form>

          {/* Quick preset selector dropdown toggle */}
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="absolute -bottom-5 right-1 text-[10px] text-slate-400 hover:text-sky-400 flex items-center gap-0.5"
          >
            Presets <ChevronDown className="w-2.5 h-2.5" />
          </button>

          {/* Presets popover */}
          {showPresets && (
            <div className="absolute top-11 right-0 w-64 bg-space-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
              <div className="text-[10px] uppercase font-mono text-slate-400 px-2 py-1">Featured Universes</div>
              {sampleUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSearchUser(u.id);
                    setShowPresets(false);
                    setInputUser(u.id);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-space-800 transition flex items-center justify-between group"
                >
                  <span className="text-xs text-slate-200 group-hover:text-sky-400 font-medium">{u.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{u.role}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Repos in Galaxy */}
        <div className="hidden lg:flex items-center gap-1">
          <input
            type="text"
            placeholder="Filter systems..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-32 bg-space-900/60 text-xs text-slate-200 rounded-lg px-2.5 py-2 border border-slate-800 focus:outline-none focus:border-purple-500"
          />
          {languages.length > 0 && (
            <select
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value)}
              className="bg-space-900/60 text-xs text-slate-300 rounded-lg px-2 py-2 border border-slate-800 focus:outline-none"
            >
              <option value="ALL">All Languages</option>
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Right Controls HUD */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Camera mode switcher */}
        <div className="hidden sm:flex bg-space-900/80 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => onChangeCameraMode('overview')}
            title="Galactic Overview"
            className={`px-2 py-1 text-xs rounded-md transition ${
              cameraMode === 'overview' ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onChangeCameraMode('inclined')}
            title="Inclined Galactic Plane"
            className={`px-2 py-1 text-xs rounded-md transition ${
              cameraMode === 'inclined' ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inclined
          </button>
          <button
            onClick={() => onChangeCameraMode('free')}
            title="Free Roam"
            className={`px-2 py-1 text-xs rounded-md transition ${
              cameraMode === 'free' ? 'bg-sky-500/20 text-sky-400 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Free
          </button>
        </div>

        {/* Visual Toggles */}
        <button
          onClick={onToggleOrbits}
          title={showOrbits ? 'Hide Orbit Lines' : 'Show Orbit Lines'}
          className={`p-2 rounded-lg border transition ${
            showOrbits
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-400'
              : 'bg-space-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Orbit className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleNebula}
          title={showNebula ? 'Hide Nebula Clouds' : 'Show Nebula Clouds'}
          className={`p-2 rounded-lg border transition ${
            showNebula
              ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
              : 'bg-space-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cloud className="w-4 h-4" />
        </button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Cosmic Ambient Drone' : 'Enable Cosmic Ambient Drone'}
          className={`p-2 rounded-lg border transition ${
            soundEnabled
              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
              : 'bg-space-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Analytics Drawer Button */}
        <button
          onClick={onToggleAnalytics}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition ${
            isAnalyticsOpen
              ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]'
              : 'bg-space-900/80 border-slate-800 text-slate-300 hover:bg-space-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">Telemetry</span>
        </button>

        {/* Embed & Share */}
        <button
          onClick={onOpenEmbed}
          title="Share or Embed Galaxy"
          className="p-2 rounded-lg bg-space-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Help */}
        <button
          onClick={onOpenHelp}
          title="Guide & Navigation Keys"
          className="p-2 rounded-lg bg-space-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
