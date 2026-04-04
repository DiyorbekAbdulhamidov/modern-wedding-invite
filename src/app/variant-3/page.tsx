"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, Disc, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Ikat diamond ornament
const IkatDiamond = ({ size = 50, color = '#D4AF37', fill = 'rgba(212,175,55,0.15)' }: { size?: number; color?: string; fill?: string }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="none">
    <polygon points="25,2 48,25 25,48 2,25" fill={fill} stroke={color} strokeWidth="0.8" />
    <polygon points="25,10 40,25 25,40 10,25" fill="none" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <polygon points="25,18 32,25 25,32 18,25" fill={color} fillOpacity="0.4" />
    <line x1="25" y1="2" x2="25" y2="48" stroke={color} strokeWidth="0.3" opacity="0.3" />
    <line x1="2" y1="25" x2="48" y2="25" stroke={color} strokeWidth="0.3" opacity="0.3" />
  </svg>
);

// Ikat pattern border row
const IkatBorder = ({ color = '#D4AF37', bg = 'transparent', count = 7 }: { color?: string; bg?: string; count?: number }) => (
  <div className="flex items-center justify-center" style={{ background: bg, overflow: 'hidden' }}>
    {Array.from({ length: count }, (_, i) => (
      <svg key={i} width="48" height="48" viewBox="0 0 48 48" fill="none">
        <polygon points="24,2 46,24 24,46 2,24" fill="rgba(212,175,55,0.1)" stroke={color} strokeWidth="0.6" />
        <polygon points="24,10 38,24 24,38 10,24" fill="rgba(212,175,55,0.08)" stroke={color} strokeWidth="0.4" opacity="0.6" />
        <polygon points="24,18 30,24 24,30 18,24" fill={color} fillOpacity="0.3" />
        <circle cx="24" cy="2" r="1.5" fill={color} fillOpacity="0.5" />
        <circle cx="24" cy="46" r="1.5" fill={color} fillOpacity="0.5" />
        <circle cx="2" cy="24" r="1.5" fill={color} fillOpacity="0.5" />
        <circle cx="46" cy="24" r="1.5" fill={color} fillOpacity="0.5" />
      </svg>
    ))}
  </div>
);

// Ornamental gate arch SVG
const OrnamentalGate = () => (
  <svg viewBox="0 0 320 380" fill="none" className="w-full h-full">
    <rect x="1" y="1" width="318" height="378" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
    <rect x="8" y="8" width="304" height="364" stroke="#D4AF37" strokeWidth="0.4" opacity="0.25" />
    {/* Top arch */}
    <path d="M40 100 C40 20, 280 20, 280 100" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6" />
    <path d="M55 100 C55 35, 265 35, 265 100" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.35" />
    {/* Corner diamonds */}
    {[[20, 20], [300, 20], [20, 360], [300, 360]].map(([cx, cy], i) => (
      <polygon key={i} points={`${cx},${cy - 10} ${cx + 10},${cy} ${cx},${cy + 10} ${cx - 10},${cy}`} fill="#D4AF37" fillOpacity="0.5" />
    ))}
    {/* Side pillars */}
    <line x1="40" y1="100" x2="40" y2="370" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
    <line x1="280" y1="100" x2="280" y2="370" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
    {/* Mid ornaments on pillars */}
    {[150, 220, 290].map(y => (
      <g key={y}>
        <polygon points={`32,${y} 40,${y - 8} 48,${y} 40,${y + 8}`} fill="rgba(212,175,55,0.3)" />
        <polygon points={`272,${y} 280,${y - 8} 288,${y} 280,${y + 8}`} fill="rgba(212,175,55,0.3)" />
      </g>
    ))}
    {/* Top arch ornament */}
    <polygon points="160,30 172,42 160,54 148,42" fill="rgba(212,175,55,0.5)" stroke="#D4AF37" strokeWidth="0.5" />
    <circle cx="160" cy="42" r="4" fill="#D4AF37" opacity="0.4" />
  </svg>
);

