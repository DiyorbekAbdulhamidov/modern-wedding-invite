"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, Disc, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Cherry blossom petal SVG
const PetalSVG = ({ color }: { color: string }) => (
  <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
    <ellipse cx="11" cy="14" rx="9" ry="13" fill={color} />
    <ellipse cx="11" cy="14" rx="5.5" ry="9" fill={color} fillOpacity="0.6" />
    <path d="M11 4 Q9 14 11 24" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" fill="none" />
    <path d="M5 10 Q11 14 17 10" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
  </svg>
);

const FallingPetal = ({ x, delay, duration, color, rotateDir }: { x: number; delay: number; duration: number; color: string; rotateDir: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: `${x}%`, top: -30 }}
    animate={{ y: ['0vh', '115vh'], rotate: [0, rotateDir * 360], x: [0, rotateDir * 60] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'linear', repeatDelay: delay * 0.2 }}
  >
    <PetalSVG color={color} />
  </motion.div>
);

// Botanical arch SVG
const BotanicalArch = () => (
  <svg viewBox="0 0 300 400" className="w-full h-full" fill="none">
    {/* Left vine */}
    <path d="M20 380 C20 280, 10 220, 40 150 C60 100, 30 80, 50 40" stroke="#4A7C59" strokeWidth="1.5" opacity="0.7" />
    <path d="M40 300 C50 270, 20 250, 30 230" stroke="#4A7C59" strokeWidth="1" opacity="0.5" />
    <path d="M35 250 C15 240, 5 220, 20 205" stroke="#4A7C59" strokeWidth="0.8" opacity="0.4" />
    {/* Right vine */}
    <path d="M280 380 C280 280, 290 220, 260 150 C240 100, 270 80, 250 40" stroke="#4A7C59" strokeWidth="1.5" opacity="0.7" />
    <path d="M260 300 C250 270, 280 250, 270 230" stroke="#4A7C59" strokeWidth="1" opacity="0.5" />
    <path d="M265 250 C285 240, 295 220, 280 205" stroke="#4A7C59" strokeWidth="0.8" opacity="0.4" />
    {/* Top arch */}
    <path d="M50 40 C100 -10, 200 -10, 250 40" stroke="#4A7C59" strokeWidth="1.5" opacity="0.7" />
    {/* Left flowers */}
    <circle cx="22" cy="160" r="6" fill="#E8A0B0" opacity="0.8" />
    <circle cx="22" cy="160" r="3" fill="#F9D5C8" />
    <circle cx="10" cy="185" r="5" fill="#F9A8C0" opacity="0.7" />
    <circle cx="10" cy="185" r="2.5" fill="#FDDDE6" />
    <circle cx="35" cy="210" r="4" fill="#E8A0B0" opacity="0.6" />
    <circle cx="30" cy="130" r="7" fill="#F9A8C0" opacity="0.8" />
    <circle cx="30" cy="130" r="3.5" fill="#FDDDE6" />
    {/* Right flowers */}
    <circle cx="278" cy="160" r="6" fill="#E8A0B0" opacity="0.8" />
    <circle cx="278" cy="160" r="3" fill="#F9D5C8" />
    <circle cx="290" cy="185" r="5" fill="#F9A8C0" opacity="0.7" />
    <circle cx="290" cy="185" r="2.5" fill="#FDDDE6" />
    <circle cx="265" cy="210" r="4" fill="#E8A0B0" opacity="0.6" />
    <circle cx="270" cy="130" r="7" fill="#F9A8C0" opacity="0.8" />
    <circle cx="270" cy="130" r="3.5" fill="#FDDDE6" />
    {/* Top arch flowers */}
    <circle cx="150" cy="8" r="8" fill="#E8A0B0" opacity="0.9" />
    <circle cx="150" cy="8" r="4" fill="#FDDDE6" />
    <circle cx="120" cy="18" r="6" fill="#F9A8C0" opacity="0.8" />
    <circle cx="180" cy="18" r="6" fill="#F9A8C0" opacity="0.8" />
    {/* Leaves */}
    <ellipse cx="18" cy="245" rx="8" ry="4" fill="#4A7C59" opacity="0.5" transform="rotate(-30 18 245)" />
    <ellipse cx="282" cy="245" rx="8" ry="4" fill="#4A7C59" opacity="0.5" transform="rotate(30 282 245)" />
    <ellipse cx="25" cy="175" rx="6" ry="3" fill="#4A7C59" opacity="0.4" transform="rotate(-45 25 175)" />
    <ellipse cx="275" cy="175" rx="6" ry="3" fill="#4A7C59" opacity="0.4" transform="rotate(45 275 175)" />
  </svg>
);

