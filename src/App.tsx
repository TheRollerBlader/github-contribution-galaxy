import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserGalaxyProfile, RepositoryStar } from './types/galaxy';
import { SAMPLE_PROFILES } from './data/sampleProfiles';
import { fetchUserGalaxy } from './services/githubApi';
import { cosmicAudio } from './utils/audioSynth';
import { GalaxyCanvas } from './components/GalaxyCanvas';
import { GalaxyHUD } from './components/GalaxyHUD';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { RepoModal } from './components/RepoModal';
import { TimelineControls } from './components/TimelineControls';
import { EmbedModal } from './components/EmbedModal';
import { QuickGuideModal } from './components/QuickGuideModal';
import { GalaxyTooltip } from './components/GalaxyTooltip';

export const App: React.FC = () => {
  // Active Profile State
  const [profile, setProfile] = useState<UserGalaxyProfile>(SAMPLE_PROFILES.torvalds);
  const [isLoading, setIsLoading] = useState(false);
  const [isCached, setIsCached] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);

  // Selection & Hover State
  const [selectedRepo, setSelectedRepo] = useState<RepositoryStar | null>(null);
  const [hoveredRepo, setHoveredRepo] = useState<RepositoryStar | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Timeline State
  const [timelineYear, setTimelineYear] = useState<number>(2026);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Camera & View Options
  const [cameraMode, setCameraMode] = useState<'overview' | 'inclined' | 'free'>('overview');
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showNebula, setShowNebula] = useState<boolean>(true);
  const [bloomEnabled] = useState<boolean>(true);

  // Modals & Drawers
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Audio State
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Filtering
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');

  // Load User function
  const loadUser = useCallback(async (username: string, targetRepoName?: string) => {
    setIsLoading(true);
    try {
      const result = await fetchUserGalaxy(username);
      setProfile(result.profile);
      setIsCached(result.isCached);
      setRateLimited(result.rateLimited);

      // Reset timeline to latest year
      const years = result.profile.timelineYears;
      if (years.length > 0) {
        setTimelineYear(years[years.length - 1]);
      }

      // Check if target repo specified
      if (targetRepoName) {
        const found = result.profile.repositories.find(
          (r) => r.name.toLowerCase() === targetRepoName.toLowerCase()
        );
        if (found) setSelectedRepo(found);
      } else {
        setSelectedRepo(null);
      }
    } catch (e) {
      console.error('Failed to load user galaxy', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize from URL parameters on first mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    const repoParam = params.get('repo');
    const autoplayParam = params.get('autoplay');

    if (autoplayParam === '1' || autoplayParam === 'true') {
      setIsPlaying(true);
    }

    if (userParam) {
      loadUser(userParam, repoParam || undefined);
    } else {
      // Default initial profile
      const defaultProfile = SAMPLE_PROFILES.torvalds;
      setProfile(defaultProfile);
      setTimelineYear(defaultProfile.timelineYears[defaultProfile.timelineYears.length - 1]);
    }
  }, [loadUser]);

  // Audio Toggle
  const handleToggleSound = () => {
    const active = cosmicAudio.toggle();
    setSoundEnabled(active);
  };

  // Hover Handler
  const handleHoverRepo = (repo: RepositoryStar | null, screenPos?: { x: number; y: number } | null) => {
    setHoveredRepo(repo);
    setTooltipPos(screenPos || null);
  };

  // Filtered Repositories list
  const filteredRepositories = useMemo(() => {
    return profile.repositories.filter((repo) => {
      const matchesSearch =
        searchTerm === '' ||
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLang =
        selectedLanguage === 'ALL' || repo.primaryLanguage === selectedLanguage;

      return matchesSearch && matchesLang;
    });
  }, [profile.repositories, searchTerm, selectedLanguage]);

  // Distinct languages for dropdown
  const distinctLanguages = useMemo(() => {
    const set = new Set<string>();
    profile.repositories.forEach((r) => {
      if (r.primaryLanguage) set.add(r.primaryLanguage);
    });
    return Array.from(set).sort();
  }, [profile.repositories]);

  // Number of systems active up to current timeline year
  const activeSystemsCount = useMemo(() => {
    return filteredRepositories.filter(
      (r) => new Date(r.createdAt).getFullYear() <= timelineYear
    ).length;
  }, [filteredRepositories, timelineYear]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-950 font-sans text-slate-100">
      {/* 3D Cosmos Canvas */}
      <GalaxyCanvas
        repositories={filteredRepositories}
        selectedRepo={selectedRepo}
        onSelectRepo={(r) => setSelectedRepo(r)}
        hoveredRepo={hoveredRepo}
        onHoverRepo={handleHoverRepo}
        timelineYear={timelineYear}
        bloomEnabled={bloomEnabled}
        showOrbits={showOrbits}
        showNebula={showNebula}
        userAvatarUrl={profile.avatarUrl}
        cameraMode={cameraMode}
      />

      {/* Screen-space Floating Tooltip */}
      <GalaxyTooltip repo={hoveredRepo} position={tooltipPos} />

      {/* Top Galactic HUD Header */}
      <GalaxyHUD
        profile={profile}
        onSearchUser={(u) => loadUser(u)}
        isLoading={isLoading}
        isCached={isCached}
        rateLimited={rateLimited}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        cameraMode={cameraMode}
        onChangeCameraMode={(m) => setCameraMode(m)}
        showOrbits={showOrbits}
        onToggleOrbits={() => setShowOrbits(!showOrbits)}
        showNebula={showNebula}
        onToggleNebula={() => setShowNebula(!showNebula)}
        onToggleAnalytics={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
        isAnalyticsOpen={isAnalyticsOpen}
        onOpenEmbed={() => setIsEmbedOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        searchTerm={searchTerm}
        onSearchTermChange={(t) => setSearchTerm(t)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(l) => setSelectedLanguage(l)}
        languages={distinctLanguages}
      />

      {/* Selected Repository Card / Modal */}
      <RepoModal
        repo={selectedRepo}
        onClose={() => setSelectedRepo(null)}
        onResetView={() => {
          setSelectedRepo(null);
          setCameraMode('overview');
        }}
      />

      {/* Time Epoch Replay Controller */}
      <TimelineControls
        years={profile.timelineYears}
        currentYear={timelineYear}
        onYearChange={(y) => setTimelineYear(y)}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={(s) => setPlaybackSpeed(s)}
        visibleCount={activeSystemsCount}
        totalCount={filteredRepositories.length}
      />

      {/* Telemetry & Analytics Slide-Out Drawer */}
      <AnalyticsPanel
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        profile={profile}
        onSelectRepo={(r) => {
          setSelectedRepo(r);
          setIsAnalyticsOpen(false);
          cosmicAudio.playWarp();
        }}
        selectedRepo={selectedRepo}
      />

      {/* Embed & Share Dialog */}
      <EmbedModal
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
        username={profile.username}
      />

      {/* Flight Manual & Keyboard / Mouse Guide */}
      <QuickGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </main>
  );
};

export default App;
