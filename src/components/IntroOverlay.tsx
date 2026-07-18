/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MailOpen, Heart } from 'lucide-react';

interface IntroOverlayProps {
  onOpen: () => void;
}

export default function IntroOverlay({ onOpen }: IntroOverlayProps) {
  const [isOpenClicked, setIsOpenClicked] = useState(false);

  const handleOpen = () => {
    setIsOpenClicked(true);
    setTimeout(() => {
      onOpen();
    }, 1000);
  };

  return (
    <motion.div
      id="intro-overlay"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-warm-beige p-6 text-center paper-texture"
      initial={{ opacity: 1 }}
      animate={{ opacity: isOpenClicked ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-md w-full border border-ink-muted/20 rounded-2xl p-8 md:p-12 bg-paper-card shadow-lg relative overflow-hidden flex flex-col items-center">
        {/* Decorative corner borders */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-ink-muted/30"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-ink-muted/30"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-ink-muted/30"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-ink-muted/30"></div>

        <motion.div
          className="w-16 h-16 rounded-full bg-crimson/5 flex items-center justify-center mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <Heart className="w-8 h-8 text-crimson" fill="currentColor" opacity={0.1} />
        </motion.div>

        <h1 className="font-serif text-3xl md:text-4xl text-ink-dark tracking-tight mb-4">
          Untuk Acaa Sayang,
        </h1>
        
        <p className="font-sans text-sm md:text-base text-ink-muted leading-relaxed mb-8">
          Sebuah ruang sunyi yang kubangun dengan penuh penyesalan, untuk merenungkan kesalahan Malam Sabtu kemarin. Ketuk untuk membuka lembar permohonan maaf ini.
        </p>

        <motion.button
          id="btn-open-letter"
          onClick={handleOpen}
          className="flex items-center gap-3 px-6 py-3.5 bg-ink-dark text-warm-beige font-medium rounded-xl shadow-md hover:bg-crimson hover:text-white transition-all duration-300 group cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <MailOpen className="w-5 h-5 group-hover:rotate-6 transition-transform" />
          <span>Buka Surat Ini</span>
        </motion.button>

        <div className="mt-8 flex items-center gap-2 text-xs text-ink-muted/60 font-mono">
          <span>Sabtu, 18 Juli 2026</span>
          <span>•</span>
          <span>Hati yang Menyesal</span>
        </div>
      </div>
    </motion.div>
  );
}
