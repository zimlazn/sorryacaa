/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Clock, Calendar, ArrowDown, ChevronRight, Sparkles, MessageCircle, Info } from 'lucide-react';
import IntroOverlay from './components/IntroOverlay';
import MusicPlayer from './components/MusicPlayer';
import RedemptionSection from './components/RedemptionSection';
import VoiceOfApology from './components/VoiceOfApology';
import BoyfriendDashboard from './components/BoyfriendDashboard';

// Custom images with timestamps generated previously
const SLEEPING_BOY_IMG = '/src/assets/images/sketch_sleeping_boy_1784392090681.jpg';
const WAITING_PHONE_IMG = '/src/assets/images/sketch_waiting_phone_1784392105386.jpg';
const APOLOGY_CATS_IMG = '/src/assets/images/sketch_apology_cats_1784392118589.jpg';

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

const EMOJIS = ['❤️', '💖', '✨', '🌟', '🥺', '🌸', '🧸', '🐱', '💭'];

export default function App() {
  const [isIntroOpen, setIsIntroOpen] = useState(true);
  const [clickParticles, setClickParticles] = useState<ClickParticle[]>([]);
  const [elapsedTimeStr, setElapsedTimeStr] = useState('');

  // Track the elapsed time since Saturday, July 17, 2026, 22:00 (the approximate sleep-off time)
  useEffect(() => {
    const targetDate = new Date('2026-07-17T22:00:00-07:00'); // Malam Sabtu 17 Juli
    
    const updateTimer = () => {
      const now = new Date();
      const diffMs = now.getTime() - targetDate.getTime();
      
      if (diffMs < 0) {
        setElapsedTimeStr("0 Jam 0 Menit");
        return;
      }
      
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const hours = totalHours % 24;
      const days = Math.floor(totalHours / 24);
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      let str = "";
      if (days > 0) str += `${days} Hari `;
      str += `${hours} Jam ${minutes} Menit ${seconds} Detik`;
      setElapsedTimeStr(str);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle click coordinates for interactive floating emojis
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Exclude button/input clicks to avoid interfering with form usage
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' || 
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.closest('button') || 
      target.closest('input') || 
      target.closest('textarea')
    ) {
      return;
    }

    const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const newParticle: ClickParticle = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY + window.scrollY, // Add scroll position to draw accurately in document space
      emoji: randomEmoji,
    };

    setClickParticles((prev) => [...prev, newParticle].slice(-25)); // Keep last 25 elements
  };

  // Clean up particles
  useEffect(() => {
    if (clickParticles.length > 0) {
      const timer = setTimeout(() => {
        setClickParticles((prev) => prev.filter((p) => Date.now() - p.id < 1200));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [clickParticles]);

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div 
      className="min-h-screen bg-warm-beige text-ink-dark paper-texture selection:bg-crimson/15 selection:text-crimson"
      onClick={handlePageClick}
    >
      {/* 1. Intro envelope overlay sequence */}
      <AnimatePresence>
        {isIntroOpen && (
          <IntroOverlay onOpen={() => setIsIntroOpen(false)} />
        )}
      </AnimatePresence>

      {/* Floating Sparkles and Click Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        <AnimatePresence>
          {clickParticles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, scale: 0.5, x: particle.x, y: particle.y }}
              animate={{ 
                opacity: 0, 
                scale: 1.4, 
                y: particle.y - 120, // drift upward
                x: particle.x + (Math.random() * 40 - 20) // subtle wave side-to-side
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute text-lg select-none"
              style={{ left: 0, top: 0 }}
            >
              {particle.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dynamic Background Flying Paper Airplanes & Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-15">
        <div className="absolute top-[20%] left-[5%] animate-pulse">🌸</div>
        <div className="absolute top-[45%] right-[8%] animate-pulse duration-1000">✨</div>
        <div className="absolute bottom-[30%] left-[10%] animate-bounce duration-2000">🧸</div>
        <div className="absolute bottom-[65%] right-[15%] animate-pulse duration-3000">🐱</div>
      </div>

      {/* Main Single-Page Scroller */}
      {!isIntroOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col relative z-10"
        >
          {/* Header Navigation Bar (Subtle & Elegant) */}
          <header className="w-full border-b border-ink-muted/10 bg-warm-beige/85 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <span className="font-serif italic text-base font-semibold text-ink-dark tracking-tight flex items-center gap-1">
                <Heart className="w-4 h-4 text-crimson fill-crimson" />
                <span>Untuk Acaa</span>
              </span>
              
              <div className="flex items-center gap-4 text-xs font-mono text-ink-muted">
                <span className="hidden sm:inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Waktu Berlalu: {elapsedTimeStr}</span>
                </span>
                <span className="px-2.5 py-0.5 bg-crimson/5 rounded-full border border-crimson/10 text-crimson">
                  Malam Sabtu • 17 Juli 2026
                </span>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="min-h-[85vh] flex flex-col justify-center items-center px-6 text-center max-w-4xl mx-auto py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-1 text-xs font-mono text-crimson font-bold uppercase tracking-widest bg-crimson/5 px-3 py-1 rounded-full border border-crimson/10">
                <Sparkles className="w-3.5 h-3.5 text-crimson" />
                <span>Permohonan Maaf Tulus</span>
              </div>

              <h1 className="font-serif text-4xl md:text-6xl text-ink-dark leading-tight tracking-tight max-w-3xl mx-auto">
                Malam Sabtu yang Sunyi,<br />
                <span className="italic text-ink-muted">dan Maaf yang Terlambat.</span>
              </h1>

              <p className="font-sans text-sm md:text-base text-ink-muted max-w-xl mx-auto leading-relaxed italic">
                "Ada waktu yang terbuang sia-sia, ada kekecewaan yang meluap dalam dering telepon tanpa suara. Aku tertidur saat kamu menanti, dan untuk itu, maaf adalah kata yang terlalu sederhana..."
              </p>

              <div className="w-12 h-[1px] bg-ink-muted/30 mx-auto my-6"></div>

              <div className="flex items-center justify-center gap-2 text-xs font-mono text-ink-muted/80">
                <span>Cobalah scroll ke bawah secara perlahan, Acaa...</span>
              </div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="inline-block"
              >
                <ArrowDown className="w-5 h-5 text-crimson mt-2" />
              </motion.div>
            </motion.div>
          </section>

          {/* Story Section: The Sleeping Boy vs The Waiting Phone */}
          <section className="py-20 px-6 border-t border-b border-ink-muted/10 bg-paper-card">
            <div className="max-w-5xl mx-auto space-y-24">
              
              {/* Row 1: Her side of the story (Waiting Sadly) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7 }}
                  className="space-y-5 order-2 md:order-1"
                >
                  <span className="text-xs font-mono text-crimson font-semibold">Lembar Pertama: Penantianmu</span>
                  <h3 className="font-serif text-2xl md:text-3xl text-ink-dark leading-tight">
                    Kamu Memeluk Sepi, Menanti Kabar yang Tak Datang.
                  </h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">
                    Aku membayangkan malam itu—saat kamu telah menyisihkan waktumu yang berharga untukku. Kamu menatap ponselmu, berkali-kali menekan tombol panggilan, berharap ada jawaban hangat di ujung sana. 
                  </p>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">
                    Namun, yang kamu dapatkan hanyalah nada sambung yang terus berdering dingin di tengah malam yang sunyi. Setiap detik yang berdetak melahirkan kekecewaan yang mendalam, dan aku sadar, itu adalah goresan rasa sakit yang bersumber dariku.
                  </p>
                </motion.div>

                {/* Picture Frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="order-1 md:order-2 flex justify-center"
                >
                  <div className="bg-white p-4 pb-8 rounded-lg shadow-md border border-ink-muted/10 transform rotate-1 hover:rotate-0 transition-transform duration-300 max-w-sm w-full">
                    <img
                      src={WAITING_PHONE_IMG}
                      alt="Acaa Menanti Kabar"
                      className="w-full h-auto aspect-square object-cover rounded-md mb-4 grayscale hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <p className="font-serif italic text-xs text-center text-ink-muted">
                      "Menatap malam, mencari kabar yang hanyut dalam lelap..."
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Row 2: His side of the story (Fell asleep helplessly) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Picture Frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="flex justify-center"
                >
                  <div className="bg-white p-4 pb-8 rounded-lg shadow-md border border-ink-muted/10 transform -rotate-2 hover:rotate-0 transition-transform duration-300 max-w-sm w-full">
                    <img
                      src={SLEEPING_BOY_IMG}
                      alt="Ketiduran di Malam Sabtu"
                      className="w-full h-auto aspect-square object-cover rounded-md mb-4 grayscale hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <p className="font-serif italic text-xs text-center text-ink-muted">
                      "Tergulung kantuk tanpa sempat mengucap selamat tidur..."
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7 }}
                  className="space-y-5"
                >
                  <span className="text-xs font-mono text-crimson font-semibold">Lembar Kedua: Kelalaianku</span>
                  <h3 className="font-serif text-2xl md:text-3xl text-ink-dark leading-tight">
                    Aku Terbuang dalam Lelap, Melalaikan Keberadaanmu.
                  </h3>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">
                    Aku tidak sedang mencari alasan atau pembelaan diri. Aku tahu lelah melanda setelah pekan yang panjang, namun menutup mata tanpa mengabari atau merespons dering teleponmu adalah sebuah kelalaian besar.
                  </p>
                  <p className="font-sans text-sm text-ink-muted leading-relaxed">
                    Saat mataku tertutup dalam ketidaksadaran mimpi, kamu memikul sebal sendirian. Seharusnya aku ada di sana, mendengar suaramu, merayakan malam bersama. Maafkan aku yang tak mampu menjaga komitmen kecil namun sangat berarti bagi kita semalam.
                  </p>
                </motion.div>
              </div>

            </div>
          </section>

          {/* Custom interactive cute cat element separator */}
          <section className="py-12 bg-warm-beige text-center">
            <div className="max-w-md mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-paper-card border border-ink-muted/10 rounded-2xl p-6 flex flex-col items-center gap-4"
              >
                <img 
                  src={APOLOGY_CATS_IMG} 
                  alt="Kitten Apology" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-ink-muted/15 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <p className="font-serif italic text-sm text-ink-dark">
                    "Meow... Maafin ya, Acaa sayang?"
                  </p>
                  <p className="text-[10px] text-ink-muted/60 font-mono">
                    Sentuhan kecil agar amarahmu lekas mereda.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Memory Lane Section (Music Player) */}
          <section className="py-16 px-6 max-w-5xl mx-auto w-full">
            <div className="text-center mb-10">
              <span className="px-3 py-1 rounded-full bg-crimson/10 text-crimson text-xs font-mono font-semibold tracking-wider uppercase">
                Alunan Melodi Penyesalan
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-ink-dark mt-3">
                Lagu Pengiring Sepi
              </h2>
              <p className="font-sans text-sm text-ink-muted mt-2 max-w-lg mx-auto">
                Bait-bait lirik lagu Aziz Hendra ini mewakili sepi dan beratnya penantian yang kamu alami di Malam Sabtu kemarin. Putar musiknya dan hayati maknanya.
              </p>
            </div>

            <MusicPlayer />
          </section>

          {/* Redemption Section (Interactive Choices) */}
          <section className="py-16 px-6 bg-paper-card border-t border-b border-ink-muted/10">
            <RedemptionSection appUrl={appUrl} />
          </section>

          {/* Voice of Apology (Gemini Chat Interface) */}
          <section className="py-16 px-6">
            <VoiceOfApology />
          </section>

          {/* Boyfriend Hidden Admin Dashboard */}
          <section className="py-10 bg-warm-beige">
            <BoyfriendDashboard />
          </section>

          {/* Footer */}
          <footer className="w-full bg-ink-dark text-warm-beige/90 py-12 px-6 border-t border-ink-muted/10 text-center relative overflow-hidden">
            <div className="absolute top-2 left-2 opacity-5 text-warm-beige">💖</div>
            <div className="absolute bottom-4 right-4 opacity-5 text-warm-beige">✨</div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <span className="font-serif italic text-lg text-warm-beige font-semibold">
                — Dari Lubuk Hati Terbawah —
              </span>
              
              <p className="font-sans text-xs text-warm-beige/60 max-w-md mx-auto leading-relaxed">
                Situs ini kuukir dengan penuh ketulusan, kesungguhan hati, dan rindu yang dalam. Tenanglah dahulu, aku di sini selalu setia menunggumu kembali melunak, Acaa sayang.
              </p>
              
              <div className="w-12 h-[1px] bg-warm-beige/25 mx-auto my-4"></div>
              
              <p className="font-mono text-[10px] text-warm-beige/40">
                © 2026 Surat Maaf untuk Acaa • Kejadian Malam Sabtu, 17 Juli 2026 • Dibuat dengan penuh rasa bersalah oleh Pacarmu.
              </p>
            </div>
          </footer>

        </motion.div>
      )}
    </div>
  );
}
