/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Heart, Quote, MessageSquareWarning, Mail, CheckCircle } from 'lucide-react';

interface ReplyResponse {
  poem: string;
  letter: string;
  sweetMessage: string;
}

const MOODS = [
  { id: '😡 Marah Banget', label: 'Marah Banget', emoji: '😡', color: 'border-red-400 bg-red-50/40 text-red-700' },
  { id: '😢 Kecewa & Sedih', label: 'Kecewa & Sedih', emoji: '😢', color: 'border-blue-400 bg-blue-50/40 text-blue-700' },
  { id: '🥺 Butuh Dibujuk', label: 'Butuh Dibujuk', emoji: '🥺', color: 'border-amber-400 bg-amber-50/40 text-amber-700' },
  { id: '🤭 Mulai Gemas', label: 'Mulai Gemas', emoji: '🤭', color: 'border-emerald-400 bg-emerald-50/40 text-emerald-700' }
];

export default function VoiceOfApology() {
  const [message, setMessage] = useState('');
  const [selectedMood, setSelectedMood] = useState(MOODS[1].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestReply, setLatestReply] = useState<ReplyResponse | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Load the most recent interaction from the server history to show as the latest letter if it exists
  useEffect(() => {
    fetch('/api/apology/responses')
      .then((res) => res.json())
      .then((data) => {
        if (data.logs && data.logs.length > 0) {
          const lastLog = data.logs[0]; // the latest one
          const parts = lastLog.reply.split("---").map((p: string) => p.trim());
          setLatestReply({
            poem: parts[0] || "Hening malam menceritakan sesal yang tak bertepi.",
            letter: parts[1] || lastLog.reply,
            sweetMessage: parts[2] || "Aku di sini selalu menantimu reda, Acaa sayang."
          });
        }
      })
      .catch((err) => console.error("Gagal memuat riwayat suara hati:", err));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    const backupMsg = message;
    setMessage('');

    try {
      const response = await fetch('/api/apology/gemini-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: backupMsg, mood: selectedMood }),
      });

      const result = await response.json();
      if (result.success) {
        setLatestReply({
          poem: result.poem,
          letter: result.letter,
          sweetMessage: result.sweetMessage,
        });
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 6000);
      } else {
        setError(result.error || 'Gagal mengirimkan pesan marahmu.');
        setMessage(backupMsg); // Restore message
      }
    } catch (err) {
      setError('Koneksi terputus. Namun cinta dan maafku tak pernah terputus.');
      setMessage(backupMsg); // Restore message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="voice-of-apology-section" className="w-full max-w-2xl mx-auto px-4 py-8 relative">
      <div className="text-center mb-8">
        <span className="px-3 py-1 rounded-full bg-crimson/10 text-crimson text-xs font-mono font-semibold tracking-wider uppercase">
          Kotak Suara Hati Acaa
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-ink-dark mt-3">
          Tumpahkan Amarah & Kecewamu
        </h2>
        <p className="font-sans text-sm text-ink-muted mt-3 max-w-xl mx-auto leading-relaxed">
          Keluarkan apa saja yang ada di dalam hatimu—baik kekesalan, amarah, maupun kekecewaan karena diabaikan semalam. Aku siap mendengarkan dan pesanmu akan langsung terkirim ke emailku.
        </p>
      </div>

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-start gap-3 shadow-sm"
          >
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Pesan Amarahmu Berhasil Terkirim! 📬</p>
              <p className="text-xs text-emerald-700/90 mt-0.5">
                Surat suara hatimu telah sukses dikirim ke email Arham (arhamalmizan@gmail.com). Dia akan segera membaca luapan perasaanmu dan segera berbenah diri.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {/* Centered Input Form */}
        <div className="bg-paper-card border border-ink-muted/15 rounded-2xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSend} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted mb-2">
                1. Pilih Perasaan Acaa Saat Ini:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium text-left flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
                      selectedMood === mood.id
                        ? 'border-crimson bg-crimson/5 ring-1 ring-crimson/15 text-crimson font-semibold scale-[1.02]'
                        : 'border-ink-muted/10 hover:border-ink-muted/30 text-ink-muted bg-white'
                    }`}
                  >
                    <span>{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted mb-2">
                2. Tulis Kekesalan/Pertanyaanmu:
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Misal: 'Aku nungguin tahu! Nelpon berkali-kali ga diangkat, kamu parah banget sih!'"
                  rows={4}
                  className="w-full text-sm p-4 bg-white border border-ink-muted/15 rounded-xl focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson text-ink-dark placeholder-ink-muted/30 leading-relaxed resize-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-crimson text-xs font-mono">
                <MessageSquareWarning className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="w-full py-3 bg-ink-dark hover:bg-crimson disabled:bg-ink-dark/30 text-warm-beige disabled:text-warm-beige/50 font-medium text-sm rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-warm-beige border-t-transparent rounded-full animate-spin"></div>
                  <span>Mengirimkan ke Aam...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim ke Aam</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-ink-muted/10 text-center">
            <p className="text-[10px] text-ink-muted/50 font-mono flex items-center justify-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-crimson" />
              <span>
                aam pasti bakal baca pesan kamu kok:))
              </span>
            </p>
          </div>
        </div>

        {/* Display Single Latest Reply parchment paper */}
        {latestReply && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mt-6"
          >
            <div className="w-full bg-white border border-amber-800/15 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden paper-texture">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Heart className="w-36 h-36 text-crimson fill-crimson" />
              </div>
              
              <div className="text-center pb-4 mb-5 border-b border-dashed border-ink-muted/15">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold bg-amber-50 px-3 py-1 rounded-full">
                  Surat Balasan Penyesalan Aam
                </span>
              </div>

              {/* Quote element */}
              <div className="flex items-start gap-2.5 text-crimson font-serif italic text-sm font-semibold mb-5 bg-crimson/5 p-4 rounded-xl border-l-4 border-crimson">
                <Quote className="w-4 h-4 text-crimson flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">"{latestReply.poem}"</p>
              </div>

              {/* Letter Content */}
              <div className="font-serif text-sm text-ink-muted leading-relaxed space-y-4 whitespace-pre-line border-b border-dashed border-ink-muted/15 pb-5">
                {latestReply.letter}
              </div>

              {/* Sweet Closing */}
              <div className="mt-5 flex items-center justify-center gap-2 text-sm font-serif text-amber-900 font-bold italic text-center">
                <Heart className="w-4 h-4 text-crimson fill-crimson animate-pulse" />
                <span>{latestReply.sweetMessage}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