// Wavy section divider
const WaveDivider = ({ flip, color }: { flip?: boolean; color: string }) => (
  <svg viewBox="0 0 460 40" className="w-full" style={{ display: 'block', transform: flip ? 'scaleY(-1)' : undefined }}>
    <path d="M0 20 C80 0, 160 40, 230 20 C300 0, 380 40, 460 20 L460 40 L0 40 Z" fill={color} />
  </svg>
);

const petalConfigs = [
  { x: 5, delay: 0, duration: 9, color: 'rgba(249,165,192,0.75)', rotateDir: 1 },
  { x: 15, delay: 2.5, duration: 11, color: 'rgba(232,160,176,0.65)', rotateDir: -1 },
  { x: 28, delay: 1, duration: 8, color: 'rgba(253,221,230,0.8)', rotateDir: 1 },
  { x: 40, delay: 4, duration: 12, color: 'rgba(249,213,200,0.7)', rotateDir: -1 },
  { x: 52, delay: 0.5, duration: 10, color: 'rgba(232,160,176,0.75)', rotateDir: 1 },
  { x: 63, delay: 3, duration: 9.5, color: 'rgba(253,221,230,0.65)', rotateDir: -1 },
  { x: 74, delay: 1.5, duration: 11, color: 'rgba(249,165,192,0.8)', rotateDir: 1 },
  { x: 85, delay: 5, duration: 8.5, color: 'rgba(232,160,176,0.7)', rotateDir: -1 },
  { x: 92, delay: 2, duration: 10, color: 'rgba(253,221,230,0.75)', rotateDir: 1 },
  { x: 35, delay: 6, duration: 13, color: 'rgba(249,165,192,0.6)', rotateDir: -1 },
  { x: 70, delay: 7, duration: 9, color: 'rgba(232,160,176,0.6)', rotateDir: 1 },
  { x: 10, delay: 8, duration: 11.5, color: 'rgba(253,221,230,0.7)', rotateDir: -1 },
];

