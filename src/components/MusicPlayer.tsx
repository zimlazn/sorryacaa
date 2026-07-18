/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Music } from 'lucide-react';

export default function MusicPlayer() {
  return (
    <div id="music-player-section" className="w-full bg-paper-card border border-ink-muted/15 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-ink-muted/10 pb-5">
        <div className="text-center sm:text-left">
          <h3 className="font-serif text-xl text-ink-dark font-semibold flex items-center justify-center sm:justify-start gap-2">
            <Music className="w-5 h-5 text-crimson animate-pulse" />
            Lagu Untuk Acaa: Somebody's Pleasure
          </h3>
          <p className="text-xs text-ink-muted mt-1 font-sans">
            Dengarkan bait-bait indah dari Aziz Hendra yang mengiringi rasa sesal di lubuk jiwaku.
          </p>
        </div>
      </div>

      <div className="w-full max-w-xl mx-auto">
        {/* Spotify Premium Card */}
        <div className="bg-white border border-ink-muted/10 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              SPOTIFY PLAYER
            </span>
            <span className="text-[10px] font-mono text-ink-muted">Mainkan Audio Resmi</span>
          </div>
          
          <div className="w-full">
            <iframe
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/track/3e1rs346dsDDwpqTRGlRZR?utm_source=generator"
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full"
            ></iframe>
          </div>
          
          <div className="text-[11px] font-sans text-ink-muted/70 leading-relaxed bg-amber-50/40 p-3 rounded-lg border border-amber-800/10 italic">
            "Lagu ini menceritakan betapa hampa dan sepinya diriku saat melewatkan momen bersamamu semalam. Maafkan aku yang tertidur tanpa kabar ya, Aca..."
          </div>
        </div>
      </div>
    </div>
  );
}
