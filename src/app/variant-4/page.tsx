"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, Disc, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Twinkling star component
const Star = ({ x, y, size, delay, dur }: { x: number; y: number; size: number; delay: number; dur: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: 'white' }}
    animate={{ opacity: [0.1, 1, 0.2, 0.8, 0.1], scale: [1, 1.4, 0.8, 1.2, 1] }}
    transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// Moon crescent SVG
const MoonCrescent = ({ size = 80, color = '#FFD580' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="32" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.5" opacity="0.6" />
    <circle cx="52" cy="34" r="26" fill="#060B18" />
    <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
    {/* Stars around moon */}
    {[[15, 20], [65, 25], [70, 60], [20, 65], [10, 45]].map(([sx, sy], i) => (
      <circle key={i} cx={sx} cy={sy} r="1.5" fill={color} fillOpacity="0.6" />
    ))}
  </svg>
);

// Constellation connector SVG
const ConstellationLine = () => (
  <svg viewBox="0 0 320 60" className="w-full opacity-30" fill="none">
    <circle cx="20" cy="30" r="2" fill="#7B61FF" />
    <circle cx="80" cy="15" r="1.5" fill="#4ECDC4" />
    <circle cx="140" cy="35" r="2.5" fill="#7B61FF" />
    <circle cx="200" cy="10" r="1.5" fill="#4ECDC4" />
    <circle cx="260" cy="30" r="2" fill="#7B61FF" />
    <circle cx="300" cy="20" r="1.5" fill="#4ECDC4" />
    <path d="M20 30 L80 15 L140 35 L200 10 L260 30 L300 20" stroke="rgba(123,97,255,0.5)" strokeWidth="0.5" strokeDasharray="3 3" />
    {/* Extra far stars */}
    <circle cx="50" cy="50" r="1" fill="#FFD580" fillOpacity="0.5" />
    <circle cx="170" cy="52" r="1" fill="#FFD580" fillOpacity="0.5" />
    <circle cx="290" cy="48" r="1" fill="#FFD580" fillOpacity="0.5" />
  </svg>
);

// Nebula orb (decorative blurred circles)
const NebulaOrb = ({ x, y, size, color, opacity }: { x: string; y: string; size: number; color: string; opacity: number }) => (
  <div className="absolute pointer-events-none rounded-full" style={{
    left: x, top: y, width: size, height: size,
    background: color, filter: `blur(${size * 0.6}px)`, opacity,
    transform: 'translate(-50%, -50%)'
  }} />
);

// Star field generator
const starData = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: (i * 12.7) % 100,
  y: (i * 8.3) % 100,
  size: 0.8 + (i % 3) * 0.6,
  delay: (i * 0.17) % 5,
  dur: 2.5 + (i * 0.31) % 3.5,
}));