const IkatWedding: NextPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<null | 'attending' | 'declined'>(null);
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isStarted) return;
    const target = new Date('2026-04-25T13:00:00').getTime();
    const t = setInterval(() => {
      const d = target - Date.now();
      if (d > 0) setTimeLeft({
        kun: Math.floor(d / 86400000), soat: Math.floor((d % 86400000) / 3600000),
        daqiqa: Math.floor((d % 3600000) / 60000), soniya: Math.floor((d % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isStarted]);

  const handleStart = () => {
    setIsStarted(true);
    audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => { });
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { }); }
  };

  const handleRSVP = async (status: 'attending' | 'declined') => {
    if (!guestName.trim()) { alert('Ismingizni kiriting!'); return; }
    setIsSubmitting(true);
    const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `👑 To'y RSVP (Ulug'bek & Kamola)\n👤 ${guestName}\n📝 ${status === 'attending' ? '✅ Keladi' : '❌ Kelmaydi'}` }),
      }).catch(() => { });
    }
    setRsvpStatus(status);
    setIsSubmitting(false);
  };

  const royalFade = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
  };

  const NAVY = '#0F0C2E';
  const NAVY2 = '#161240';
  const RUBY = '#A01830';
  const EMERALD = '#144D30';
  const GOLD = '#D4AF37';
  const IVORY = '#F5E6C8';
  const TEXT_LIGHT = '#E8D8A8';

  return (
    <div style={{ background: NAVY, minHeight: '100svh', color: IVORY }} className="flex justify-center overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&family=Oswald:wght@200;300;400&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-lora { font-family: 'Lora', serif; }
        .font-oswald { font-family: 'Oswald', sans-serif; }
        @keyframes pulse-gold { 0%,100%{opacity:0.6;} 50%{opacity:1;} }
      `}</style>

      <div className="w-full max-w-[460px] relative overflow-x-hidden">
        <Head><title>Ulug'bek & Kamola | To'y Bazmi</title></Head>
        <audio ref={audioRef} loop preload="auto"><source src="/die.mp3" type="audio/mpeg" /></audio>

        {/* SPLASH */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
              style={{ background: NAVY }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 1.6, ease: [0.77, 0, 0.175, 1] }}>

              {/* Animated background ikat grid */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                {Array.from({ length: 8 }, (_, row) => (
                  <div key={row} className="flex" style={{ marginTop: row === 0 ? -24 : 0 }}>
                    {Array.from({ length: 10 }, (_, col) => (
                      <svg key={col} width="50" height="50" viewBox="0 0 50 50" fill="none">
                        <polygon points="25,2 48,25 25,48 2,25" fill="none" stroke={GOLD} strokeWidth="0.5" />
                        <polygon points="25,14 36,25 25,36 14,25" fill="rgba(212,175,55,0.3)" />
                      </svg>
                    ))}
                  </div>
                ))}
              </div>

              <motion.div className="relative z-20 flex flex-col items-center cursor-pointer" onClick={handleStart}>
                <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: 'easeOut' }}>
                  {/* Royal monogram */}
                  <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="absolute">
                      <polygon points="100,5 195,100 100,195 5,100" fill={`${NAVY}cc`} stroke={GOLD} strokeWidth="1" />
                      <polygon points="100,18 182,100 100,182 18,100" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.5" />
                      <polygon points="100,35 165,100 100,165 35,100" fill="none" stroke={GOLD} strokeWidth="0.3" opacity="0.3" />
                      {[0, 90, 180, 270].map(a => (
                        <g key={a} transform={`rotate(${a} 100 100)`}>
                          <polygon points="100,8 107,15 100,22 93,15" fill={GOLD} fillOpacity="0.6" />
                        </g>
                      ))}
                    </svg>
                    <div className="relative z-10 text-center">
                      <span className="font-cinzel block" style={{ fontSize: '3rem', color: GOLD, letterSpacing: '0.2em', lineHeight: 1.1 }}>U</span>
                      <span className="font-lora italic block" style={{ fontSize: '1.2rem', color: 'rgba(212,175,55,0.5)', lineHeight: 1 }}>&</span>
                      <span className="font-cinzel block" style={{ fontSize: '3rem', color: GOLD, letterSpacing: '0.2em', lineHeight: 1.1 }}>K</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }} className="text-center mt-6 mb-10">
                  <p className="font-oswald" style={{ fontSize: 9, letterSpacing: '0.8em', textTransform: 'uppercase', color: GOLD, fontWeight: 300 }}>Visol Bazmi</p>
                  <p className="font-oswald mt-2" style={{ fontSize: 8, letterSpacing: '0.5em', color: 'rgba(245,230,200,0.4)', textTransform: 'uppercase', fontWeight: 200 }}>25 . 04 . 2026</p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                  className="flex items-center gap-3 px-10 py-4 transition-all duration-500 hover:opacity-80"
                  style={{ border: `0.5px solid ${GOLD}`, background: `rgba(212,175,55,0.08)` }}>
                  <Play size={12} color={GOLD} />
                  <span className="font-oswald" style={{ fontSize: 9, letterSpacing: '0.6em', textTransform: 'uppercase', color: GOLD, fontWeight: 300 }}>Taklifnomani Ochish</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MUSIC BTN */}
        {isStarted && (
          <motion.button onClick={toggleMusic} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed bottom-8 right-6 z-[150] w-12 h-12 flex items-center justify-center active:scale-95 transition-transform"
            style={{ background: NAVY2, border: `0.5px solid rgba(212,175,55,0.4)`, clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}>
            {isPlaying ? <Disc className="animate-spin" size={16} color={GOLD} style={{ animationDuration: '4s' }} /> : <Play size={12} color={GOLD} style={{ marginLeft: 2 }} />}
          </motion.button>
        )}

        {/* MAIN */}
        {isStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

            {/* === HERO === */}
            <section className="relative text-center overflow-hidden" style={{ minHeight: '100svh', background: NAVY }}>
              {/* Background ikat pattern */}
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ overflow: 'hidden' }}>
                {Array.from({ length: 10 }, (_, row) => (
                  <div key={row} className="flex" style={{ marginLeft: row % 2 ? -24 : 0 }}>
                    {Array.from({ length: 11 }, (_, col) => (
                      <svg key={col} width="46" height="46" viewBox="0 0 46 46" fill="none" style={{ flexShrink: 0 }}>
                        <polygon points="23,1 45,23 23,45 1,23" fill="none" stroke={GOLD} strokeWidth="0.8" />
                        <polygon points="23,11 35,23 23,35 11,23" fill={GOLD} fillOpacity="0.4" />
                      </svg>
                    ))}
                  </div>
                ))}
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center px-6 py-20" style={{ minHeight: '100svh' }}>
                <IkatBorder count={9} />

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  className="font-oswald my-10" style={{ fontSize: 8, letterSpacing: '0.8em', textTransform: 'uppercase', color: GOLD, fontWeight: 300 }}>
                  Oila Qurish Tantanasi
                </motion.p>

                {/* Gate frame with image */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1.2 }}
                  className="relative mx-auto" style={{ width: '75%', maxWidth: 280, aspectRatio: '4/5' }}>
                  <div className="absolute inset-0 pointer-events-none z-20">
                    <OrnamentalGate />
                  </div>
                  <div className="w-full h-full overflow-hidden" style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 15%, 100% 100%, 0 100%, 0 15%)', background: NAVY2 }}>
                    <img src="/dreamwedding.jpg" alt="Couple" className="w-full h-full object-cover object-top" style={{ filter: 'brightness(0.85) sepia(0.15) hue-rotate(10deg)' }} />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${NAVY}aa, transparent 40%)` }} />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1 }} className="mt-8">
                  <h1 className="font-cinzel" style={{ fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', color: IVORY, letterSpacing: '0.25em', fontWeight: 400 }}>
                    ULUG'BEK
                  </h1>
                  <div className="flex items-center justify-center gap-3 my-3">
                    <div style={{ height: 0.5, width: 30, background: GOLD }} />
                    <IkatDiamond size={20} color={GOLD} fill={`rgba(212,175,55,0.3)`} />
                    <div style={{ height: 0.5, width: 30, background: GOLD }} />
                  </div>
                  <h1 className="font-cinzel" style={{ fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', color: IVORY, letterSpacing: '0.25em', fontWeight: 400 }}>
                    KAMOLA
                  </h1>
                  <p className="font-oswald mt-6" style={{ fontSize: 11, letterSpacing: '0.5em', color: 'rgba(245,230,200,0.5)', textTransform: 'uppercase', fontWeight: 200 }}>
                    25 · 04 · 2026
                  </p>
                </motion.div>

                <IkatBorder count={9} />
              </div>
            </section>

            {/* === RUBY SECTION: LETTER === */}
            <div style={{ height: 4, background: `linear-gradient(90deg, ${EMERALD}, ${RUBY}, ${GOLD}, ${RUBY}, ${EMERALD})` }} />
            <section className="py-20 px-6 relative overflow-hidden" style={{ background: RUBY }}>
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                {Array.from({ length: 6 }, (_, row) => (
                  <div key={row} className="flex" style={{ marginLeft: row % 2 ? -24 : 0 }}>
                    {Array.from({ length: 11 }, (_, col) => (
                      <svg key={col} width="46" height="46" viewBox="0 0 46 46" fill="none" style={{ flexShrink: 0 }}>
                        <polygon points="23,1 45,23 23,45 1,23" fill="none" stroke={GOLD} strokeWidth="1" />
                        <polygon points="23,14 32,23 23,32 14,23" fill="rgba(212,175,55,0.5)" />
                      </svg>
                    ))}
                  </div>
                ))}
              </div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={royalFade} className="max-w-[340px] mx-auto text-center relative z-10">
                <div className="flex justify-center gap-3 mb-8">
                  {[...Array(3)].map((_, i) => <IkatDiamond key={i} size={24} color={GOLD} fill="rgba(212,175,55,0.2)" />)}
                </div>
                <p className="font-oswald mb-8" style={{ fontSize: 8, letterSpacing: '0.7em', textTransform: 'uppercase', color: GOLD, fontWeight: 300 }}>Ehtiromli Mehmonlarimiz</p>
                <p className="font-lora italic px-2" style={{ fontSize: 15, color: 'rgba(245,230,200,0.85)', lineHeight: 2.5 }}>
                  "Farzand — ota-ona uchun Yaratganning eng buyuk in'omi. Bugun shu in'omlarning kamolini ko'rish nasib etmoqda.
                </p>
                <p className="font-cinzel my-8" style={{ fontSize: 15, color: GOLD, letterSpacing: '0.2em' }}>ULUG'BEK & KAMOLAXON</p>
                <p className="font-lora italic px-2" style={{ fontSize: 15, color: 'rgba(245,230,200,0.85)', lineHeight: 2.5 }}>
                  visol to'yini muborak duolaringiz bilan bezashingizni so'raymiz."
                </p>
                <div className="flex justify-center gap-3 mt-8">
                  {[...Array(3)].map((_, i) => <IkatDiamond key={i} size={24} color={GOLD} fill="rgba(212,175,55,0.2)" />)}
                </div>
              </motion.div>
            </section>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${EMERALD}, ${RUBY}, ${GOLD}, ${RUBY}, ${EMERALD})` }} />

            {/* === EMERALD SECTION: PROGRAM === */}
            <section className="py-20 px-6 relative overflow-hidden" style={{ background: EMERALD }}>
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                {Array.from({ length: 6 }, (_, row) => (
                  <div key={row} className="flex" style={{ marginLeft: row % 2 ? -24 : 0 }}>
                    {Array.from({ length: 11 }, (_, col) => (
                      <svg key={col} width="46" height="46" viewBox="0 0 46 46" fill="none" style={{ flexShrink: 0 }}>
                        <polygon points="23,1 45,23 23,45 1,23" fill="none" stroke={GOLD} strokeWidth="1" />
                        <polygon points="23,14 32,23 23,32 14,23" fill="rgba(212,175,55,0.4)" />
                      </svg>
                    ))}
                  </div>
                ))}
              </div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={royalFade} className="max-w-[340px] mx-auto relative z-10">
                <div className="text-center mb-12">
                  <IkatDiamond size={36} color={GOLD} fill="rgba(212,175,55,0.3)" />
                  <h2 className="font-cinzel mt-4" style={{ fontSize: '1.6rem', color: IVORY, letterSpacing: '0.25em' }}>TANTANA DASTURI</h2>
                </div>

                {[
                  { time: 'Nahorgi Osh', t: '', event: 'Dasturxon Fayzi', desc: "Ertalabki palovga marhamat", color: GOLD },
                  { time: '08:00', t: '', event: "Hatmi Qur'on", desc: "Qur'on tilovati va oq fotixa", color: GOLD },
                  { time: '13:00', t: '', event: "To'y Bazmi", desc: '"Bohodirjon" To\'yxonasi', color: GOLD },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-5 mb-6 p-5 relative"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(212,175,55,0.2)', borderLeft: `3px solid ${item.color}` }}>
                    <div className="flex-shrink-0">
                      <IkatDiamond size={20} color={GOLD} fill="rgba(212,175,55,0.25)" />
                    </div>
                    <div>
                      <p className="font-cinzel" style={{ fontSize: 18, color: GOLD, letterSpacing: '0.1em', lineHeight: 1.2 }}>{item.time}</p>
                      <p className="font-cinzel" style={{ fontSize: 11, color: IVORY, letterSpacing: '0.2em', marginTop: 2 }}>{item.event}</p>
                      <p className="font-lora italic" style={{ fontSize: 12, color: 'rgba(245,230,200,0.5)', marginTop: 2 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${EMERALD}, ${RUBY}, ${GOLD}, ${RUBY}, ${EMERALD})` }} />

            {/* === VENUE === */}
            <section className="py-20 px-6 relative" style={{ background: NAVY2 }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={royalFade} className="max-w-[340px] mx-auto">
                <div className="text-center p-10 relative" style={{ border: '0.5px solid rgba(212,175,55,0.35)' }}>
                  <div className="absolute" style={{ inset: 8, border: '0.5px solid rgba(212,175,55,0.12)', pointerEvents: 'none' }} />
                  {/* Corner diamonds */}
                  {['-translate-x-2 -translate-y-2', 'translate-x-2 -translate-y-2 right-0', '-translate-x-2 translate-y-2 bottom-0', 'translate-x-2 translate-y-2 right-0 bottom-0'].map((t, i) => (
                    <div key={i} className={`absolute transform ${t}`} style={{ top: i < 2 ? 0 : undefined, bottom: i >= 2 ? 0 : undefined, left: i % 2 === 0 ? 0 : undefined, right: i % 2 !== 0 ? 0 : undefined }}>
                      <IkatDiamond size={16} color={GOLD} fill={`rgba(212,175,55,0.4)`} />
                    </div>
                  ))}

                  <MapPin size={22} color={GOLD} style={{ margin: '0 auto 20px', opacity: 0.8 }} />
                  <h3 className="font-cinzel mb-5" style={{ fontSize: 16, color: IVORY, letterSpacing: '0.35em' }}>MANZIL</h3>
                  <p className="font-lora italic mb-4" style={{ fontSize: 14, color: 'rgba(245,230,200,0.6)', lineHeight: 1.9 }}>
                    Toshkent viloyati, Piskent tumani
                  </p>
                  <p className="font-cinzel mb-8" style={{ fontSize: 13, color: GOLD, letterSpacing: '0.15em' }}>"BOHODIRJON" TO'YXONASI</p>
                  <a href="https://maps.app.goo.gl/GEGwZe2Lk4HrmYHr5" target="_blank" rel="noopener noreferrer"
                    className="font-oswald inline-block px-8 py-3 transition-all duration-400 hover:bg-[rgba(212,175,55,0.15)]"
                    style={{ border: `0.5px solid ${GOLD}`, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: GOLD, fontWeight: 300 }}>
                    Xaritada Ochish
                  </a>
                </div>
              </motion.div>
            </section>

            {/* === RSVP === */}
            <div style={{ height: 4, background: `linear-gradient(90deg, ${EMERALD}, ${RUBY}, ${GOLD}, ${RUBY}, ${EMERALD})` }} />
            <section className="py-20 px-6" style={{ background: NAVY }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={royalFade} className="max-w-[340px] mx-auto text-center">
                <div className="flex justify-center gap-2 mb-6">
                  <IkatDiamond size={28} color={RUBY} fill={`rgba(160,24,48,0.2)`} />
                  <IkatDiamond size={36} color={GOLD} fill={`rgba(212,175,55,0.2)`} />
                  <IkatDiamond size={28} color={EMERALD} fill={`rgba(20,77,48,0.2)`} />
                </div>
                <h3 className="font-cinzel mb-3" style={{ fontSize: '1.4rem', color: IVORY, letterSpacing: '0.3em' }}>TASHRIF TASDIG'I</h3>
                <p className="font-oswald mb-10" style={{ fontSize: 8, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(245,230,200,0.4)', fontWeight: 200 }}>
                  Ismingizni kiriting
                </p>

                <div className="p-8" style={{ border: '0.5px solid rgba(212,175,55,0.25)', background: 'rgba(255,255,255,0.03)' }}>
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="form" exit={{ opacity: 0 }} className="space-y-6">
                        <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                          placeholder="Ism-sharifingiz"
                          className="font-lora italic w-full text-center py-3 focus:outline-none bg-transparent transition-colors"
                          style={{ fontSize: 18, color: IVORY, borderBottom: '0.5px solid rgba(212,175,55,0.3)' } as any} />
                        <div className="space-y-3 pt-3">
                          <button onClick={() => handleRSVP('attending')} disabled={isSubmitting}
                            className="font-oswald w-full flex justify-center items-center transition-all duration-300"
                            style={{ height: 48, background: GOLD, color: NAVY, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', fontWeight: 400 }}>
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Quvonch bilan boraman'}
                          </button>
                          <button onClick={() => handleRSVP('declined')} disabled={isSubmitting}
                            className="font-oswald w-full flex justify-center items-center transition-all duration-300"
                            style={{ height: 48, border: `0.5px solid rgba(212,175,55,0.3)`, color: 'rgba(245,230,200,0.4)', fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', fontWeight: 200 }}>
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Afsuski, bora olmayman'}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 flex flex-col items-center">
                        <CheckCircle size={44} color={GOLD} style={{ marginBottom: 16 }} />
                        <p className="font-lora italic" style={{ fontSize: 20, color: IVORY }}>Rahmat!</p>
                        <p className="font-oswald mt-2" style={{ fontSize: 8, letterSpacing: '0.5em', textTransform: 'uppercase', color: `rgba(212,175,55,0.5)`, fontWeight: 200 }}>Javobingiz qabul qilindi</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>

            {/* === COUNTDOWN === */}
            <div style={{ height: 4, background: `linear-gradient(90deg, ${EMERALD}, ${RUBY}, ${GOLD}, ${RUBY}, ${EMERALD})` }} />
            <section className="py-24 px-6 text-center" style={{ background: RUBY }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={royalFade}>
                <p className="font-lora italic mb-12" style={{ fontSize: '1.8rem', color: GOLD, opacity: 0.85 }}>Bayramga qadar...</p>
                <div className="flex justify-center gap-2">
                  {[{ l: 'KUN', v: timeLeft.kun }, { l: 'SOAT', v: timeLeft.soat }, { l: 'DAQIQA', v: timeLeft.daqiqa }, { l: 'SONIYA', v: timeLeft.soniya }].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="flex flex-col items-center py-5" style={{ width: 64, border: '0.5px solid rgba(212,175,55,0.3)', background: 'rgba(255,255,255,0.05)', clipPath: 'polygon(50% 0, 100% 15%, 100% 85%, 50% 100%, 0 85%, 0 15%)' }}>
                      <span className="font-cinzel" style={{ fontSize: 24, color: GOLD, fontWeight: 500 }}>{item.v.toString().padStart(2, '0')}</span>
                      <span className="font-oswald mt-2" style={{ fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,230,200,0.5)', fontWeight: 200 }}>{item.l}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${EMERALD}, ${RUBY}, ${GOLD}, ${RUBY}, ${EMERALD})` }} />

            {/* === CLOSE === */}
            <section className="py-32 px-6 text-center relative overflow-hidden" style={{ background: NAVY }}>
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                {Array.from({ length: 8 }, (_, row) => (
                  <div key={row} className="flex" style={{ marginLeft: row % 2 ? -24 : 0 }}>
                    {Array.from({ length: 11 }, (_, col) => (
                      <svg key={col} width="46" height="46" viewBox="0 0 46 46" fill="none" style={{ flexShrink: 0 }}>
                        <polygon points="23,1 45,23 23,45 1,23" fill="none" stroke={GOLD} strokeWidth="0.8" />
                        <polygon points="23,14 32,23 23,32 14,23" fill={GOLD} fillOpacity="0.35" />
                      </svg>
                    ))}
                  </div>
                ))}
              </div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={royalFade} className="relative z-10">
                <div className="flex justify-center gap-4 mb-8">
                  <IkatDiamond size={20} color={RUBY} fill="rgba(160,24,48,0.25)" />
                  <IkatDiamond size={32} color={GOLD} fill="rgba(212,175,55,0.2)" />
                  <IkatDiamond size={20} color={EMERALD} fill="rgba(20,77,48,0.25)" />
                </div>
                <p className="font-lora italic max-w-[260px] mx-auto mb-8" style={{ fontSize: 16, color: 'rgba(245,230,200,0.55)', lineHeight: 2 }}>
                  "Bizning baxtimiz sizning tashrifingiz bilan to'kis bo'ladi."
                </p>
                <h2 className="font-cinzel" style={{ fontSize: '3rem', color: GOLD, letterSpacing: '0.3em' }}>U & K</h2>
                <div className="flex justify-center gap-4 mt-8">
                  <IkatDiamond size={20} color={EMERALD} fill="rgba(20,77,48,0.25)" />
                  <IkatDiamond size={32} color={GOLD} fill="rgba(212,175,55,0.2)" />
                  <IkatDiamond size={20} color={RUBY} fill="rgba(160,24,48,0.25)" />
                </div>
              </motion.div>
            </section>

            <footer className="py-8 text-center" style={{ background: '#080520', borderTop: `0.5px solid rgba(212,175,55,0.15)` }}>
              <p className="font-oswald" style={{ fontSize: 8, letterSpacing: '0.6em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.45)', fontWeight: 200 }}>
                Designed by <Link href="https://webleaders.uz" className="hover:opacity-80 transition-opacity">WebLeaders</Link>
              </p>
            </footer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IkatWedding;