"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import type { Variants } from 'framer-motion';
import { Play, MapPin, CheckCircle, Loader2, Calendar, Copy, Volume2, VolumeX, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Ikat diamond ornament
const IkatDiamond = ({ size = 50, color = '#D4AF37', fill = 'rgba(212,175,55,0.15)' }: { size?: number; color?: string; fill?: string }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="none" className="transition-transform duration-700 hover:scale-110">
    <polygon points="25,2 48,25 25,48 2,25" fill={fill} stroke={color} strokeWidth="0.8" />
    <polygon points="25,10 40,25 25,40 10,25" fill="none" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <polygon points="25,18 32,25 25,32 18,25" fill={color} fillOpacity="0.4" />
    <line x1="25" y1="2" x2="25" y2="48" stroke={color} strokeWidth="0.3" opacity="0.3" />
    <line x1="2" y1="25" x2="48" y2="25" stroke={color} strokeWidth="0.3" opacity="0.3" />
  </svg>
);

// Ikat pattern border row
const IkatBorder = ({ color = '#D4AF37', bg = 'transparent', count = 7 }: { color?: string; bg?: string; count?: number }) => (
  <div className="flex items-center justify-center select-none py-2" style={{ background: bg, overflow: 'hidden' }}>
    {Array.from({ length: count }, (_, i) => (
      <svg key={i} width="44" height="44" viewBox="0 0 48 48" fill="none" className="opacity-80">
        <polygon points="24,2 46,24 24,46 2,24" fill="rgba(212,175,55,0.06)" stroke={color} strokeWidth="0.6" />
        <polygon points="24,10 38,24 24,38 10,24" fill="rgba(212,175,55,0.04)" stroke={color} strokeWidth="0.4" opacity="0.6" />
        <polygon points="24,18 30,24 24,30 18,24" fill={color} fillOpacity="0.25" />
        <circle cx="24" cy="2" r="1" fill={color} fillOpacity="0.4" />
        <circle cx="24" cy="46" r="1" fill={color} fillOpacity="0.4" />
      </svg>
    ))}
  </div>
);

// Ornamental gate arch SVG
const OrnamentalGate = () => (
  <svg viewBox="0 0 320 380" fill="none" className="w-full h-full drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]">
    <rect x="1" y="1" width="318" height="378" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
    <rect x="8" y="8" width="304" height="364" stroke="#D4AF37" strokeWidth="0.4" opacity="0.25" />
    <path d="M40 100 C40 20, 280 20, 280 100" stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity="0.7" />
    <path d="M55 100 C55 35, 265 35, 265 100" stroke="#D4AF37" strokeWidth="0.6" fill="none" opacity="0.4" />
    {[[20, 20], [300, 20], [20, 360], [300, 360]].map(([cx, cy], i) => (
      <polygon key={i} points={`${cx},${cy - 8} ${cx + 8},${cy} ${cx},${cy + 8} ${cx - 8},${cy}`} fill="#D4AF37" fillOpacity="0.6" />
    ))}
    <line x1="40" y1="100" x2="40" y2="370" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
    <line x1="280" y1="100" x2="280" y2="370" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
    {[150, 220, 290].map(y => (
      <g key={y}>
        <polygon points={`34,${y} 40,${y - 6} 46,${y} 40,${y + 6}`} fill="rgba(212,175,55,0.4)" />
        <polygon points={`274,${y} 280,${y - 6} 286,${y} 280,${y + 6}`} fill="rgba(212,175,55,0.4)" />
      </g>
    ))}
    <polygon points="160,26 170,36 160,46 150,36" fill="rgba(212,175,55,0.6)" stroke="#D4AF37" strokeWidth="0.5" />
  </svg>
);

const IkatWedding: NextPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<null | 'attending' | 'declined'>(null);
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const target = new Date('2026-04-25T13:00:00').getTime();
    const t = setInterval(() => {
      const d = target - Date.now();
      if (d > 0) {
        setTimeLeft({
          kun: Math.floor(d / 86400000),
          soat: Math.floor((d % 86400000) / 3600000),
          daqiqa: Math.floor((d % 3600000) / 60000),
          soniya: Math.floor((d % 60000) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio playback blocked:", err));
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => { });
    }
  };

  const handleRSVP = async (status: 'attending' | 'declined') => {
    if (!guestName.trim()) {
      alert('Iltimos, ism-sharifingizni kiriting.');
      return;
    }
    setIsSubmitting(true);
    const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `👑 To'y RSVP\n👤 Mehmon: ${guestName}\n📝 Holati: ${status === 'attending' ? '✅ Quvonch bilan boradi' : '❌ Afsuski bora olmaydi'}`
        }),
      }).catch(() => { });
    }
    setRsvpStatus(status);
    setIsSubmitting(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("Bohodirjon To'yxonasi, Piskent tumani");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const royalFade: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const NAVY = '#0F0C2E';
  const NAVY2 = '#161240';
  const RUBY = '#A01830';
  const EMERALD = '#144D30';
  const GOLD = '#D4AF37';
  const IVORY = '#F5E6C8';

  return (
    <div style={{ background: NAVY, minHeight: '100svh', color: IVORY }} className="flex justify-center overflow-hidden antialiased selection:bg-[#rgba(212,175,55,0.3)]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;0,500;1,400&family=Oswald:wght@200;400;500&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-lora { font-family: 'Lora', serif; }
        .font-oswald { font-family: 'Oswald', sans-serif; }
        
        .gold-shimmer {
          background: linear-gradient(90deg, #D4AF37 0%, #FFF5D1 50%, #D4AF37 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .luxury-blur {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.03);
          border: 0.5px solid rgba(212, 175, 55, 0.2);
        }
      `}</style>

      <div className="w-full max-w-[460px] relative overflow-x-hidden shadow-2xl shadow-black/80">
        <Head>
          <title>Ulug'bek & Kamola | Taklifnoma</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </Head>

        <audio ref={audioRef} loop preload="auto">
          <source src="/die.mp3" type="audio/mpeg" />
        </audio>

        {/* SPLASH ENTRY */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div className="fixed inset-0 z-[300] flex flex-col items-center justify-center px-6"
              style={{ background: NAVY }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}>

              {/* Grid Background */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.04] grid grid-cols-6 gap-2 p-4">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="aspect-square border border-[#D4AF37] rotate-45" />
                ))}
              </div>

              <motion.div className="relative z-20 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}>

                {/* Royal Monogram Container */}
                <div className="relative flex items-center justify-center w-52 h-52 mb-8 animate-[pulse_4s_infinite_ease-in-out]">
                  <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" className="absolute top-0 left-0">
                    <polygon points="100,5 195,100 100,195 5,100" fill="rgba(15,12,46,0.8)" stroke={GOLD} strokeWidth="1" />
                    <polygon points="100,15 185,100 100,185 15,100" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.5" />
                    <circle cx="100" cy="100" r="45" stroke={GOLD} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.6" />
                  </svg>
                  <div className="relative z-10">
                    <span className="font-cinzel block text-5xl font-semibold tracking-widest text-[#D4AF37] gold-shimmer">U & K</span>
                  </div>
                </div>

                <p className="font-oswald text-[10px] tracking-[0.8em] uppercase text-[#D4AF37] mb-2 font-light">Visol Bazmi Takvimi</p>
                <p className="font-oswald text-xs tracking-[0.4em] text-ivory/60 mb-12">25.04.2026</p>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  className="group relative flex items-center gap-4 px-8 py-4 overflow-hidden transition-all duration-300 active:scale-95 luxury-blur hover:border-[#D4AF37]/60"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <Play size={14} fill={GOLD} stroke="none" className="group-hover:scale-110 transition-transform" />
                  <span className="font-oswald text-[10px] tracking-[0.5em] uppercase text-[#D4AF37] font-medium">Taklifnomani Ochish</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PREMIUM AUDIO CONTROLLER */}
        {isStarted && (
          <motion.button
            onClick={toggleMusic}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 right-6 z-[200] w-14 h-14 flex flex-col items-center justify-center rounded-full bg-[#161240]/90 border border-[#D4AF37]/40 shadow-xl backdrop-blur-md active:scale-90 transition-transform"
          >
            {isPlaying ? (
              <div className="flex items-end gap-[2px] h-4">
                <span className="w-[2px] bg-[#D4AF37] rounded-full animate-[pulse_0.5s_infinite_alternate]" style={{ height: '60%' }} />
                <span className="w-[2px] bg-[#D4AF37] rounded-full animate-[pulse_0.7s_infinite_alternate_0.2s]" style={{ height: '100%' }} />
                <span className="w-[2px] bg-[#D4AF37] rounded-full animate-[pulse_0.4s_infinite_alternate_0.1s]" style={{ height: '40%' }} />
                <span className="w-[2px] bg-[#D4AF37] rounded-full animate-[pulse_0.6s_infinite_alternate_0.3s]" style={{ height: '80%' }} />
              </div>
            ) : (
              <VolumeX size={16} stroke={GOLD} />
            )}
            <span className="text-[7px] font-oswald text-[#D4AF37] tracking-widest mt-1 font-light">{isPlaying ? "Muzika" : "Jim"}</span>
          </motion.button>
        )}

        {/* MAIN COMPONENT CONTENT */}
        {isStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>

            {/* HEROSCAPE */}
            <section className="relative text-center flex flex-col justify-between items-center px-6 py-12 min-h-screen" style={{ background: NAVY }}>
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay">
                {Array.from({ length: 12 }).map((_, r) => (
                  <div key={r} className="flex justify-center gap-4 my-2 opacity-40">
                    {Array.from({ length: 6 }).map((_, c) => <div key={c} className="w-8 h-8 border border-white rotate-45" />)}
                  </div>
                ))}
              </div>

              <IkatBorder count={9} />

              <div className="my-auto w-full flex flex-col items-center">
                <p className="font-oswald text-[9px] tracking-[0.7em] uppercase text-[#D4AF37] mb-8 font-light">Lutfan Taklif Etamiz</p>

                {/* Elegant Gate Framework Frame */}
                <div className="relative w-64 aspect-[4/5] mb-8 group">
                  <div className="absolute inset-0 z-20 pointer-events-none transform group-hover:scale-[1.01] transition-transform duration-1000">
                    <OrnamentalGate />
                  </div>
                  <div className="w-full h-full p-2" style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 12%, 100% 100%, 0 100%, 0 12%)' }}>
                    <div className="w-full h-full overflow-hidden bg-[#161240]">
                      <img
                        src="/dreamwedding.jpg"
                        alt="Couple Portrait"
                        className="w-full h-full object-cover object-top filter brightness-[0.75] sepia-[0.2] contrast-[1.05] transition-transform duration-[4000] ease-out group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>

                <h1 className="font-cinzel text-3xl font-medium tracking-[0.2em] text-white">ULUG'BEK</h1>
                <div className="flex items-center justify-center gap-4 my-4 w-full opacity-60">
                  <div className="h-[0.5px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                  <IkatDiamond size={16} color={GOLD} fill="rgba(212,175,55,0.4)" />
                  <div className="h-[0.5px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
                </div>
                <h1 className="font-cinzel text-3xl font-medium tracking-[0.2em] text-white">KAMOLA</h1>

                <p className="font-oswald text-xs tracking-[0.5em] text-[#D4AF37] mt-8 font-light">25 APREL · 2026</p>
              </div>

              <IkatBorder count={9} />
            </section>

            {/* THE INVITATION MESSAGE */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40" />
            <section className="py-24 px-6 text-center relative overflow-hidden" style={{ background: RUBY }}>
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={royalFade} className="max-w-[340px] mx-auto space-y-8 relative z-10">
                <div className="flex justify-center gap-2 opacity-70">
                  {[...Array(3)].map((_, i) => <IkatDiamond key={i} size={20} color={GOLD} fill="transparent" />)}
                </div>

                <p className="font-oswald text-[9px] tracking-[0.6em] uppercase text-[#D4AF37] font-light">Qadrli Mehmonimiz</p>

                <p className="font-lora text-base leading-loose text-white/90 px-2 font-light">
                  "Farzand — ota-ona hayotining mazmuni, Yaratganning cheksiz marhamati. Bugun niyatlarimiz ijobat bo'lib, jondan aziz farzandlarimiz kamolini ko'rish baxtiga musharrafmiz."
                </p>

                <h3 className="font-cinzel text-sm tracking-[0.25em] text-[#D4AF37] font-semibold py-2">ULUG'BEK & KAMOLAXON</h3>

                <p className="font-lora text-base leading-loose text-white/90 px-2 font-light">
                  Ushbu muqaddas rishtalar bog'lanadigan qutlug' ayyomda siz azizlarimizning samimiy duolaringiz va hamrohligingiz biz uchun yuksak sharafdir.
                </p>

                <div className="flex justify-center gap-2 opacity-70">
                  {[...Array(3)].map((_, i) => <IkatDiamond key={i} size={20} color={GOLD} fill="transparent" />)}
                </div>
              </motion.div>
            </section>

            {/* EVENT SCHEDULE (DASTUR) */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40" />
            <section className="py-24 px-6 relative overflow-hidden" style={{ background: EMERALD }}>
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={royalFade} className="max-w-[350px] mx-auto relative z-10">
                <div className="text-center mb-16">
                  <IkatDiamond size={32} color={GOLD} fill="rgba(212,175,55,0.1)" />
                  <h2 className="font-cinzel text-xl tracking-[0.3em] text-white mt-4 font-medium">TANTANA DASTURI</h2>
                </div>

                {[
                  { time: 'Nahorgi Osh', label: '07:00 - 09:00', event: 'Ertalabki Dasturxon', desc: "Yaqinlar davrasida milliy palov", edge: GOLD },
                  { time: "Hatmi Qur'on", label: '08:00', event: "Duolar va Oq Fotixa", desc: "Kelin-kuyov baxti uchun Qur'on tilovati", edge: GOLD },
                  { time: "To'y Bazmi", label: '13:00', event: "Nikoh Tantanasi", desc: 'Muhtasham "Bohodirjon" To\'yxonasi', edge: GOLD },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.8 }}
                    className="luxury-blur p-6 mb-6 relative group hover:bg-white/[0.05] transition-all"
                    style={{ borderLeft: `3px solid ${item.edge}` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-cinzel text-base font-semibold tracking-wider text-[#D4AF37]">{item.time}</span>
                      <span className="font-oswald text-[10px] tracking-widest text-white/50">{item.label}</span>
                    </div>
                    <p className="font-cinzel text-[11px] tracking-widest text-white/90 mb-1">{item.event}</p>
                    <p className="font-lora text-xs italic text-white/60 font-light">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* GEO-LOCATION SECTION */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40" />
            <section className="py-24 px-6 relative" style={{ background: NAVY2 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={royalFade} className="max-w-[340px] mx-auto">
                <div className="text-center p-8 relative border border-[#D4AF37]/30 bg-black/10">
                  <div className="absolute inset-2 border border-[#D4AF37]/10 pointer-events-none" />

                  {/* Corner Elements */}
                  {['top-0 left-0 -translate-x-1 -translate-y-1', 'top-0 right-0 translate-x-1 -translate-y-1', 'bottom-0 left-0 -translate-x-1 translate-y-1', 'bottom-0 right-0 translate-x-1 translate-y-1'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos}`}>
                      <IkatDiamond size={12} color={GOLD} fill={NAVY2} />
                    </div>
                  ))}

                  <MapPin size={24} stroke={GOLD} className="mx-auto mb-6 opacity-90 animate-bounce" />
                  <h3 className="font-cinzel text-sm tracking-[0.4em] text-white mb-6 font-semibold">TO'YXONA MANZILI</h3>

                  <p className="font-lora text-sm text-white/70 leading-relaxed mb-1 font-light">Toshkent viloyati,</p>
                  <p className="font-lora text-sm text-white/70 leading-relaxed mb-4 font-light">Piskent tumani</p>
                  <p className="font-cinzel text-sm text-[#D4AF37] tracking-[0.15em] mb-8 font-medium">"BOHODIRJON" TO'YXONASI</p>

                  <div className="flex flex-col gap-3">
                    <a href="https://maps.app.goo.gl/GEGwZe2Lk4HrmYHr5" target="_blank" rel="noopener noreferrer"
                      className="font-oswald flex items-center justify-center gap-2 px-6 py-3 w-full border border-[#D4AF37] text-[10px] tracking-[0.4em] uppercase text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all font-medium">
                      <span>Xaritadan ko'rish</span>
                      <ExternalLink size={10} />
                    </a>

                    <button
                      onClick={copyToClipboard}
                      className="font-oswald flex items-center justify-center gap-2 px-6 py-3 w-full border border-white/20 text-[10px] tracking-[0.4em] uppercase text-white/60 hover:text-white transition-all font-light"
                    >
                      <Copy size={10} />
                      <span>{copied ? "Nusxalandi!" : "Manzilni nusxalash"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* RSVP PLATFORM */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40" />
            <section className="py-24 px-6 relative" style={{ background: NAVY }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={royalFade} className="max-w-[340px] mx-auto text-center">
                <div className="flex justify-center gap-3 mb-6 opacity-60">
                  <IkatDiamond size={24} color={RUBY} fill="transparent" />
                  <IkatDiamond size={28} color={GOLD} fill="transparent" />
                  <IkatDiamond size={24} color={EMERALD} fill="transparent" />
                </div>

                <h3 className="font-cinzel text-lg tracking-[0.25em] text-white mb-2 font-medium">TASHRIFNI TASDIQLASH</h3>
                <p className="font-oswald text-[9px] tracking-[0.4em] uppercase text-white/40 mb-10 font-light">Sizni intizorlik bilan kutamiz</p>

                <div className="luxury-blur p-8 rounded-none">
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="rsvp-form" exit={{ opacity: 0 }} className="space-y-6">
                        <div className="relative">
                          <input
                            type="text"
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                            placeholder="Ism-sharifingiz"
                            className="font-lora italic w-full text-center py-3 bg-transparent border-b border-white/20 text-white placeholder:text-white/30 text-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
                          />
                        </div>

                        <div className="space-y-3 pt-4">
                          <button
                            onClick={() => handleRSVP('attending')}
                            disabled={isSubmitting}
                            className="font-oswald w-full flex justify-center items-center h-12 bg-[#D4AF37] text-[#0F0C2E] text-[10px] tracking-[0.4em] uppercase font-semibold hover:bg-[#FFF5D1] transition-colors disabled:opacity-50"
                          >
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Quvonch bilan boraman'}
                          </button>

                          <button
                            onClick={() => handleRSVP('declined')}
                            disabled={isSubmitting}
                            className="font-oswald w-full flex justify-center items-center h-12 border border-white/20 text-white/60 text-[10px] tracking-[0.4em] uppercase font-light hover:border-white/40 transition-colors disabled:opacity-50"
                          >
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Afsuski, bora olmayman'}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="rsvp-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 flex flex-col items-center">
                        <CheckCircle size={40} stroke={GOLD} className="mb-4" />
                        <p className="font-lora italic text-xl text-white mb-2">Katta rahmat!</p>
                        <p className="font-oswald text-[9px] tracking-[0.3em] uppercase text-[#D4AF37] font-light">Sizning javobingiz muvaffaqiyatli yetkazildi</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>

            {/* INTERACTIVE COUNTDOWN TIMELINE */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40" />
            <section className="py-24 px-6 text-center relative" style={{ background: RUBY }}>
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={royalFade} className="relative z-10">
                <p className="font-lora text-xl text-[#D4AF37] italic mb-10 font-light">Go'zal lahzalarga oz qoldi...</p>

                <div className="flex justify-center gap-3">
                  {[
                    { label: 'KUN', val: timeLeft.kun },
                    { label: 'SOAT', val: timeLeft.soat },
                    { label: 'MINUT', val: timeLeft.daqiqa },
                    { label: 'SEKUND', val: timeLeft.soniya }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center py-4 w-16 h-20 border border-[#D4AF37]/30 bg-black/10"
                      style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 85%, 50% 100%, 0% 85%, 0% 15%)' }}
                    >
                      <span className="font-cinzel text-xl text-[#D4AF37] font-medium">{item.val.toString().padStart(2, '0')}</span>
                      <span className="font-oswald text-[7px] tracking-widest text-white/40 mt-1 font-light">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Add to Calendar Button */}
                <div className="mt-10 flex justify-center">
                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ulug%27bek+%26+Kamola+Visol+To%27yi&dates=20260425T020000Z/20260425T170000Z&details=Sizni+farzandlarimiz+nikoh+to%27yi+tantanasida+kutamiz.&location=Bohodirjon+To%27yxonasi,+Piskent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-oswald flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/20 text-[9px] tracking-[0.3em] uppercase text-white/80 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all"
                  >
                    <Calendar size={11} />
                    <span>Kalendarga qo'shish</span>
                  </a>
                </div>
              </motion.div>
            </section>

            {/* VALEDICTION FOOTNOTE */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40" />
            <section className="py-32 px-6 text-center relative" style={{ background: NAVY }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={royalFade}>
                <div className="flex justify-center gap-3 mb-6 opacity-50">
                  <IkatDiamond size={16} color={EMERALD} fill="transparent" />
                  <IkatDiamond size={24} color={GOLD} fill="transparent" />
                  <IkatDiamond size={16} color={RUBY} fill="transparent" />
                </div>
                <p className="font-lora text-base italic max-w-[260px] mx-auto text-white/60 leading-relaxed mb-6 font-light">
                  "Tashrifingiz qalbimizga quvonch, xonadonimizga fayz bag'ishlaydi."
                </p>
                <h2 className="font-cinzel text-3xl tracking-[0.3em] text-[#D4AF37] font-light">U & K</h2>
              </motion.div>
            </section>

            {/* BRANDED LUXURY FOOTER */}
            <footer className="py-8 text-center bg-[#070517]" style={{ borderTop: `0.5px solid rgba(212,175,55,0.15)` }}>
              <p className="font-oswald text-[8px] tracking-[0.5em] uppercase text-white/30 font-light">
                Designed by <Link href="https://webleaders.uz" className="text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors">WebLeaders</Link>
              </p>
            </footer>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IkatWedding;