const CelestialWedding: NextPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<null | 'attending' | 'declined'>(null);
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isStarted) return;
    const target = new Date('2026-06-20T17:00:00').getTime();
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
        body: JSON.stringify({ chat_id: chatId, text: `✨ RSVP\n👤 ${guestName}\n📝 ${status === 'attending' ? '✅ Keladi' : '❌ Kelmaydi'}` }),
      }).catch(() => { });
    }
    setRsvpStatus(status);
    setIsSubmitting(false);
  };

  const cosmicFade = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
  };

  const SPACE = '#060B18';
  const SPACE2 = '#0D1530';
  const PURPLE = '#7B61FF';
  const TEAL = '#4ECDC4';
  const STAR_GOLD = '#FFD580';
  const TEXT = '#D8E8FF';

  const glowStyle = (color: string) => ({ textShadow: `0 0 30px ${color}60, 0 0 60px ${color}30` });

  return (
    <div style={{ background: SPACE, minHeight: '100svh', color: TEXT }} className="flex justify-center overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;1,100;1,200&family=Raleway:wght@100;200;300;400&family=Sacramento&display=swap');
        .font-josefin { font-family: 'Josefin Sans', sans-serif; }
        .font-raleway { font-family: 'Raleway', sans-serif; }
        .font-sacramento { font-family: 'Sacramento', cursive; }
        @keyframes twinkle { 0%,100%{opacity:0.15} 50%{opacity:1} }
        @keyframes orbit { from{transform:rotate(0deg) translateX(90px) rotate(0deg)} to{transform:rotate(360deg) translateX(90px) rotate(-360deg)} }
        .orbit-dot { animation: orbit 12s linear infinite; }
        @keyframes float-glow { 0%,100%{transform:translateY(0) scale(1); opacity:0.5} 50%{transform:translateY(-12px) scale(1.05); opacity:0.8} }
      `}</style>

      <div className="w-full max-w-[460px] relative overflow-x-hidden">
        <Head><title>Kosmik Muhabbat | Visol Bazmi</title></Head>
        <audio ref={audioRef} loop preload="auto"><source src="/die.mp3" type="audio/mpeg" /></audio>

        {/* SPLASH */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
              style={{ background: SPACE }}
              exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
              transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}>

              {/* Star field */}
              <div className="absolute inset-0 pointer-events-none">
                {starData.map(s => <Star key={s.id} {...s} />)}
              </div>

              {/* Nebula bg */}
              <NebulaOrb x="20%" y="30%" size={200} color={PURPLE} opacity={0.08} />
              <NebulaOrb x="80%" y="70%" size={250} color={TEAL} opacity={0.06} />
              <NebulaOrb x="50%" y="50%" size={300} color="#6B3F7C" opacity={0.05} />

              <motion.div className="relative z-20 flex flex-col items-center cursor-pointer" onClick={handleStart}>
                {/* Orbiting moon decoration */}
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease: 'easeOut' }}
                  className="relative mb-10 flex items-center justify-center" style={{ width: 200, height: 200 }}>

                  {/* Orbit rings */}
                  <div className="absolute inset-0 rounded-full" style={{ border: '0.5px solid rgba(123,97,255,0.2)' }} />
                  <div className="absolute rounded-full" style={{ inset: 12, border: '0.5px solid rgba(78,205,196,0.15)' }} />

                  {/* Rotating orbit dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div className="absolute" style={{ width: 8, height: 8 }}
                      animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', background: TEAL,
                        boxShadow: `0 0 12px ${TEAL}`, transform: 'translateX(82px)'
                      }} />
                    </motion.div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div className="absolute" style={{ width: 6, height: 6 }}
                      animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%', background: STAR_GOLD,
                        boxShadow: `0 0 10px ${STAR_GOLD}`, transform: 'translateX(60px)'
                      }} />
                    </motion.div>
                  </div>

                  {/* Moon + monogram center */}
                  <div className="relative z-10 flex flex-col items-center">
                    <MoonCrescent size={60} color={STAR_GOLD} />
                    <div className="mt-1 text-center">
                      <span className="font-josefin block" style={{ fontSize: '2rem', color: TEXT, letterSpacing: '0.4em', fontWeight: 100, ...glowStyle(PURPLE) }}>
                        S & A
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.2 }} className="text-center mb-10">
                  <p className="font-sacramento" style={{ fontSize: '2.5rem', color: STAR_GOLD, ...glowStyle(STAR_GOLD) }}>Kosmik Muhabbat</p>
                  <p className="font-josefin mt-3" style={{ fontSize: 8, letterSpacing: '0.6em', textTransform: 'uppercase', color: 'rgba(216,232,255,0.35)', fontWeight: 200 }}>
                    20 . 06 . 2026
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                  className="flex items-center gap-3 px-10 py-4 transition-all duration-500 hover:opacity-80"
                  style={{ border: `0.5px solid rgba(123,97,255,0.5)`, background: 'rgba(123,97,255,0.08)', borderRadius: 2 }}>
                  <Play size={12} color={PURPLE} />
                  <span className="font-josefin" style={{ fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: TEXT, fontWeight: 200 }}>Taklifnomani Ochish</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MUSIC BTN */}
        {isStarted && (
          <motion.button onClick={toggleMusic} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed bottom-8 right-6 z-[150] w-12 h-12 flex items-center justify-center active:scale-95 transition-transform rounded-full"
            style={{ background: 'rgba(6,11,24,0.9)', border: `0.5px solid rgba(123,97,255,0.4)`, backdropFilter: 'blur(20px)', boxShadow: `0 0 20px rgba(123,97,255,0.2)` }}>
            {isPlaying ? <Disc className="animate-spin" size={18} color={PURPLE} style={{ animationDuration: '4s' }} /> : <Play size={14} color={PURPLE} style={{ marginLeft: 2 }} />}
          </motion.button>
        )}

        {/* MAIN */}
        {isStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

            {/* === HERO === */}
            <section className="relative text-center overflow-hidden" style={{ minHeight: '100svh', background: SPACE }}>
              {/* Stars */}
              <div className="absolute inset-0 pointer-events-none">
                {starData.map(s => <Star key={s.id} {...s} />)}
              </div>
              {/* Nebulae */}
              <NebulaOrb x="15%" y="20%" size={220} color={PURPLE} opacity={0.07} />
              <NebulaOrb x="85%" y="75%" size={280} color={TEAL} opacity={0.05} />
              <NebulaOrb x="50%" y="45%" size={350} color="#6B3F7C" opacity={0.04} />

              <div className="relative z-10 flex flex-col items-center justify-center px-8 py-20" style={{ minHeight: '100svh' }}>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}>
                  <MoonCrescent size={70} color={STAR_GOLD} />
                </motion.div>

                <ConstellationLine />

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="font-josefin my-8" style={{ fontSize: 8, letterSpacing: '0.8em', textTransform: 'uppercase', color: TEAL, fontWeight: 200 }}>
                  Oila Qurish Tantanasi
                </motion.p>

                {/* Names */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1.2 }}>
                  <h1 className="font-josefin" style={{ fontSize: 'clamp(3rem,13vw,5rem)', color: TEXT, letterSpacing: '0.2em', fontWeight: 100, lineHeight: 1, ...glowStyle(PURPLE) }}>
                    SARDOR
                  </h1>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                  className="flex items-center gap-4 my-4">
                  <div style={{ height: 0.5, width: 40, background: `linear-gradient(90deg, transparent, ${PURPLE})` }} />
                  <span className="font-sacramento" style={{ fontSize: '2.5rem', color: STAR_GOLD, ...glowStyle(STAR_GOLD) }}>va</span>
                  <div style={{ height: 0.5, width: 40, background: `linear-gradient(90deg, ${PURPLE}, transparent)` }} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.2 }}>
                  <h1 className="font-josefin" style={{ fontSize: 'clamp(3rem,13vw,5rem)', color: TEXT, letterSpacing: '0.2em', fontWeight: 100, lineHeight: 1, ...glowStyle(TEAL) }}>
                    AMIRA
                  </h1>
                </motion.div>

                <ConstellationLine />

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                  className="flex items-center gap-4 mt-8">
                  <div style={{ height: 0.5, width: 30, background: PURPLE, opacity: 0.5 }} />
                  <p className="font-josefin" style={{ fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(216,232,255,0.45)', fontWeight: 200 }}>
                    20 · Iyun · 2026
                  </p>
                  <div style={{ height: 0.5, width: 30, background: TEAL, opacity: 0.5 }} />
                </motion.div>
              </div>
            </section>

            {/* === LETTER === */}
            <section className="py-24 px-6 relative overflow-hidden" style={{ background: SPACE2 }}>
              <NebulaOrb x="80%" y="30%" size={200} color={PURPLE} opacity={0.06} />
              <NebulaOrb x="10%" y="70%" size={180} color={TEAL} opacity={0.05} />

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="max-w-[340px] mx-auto text-center relative z-10">
                {/* Cosmic ornament */}
                <svg width="80" height="40" viewBox="0 0 80 40" style={{ margin: '0 auto 24px' }}>
                  <path d="M40 5 L60 20 L40 35 L20 20 Z" fill="none" stroke={PURPLE} strokeWidth="0.5" opacity="0.6" />
                  <path d="M40 12 L52 20 L40 28 L28 20 Z" fill={PURPLE} fillOpacity="0.2" />
                  <circle cx="40" cy="20" r="3" fill={STAR_GOLD} fillOpacity="0.5" />
                  <line x1="0" y1="20" x2="18" y2="20" stroke={PURPLE} strokeWidth="0.5" opacity="0.4" strokeDasharray="2 2" />
                  <line x1="62" y1="20" x2="80" y2="20" stroke={PURPLE} strokeWidth="0.5" opacity="0.4" strokeDasharray="2 2" />
                </svg>

                <p className="font-josefin mb-8" style={{ fontSize: 8, letterSpacing: '0.7em', textTransform: 'uppercase', color: PURPLE, fontWeight: 200 }}>
                  Qadrli Mehmonlarimiz
                </p>

                <div style={{ height: 0.5, background: `linear-gradient(90deg, transparent, ${PURPLE}80, ${TEAL}80, transparent)`, marginBottom: 32 }} />

                <p className="font-raleway italic px-2" style={{ fontSize: 15, color: 'rgba(216,232,255,0.75)', lineHeight: 2.5, fontWeight: 300 }}>
                  "Ikki yulduz bir-birini uzoqdan topar ekan — ular uchrashgan kun koinotning eng yorqin kuni bo'ladi. Bizning uchrashuvimiz ham shunday bo'ldi."
                </p>

                <p className="font-josefin my-10" style={{ fontSize: 12, color: TEXT, letterSpacing: '0.3em', fontWeight: 300 }}>SARDORJON & AMIRAXON</p>

                <p className="font-raleway italic px-2" style={{ fontSize: 15, color: 'rgba(216,232,255,0.75)', lineHeight: 2.5, fontWeight: 300 }}>
                  "visol oqshomimizni duolaringiz va porloq tabassumingiz bilan bezashingizni iltimos qilamiz."
                </p>

                <div style={{ height: 0.5, background: `linear-gradient(90deg, transparent, ${TEAL}80, ${PURPLE}80, transparent)`, marginTop: 32 }} />
              </motion.div>
            </section>

            {/* === PROGRAM === */}
            <section className="py-24 px-6 relative overflow-hidden" style={{ background: SPACE }}>
              <div className="absolute inset-0 pointer-events-none">
                {starData.slice(0, 30).map(s => <Star key={s.id} {...s} />)}
              </div>
              <NebulaOrb x="50%" y="50%" size={400} color={PURPLE} opacity={0.04} />

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="max-w-[340px] mx-auto relative z-10">
                <div className="text-center mb-14">
                  <p className="font-josefin mb-4" style={{ fontSize: 8, letterSpacing: '0.7em', textTransform: 'uppercase', color: TEAL, fontWeight: 200 }}>Tantana Dasturi</p>
                  <h2 className="font-josefin" style={{ fontSize: '1.6rem', color: TEXT, letterSpacing: '0.3em', fontWeight: 100, ...glowStyle(PURPLE) }}>OQSHOM TARTIBI</h2>
                </div>

                {[
                  { time: '14:00', event: 'ZAGS Marosimi', desc: "Rasmiy ro'yxatdan o'tish", icon: '✦', color: STAR_GOLD },
                  { time: '17:00', event: 'Welcome Reception', desc: 'Musiqa va samimiy suhbat', icon: '◈', color: TEAL },
                  { time: '18:00', event: "Asosiy To'y Bazmi", desc: '"Versal" Saroyi', icon: '❋', color: PURPLE },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-5 mb-8 p-5 relative"
                    style={{ border: '0.5px solid rgba(123,97,255,0.15)', background: 'rgba(123,97,255,0.04)', borderLeft: `2px solid ${item.color}40` }}>
                    <div className="flex-shrink-0 mt-1">
                      <span style={{ fontSize: 20, color: item.color, filter: `drop-shadow(0 0 8px ${item.color})` }}>{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-josefin" style={{ fontSize: 24, color: item.color, fontWeight: 100, letterSpacing: '0.1em', lineHeight: 1.2, ...glowStyle(item.color) }}>{item.time}</p>
                      <p className="font-josefin mt-1" style={{ fontSize: 12, color: TEXT, letterSpacing: '0.25em', fontWeight: 300 }}>{item.event}</p>
                      <p className="font-raleway italic mt-1" style={{ fontSize: 13, color: 'rgba(216,232,255,0.4)', fontWeight: 300 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* === VENUE === */}
            <section className="py-24 px-6" style={{ background: SPACE2 }}>
              <NebulaOrb x="30%" y="60%" size={200} color={TEAL} opacity={0.06} />
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="max-w-[340px] mx-auto relative z-10">
                <div className="text-center p-10 relative" style={{ border: '0.5px solid rgba(78,205,196,0.25)', background: 'rgba(78,205,196,0.03)' }}>
                  {/* Corner stars */}
                  {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], i) => (
                    <div key={i} className="absolute" style={{ top: cx ? undefined : -6, bottom: cx ? -6 : undefined, left: cy ? undefined : -6, right: cy ? -6 : undefined }}>
                      <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 7.5,4.5 12,6 7.5,7.5 6,12 4.5,7.5 0,6 4.5,4.5" fill={TEAL} fillOpacity="0.5" /></svg>
                    </div>
                  ))}

                  <MapPin size={22} color={TEAL} style={{ margin: '0 auto 20px', filter: `drop-shadow(0 0 8px ${TEAL})` }} />
                  <h3 className="font-josefin mb-5" style={{ fontSize: 16, color: TEXT, letterSpacing: '0.4em', fontWeight: 200 }}>MANZIL</h3>
                  <p className="font-raleway italic mb-4" style={{ fontSize: 14, color: 'rgba(216,232,255,0.55)', lineHeight: 1.9, fontWeight: 300 }}>
                    Toshkent shahri, Yunusobod tumani,
                  </p>
                  <p className="font-josefin mb-8" style={{ fontSize: 13, color: TEAL, letterSpacing: '0.2em', fontWeight: 300, ...glowStyle(TEAL) }}>
                    "VERSAL" SAROYI
                  </p>
                  <a href="#" className="font-josefin inline-block px-8 py-3 transition-all duration-400 hover:bg-[rgba(78,205,196,0.1)]"
                    style={{ border: `0.5px solid rgba(78,205,196,0.5)`, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: TEAL, fontWeight: 200 }}>
                    Xaritada Ochish
                  </a>
                </div>
              </motion.div>
            </section>

            {/* === RSVP === */}
            <section className="py-24 px-6 relative" style={{ background: SPACE }}>
              <div className="absolute inset-0 pointer-events-none">
                {starData.slice(20, 50).map(s => <Star key={s.id} {...s} />)}
              </div>
              <NebulaOrb x="70%" y="30%" size={240} color={PURPLE} opacity={0.06} />

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="max-w-[340px] mx-auto text-center relative z-10">
                <svg width="40" height="40" viewBox="0 0 40 40" style={{ margin: '0 auto 20px' }}>
                  <polygon points="20,0 24,14 40,14 27,22 32,38 20,28 8,38 13,22 0,14 16,14" fill={STAR_GOLD} fillOpacity="0.3" stroke={STAR_GOLD} strokeWidth="0.5" />
                  <polygon points="20,6 23,14 32,14 25,19 28,29 20,23 12,29 15,19 8,14 17,14" fill={STAR_GOLD} fillOpacity="0.5" />
                </svg>

                <h3 className="font-josefin mb-3" style={{ fontSize: '1.4rem', color: TEXT, letterSpacing: '0.35em', fontWeight: 200, ...glowStyle(PURPLE) }}>TASHRIF TASDIG'I</h3>
                <p className="font-josefin mb-10" style={{ fontSize: 8, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(216,232,255,0.35)', fontWeight: 100 }}>Ismingizni yulduzlar orasiga qo'shing</p>

                <div className="p-8" style={{ border: '0.5px solid rgba(123,97,255,0.2)', background: 'rgba(123,97,255,0.04)' }}>
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="form" exit={{ opacity: 0 }} className="space-y-6">
                        <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                          placeholder="Ism-sharifingiz"
                          className="font-josefin w-full text-center py-3 focus:outline-none bg-transparent transition-colors"
                          style={{ fontSize: 16, color: TEXT, borderBottom: `0.5px solid rgba(123,97,255,0.35)`, fontWeight: 200, letterSpacing: '0.1em' } as any} />
                        <div className="space-y-3 pt-3">
                          <button onClick={() => handleRSVP('attending')} disabled={isSubmitting}
                            className="font-josefin w-full flex justify-center items-center transition-all duration-300"
                            style={{ height: 48, background: `linear-gradient(135deg, ${PURPLE}, ${TEAL})`, color: 'white', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 300 }}>
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Yulduzlarga qo\'shilaman'}
                          </button>
                          <button onClick={() => handleRSVP('declined')} disabled={isSubmitting}
                            className="font-josefin w-full flex justify-center items-center transition-all duration-300"
                            style={{ height: 48, border: `0.5px solid rgba(123,97,255,0.3)`, color: 'rgba(216,232,255,0.4)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', fontWeight: 100 }}>
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Afsuski, bora olmayman'}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 flex flex-col items-center">
                        <CheckCircle size={44} color={TEAL} style={{ marginBottom: 16, filter: `drop-shadow(0 0 12px ${TEAL})` }} />
                        <p className="font-josefin" style={{ fontSize: 16, color: TEXT, letterSpacing: '0.2em', fontWeight: 200 }}>Rahmat!</p>
                        <p className="font-josefin mt-2" style={{ fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(78,205,196,0.5)', fontWeight: 100 }}>Sizni kutib qolamiz</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>

            {/* === COUNTDOWN === */}
            <section className="py-24 px-6 text-center relative overflow-hidden" style={{ background: SPACE2 }}>
              <NebulaOrb x="50%" y="50%" size={350} color={PURPLE} opacity={0.07} />
              <div className="absolute inset-0 pointer-events-none">
                {starData.slice(0, 25).map(s => <Star key={s.id} {...s} />)}
              </div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="relative z-10">
                <p className="font-sacramento mb-12" style={{ fontSize: '3rem', color: STAR_GOLD, ...glowStyle(STAR_GOLD) }}>
                  Bayramga qadar...
                  {/*  */}
                </p>
                <div className="flex justify-center gap-3">
                  {[{ l: 'KUN', v: timeLeft.kun }, { l: 'SOAT', v: timeLeft.soat }, { l: 'DAQIQA', v: timeLeft.daqiqa }, { l: 'SONIYA', v: timeLeft.soniya }].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="flex flex-col items-center py-5 relative overflow-hidden"
                      style={{ width: 64, border: '0.5px solid rgba(123,97,255,0.3)', background: 'rgba(123,97,255,0.06)' }}>
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="absolute rounded-full"
                            style={{ width: 1.5, height: 1.5, left: `${[20, 50, 80][j]}%`, top: `${[20, 70, 40][j]}%`, background: 'white', opacity: 0.5, animation: `twinkle ${1.5 + j}s ${j * 0.8}s infinite` }} />
                        ))}
                      </div>
                      <span className="font-josefin" style={{ fontSize: 26, color: i % 2 === 0 ? PURPLE : TEAL, fontWeight: 100, ...glowStyle(i % 2 === 0 ? PURPLE : TEAL) }}>
                        {item.v.toString().padStart(2, '0')}
                      </span>
                      <span className="font-josefin mt-2" style={{ fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(216,232,255,0.35)', fontWeight: 200 }}>{item.l}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* === CLOSE === */}
            <section className="py-32 px-6 text-center relative overflow-hidden" style={{ background: SPACE }}>
              <div className="absolute inset-0 pointer-events-none">
                {starData.map(s => <Star key={s.id} {...s} />)}
              </div>
              <NebulaOrb x="50%" y="40%" size={400} color={PURPLE} opacity={0.07} />
              <NebulaOrb x="30%" y="70%" size={250} color={TEAL} opacity={0.05} />

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="relative z-10">
                <div style={{ height: 0.5, background: `linear-gradient(90deg, transparent, ${PURPLE}80, ${TEAL}80, transparent)`, marginBottom: 40 }} />
                <MoonCrescent size={60} color={STAR_GOLD} />
                <p className="font-raleway italic max-w-[260px] mx-auto my-8" style={{ fontSize: 15, color: 'rgba(216,232,255,0.5)', lineHeight: 2.2, fontWeight: 300 }}>
                  "Baxtimiz sizning nurli ishtiro­kingiz bilan kamolga yetadi."
                </p>
                <h2 className="font-josefin" style={{ fontSize: '3rem', color: TEXT, letterSpacing: '0.4em', fontWeight: 100, ...glowStyle(PURPLE) }}>S & A</h2>
                <div style={{ height: 0.5, background: `linear-gradient(90deg, transparent, ${TEAL}80, ${PURPLE}80, transparent)`, marginTop: 40 }} />
              </motion.div>
            </section>

            <footer className="py-8 text-center" style={{ background: '#030610', borderTop: '0.5px solid rgba(123,97,255,0.15)' }}>
              <p className="font-josefin" style={{ fontSize: 8, letterSpacing: '0.6em', textTransform: 'uppercase', color: 'rgba(123,97,255,0.4)', fontWeight: 100 }}>
                Designed by <Link href="https://webleaders.uz" className="hover:opacity-80 transition-opacity">WebLeaders</Link>
              </p>
            </footer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CelestialWedding;