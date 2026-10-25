import React, { useState } from 'react';
import { X, Copy, Check, Share2, Code2, ShieldAlert } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose, username }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://github.com/TheRollerBlader/github-contribution-galaxy';
  const shareUrl = `${baseUrl}?user=${encodeURIComponent(username)}`;

  const markdownBadge = `[![GitHub Contribution Galaxy](https://img.shields.io/badge/Cosmic%20Galaxy-3D%20Map-38bdf8?style=for-the-badge&logo=github)](${shareUrl})`;

  const iframeCode = `<iframe src="${shareUrl}" width="100%" height="650" style="border: 1px solid rgba(56,189,248,0.2); border-radius: 16px; background: #030712;" title="${username}'s GitHub Contribution Galaxy" allow="autoplay"></iframe>`;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-space-950 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl relative text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">Share & Embed Galactic Cosmos</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-space-900 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 my-4">
          {/* Share Link */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">Shareable Cosmic Deep Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-space-900 border border-slate-800 rounded-lg px-3 py-2 text-sky-300 font-mono text-[11px] focus:outline-none"
              />
              <button
                onClick={() => handleCopy('link', shareUrl)}
                className="px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium flex items-center gap-1 shrink-0 transition"
              >
                {copiedKey === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'link' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* GitHub Profile README Badge */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
              GitHub Profile README Badge (Markdown)
            </label>
            <div className="flex items-center gap-2">
              <textarea
                readOnly
                rows={2}
                value={markdownBadge}
                className="w-full bg-space-900 border border-slate-800 rounded-lg p-2 text-slate-300 font-mono text-[10px] focus:outline-none resize-none"
              />
              <button
                onClick={() => handleCopy('badge', markdownBadge)}
                className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-1 shrink-0 transition"
              >
                {copiedKey === 'badge' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'badge' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* HTML Iframe */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">Portfolio & Blog Embed (HTML &lt;iframe&gt;)</label>
            <div className="flex items-center gap-2">
              <textarea
                readOnly
                rows={3}
                value={iframeCode}
                className="w-full bg-space-900 border border-slate-800 rounded-lg p-2 text-slate-300 font-mono text-[10px] focus:outline-none resize-none"
              />
              <button
                onClick={() => handleCopy('iframe', iframeCode)}
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1 shrink-0 transition"
              >
                {copiedKey === 'iframe' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'iframe' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          Supports automatic rate-limit protection and query parameters: ?user=username&autoplay=1
        </div>
      </div>
    </div>
  );
};
