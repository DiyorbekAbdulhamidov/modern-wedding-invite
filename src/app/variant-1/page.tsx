"use client";

import type { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, Disc, MapPin, CheckCircle, Loader2, Sparkles, Calendar, Clock } from 'lucide-react';
import type { Variants } from 'framer-motion';
import Link from 'next/link';

const GoldSpark = ({ x, delay, duration, size }: { x: number; delay: number; duration: number; size: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      bottom: 0,
      width: size,
      height: size,
      background: 'radial-gradient(circle, #FFF, #DFBA73, #C5A059)',
      boxShadow: `0 0 ${size * 4}px rgba(223,186,115,0.9), 0 0 ${size * 8}px rgba(197,160,89,0.4)`,
    }}
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: [0, '-110vh'], opacity: [0, 1, 0.7, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
  />
);

const LuxuryDivider = () => (
  <div className="flex items-center justify-center gap-3 my-8 opacity-80">
    <div className="h-[0.5px] w-12 bg-gradient-to-r from-transparent to-[#C5A059]" />
    <div className="rotate-45 w-1.5 h-1.5 bg-[#C5A059] rotate-45" />
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-pulse">
      <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="url(#goldGradient)" />
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFBA73" />
          <stop offset="100%" stopColor="#C5A059" />
        </linearGradient>
      </defs>
    </svg>
    <div className="rotate-45 w-1.5 h-1.5 bg-[#C5A059]" />
    <div className="h-[0.5px] w-12 bg-gradient-to-l from-transparent to-[#C5A059]" />
  </div>
);

const CornerAccents = () => (
  <div className="absolute inset-4 pointer-events-none border border-[#C5A059]/10 z-50">
    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#C5A059]/40" />
    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#C5A059]/40" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#C5A059]/40" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#C5A059]/40" />
  </div>
);

