import React from 'react';
import { X, MousePointer, Orbit, Sparkles, Navigation, Flame, Radio } from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-space-950 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl relative text-xs text-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">Galactic Flight Manual</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-space-900 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-4 space-y-3.5">
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-space-900/60 border border-slate-800/80">
            <MousePointer className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-100">Orbit & Pan</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Click & drag with <strong>Left Mouse Button</strong> to rotate around the galaxy. Drag with <strong>Right Mouse Button</strong> to pan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-space-900/60 border border-slate-800/80">
            <Navigation className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-100">Zoom & Warp</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Use <strong>Scroll Wheel</strong> or trackpad pinch to zoom from macro galactic arm vistas down to microscopic planetary orbits.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-space-900/60 border border-slate-800/80">
            <Orbit className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-100">Inspect Star Systems</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Click on any luminous star cluster to fly your camera directly to that repository and view real-time commit satellites.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-space-900/60 border border-slate-800/80">
            <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-100">Time Epoch Replay</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Press <strong>Play</strong> on the bottom timeline bar to witness the developer's universe ignite and expand year by year.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-space-900/60 border border-slate-800/80">
            <Radio className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-100">Cosmic Drone Synthesizer</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Toggle the sound icon on the top HUD to activate procedural 55Hz Web Audio resonance and interactive warp frequencies.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition"
        >
          Engage Thrusters
        </button>
      </div>
    </div>
  );
};
