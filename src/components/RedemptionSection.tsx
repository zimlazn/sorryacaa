/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, CheckCircle2, Send, RotateCcw, AlertCircle, ShoppingBag, Calendar, HeartHandshake } from 'lucide-react';
import { TebusanOption } from '../types';

interface RedemptionSectionProps {
  appUrl: string;
}

export default function RedemptionSection({ appUrl }: RedemptionSectionProps) {
  const [selectedOption, setSelectedOption] = useState<TebusanOption | null>(null);
  const [customNote, setCustomNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submittedChoice, setSubmittedChoice] = useState<TebusanOption | null>(null);
  const [savedNote, setSavedNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch current selection on mount
  useEffect(() => {
    fetch('/api/apology/responses')
      .then((res) => res.json())
      .then((data) => {
        if (data.selectedTebusan) {
          setSubmittedChoice(data.selectedTebusan);
          setSelectedOption(data.selectedTebusan);
          setSavedNote(data.customNote || '');
          setCustomNote(data.customNote || '');
        }
      })
      .catch((err) => console.error("Gagal memuat status tebusan:", err));
  }, []);

  const options = [
    {
      id: TebusanOption.TRAKTIR,
      title: 'Belanja Online (Max Rp 50k)',
      description: 'Acaa bisa bebas memilih barang atau checkout apa saja di e-commerce kesukaan (Shopee/Tokopedia/dll) dengan nominal maksimal Rp 50.000, nanti aku yang langsung bayarkan!',
      icon: ShoppingBag,
      color: 'border-amber-700/30 bg-amber-50/50 hover:bg-amber-50',
      badge: 'Belanja Manis',
      waLabel: 'Kupon Belanja Online (Maksimal Rp 50.000) 🛍️✨'
    },
    {
      id: TebusanOption.PERMINTAAN_BEBAS,
      title: 'Kabulkan Permintaan Bebas',
      description: 'Satu kali permintaan ajaib dari Acaa yang harus kupenuhi dengan patuh tanpa keluhan, tanpa protes, dan dengan senyuman penuh kelembutan.',
      icon: HeartHandshake,
      color: 'border-crimson/20 bg-red-50/50 hover:bg-red-50',
      badge: 'Hak Istimewa',
      waLabel: 'Satu Permintaan Bebas Tanpa Protes! 💫👑'
    },
    {
      id: TebusanOption.SEHARIAN_FULL,
      title: 'Satu Hari Penuh Bersama',
      description: 'Satu hari penuh (pukul 00:00 sampai 23:59) didedikasikan 100% untuk menemani Acaa. Tanpa interupsi, tanpa mengantuk, sepenuhnya milikmu.',
      icon: Calendar,
      color: 'border-emerald-700/20 bg-emerald-50/50 hover:bg-emerald-50',
      badge: 'Waktu Berkualitas',
      waLabel: 'Satu Hari Penuh Bersama Acaa (00:00 - 23:59) ⏳✨'
    }
  ];

  const handleSubmit = async () => {
    if (!selectedOption) {
      setError('Pilih salah satu tebusan penyesalan terlebih dahulu, Acaa sayang.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/apology/submit-tebusan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option: selectedOption, customNote }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmittedChoice(selectedOption);
        setSavedNote(customNote);
      } else {
        setError(result.error || 'Gagal menyimpan tebusan.');
      }
    } catch (err) {
      setError('Koneksi bermasalah. Tapi tenang, niat tebusanku tetap tulus.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateWhatsAppLink = () => {
    const chosen = options.find(o => o.id === submittedChoice);
    if (!chosen) return '#';

    const text = `*🎟️ KUPON RESMI TEBUSAN MAAF ACA* 🎟️

Halo sayang! Aku sudah merenung di website permohonan maafmu dan telah menentukan pilihan tebusan penyesalanmu:

📌 *Pilihan Tebusan:* 
👉 _${chosen.waLabel}_

💌 *Detail Permintaan Tambahanku:* 
_"${savedNote || 'Tidak ada catatan, yang penting segera ditebus!'}"_

*Syarat & Ketentuan Penggunaan:*
- Kupon ini berlaku selamanya dan wajib dipenuhi sesegera mungkin.
- Pelaksana wajib melayani dengan kelembutan, keceriaan, dan dilarang menggerutu.
- Kegagalan eksekusi akan membatalkan status maaf!

_Divalidasi secara digital di:_ ${appUrl || 'Aplikasi Surat Maaf'}`;

    return `https://api.whatsapp.com/send?phone=6289515179132&text=${encodeURIComponent(text)}`;
  };

  const handleReset = () => {
    setSubmittedChoice(null);
    setCustomNote('');
    setSelectedOption(null);
  };

  return (
    <div id="redemption-section" className="w-full max-w-4xl mx-auto px-4 py-8 relative">
      <div className="text-center mb-10">
        <span className="px-3 py-1 rounded-full bg-crimson/10 text-crimson text-xs font-mono font-semibold tracking-wider uppercase">
          Tebusan Penyesalan
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-ink-dark mt-3">
          Tentukan Syarat Maafmu, Acaa
        </h2>
        <p className="font-sans text-sm md:text-base text-ink-muted mt-3 max-w-xl mx-auto leading-relaxed">
          Waktumu yang terbuang tidak bisa kembali, namun izinkan aku menebusnya dengan hal-hal yang bisa membuatmu tersenyum kembali. Pilih salah satu kupon di bawah ini.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!submittedChoice ? (
          <motion.div
            key="selection-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Options grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {options.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedOption(opt.id);
                      setError(null);
                    }}
                    className={`text-left p-6 rounded-2xl border-2 flex flex-col justify-between h-72 cursor-pointer transition-all duration-300 relative overflow-hidden group ${opt.color} ${
                      isSelected
                        ? 'border-crimson shadow-md ring-2 ring-crimson/10 scale-[1.02]'
                        : 'border-ink-muted/10 hover:border-ink-muted/35 scale-100'
                    }`}
                  >
                    {/* Background floating sparkle icon */}
                    <div className="absolute -right-3 -top-3 text-ink-muted/5 group-hover:text-ink-muted/10 transition-colors">
                      <IconComponent className="w-24 h-24 stroke-[1]" />
                    </div>

                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase ${
                          isSelected ? 'bg-crimson text-white' : 'bg-ink-muted/10 text-ink-muted'
                        }`}>
                          {opt.badge}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-crimson text-warm-beige p-1 rounded-full"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </motion.div>
                        )}
                      </div>
                      
                      <h3 className="font-serif text-lg font-semibold text-ink-dark group-hover:text-crimson transition-colors leading-tight">
                        {opt.title}
                      </h3>
                      <p className="font-sans text-xs text-ink-muted mt-2.5 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    <div className="mt-4 font-mono text-xs font-medium text-ink-dark/80 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      <span>Pilih Kupon Ini</span>
                      <span>→</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Note input */}
            {selectedOption && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-paper-card p-6 border border-ink-muted/15 rounded-2xl max-w-xl mx-auto mt-4"
              >
                <label className="block text-xs font-mono font-semibold uppercase text-ink-muted mb-2 tracking-wide">
                  Detail Permintaan Tambahan Acaa (Opsional)
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Misal: 'Es krim matcha harus dibelikan di gerai kesukaanku hari Minggu besok!' atau tulis apa saja sesukamu..."
                  rows={3}
                  className="w-full text-sm font-sans p-3 bg-warm-beige border border-ink-muted/20 rounded-xl focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson text-ink-dark placeholder-ink-muted/40"
                />
              </motion.div>
            )}

            {/* Error messaging */}
            {error && (
              <div className="flex items-center gap-2 text-crimson text-xs justify-center font-mono">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3.5 bg-ink-dark hover:bg-crimson text-warm-beige hover:text-white rounded-xl shadow-md transition-all duration-300 font-medium tracking-wide inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-warm-beige border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengukir Janji...</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>Terbitkan Kupon Tebusan Maaf</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="redemption-voucher"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto"
          >
            {/* The Vintage Voucher Certificate Card */}
            <div className="relative border-4 border-double border-amber-800/40 bg-paper-card rounded-2xl p-8 md:p-10 shadow-xl overflow-hidden paper-texture">
              {/* Filigree decorative corners */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-800/30"></div>
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-800/30"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-800/30"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-800/30"></div>
              
              {/* Watermark logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02]">
                <HeartHandshake className="w-80 h-80 text-amber-800" />
              </div>

              <div className="text-center relative">
                <div className="inline-block bg-amber-500/10 text-amber-800 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider mb-4 border border-amber-500/20">
                  Sertifikat Janji Setia
                </div>

                <h3 className="font-serif text-2xl md:text-3xl text-amber-900 italic font-bold tracking-tight">
                  Kupon Tebusan Maaf Resmi
                </h3>
                
                <div className="w-16 h-[1px] bg-amber-800/30 mx-auto my-4"></div>
                
                <p className="font-sans text-xs text-ink-muted leading-relaxed max-w-sm mx-auto mb-6">
                  Diberikan kepada <span className="font-semibold text-ink-dark">Acaa</span> sebagai bentuk janji mutlak yang tidak dapat diganggu gugat untuk menebus kesalahan Malam Sabtu, 17 Juli 2026.
                </p>

                <div className="bg-amber-50/70 border border-amber-700/20 rounded-xl p-5 mb-6 text-left">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-800/60 block mb-1">
                    Kupon Pilihan Acaa:
                  </span>
                  <span className="font-serif text-lg md:text-xl font-bold text-amber-950 block">
                    {options.find(o => o.id === submittedChoice)?.title}
                  </span>
                  <p className="font-sans text-xs text-ink-muted/90 mt-1.5 leading-relaxed">
                    {options.find(o => o.id === submittedChoice)?.description}
                  </p>

                  {savedNote && (
                    <div className="mt-4 pt-3 border-t border-amber-800/10">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-800/60 block mb-1">
                        Persyaratan Khusus Acaa:
                      </span>
                      <p className="font-sans text-xs italic text-amber-900 bg-warm-beige/80 p-2.5 rounded-lg border border-amber-800/5 leading-relaxed">
                        "{savedNote}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Micro signatures */}
                <div className="flex justify-between items-center text-left text-[9px] font-mono text-ink-muted/50 mb-6">
                  <div>
                    <p className="border-b border-ink-muted/20 pb-1 italic font-serif text-[11px] text-ink-dark/70">Acaa Sayang</p>
                    <p className="mt-0.5">Pihak Penerima Maaf</p>
                  </div>
                  <div className="text-right">
                    <p className="border-b border-ink-muted/20 pb-1 italic font-serif text-[11px] text-ink-dark/70">Pacarmu yang Sembuh</p>
                    <p className="mt-0.5">Pihak Pemohon Maaf</p>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl shadow-md font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4 fill-white" />
                    <span>Redeem Kupon ke WhatsApp</span>
                  </a>

                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-3 border border-ink-muted/20 hover:border-crimson text-ink-muted hover:text-crimson bg-transparent rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ganti Pilihan</span>
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-center text-[10px] text-ink-muted/50 font-mono mt-4">
              *Kupon terdaftar secara aman di penyimpanan database lokal. Kirim ke WhatsApp untuk menjadikannya agenda resmi kami!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