const NoirWedding: NextPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<null | 'attending' | 'declined'>(null);
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sparks = Array.from({ length: 25 }, (_, i) => ({
    id: i, x: (i * 4.1) % 100, delay: (i * 0.28) % 8,
    duration: 4.5 + (i * 0.5) % 5, size: 1.2 + (i % 3.5),
  }));

  useEffect(() => {
    if (isStarted) document.title = "Sardor & Amira | Muazzam Visol Bazmi";
  }, [isStarted]);

  useEffect(() => {
    if (!isStarted) return;
    const target = new Date('2026-05-15T18:00:00').getTime();
    const t = setInterval(() => {
      const d = target - Date.now();
      if (d > 0) {
        setTimeLeft({
          kun: Math.floor(d / 86400000),
          soat: Math.floor((d % 86400000) / 3600000),
          daqiqa: Math.floor((d % 3600000) / 60000),
          soniya: Math.floor((d % 60000) / 1000),
        });
      } else {
        setTimeLeft({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
        clearInterval(t);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [isStarted]);

  const handleStart = () => {
    setIsStarted(true);
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => { });
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    }
  };

  const handleRSVP = async (status: 'attending' | 'declined') => {
    if (!guestName.trim()) { alert('Ismingizni kiriting!'); return; }
    setIsSubmitting(true);
    const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🎭 VIP RSVP\n👤 Mehmon: ${guestName}\n📝 Holati: ${status === 'attending' ? '✅ Quvonch bilan boradi' : '❌ Afsuski, bora olmaydi'}`
        }),
      }).catch(() => { });
    }
    setRsvpStatus(status);
    setIsSubmitting(false);
  };

  const editorialReveal: Variants = {
    hidden: { opacity: 0, y: 60, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.4, ease: [0.19, 1, 0.22, 1] },
    },
  };

  return (
    <div style={{ background: '#030303', minHeight: '100svh' }} className="flex justify-center overflow-hidden selection:bg-[#C5A059]/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-cinzel-deco { font-family: 'Cinzel Decorative', serif; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
      `}</style>

      <div className="w-full max-w-[460px] relative overflow-x-hidden bg-[#030303]" style={{ color: '#F4EFE6' }}>
        <audio ref={audioRef} loop preload="auto"><source src="/die.mp3" type="audio/mpeg" /></audio>

        {/* SPLASH PRELOADER */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-6"
              style={{ background: 'radial-gradient(circle at center, #0a0a0a 0%, #020202 100%)' }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
            >
              <CornerAccents />
              <div className="absolute inset-0 overflow-hidden">
                {sparks.map(s => <GoldSpark key={s.id} {...s} />)}
              </div>

              <motion.div className="relative z-20 flex flex-col items-center cursor-pointer" onClick={handleStart} whileTap={{ scale: 0.98 }}>
                <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}>
                  <div className="relative flex items-center justify-center w-56 h-56">
                    <motion.div className="absolute inset-0 rounded-full border border-[#C5A059]/20"
                      animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                    <div className="absolute inset-3 rounded-full border border-[#C5A059]/40 border-dashed animate-[spin_80s_linear_infinite]" />
                    <motion.div className="absolute inset-0 rounded-full border-t border-b border-[#C5A059]/60"
                      animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />

                    <div className="text-center relative z-10 bg-[#030303]/60 backdrop-blur-sm w-40 h-40 rounded-full flex flex-col justify-center items-center">
                      <span className="font-cinzel-deco block text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] to-[#C5A059] leading-none select-none">S</span>
                      <span className="font-cormorant block italic text-lg text-[#C5A059]/60 my-0.5">&</span>
                      <span className="font-cinzel-deco block text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] to-[#C5A059] leading-none select-none">A</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }} className="text-center mt-10 tracking-[0.6em] uppercase">
                  <p className="font-rajdhani text-[10px] text-[#DFBA73] font-medium">Kechki Visol Oqshomi</p>
                  <p className="font-rajdhani text-[9px] text-white/30 mt-2 tracking-[0.4em]">15 . 05 . 2026</p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                  className="flex items-center gap-3 px-8 py-3.5 mt-12 bg-gradient-to-r from-[#C5A059]/10 to-[#DFBA73]/10 border border-[#C5A059]/50 shadow-[0_0_20px_rgba(197,160,89,0.15)] transition-all duration-300 hover:border-[#FFF]">
                  <Play size={10} className="fill-[#DFBA73] stroke-[#DFBA73]" />
                  <span className="font-rajdhani text-[10px] font-semibold tracking-[0.4em] uppercase text-[#DFBA73]">Taklifnomani Ochish</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING MUSIC NODE */}
        {isStarted && (
          <motion.button onClick={toggleMusic} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-8 right-6 z-[150] w-14 h-14 flex items-center justify-center rounded-full bg-black/80 border border-[#C5A059]/50 backdrop-blur-md shadow-[0_0_25px_rgba(197,160,89,0.25)] active:scale-90 transition-transform">
            {isPlaying ? (
              <Disc className="animate-[spin_5s_linear_infinite] text-[#DFBA73]" size={20} />
            ) : (
              <Play className="text-[#DFBA73] fill-[#DFBA73]/20 ml-0.5" size={16} />
            )}
          </motion.button>
        )}

        {/* MAIN BODY */}
        {isStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>

            {/* === HERO SECTION === */}
            <section className="relative flex flex-col justify-between px-6 py-20 min-h-svh">
              {/* Luxury Dynamic Glow Backgrounds */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[-20%] w-80 h-80 bg-[#C5A059] rounded-full filter blur-[120px] opacity-[0.06] animate-pulse" />
                <div className="absolute bottom-[30%] right-[-20%] w-80 h-80 bg-[#DFBA73] rounded-full filter blur-[130px] opacity-[0.04]" />
              </div>

              <div className="text-center mt-6">
                <p className="font-rajdhani text-[10px] tracking-[0.8em] uppercase text-[#DFBA73] font-medium">Kechki Hashamatli Tantana</p>
                <div className="w-6 h-[0.5px] bg-[#C5A059] mx-auto mt-4" />
              </div>

              {/* Unique Asymmetric Typography Layout */}
              <div className="my-auto relative w-full flex flex-col justify-center h-[50vh]">
                <div className="w-full text-left pl-2">
                  <motion.h1 initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="font-cinzel text-6xl font-light tracking-[0.1em] text-white/90">
                    SARDOR
                  </motion.h1>
                </div>

                <div className="absolute left-[42%] top-[34%] z-10">
                  <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, duration: 1.2 }}
                    className="font-cormorant text-7xl italic text-[#C5A059]/70 select-none">
                    &
                  </motion.span>
                </div>

                <div className="w-full text-right pr-2 mt-8">
                  <motion.h1 initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="font-cinzel text-6xl font-light tracking-[0.1em] text-[#DFBA73]">
                    AMIRA
                  </motion.h1>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 mb-4">
                <div className="flex items-center gap-4 text-[#DFBA73]/80">
                  <span className="h-[0.5px] w-8 bg-[#C5A059]/40" />
                  <p className="font-rajdhani text-[12px] tracking-[0.6em] uppercase font-semibold">MAY 15 · 2026</p>
                  <span className="h-[0.5px] w-8 bg-[#C5A059]/40" />
                </div>

                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="mt-4">
                  <div className="w-[1px] h-12 bg-gradient-to-b from-[#C5A059] to-transparent" />
                </motion.div>
              </div>
            </section>

            {/* === ROYAL LETTER SECTION === */}
            <section className="py-24 px-8 relative bg-[#070707] border-y border-[#C5A059]/10">
              <CornerAccents />

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={editorialReveal}
                className="max-w-[340px] mx-auto text-center">
                <p className="font-rajdhani text-[9px] tracking-[0.6em] uppercase text-[#DFBA73] mb-2 font-medium">Ehtirom Ila</p>
                <h3 className="font-cinzel text-xl tracking-[0.3em] text-white/90">TAKLIFNOMA</h3>

                <LuxuryDivider />

                <p className="font-cormorant italic text-[19px] px-2 text-white/80 leading-[2.2] font-light">
                  "Hayotimizning eng muazzam oqshomi, ikki qalbning abadiy rishta ila bogʻlanish damlarida siz aziz va qadrli mehmonimizni quvonchimizga sherik boʻlishga chorlaymiz."
                </p>

                <p className="font-cinzel text-sm text-[#DFBA73] tracking-[0.4em] font-medium my-10 bg-white/[0.02] py-3 border-x border-[#C5A059]/20">
                  SARDOR & AMIRA
                </p>

                <p className="font-cormorant italic text-[19px] px-2 text-white/80 leading-[2.2] font-light">
                  "Ushbu baxtli va unutilmas kunni samimiy tabriklaringiz hamda ezgu duolaringiz ila fayzli va munavvar etishingizni soʻraymiz."
                </p>

                <div className="w-1.5 h-1.5 bg-[#C5A059] rotate-45 mx-auto mt-8 opacity-60" />
              </motion.div>
            </section>

            {/* === EDITORIAL PROGRAM === */}
            <section className="py-24 px-6 bg-[#030303]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={editorialReveal} className="text-center mb-20">
                <p className="font-rajdhani text-[9px] tracking-[0.7em] uppercase text-[#DFBA73] mb-3">Tantana Alomati</p>
                <h2 className="font-cinzel text-2xl text-white tracking-[0.25em] font-light">OQSHOM REJASI</h2>
                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mt-4" />
              </motion.div>

              <div className="max-w-[360px] mx-auto relative px-4">
                {/* Center aesthetic line */}
                <div className="absolute left-[29px] top-4 bottom-4 w-[0.5px] bg-gradient-to-b from-[#C5A059]/40 via-[#C5A059]/10 to-transparent" />

                {[
                  { time: '14:00', event: 'Nikoh Marosimi', desc: "Guvohlar huzurida rasmiy ro'yxatdan o'tish lahzalari", icon: Sparkles },
                  { time: '17:30', event: 'Sokin Fursatlar', desc: "Welcome Reception: Jonli simfonik musiqa va sharbatlar", icon: Clock },
                  { time: '18:00', event: 'Muazzam Bazm', desc: '"Versal" muhtasham saroyida asosiy tantananing boshlanishi', icon: Calendar },
                ].map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.2, duration: 1 }}
                    className="flex gap-6 mb-12 last:mb-0 relative z-15 group">

                    <div className="flex flex-col items-center relative">
                      <div className="w-8 h-8 rounded-full bg-neutral-950 border border-[#C5A059]/50 flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.2)] transition-colors group-hover:border-[#FFF]">
                        <item.icon size={11} className="text-[#DFBA73]" />
                      </div>
                    </div>

                    <div className="flex-1 bg-white/[0.01] border-l border-t border-white/[0.04] p-5 rounded-r-lg backdrop-blur-xs transition-all duration-300 hover:bg-white/[0.03] hover:border-[#C5A059]/30">
                      <span className="font-rajdhani text-2xl text-[#DFBA73] tracking-widest font-light block leading-none mb-2">{item.time}</span>
                      <h4 className="font-cinzel text-[13px] text-white tracking-[0.15em] font-medium mb-1.5">{item.event}</h4>
                      <p className="font-cormorant italic text-[15px] text-white/40 leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* === LUXURY VENUE CARD === */}
            <section className="py-24 px-6 bg-[#070707] border-y border-[#C5A059]/10 relative">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={editorialReveal} className="max-w-[360px] mx-auto">
                <div className="text-center p-12 bg-gradient-to-b from-neutral-950 to-neutral-900/60 border border-[#C5A059]/20 relative shadow-2xl backdrop-blur-md">
                  <div className="absolute inset-2 border border-[#C5A059]/5 pointer-events-none" />

                  <div className="w-12 h-12 rounded-full border border-[#C5A059]/30 mx-auto flex items-center justify-center mb-6">
                    <MapPin size={18} className="text-[#DFBA73] opacity-80" />
                  </div>

                  <h3 className="font-cinzel text-lg text-white tracking-[0.3em] mb-4">MANZIL</h3>

                  <p className="font-cormorant italic text-[17px] text-white/70 leading-loose mb-8 font-light">
                    Toshkent shahri, Yunusobod tumani,<br />
                    <span className="font-cinzel not-italic text-sm text-white font-medium block mt-2 tracking-widest">"VERSAL" TANTANALAR SAROYI</span>
                  </p>

                  <Link href="#" className="font-rajdhani inline-block px-10 py-4 bg-[#C5A059]/5 border border-[#C5A059]/50 text-[#DFBA73] text-[10px] tracking-[0.4em] uppercase font-semibold transition-all duration-400 hover:bg-[#C5A059] hover:text-black hover:shadow-[0_0_25px_rgba(197,160,89,0.4)]">
                    Xaritadan Ko'rish
                  </Link>
                </div>
              </motion.div>
            </section>

            {/* === RSVP PREMIUM GLASS FORM === */}
            <section className="py-24 px-6 bg-[#030303]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={editorialReveal} className="max-w-[360px] mx-auto text-center">
                <p className="font-rajdhani text-[9px] tracking-[0.7em] uppercase text-[#DFBA73] mb-3">Tashrif Tasdig'i</p>
                <h3 className="font-cinzel text-2xl text-white tracking-[0.25em] mb-12 font-light">R S V P</h3>

                <div className="p-8 bg-neutral-950/40 border border-white/[0.06] backdrop-blur-md shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative">
                  <div className="absolute top-0 left-0 w-2 h-[1px] bg-[#C5A059]" />
                  <div className="absolute top-0 left-0 w-[1px] h-2 bg-[#C5A059]" />
                  <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-[#C5A059]" />
                  <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-[#C5A059]" />

                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="form" exit={{ opacity: 0 }} className="space-y-8">
                        <div className="relative">
                          <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                            placeholder="Ism-sharifingiz"
                            className="font-cormorant italic w-full text-center py-3 bg-transparent text-white text-xl border-b border-white/10 focus:border-[#C5A059] focus:outline-none transition-colors duration-300 placeholder:text-white/10"
                          />
                        </div>

                        <div className="space-y-4 pt-4">
                          <button onClick={() => handleRSVP('attending')} disabled={isSubmitting}
                            className="font-rajdhani w-full h-13 flex justify-center items-center bg-gradient-to-r from-[#C5A059] to-[#DFBA73] text-black text-[10px] font-bold tracking-[0.4em] uppercase shadow-[0_5px_20px_rgba(197,160,89,0.2)] transition-transform active:scale-98 disabled:opacity-50">
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Quvonch Ila Boraman'}
                          </button>

                          <button onClick={() => handleRSVP('declined')} disabled={isSubmitting}
                            className="font-rajdhani w-full h-12 flex justify-center items-center border border-white/10 text-white/50 text-[9px] tracking-[0.4em] uppercase transition-all duration-300 hover:border-red-500/40 hover:text-red-400 disabled:opacity-50">
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Afsuski, Bora olmayman'}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full border border-[#C5A059]/30 flex items-center justify-center mb-4 bg-[#C5A059]/5 shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                          <CheckCircle size={26} className="text-[#DFBA73]" />
                        </div>
                        <p className="font-cinzel text-base text-white tracking-widest mt-2">SAMIMIY RAHMAT!</p>
                        <p className="font-rajdhani text-[9px] tracking-[0.3em] uppercase text-[#DFBA73]/60 mt-2">Sizning javobingiz muvaffaqiyatli qabul qilindi</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>

            {/* === MODERN COUNTDOWN === */}
            <section className="py-28 px-6 text-center bg-[#070707] border-t border-white/[0.03]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={editorialReveal}>
                <p className="font-cormorant italic text-2xl text-[#DFBA73]/70 mb-14 font-light">Muqaddas lahzalarga qadar...</p>

                <div className="flex justify-center items-center gap-2">
                  {[
                    { label: 'KUN', val: timeLeft.kun },
                    { label: 'SOAT', val: timeLeft.soat },
                    { label: 'DAQIQA', val: timeLeft.daqiqa },
                    { label: 'SONIYA', val: timeLeft.soniya }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center">
                      <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                        className="flex flex-col items-center justify-center h-24 w-20 bg-neutral-950 border border-white/[0.04] relative">
                        <span className="font-cinzel text-3xl text-white font-light tracking-tight select-none">
                          {item.val.toString().padStart(2, '0')}
                        </span>
                        <span className="font-rajdhani text-[8px] tracking-[0.2em] text-[#C5A059] mt-2 font-medium">{item.label}</span>
                      </motion.div>
                      {i < 3 && <span className="font-light text-[#C5A059]/30 text-xl mx-1 animate-pulse">:</span>}
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* === FINAL ART DECO LOGO === */}
            <section className="py-32 px-6 text-center relative bg-[#030303] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)]" />
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={editorialReveal} className="relative z-10">
                <div className="h-[0.5px] w-16 bg-[#C5A059]/30 mx-auto mb-10" />
                <p className="font-cormorant italic text-[18px] max-w-[280px] mx-auto text-white/50 leading-relaxed font-light mb-10">
                  "Tashrifingiz qalbimizga cheksiz shodlik va baxt bagʻishlaydi."
                </p>
                <h2 className="font-cinzel-deco text-4xl text-transparent bg-clip-text bg-gradient-to-b from-white to-[#C5A059] tracking-[0.35em] select-none">S & A</h2>
                <div className="h-[0.5px] w-16 bg-[#C5A059]/30 mx-auto mt-10" />
              </motion.div>
            </section>

            {/* === PREMIUM FOOTER === */}
            <footer className="py-8 text-center bg-[#070707] border-t border-[#C5A059]/10">
              <p className="font-rajdhani text-[8px] tracking-[0.6em] uppercase text-white/30">
                Designed by <Link href="https://webleaders.uz" className="text-[#DFBA73] hover:text-white transition-colors duration-300 font-semibold">WebLeaders</Link>
              </p>
            </footer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NoirWedding;