const SakuraWedding: NextPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<null | 'attending' | 'declined'>(null);
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isStarted) return;
    const target = new Date('2026-04-08T18:00:00').getTime();
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
        body: JSON.stringify({ chat_id: chatId, text: `🌸 Qiz Bazmi RSVP (Nihola)\n👤 ${guestName}\n📝 ${status === 'attending' ? '✅ Keladi' : '❌ Kelmaydi'}` }),
      }).catch(() => { });
    }
    setRsvpStatus(status);
    setIsSubmitting(false);
  };

  const softFade = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
  };

  const BG_CREAM = '#FEF6F0';
  const BG_BLUSH = '#FDF0F5';
  const ROSE = '#C8607A';
  const SAGE = '#4A7C59';
  const TEXT = '#3D2B2E';

  return (
    <div style={{ background: BG_CREAM, minHeight: '100svh', color: TEXT }} className="flex justify-center overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Nunito:wght@200;300;400&family=Dancing+Script:wght@400;600;700&display=swap');
        .font-fraunces { font-family: 'Fraunces', serif; }
        .font-dancing { font-family: 'Dancing Script', cursive; }
        .font-nunito { font-family: 'Nunito', sans-serif; }
      `}</style>

      <div className="w-full max-w-[460px] relative overflow-x-hidden" style={{ boxShadow: '0 0 60px rgba(200,96,122,0.06)' }}>
        <Head><title>Nihola — Qiz Bazmi</title></Head>
        <audio ref={audioRef} loop preload="auto"><source src="/die.mp3" type="audio/mpeg" /></audio>

        {/* SPLASH */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
              style={{ background: BG_CREAM }}
              exit={{ opacity: 0, filter: 'blur(12px)', scale: 1.05 }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}>

              {/* Petals in splash */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {petalConfigs.slice(0, 6).map((p, i) => <FallingPetal key={i} {...p} />)}
              </div>

              <motion.div className="relative z-20 flex flex-col items-center cursor-pointer" onClick={handleStart}>
                {/* Floral frame */}
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: 'easeOut' }}>
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" stroke={ROSE} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
                    <circle cx="80" cy="80" r="58" fill="rgba(232,160,176,0.08)" stroke={ROSE} strokeWidth="0.5" opacity="0.3" />
                    {[0, 60, 120, 180, 240, 300].map(angle => (
                      <g key={angle} transform={`rotate(${angle} 80 80)`}>
                        <circle cx="80" cy="14" r="5" fill="#F9A8C0" opacity="0.6" />
                        <circle cx="80" cy="14" r="2.5" fill="#FDDDE6" />
                      </g>
                    ))}
                    <text x="80" y="72" textAnchor="middle" fontFamily="'Fraunces', serif" fontSize="48" fill={ROSE} fontStyle="italic" opacity="0.9">N</text>
                    <text x="80" y="108" textAnchor="middle" fontFamily="'Dancing Script', cursive" fontSize="18" fill={SAGE} opacity="0.7">Qiz Bazmi</text>
                  </svg>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }} className="text-center mt-6 mb-10">
                  <p className="font-nunito" style={{ fontSize: 8, letterSpacing: '0.5em', textTransform: 'uppercase', color: SAGE, fontWeight: 400 }}>08 . 04 . 2026</p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                  className="flex items-center gap-3 px-10 py-4 transition-all duration-500 hover:shadow-lg"
                  style={{ background: 'white', borderRadius: 50, border: `0.5px solid rgba(200,96,122,0.3)`, boxShadow: '0 8px 24px rgba(200,96,122,0.1)' }}>
                  <Play size={12} color={ROSE} />
                  <span className="font-nunito" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: ROSE }}>Tashrif Buyurish</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MUSIC BTN */}
        {isStarted && (
          <motion.button onClick={toggleMusic} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed bottom-8 right-6 z-[150] w-12 h-12 flex items-center justify-center active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 50, border: `0.5px solid rgba(200,96,122,0.35)`, boxShadow: '0 8px 24px rgba(200,96,122,0.12)', backdropFilter: 'blur(20px)' }}>
            {isPlaying ? <Disc className="animate-spin" size={18} color={ROSE} style={{ animationDuration: '4s' }} /> : <Play size={14} color={ROSE} style={{ marginLeft: 2 }} />}
          </motion.button>
        )}

        {/* MAIN */}
        {isStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>

            {/* === HERO === */}
            <section className="relative text-center overflow-hidden" style={{ minHeight: '100svh', background: BG_CREAM }}>
              {/* Floating petals */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {petalConfigs.map((p, i) => <FallingPetal key={i} {...p} />)}
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center px-8 py-20" style={{ minHeight: '100svh' }}>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="font-nunito mb-12" style={{ fontSize: 8, letterSpacing: '0.5em', textTransform: 'uppercase', color: SAGE, fontWeight: 400 }}>
                  Maxsus Oqshom
                </motion.p>

                {/* Arch frame with image */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1.2 }}
                  className="relative mx-auto mb-8" style={{ width: '72%', maxWidth: 280, aspectRatio: '3/4' }}>
                  {/* Botanical arch overlay */}
                  <div className="absolute inset-0 pointer-events-none z-20">
                    <BotanicalArch />
                  </div>
                  {/* Rounded arch frame */}
                  <div className="w-full h-full overflow-hidden" style={{ borderRadius: '50% 50% 0 0 / 35% 35% 0 0', border: `0.5px solid rgba(200,96,122,0.2)`, background: '#F9EDE8' }}>
                    <img src="/dreamwedding.jpg" alt="Nihola" className="w-full h-full object-cover" style={{ filter: 'brightness(1.02) saturate(0.95)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(254,246,240,0.6), transparent 50%)' }} />
                  </div>
                </motion.div>

                {/* Name */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }}>
                  <h1 className="font-dancing" style={{ fontSize: 'clamp(4rem,16vw,5.5rem)', color: ROSE, lineHeight: 1 }}>Nihola</h1>
                  <p className="font-fraunces italic mt-2" style={{ fontSize: 15, color: 'rgba(61,43,46,0.6)', letterSpacing: '0.1em' }}>ning qiz bazmi</p>
                </motion.div>

                {/* Date ribbon */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  className="flex items-center gap-4 mt-10">
                  <div style={{ height: 0.5, width: 40, background: `linear-gradient(90deg, transparent, ${ROSE})` }} />
                  <p className="font-nunito" style={{ fontSize: 10, letterSpacing: '0.4em', color: 'rgba(61,43,46,0.55)', textTransform: 'uppercase', fontWeight: 300 }}>08 · 04 · 2026</p>
                  <div style={{ height: 0.5, width: 40, background: `linear-gradient(90deg, ${ROSE}, transparent)` }} />
                </motion.div>
              </div>
            </section>

            {/* === STORY === */}
            <WaveDivider color={BG_BLUSH} />
            <section className="py-20 px-8 text-center" style={{ background: BG_BLUSH }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={softFade} className="max-w-[320px] mx-auto">
                <svg width="60" height="60" viewBox="0 0 60 60" style={{ margin: '0 auto 24px' }}>
                  <path d="M30 50 C30 50, 5 38, 5 22 C5 14, 11 8, 18 8 C22 8, 26 10, 30 15 C34 10, 38 8, 42 8 C49 8, 55 14, 55 22 C55 38, 30 50, 30 50Z" fill={ROSE} fillOpacity="0.15" />
                  <path d="M30 50 C30 50, 5 38, 5 22 C5 14, 11 8, 18 8 C22 8, 26 10, 30 15 C34 10, 38 8, 42 8 C49 8, 55 14, 55 22 C55 38, 30 50, 30 50Z" fill="none" stroke={ROSE} strokeWidth="1" opacity="0.4" />
                </svg>
                <h2 className="font-dancing mb-6" style={{ fontSize: '2.8rem', color: ROSE }}>Qiz Bazmi</h2>
                <p className="font-fraunces italic" style={{ fontSize: 15, color: 'rgba(61,43,46,0.65)', lineHeight: 2.4 }}>
                  "Har bir qizning hayotidagi eng shirin damlaridan biri... Kelinlik libosini kiyishdan avval, eng yaqin dugonalarim davrasida bu oqshomni siz bilan nishonlashni istadim."
                </p>
                <div className="flex items-center justify-center gap-3 mt-8">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}>
                      <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill={ROSE} /></svg>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>
            <WaveDivider color={BG_CREAM} flip />

            {/* === LETTER === */}
            <section className="py-24 px-6" style={{ background: BG_CREAM }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={softFade} className="max-w-[340px] mx-auto">
                <div className="relative p-10 text-center" style={{
                  background: 'white', borderRadius: 4,
                  border: `0.5px solid rgba(200,96,122,0.25)`,
                  boxShadow: '0 20px 60px rgba(200,96,122,0.06), 0 4px 16px rgba(0,0,0,0.03)'
                }}>
                  <div className="absolute" style={{ inset: 8, border: `0.5px solid rgba(200,96,122,0.12)`, borderRadius: 2, pointerEvents: 'none' }} />

                  {/* Top floral */}
                  <svg width="100" height="30" viewBox="0 0 100 30" style={{ margin: '0 auto 24px' }}>
                    <path d="M50 15 C40 5, 20 25, 0 15" stroke={ROSE} strokeWidth="0.5" fill="none" opacity="0.5" />
                    <path d="M50 15 C60 5, 80 25, 100 15" stroke={ROSE} strokeWidth="0.5" fill="none" opacity="0.5" />
                    <circle cx="50" cy="15" r="4" fill={ROSE} fillOpacity="0.25" />
                    <circle cx="50" cy="15" r="2" fill={ROSE} fillOpacity="0.6" />
                  </svg>

                  <p className="font-nunito mb-8" style={{ fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: ROSE, fontWeight: 400 }}>Mehribon Yaqinlarim</p>
                  <div className="font-fraunces italic" style={{ fontSize: 15, color: 'rgba(61,43,46,0.7)', lineHeight: 2.5 }}>
                    <p className="mb-4">"Yangi hayot ostonasida turar ekanman, quvonchimga sherik bo'lishingizni chin dildan xohlayman.</p>
                    <p className="font-fraunces not-italic mb-4" style={{ fontSize: '1.1rem', color: TEXT }}>Nihola va Jasurbeklarning</p>
                    <p>visol oqshomidan avvalgi bu shirin kechada dildan suhbat qurish uchun sizni kutib qolaman."</p>
                  </div>

                  <p className="font-dancing mt-10" style={{ fontSize: '2.2rem', color: ROSE }}>Nihola</p>

                  <svg width="100" height="20" viewBox="0 0 100 20" style={{ margin: '16px auto 0' }}>
                    <path d="M0 10 C30 0, 70 20, 100 10" stroke={SAGE} strokeWidth="0.5" fill="none" opacity="0.4" />
                    <circle cx="25" cy="7" r="2.5" fill={ROSE} fillOpacity="0.5" />
                    <circle cx="50" cy="12" r="2" fill={SAGE} fillOpacity="0.5" />
                    <circle cx="75" cy="7" r="2.5" fill={ROSE} fillOpacity="0.5" />
                  </svg>
                </div>
              </motion.div>
            </section>

            {/* === PROGRAM === */}
            <WaveDivider color={BG_BLUSH} />
            <section className="py-24 px-8 text-center" style={{ background: BG_BLUSH }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={softFade} className="mb-14">
                <h2 className="font-dancing" style={{ fontSize: '2.5rem', color: ROSE }}>Oqshom Fayzi</h2>
              </motion.div>

              <div className="max-w-[300px] mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="text-center py-8" style={{ background: 'white', borderRadius: 12, border: `0.5px solid rgba(200,96,122,0.2)`, boxShadow: '0 8px 30px rgba(200,96,122,0.08)' }}>
                  <p className="font-dancing" style={{ fontSize: '3rem', color: ROSE, lineHeight: 1 }}>18:00</p>
                  <p className="font-nunito mt-3 mb-2" style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: TEXT, fontWeight: 400 }}>Qiz Bazmi Boshlanishi</p>
                  <p className="font-fraunces italic" style={{ fontSize: 14, color: 'rgba(61,43,46,0.5)' }}>Musiqa, raqs va shirin xotiralar</p>
                </motion.div>
              </div>
            </section>
            <WaveDivider color={BG_CREAM} flip />

            {/* === VENUE === */}
            <section className="py-24 px-6" style={{ background: BG_CREAM }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={softFade}
                className="max-w-[320px] mx-auto text-center p-10"
                style={{ background: 'white', borderRadius: 8, border: `0.5px solid rgba(200,96,122,0.2)`, boxShadow: '0 12px 40px rgba(200,96,122,0.07)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'rgba(200,96,122,0.1)' }}>
                  <MapPin size={20} color={ROSE} />
                </div>
                <h3 className="font-fraunces mb-4" style={{ fontSize: '1.5rem', color: TEXT }}>Manzil</h3>
                <p className="font-fraunces italic mb-2" style={{ fontSize: 14, color: 'rgba(61,43,46,0.6)', lineHeight: 1.8 }}>
                  Toshkent viloyati, Piskent tumani,<br />Bobur Mirzo ko'chasi,
                </p>
                <p className="font-nunito mb-8" style={{ fontSize: 13, color: TEXT, fontWeight: 400 }}>"Lola" To'yxonasi</p>
                <a href="https://www.google.com/maps?q=40.898729,69.350592" target="_blank" rel="noopener noreferrer"
                  className="font-nunito inline-block px-8 py-3 transition-all duration-300 hover:shadow-lg"
                  style={{ background: ROSE, color: 'white', borderRadius: 50, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 400 }}>
                  Xaritada Ochish
                </a>
              </motion.div>
            </section>

            {/* === RSVP === */}
            <WaveDivider color={BG_BLUSH} />
            <section className="py-24 px-6" style={{ background: BG_BLUSH }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={softFade} className="max-w-[340px] mx-auto text-center">
                <h3 className="font-dancing mb-2" style={{ fontSize: '2.5rem', color: ROSE }}>Tashrifingiz</h3>
                <p className="font-nunito mb-10" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(61,43,46,0.45)', fontWeight: 300 }}>Ismingizni qoldiring</p>

                <div className="p-8" style={{ background: 'white', borderRadius: 8, border: `0.5px solid rgba(200,96,122,0.2)`, boxShadow: '0 8px 30px rgba(200,96,122,0.06)' }}>
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="form" exit={{ opacity: 0 }} className="space-y-6">
                        <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                          placeholder="Ism-sharifingiz"
                          className="font-dancing w-full text-center py-3 focus:outline-none bg-transparent transition-colors"
                          style={{ fontSize: 22, color: TEXT, borderBottom: `1px solid rgba(200,96,122,0.25)` } as any} />
                        <div className="space-y-3 pt-2">
                          <button onClick={() => handleRSVP('attending')} disabled={isSubmitting}
                            className="font-nunito w-full flex justify-center items-center transition-all duration-300 hover:shadow-lg"
                            style={{ height: 48, background: ROSE, color: 'white', borderRadius: 50, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 400 }}>
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Bajonidil qatnashaman'}
                          </button>
                          <button onClick={() => handleRSVP('declined')} disabled={isSubmitting}
                            className="font-nunito w-full flex justify-center items-center transition-all duration-300"
                            style={{ height: 48, border: `0.5px solid rgba(200,96,122,0.3)`, color: 'rgba(61,43,46,0.5)', borderRadius: 50, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 300 }}>
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Afsuski, kela olmayman'}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 flex flex-col items-center">
                        <CheckCircle size={44} color={ROSE} style={{ marginBottom: 16 }} />
                        <p className="font-dancing" style={{ fontSize: '1.8rem', color: TEXT }}>Rahmat!</p>
                        <p className="font-nunito mt-2" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(61,43,46,0.4)', fontWeight: 300 }}>Sizni kutib qolamiz</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>
            <WaveDivider color={BG_CREAM} flip />

            {/* === COUNTDOWN === */}
            <section className="py-24 px-6 text-center" style={{ background: BG_CREAM }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={softFade}>
                <h2 className="font-dancing mb-12" style={{ fontSize: '3rem', color: ROSE }}>Kutish onlari</h2>
                <div className="flex justify-center gap-3">
                  {[{ l: 'Kun', v: timeLeft.kun }, { l: 'Soat', v: timeLeft.soat }, { l: 'Daqiqa', v: timeLeft.daqiqa }, { l: 'Soniya', v: timeLeft.soniya }].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="flex flex-col items-center py-5" style={{ width: 64, background: 'white', borderRadius: 12, border: `0.5px solid rgba(200,96,122,0.2)`, boxShadow: '0 4px 16px rgba(200,96,122,0.06)' }}>
                      <span className="font-fraunces" style={{ fontSize: 26, color: ROSE, fontWeight: 400 }}>{item.v.toString().padStart(2, '0')}</span>
                      <span className="font-nunito mt-1" style={{ fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: SAGE, fontWeight: 400 }}>{item.l}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* === CLOSE === */}
            <section className="py-32 px-6 text-center relative overflow-hidden" style={{ background: BG_BLUSH }}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                {petalConfigs.slice(0, 4).map((p, i) => <FallingPetal key={i} {...p} delay={p.delay + 1} />)}
              </div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={softFade} className="relative z-10">
                <svg width="80" height="50" viewBox="0 0 80 50" style={{ margin: '0 auto 24px' }}>
                  <path d="M40 30 C40 30, 5 18, 5 7 C5 2, 10 0, 15 0 C20 0, 25 3, 40 12 C55 3, 60 0, 65 0 C70 0, 75 2, 75 7 C75 18, 40 30, 40 30Z" fill={ROSE} fillOpacity="0.15" />
                  <path d="M40 30 C40 30, 5 18, 5 7 C5 2, 10 0, 15 0 C20 0, 25 3, 40 12 C55 3, 60 0, 65 0 C70 0, 75 2, 75 7 C75 18, 40 30, 40 30Z" fill="none" stroke={ROSE} strokeWidth="0.8" opacity="0.4" />
                </svg>
                <p className="font-fraunces italic max-w-[260px] mx-auto mb-8" style={{ fontSize: 16, color: 'rgba(61,43,46,0.6)', lineHeight: 2.2 }}>
                  Tashrifingiz oqshomimizni yanada go'zal qiladi.
                </p>
                <h2 className="font-dancing" style={{ fontSize: '4rem', color: ROSE }}>N & J</h2>
              </motion.div>
            </section>

            <footer className="py-8 text-center" style={{ background: '#2D1F22' }}>
              <p className="font-nunito" style={{ fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(200,96,122,0.6)', fontWeight: 300 }}>
                Designed by <Link href="https://webleaders.uz" className="hover:opacity-80 transition-opacity">WebLeaders</Link>
              </p>
            </footer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SakuraWedding;