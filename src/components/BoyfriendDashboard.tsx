/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Gift, Heart, Sparkles, AlertCircle } from 'lucide-react';

export default function BoyfriendDashboard() {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '2007' || pin === '200724' || pin === '20072024') {
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Aww, tanggalnya masih kurang tepat nih.. Coba tanya Aam langsung yaa! 🥺');
    }
  };

  return (
    <div id="boyfriend-dashboard" className="w-full max-w-2xl mx-auto px-4 py-12 border-t border-ink-muted/10">
      <div className="bg-paper-card border border-ink-muted/15 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Gift className="w-32 h-32 text-crimson" />
        </div>

        <div className="text-center mb-6">
          <span className="px-3 py-1 rounded-full bg-crimson/10 text-crimson text-xs font-mono font-semibold tracking-wider uppercase inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Bagian Apa Niii?? 🤔✨
          </span>
          <h3 className="font-serif text-2xl text-ink-dark mt-3 font-semibold">
            Kotak Kejutan Rahasia Untuk Aca
          </h3>
          <p className="font-sans text-xs text-ink-muted mt-2 max-w-md mx-auto leading-relaxed">
            Ada kejutan manis yang sengaja Aam sembunyikan di sini. Tebak kuncinya untuk membuka hadiah spesialmu!
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-6"
            >
              <div className="w-16 h-16 bg-crimson/5 rounded-full flex items-center justify-center border border-crimson/10 mb-4 animate-bounce">
                <Lock className="w-7 h-7 text-crimson" />
              </div>

              <div className="text-center max-w-sm mb-6">
                <p className="text-xs font-sans text-ink-muted leading-relaxed">
                  Masukkan <strong>tanggal pertama kali Aca chat Aam</strong> untuk membuka gembok cinta ini.
                </p>
                <p className="text-[10px] font-mono text-crimson mt-1.5 italic">
                  (Format: DDMM atau DDMMYY, contoh: 1402 atau 140224. Kalo lupa atau beneran gatau, coba tanya aja ke Aam! 🤭)
                </p>
              </div>

              <form onSubmit={handleVerify} className="w-full max-w-xs flex flex-col gap-3">
                <input
                  type="password"
                  maxLength={8}
                  placeholder="Masukkan tanggal (DDMM/DDMMYY)"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  className="w-full py-3 px-4 text-center text-lg font-mono tracking-widest border border-ink-muted/20 rounded-xl focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson bg-white text-ink-dark"
                />
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-1.5 text-[11px] text-crimson font-medium text-center"
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={pin.length < 4}
                  className="w-full py-3 bg-ink-dark hover:bg-crimson disabled:bg-ink-dark/30 text-warm-beige disabled:text-warm-beige/50 font-bold text-xs font-mono tracking-wider rounded-xl shadow-md transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
                >
                  BUKA GEMBOK
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="flex flex-col items-center py-6 text-center"
            >
              {/* Confetti celebration container */}
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mb-6 relative">
                <motion.div
                  initial={{ rotate: -45 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Unlock className="w-8 h-8 text-emerald-600" />
                </motion.div>
                
                {/* Micro hearts and sparkles floating around */}
                <span className="absolute -top-1 -right-1 text-base animate-ping">🌸</span>
                <span className="absolute -bottom-1 -left-1 text-sm animate-bounce">✨</span>
              </div>

              <div className="max-w-md space-y-5 bg-white border border-amber-800/15 p-6 md:p-8 rounded-2xl shadow-sm relative paper-texture">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 via-pink-400 to-amber-400 rounded-t-2xl"></div>
                
                <h4 className="font-serif text-2xl font-bold text-amber-900 flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-crimson fill-crimson animate-pulse" />
                  Selamaatt Acaa Cantikk! 🎉
                </h4>
                
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-3xl">
                  💐
                </div>

                <p className="font-sans text-sm text-ink-dark font-medium leading-relaxed">
                  Kamu berhak mendapatkan <strong className="text-crimson font-serif text-lg">Bouquet Bunga Cantik</strong> sebelum Aam pergi berangkat ke Bandung! 💐✨
                </p>

                <p className="font-sans text-xs text-ink-muted leading-relaxed border-t border-dashed border-ink-muted/15 pt-4">
                  Sebagai tanda penyesalan tulus dari Aam yang ketiduran kemarin malam. Silakan ambil tangkapan layar (screenshot) halaman ini, lalu kirimkan langsung ke WA Aam untuk mengklaim bouquet bungamu sekarang juga! 🥰💖
                </p>

                <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-900/10 text-[11px] font-mono text-amber-900/80">
                  Sandi Terbuka • Bouquet Klaim Valid: YES ✅
                </div>
              </div>

              <button
                onClick={() => {
                  setIsUnlocked(false);
                  setPin('');
                }}
                className="mt-6 text-[10px] font-mono text-ink-muted hover:text-crimson transition-colors underline cursor-pointer"
              >
                Kunci Kembali Bagian Ini
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
