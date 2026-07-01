"use client";
// @ts-nocheck

import type { NextPage } from 'next';
import type { Variants } from 'framer-motion';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Play, VolumeX, MapPin, CheckCircle2,
  Loader2, Sparkles, Heart, Calendar, Star, Send
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface PetalProps {
  x: number;
  delay: number;
  duration: number;
  color: string;
  rotateDir: number;
  blur: string;
  scale: number;
  opacity: number;
}

// ─── Motion Helpers ──────────────────────────────────────────────────────────

// FIX: typed as tuple so Framer Motion's ease accepts it
const easing = [0.16, 1, 0.3, 1] as [number, number, number, number];

const premiumFadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: easing } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const childFade: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: easing } },
};

// ─── SVG: Petal ──────────────────────────────────────────────────────────────

const PetalSVG = ({
  color, opacity = 1, scale = 1, gradId,
}: { color: string; opacity?: number; scale?: number; gradId: string }) => (
  <svg
    width={Math.round(22 * scale)}
    height={Math.round(28 * scale)}
    viewBox="0 0 22 28"
    fill="none"
    className="transform-gpu"
    style={{ opacity }}
  >
    <defs>
      <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#C8607A" stopOpacity={0.4} />
      </linearGradient>
    </defs>
    <ellipse cx="11" cy="14" rx="9" ry="13" fill={`url(#${gradId})`} />
    <ellipse cx="11" cy="14" rx="5.5" ry="9" fill="#FFF" fillOpacity={0.28} />
    <path d="M11 4 Q9 14 11 24" stroke="rgba(255,255,255,0.38)" strokeWidth="0.7" fill="none" />
    <path d="M5 10 Q11 14 17 10" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" fill="none" />
  </svg>
);

const FallingPetal = ({ x, delay, duration, color, rotateDir, blur, scale, opacity }: PetalProps) => {
  const gradId = `pg-${x}-${color.replace('#', '')}`;
  return (
    <motion.div
      className={`absolute pointer-events-none transform-gpu ${blur}`}
      style={{ left: `${x}%`, top: -40 }}
      animate={{
        y: ['0vh', '110vh'],
        rotate: [0, rotateDir * 540],
        x: [`${x}%`, `${x + rotateDir * 8}%`, `${x - rotateDir * 4}%`],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        repeatDelay: delay * 0.1,
      }}
    >
      <PetalSVG color={color} opacity={opacity} scale={scale} gradId={gradId} />
    </motion.div>
  );
};

// ─── SVG: Botanical Arch ─────────────────────────────────────────────────────

const BotanicalArch = () => (
  <svg viewBox="0 0 300 400" className="w-full h-full drop-shadow-sm select-none pointer-events-none" fill="none">
    <g opacity="0.88">
      <path d="M30 390 C 25 260, 15 180, 55 120 C 75 80, 45 60, 70 30" stroke="#4A7C59" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M50 280 C 58 240, 25 220, 38 190" stroke="#4A7C59" strokeWidth="0.85" />
      <path d="M38 235 C 54 205, 26 188, 40 168" stroke="#4A7C59" strokeWidth="0.65" opacity="0.55" />
      <path d="M270 390 C 275 260, 285 180, 245 120 C 225 80, 255 60, 230 30" stroke="#4A7C59" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M250 280 C 242 240, 275 220, 262 190" stroke="#4A7C59" strokeWidth="0.85" />
      <path d="M262 235 C 246 205, 274 188, 260 168" stroke="#4A7C59" strokeWidth="0.65" opacity="0.55" />
      <path d="M70 30 C 110 -5, 190 -5, 230 30" stroke="#4A7C59" strokeWidth="1.3" strokeLinecap="round" />

      {/* Left blooms */}
      <circle cx="35" cy="150" r="5.5" fill="#E8A0B0" />
      <circle cx="35" cy="150" r="2.2" fill="#FFF" fillOpacity={0.82} />
      <circle cx="20" cy="202" r="7" fill="#F9A8C0" />
      <circle cx="20" cy="202" r="2.8" fill="#FFF" fillOpacity={0.72} />
      <circle cx="49" cy="110" r="4.5" fill="#E8A0B0" />
      <circle cx="32" cy="172" r="3" fill="#FDDDE6" />

      {/* Right blooms */}
      <circle cx="265" cy="150" r="5.5" fill="#E8A0B0" />
      <circle cx="265" cy="150" r="2.2" fill="#FFF" fillOpacity={0.82} />
      <circle cx="280" cy="202" r="7" fill="#F9A8C0" />
      <circle cx="280" cy="202" r="2.8" fill="#FFF" fillOpacity={0.72} />
      <circle cx="251" cy="110" r="4.5" fill="#E8A0B0" />
      <circle cx="268" cy="172" r="3" fill="#FDDDE6" />

      {/* Crown blooms */}
      <circle cx="150" cy="10" r="8" fill="#E8A0B0" />
      <circle cx="150" cy="10" r="3.2" fill="#FFF" fillOpacity={0.8} />
      <circle cx="130" cy="19" r="5.5" fill="#F9A8C0" />
      <circle cx="170" cy="19" r="5.5" fill="#F9A8C0" />
      <circle cx="114" cy="27" r="4" fill="#E8A0B0" />
      <circle cx="186" cy="27" r="4" fill="#E8A0B0" />

      {/* Small leaf accents */}
      <ellipse cx="43" cy="142" rx="6.5" ry="2.8" fill="#4A7C59" opacity="0.45" transform="rotate(-28 43 142)" />
      <ellipse cx="257" cy="142" rx="6.5" ry="2.8" fill="#4A7C59" opacity="0.45" transform="rotate(28 257 142)" />
    </g>
  </svg>
);

// ─── Countdown Timer ─────────────────────────────────────────────────────────

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const weddingDate = new Date('2026-07-08T10:00:00'); // Qiz bazmi — first event
    const update = () => {
      const diff = weddingDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: timeLeft.days, label: 'Kun' },
    { value: timeLeft.hours, label: 'Soat' },
    { value: timeLeft.minutes, label: 'Daqiqa' },
    { value: timeLeft.seconds, label: 'Soniya' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {units.map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={value}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="glass-panel w-full aspect-square flex items-center justify-center rounded-2xl shadow-[0_6px_18px_rgba(200,96,122,0.07)]"
            >
              <span className="font-display-lux text-xl font-medium text-[#C8607A] tabular-nums">
                {String(value).padStart(2, '0')}
              </span>
            </motion.div>
          </AnimatePresence>
          <span className="font-sans-lux text-[7.5px] tracking-[0.28em] uppercase text-[#3D2B2E]/48">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Divider ─────────────────────────────────────────────────────────────────

const LineDivider = () => (
  <div className="flex items-center justify-center gap-3 my-7 select-none">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ scale: [1, 1.45, 1], opacity: [0.28, 0.85, 0.28] }}
        transition={{ duration: 2.6, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-1.5 h-1.5 rounded-full bg-[#C8607A]"
      />
    ))}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const LuxuryWedding: NextPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<null | 'attending' | 'declined'>(null);
  const [guestName, setGuestName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wish, setWish] = useState('');
  const [wishSent, setWishSent] = useState(false);
  const [isSendingWish, setIsSendingWish] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const petals = useMemo<PetalProps[]>(() => [
    { x: 8, delay: 0, duration: 8, color: '#F9A5C0', rotateDir: 1, blur: 'blur-none', scale: 1, opacity: 0.9 },
    { x: 22, delay: 2, duration: 11, color: '#E8A076', rotateDir: -1, blur: 'blur-[1px]', scale: 0.8, opacity: 0.7 },
    { x: 35, delay: 0.5, duration: 7, color: '#FDDDE6', rotateDir: 1, blur: 'blur-[2px]', scale: 1.3, opacity: 0.6 },
    { x: 50, delay: 3.5, duration: 12, color: '#F9D5C8', rotateDir: -1, blur: 'blur-none', scale: 0.9, opacity: 0.85 },
    { x: 68, delay: 1.5, duration: 9, color: '#E8A0B0', rotateDir: 1, blur: 'blur-none', scale: 1.1, opacity: 0.9 },
    { x: 82, delay: 4, duration: 10, color: '#FDDDE6', rotateDir: -1, blur: 'blur-[1px]', scale: 0.7, opacity: 0.65 },
    { x: 94, delay: 2.5, duration: 7.5, color: '#F9A5C0', rotateDir: 1, blur: 'blur-none', scale: 1, opacity: 0.8 },
    { x: 15, delay: 5, duration: 13, color: '#E8A0B0', rotateDir: -1, blur: 'blur-[2px]', scale: 1.4, opacity: 0.5 },
    { x: 60, delay: 6, duration: 9.5, color: '#F9A5C0', rotateDir: 1, blur: 'blur-[1px]', scale: 0.85, opacity: 0.7 },
    { x: 78, delay: 1, duration: 8.5, color: '#FDDDE6', rotateDir: -1, blur: 'blur-none', scale: 1.1, opacity: 0.75 },
  ], []);

  const sendToTelegram = async (text: string) => {
    const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
  };

  const handleStart = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.45;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { }); }
  };

  const handleRSVP = async (status: 'attending' | 'declined') => {
    if (!guestName.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 600);
      return;
    }
    setIsSubmitting(true);
    await sendToTelegram(
      `🌸 *Taklifnoma RSVP (Gulzoda & Davron)*\n\n👤 *Mehmon:* ${guestName.trim()}\n📝 *Holati:* ${status === 'attending' ? '✅ Keladi (Bajonidil)' : '❌ Kelolmaydi'}`
    ).catch(console.error);
    setRsvpStatus(status);
    setIsSubmitting(false);
  };

  const handleWish = async () => {
    if (!wish.trim()) return;
    setIsSendingWish(true);
    await sendToTelegram(`💌 *Tabrik va Tilag'u*\n\n✍️ ${wish.trim()}`).catch(console.error);
    setWishSent(true);
    setIsSendingWish(false);
  };

  const handleAddToCalendar = () => {
    // Open both events separately so the guest has both in their calendar
    const qizBazmi = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Gulzoda & Davron — Qiz Bazmi")}&dates=20260708T100000/20260708T160000&details=${encodeURIComponent("Gulzoda va Davronning qiz bazmi")}&location=${encodeURIComponent('"Angren Land" to\'yxonasi, Angren shahri')}&sf=true&output=xml`;
    const visolOqshomi = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Gulzoda & Davron — Visol Oqshomi (Katta To'y)")}&dates=20260710T180000/20260710T230000&details=${encodeURIComponent("Gulzoda va Davronning visol oqshomi — katta to'y")}&location=${encodeURIComponent('"Osiyo" to\'yxonasi, Angren shahri')}&sf=true&output=xml`;
    window.open(qizBazmi, '_blank');
    setTimeout(() => window.open(visolOqshomi, '_blank'), 500);
  };

  return (
    <div className="bg-[#FEF6F0] min-h-screen text-[#3D2B2E] flex justify-center overflow-hidden antialiased">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;1,9..144,300&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Pinyon+Script&display=swap');
        .font-serif-lux  { font-family: 'Fraunces', serif; }
        .font-script-lux { font-family: 'Pinyon Script', cursive; }
        .font-sans-lux   { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-display-lux{ font-family: 'Playfair Display', serif; }
        .glass-panel {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.55);
        }
        * { -webkit-font-smoothing: antialiased; }
      `}</style>

      <div className="w-full max-w-[450px] bg-[#FEF6F0] relative overflow-x-hidden shadow-[0_0_80px_rgba(200,96,122,0.08)]">
        <Head>
          <title>Gulzoda & Davron — Taklifnoma</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>

        <audio ref={audioRef} loop preload="auto">
          <source src="/die.mp3" type="audio/mpeg" />
        </audio>

        {/* ══════════════════════════════════════════════════
            SPLASH SCREEN
        ══════════════════════════════════════════════════ */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#FEF6F0] px-6"
              exit={{ opacity: 0, filter: 'blur(22px)', scale: 1.04 }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-35">
                {petals.slice(0, 5).map((p, i) => <FallingPetal key={i} {...p} />)}
              </div>

              <motion.div
                className="relative z-20 flex flex-col items-center text-center cursor-pointer"
                onClick={handleStart}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3, ease: easing }}
              >
                {/* Spinning ring + monogram */}
                <div className="relative w-52 h-52 flex items-center justify-center mb-8">
                  <motion.svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 190 190"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                  >
                    <circle cx="95" cy="95" r="86" fill="none" stroke="#C8607A" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.3" />
                    <circle cx="95" cy="95" r="76" fill="none" stroke="#4A7C59" strokeWidth="0.4" opacity="0.18" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <circle key={angle} cx="95" cy="11" r="2.5" fill="#C8607A" opacity="0.65" transform={`rotate(${angle} 95 95)`} />
                    ))}
                  </motion.svg>

                  <div className="flex flex-col items-center">
                    <span className="font-script-lux text-[6.5rem] text-[#C8607A] leading-none select-none">G</span>
                    <span className="font-sans-lux text-[7px] tracking-[0.52em] uppercase text-[#4A7C59] font-semibold mt-2 opacity-90">
                      Maxsus Taklifnoma
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-10">
                  <p className="font-display-lux text-lg italic text-[#3D2B2E]/68">Sizni kutib qolamiz</p>
                  <p className="font-sans-lux text-[8.5px] tracking-[0.48em] uppercase text-[#4A7C59]/75 font-medium">
                    Bosing va ochib ko'ring
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: '0 22px 45px rgba(200,96,122,0.22)' }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3.5 px-10 py-4 bg-white/85 backdrop-blur-md rounded-full border border-[#C8607A]/22 shadow-[0_12px_32px_rgba(200,96,122,0.11)] transition-all duration-500"
                >
                  <Play size={11} className="fill-[#C8607A] text-[#C8607A] ml-0.5" />
                  <span className="font-sans-lux text-[10px] tracking-[0.3em] uppercase text-[#C8607A] font-semibold">
                    Taklifnomani ochish
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════
            MUSIC BUTTON
        ══════════════════════════════════════════════════ */}
        {isStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="fixed bottom-6 right-6 z-[150]"
          >
            <button
              onClick={toggleMusic}
              className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full border border-[#C8607A]/18 shadow-[0_10px_26px_rgba(200,96,122,0.14)] active:scale-95 transition-all duration-300"
            >
              {isPlaying ? (
                <div className="flex items-end justify-center gap-[2px] w-4 h-4">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '20%'] }}
                      transition={{ duration: 1 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-[2px] bg-[#C8607A] rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <VolumeX size={15} className="text-[#C8607A]/70" />
              )}
            </button>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════════════ */}
        {isStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>

            {/* Petals */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
              {petals.map((p, i) => <FallingPetal key={i} {...p} />)}
            </div>

            {/* ─── 1. HERO ──────────────────────────────────── */}
            <section className="relative text-center min-h-[100svh] flex flex-col items-center justify-center px-6 py-12 z-20">
              <div className="w-full flex flex-col items-center justify-between min-h-[88svh]">

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.88 }}
                  transition={{ duration: 2 }}
                  className="font-sans-lux text-[9px] uppercase text-[#4A7C59] font-semibold tracking-[0.48em]"
                >
                  Bismillahir Rahmanir Rahim
                </motion.p>

                {/* Photo in arch frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.8, ease: easing, delay: 0.25 }}
                  className="relative w-60 max-w-[68%] aspect-[3/4] my-6"
                >
                  <div className="absolute inset-0 z-30 pointer-events-none scale-[1.06]">
                    <BotanicalArch />
                  </div>
                  {/* Soft glow behind photo */}
                  <div className="absolute -inset-5 rounded-full opacity-[0.18] blur-3xl bg-[#C8607A]" />

                  <div className="w-full h-full overflow-hidden rounded-t-[120px] rounded-b-[5px] border border-[#C8607A]/20 bg-[#F9EDE8] p-1.5 shadow-[0_22px_65px_rgba(200,96,122,0.12)]">
                    <div className="w-full h-full overflow-hidden rounded-t-[115px] rounded-b-[3px] relative group">
                      <img
                        src="/dreamwedding.jpg"
                        alt="Gulzoda & Davron"
                        className="w-full h-full object-cover brightness-[1.02] contrast-[0.97] saturate-[0.9] transition-transform duration-[5s] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FEF6F0]/72 via-transparent to-transparent" />
                    </div>
                  </div>
                </motion.div>

                {/* Names */}
                <div className="space-y-3">
                  <motion.h1
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, delay: 0.4, ease: easing }}
                    className="font-script-lux text-[4.6rem] leading-[0.84] text-[#C8607A]"
                  >
                    Gulzoda
                    <span className="block font-serif-lux italic text-[#4A7C59] my-2" style={{ fontSize: '1.9rem' }}>
                      &amp;
                    </span>
                    Davron
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.62 }}
                    transition={{ duration: 1.2, delay: 0.65 }}
                    className="font-serif-lux italic text-[14px] tracking-[0.1em] text-[#3D2B2E]"
                  >
                    qiz bazmi va visol oqshomi
                  </motion.p>
                </div>

                {/* Date badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="flex flex-col items-center gap-2.5"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#C8607A]" />
                    <div className="text-center space-y-1">
                      <p className="font-sans-lux text-[11px] tracking-[0.45em] text-[#3D2B2E] font-medium">08 · 07 &amp; 10 · 07 · 2026</p>
                      <p className="font-sans-lux text-[8.5px] tracking-[0.32em] text-[#4A7C59] uppercase">Angren shahri</p>
                    </div>
                    <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#C8607A]" />
                  </div>
                </motion.div>

              </div>
            </section>

            {/* ─── 2. STORY ─────────────────────────────────── */}
            <section className="py-24 px-8 text-center bg-[#FDF0F5]/62 border-y border-[#C8607A]/6 z-20 relative">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={premiumFadeUp}
                className="max-w-[320px] mx-auto space-y-6"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-full border border-[#C8607A]/22 flex items-center justify-center mx-auto bg-white/50 backdrop-blur-sm"
                >
                  <Heart size={18} className="text-[#C8607A]/80 fill-[#C8607A]/18" />
                </motion.div>

                <h2 className="font-display-lux text-2xl tracking-wide text-[#C8607A] font-medium">
                  Yangi Hayot Bo'sag'asida
                </h2>

                <p className="font-serif-lux italic text-[#3D2B2E]/72 text-[15px] leading-[2.3] px-1">
                  &ldquo;Hayotimizning ushbu quvonchli va unutilmas kunida, o'zimizning eng yaqin va qadrli insonlarimizni yonimizda ko'rishdan bag'oyatda xursand bo'lamiz.&rdquo;
                </p>

                <div className="flex items-center gap-4 justify-center pt-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8607A]/28" />
                  <span className="font-script-lux text-3xl text-[#C8607A]/58">G & D</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8607A]/28" />
                </div>

                <LineDivider />
              </motion.div>
            </section>

            {/* ─── 3. COUNTDOWN ─────────────────────────────── */}
            <section className="py-24 px-6 bg-[#FEF6F0] z-20 relative overflow-hidden">
              {/* Giant ghost letter as texture */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="font-script-lux text-[22rem] text-[#C8607A]/[0.028] leading-none">G</span>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={premiumFadeUp}
                className="max-w-[340px] mx-auto text-center space-y-8 relative z-10"
              >
                <div className="space-y-2">
                  <span className="font-sans-lux text-[9px] tracking-[0.4em] uppercase text-[#4A7C59] font-semibold">Kutilmoqda</span>
                  <h2 className="font-display-lux text-2xl font-medium text-[#C8607A]">To'yga Qolgan Vaqt</h2>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-[#C8607A]/10 shadow-[0_20px_55px_rgba(200,96,122,0.06)]">
                  <CountdownTimer />
                </div>

                <p className="font-serif-lux italic text-[13px] text-[#3D2B2E]/45 tracking-wide">
                  08 Iyul — Qiz Bazmi · 10 Iyul — Katta To'y
                </p>
              </motion.div>
            </section>

            {/* ─── 4. OILALAR (FAMILIES) ────────────────────── */}
            <section className="py-24 px-6 bg-[#FDF0F5]/55 border-y border-[#C8607A]/6 z-20">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={premiumFadeUp}
                className="max-w-[340px] mx-auto text-center space-y-8"
              >
                <div className="space-y-2">
                  <span className="font-sans-lux text-[9px] tracking-[0.4em] uppercase text-[#4A7C59] font-semibold">Muborak Oilalar</span>
                  <h2 className="font-display-lux text-2xl font-medium text-[#C8607A]">Siz Kutilayapsiz</h2>
                </div>

                {/* Invite text */}
                <div className="bg-white/65 backdrop-blur-sm rounded-3xl p-7 border border-[#C8607A]/10 space-y-5">
                  <p className="font-serif-lux italic text-[#3D2B2E]/78 text-[14.5px] leading-[2.15]">
                    Farzandlarimiz Gulzoda va Davronning qiz bazmi hamda visol oqshomiga Sizi va Sizning aziz oilangizni chin dildan taklif etamiz.
                  </p>
                  <div className="w-14 h-px bg-gradient-to-r from-transparent via-[#C8607A]/38 to-transparent mx-auto" />
                  <p className="font-sans-lux text-[8.5px] tracking-[0.32em] uppercase text-[#4A7C59] font-medium">
                    Oila nomidan
                  </p>
                </div>

                {/* Family cards */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel p-5 rounded-2xl border border-[#C8607A]/10 text-center space-y-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#C8607A]/10 flex items-center justify-center mx-auto">
                      <span className="font-script-lux text-2xl text-[#C8607A]">G</span>
                    </div>
                    <div>
                      <p className="font-sans-lux text-[7px] tracking-[0.3em] uppercase text-[#C8607A] font-semibold mb-1.5">Kelin Tomon</p>
                      <p className="font-serif-lux italic text-[13px] text-[#3D2B2E] leading-relaxed">
                        Gulzodaning<br />oilasi
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel p-5 rounded-2xl border border-[#4A7C59]/12 text-center space-y-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#4A7C59]/10 flex items-center justify-center mx-auto">
                      <span className="font-script-lux text-2xl text-[#4A7C59]">D</span>
                    </div>
                    <div>
                      <p className="font-sans-lux text-[7px] tracking-[0.3em] uppercase text-[#4A7C59] font-semibold mb-1.5">Kuyov Tomon</p>
                      <p className="font-serif-lux italic text-[13px] text-[#3D2B2E] leading-relaxed">
                        Davronning<br />oilasi
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </section>

            {/* ─── 5. PROGRAM ───────────────────────────────── */}
            <section className="py-24 px-6 bg-[#FEF6F0] z-20">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={premiumFadeUp}
                className="max-w-[340px] mx-auto text-center space-y-10"
              >
                <div className="space-y-2">
                  <span className="font-sans-lux text-[9px] tracking-[0.4em] uppercase text-[#4A7C59] font-semibold">Tadbir Rejasi</span>
                  <h2 className="font-display-lux text-2xl font-medium text-[#C8607A]">Tantanalar Vaqti</h2>
                </div>

                <div className="space-y-5">
                  {/* Qiz Bazmi card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-panel p-8 rounded-3xl shadow-[0_14px_38px_rgba(200,96,122,0.06)] relative overflow-hidden group transition-all duration-500"
                  >
                    <div className="absolute top-3 right-3 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-500">
                      <Sparkles size={42} className="text-[#C8607A]" />
                    </div>
                    <div className="space-y-2 relative z-10">
                      <p className="font-sans-lux text-[8px] tracking-[0.4em] uppercase text-[#4A7C59]">08 Iyul · Birinchi Tadbir</p>
                      <p className="font-display-lux text-[3.2rem] text-[#C8607A] font-light tracking-wide leading-none py-1">10:00</p>
                      <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#C8607A]/45 to-transparent mx-auto my-3" />
                      <p className="font-sans-lux text-[11px] tracking-[0.22em] uppercase text-[#3D2B2E] font-bold">Qiz Bazmi</p>
                      <p className="font-serif-lux italic text-[14px] text-[#3D2B2E]/62">"Angren Land" to'yxonasi</p>
                      <div className="pt-3 flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8607A]/35" />
                        <span className="font-sans-lux text-[8.5px] text-[#3D2B2E]/38 tracking-wider">8 Iyul · Soat 10:00 dan boshlab</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8607A]/35" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Connector dot */}
                  <div className="flex items-center justify-center gap-3 py-1">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8607A]/18" />
                    <motion.div
                      animate={{ scale: [1, 1.35, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-[#C8607A]/25"
                    />
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8607A]/18" />
                  </div>

                  {/* Visol Oqshomi card */}
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-panel p-8 rounded-3xl shadow-[0_14px_38px_rgba(200,96,122,0.06)] relative overflow-hidden group transition-all duration-500"
                  >
                    <div className="absolute top-3 right-3 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-500">
                      <Heart size={42} className="text-[#C8607A]" />
                    </div>
                    <div className="space-y-2 relative z-10">
                      <p className="font-sans-lux text-[8px] tracking-[0.4em] uppercase text-[#4A7C59]">10 Iyul · Katta To'y</p>
                      <p className="font-display-lux text-[3.2rem] text-[#C8607A] font-light tracking-wide leading-none py-1">18:00</p>
                      <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#C8607A]/45 to-transparent mx-auto my-3" />
                      <p className="font-sans-lux text-[11px] tracking-[0.22em] uppercase text-[#3D2B2E] font-bold">Visol Oqshomi</p>
                      <p className="font-serif-lux italic text-[14px] text-[#3D2B2E]/62">"Osiyo" to'yxonasi</p>
                      <div className="pt-3 flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8607A]/35" />
                        <span className="font-sans-lux text-[8.5px] text-[#3D2B2E]/38 tracking-wider">10 Iyul · Soat 18:00 dan boshlab</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8607A]/35" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Calendar button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCalendar}
                  className="font-sans-lux flex items-center gap-2.5 mx-auto px-7 py-3.5 bg-white/80 backdrop-blur-sm border border-[#C8607A]/18 rounded-full text-[10px] tracking-[0.25em] uppercase text-[#C8607A] font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Calendar size={12} />
                  Taqvimga Qo'shish
                </motion.button>
              </motion.div>
            </section>

            {/* ─── 6. DRESS CODE ────────────────────────────── */}
            <section className="py-20 px-6 bg-[#FDF0F5]/55 border-y border-[#C8607A]/6 z-20">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={premiumFadeUp}
                className="max-w-[340px] mx-auto text-center space-y-8"
              >
                <div className="space-y-2">
                  <span className="font-sans-lux text-[9px] tracking-[0.4em] uppercase text-[#4A7C59] font-semibold">Kiyim Kodi</span>
                  <h2 className="font-display-lux text-2xl font-medium text-[#C8607A]">Dress Code</h2>
                </div>

                <div className="bg-white/68 backdrop-blur-sm rounded-3xl p-8 border border-[#C8607A]/10 space-y-7">
                  {/* Palette swatches */}
                  <div className="flex justify-center gap-3">
                    {[
                      { bg: '#F9D5E5', name: 'Pushti' },
                      { bg: '#F0E6D3', name: 'Krem' },
                      { bg: '#D4E6D5', name: 'Yashil' },
                      { bg: '#E8D5F0', name: 'Binafsha' },
                      { bg: '#FDDDE6', name: 'Tarvuz' },
                    ].map(({ bg, name }) => (
                      <div key={name} className="flex flex-col items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.18, y: -4 }}
                          style={{ backgroundColor: bg }}
                          className="w-9 h-9 rounded-full border-[1.5px] border-white shadow-[0_4px_14px_rgba(0,0,0,0.09)] cursor-default"
                        />
                        <span className="font-sans-lux text-[7px] text-[#3D2B2E]/48 tracking-wide">{name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C8607A]/18 to-transparent" />

                  <p className="font-serif-lux italic text-[13.5px] text-[#3D2B2E]/62 leading-[2.0]">
                    Iloji bo'lsa, ushbu ranglar palitrasiga muvofiq kiyinib kelishingizni iltimos qilamiz.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* ─── 7. VENUE ─────────────────────────────────── */}
            <section className="py-20 px-6 bg-[#FEF6F0] z-20">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={premiumFadeUp}
                className="max-w-[340px] mx-auto text-center space-y-6"
              >
                <div className="space-y-2">
                  <span className="font-sans-lux text-[9px] tracking-[0.4em] uppercase text-[#4A7C59] font-semibold">Manzil</span>
                  <h2 className="font-display-lux text-2xl font-medium text-[#C8607A]">To'y Joyi</h2>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-[#C8607A]/10 shadow-[0_20px_55px_rgba(200,96,122,0.05)] space-y-7">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto bg-gradient-to-br from-[#C8607A]/14 to-[#C8607A]/5">
                    <MapPin size={20} className="text-[#C8607A]" />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="font-sans-lux text-[7.5px] tracking-[0.3em] uppercase text-[#4A7C59]">Qiz Bazmi · 10:00</p>
                      <p className="font-display-lux text-[15px] text-[#3D2B2E] font-medium">"Angren Land" to'yxonasi</p>
                    </div>
                    <div className="w-10 h-px bg-[#C8607A]/15 mx-auto" />
                    <div className="space-y-1">
                      <p className="font-sans-lux text-[7.5px] tracking-[0.3em] uppercase text-[#4A7C59]">Visol Oqshomi · 18:00</p>
                      <p className="font-display-lux text-[15px] text-[#3D2B2E] font-medium">"Osiyo" to'yxonasi</p>
                    </div>
                    <div className="w-10 h-px bg-[#C8607A]/15 mx-auto" />
                    <p className="font-serif-lux italic text-[13.5px] text-[#3D2B2E]/55">
                      Toshkent viloyati, Angren shahri
                    </p>
                  </div>

                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    href="https://maps.app.goo.gl/U2bExp7i4dvTzdcVA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans-lux flex items-center justify-center gap-2.5 w-full py-4 bg-gradient-to-r from-[#C8607A] to-[#B54D66] text-white rounded-full text-[10px] tracking-[0.25em] uppercase font-semibold shadow-[0_10px_26px_rgba(200,96,122,0.25)] hover:shadow-[0_16px_36px_rgba(200,96,122,0.35)] transition-all duration-300"
                  >
                    <MapPin size={12} />
                    Xaritadan Ko'rish
                  </motion.a>
                </div>
              </motion.div>
            </section>

            {/* ─── 8. RSVP ──────────────────────────────────── */}
            <section className="py-24 px-6 bg-[#FDF0F5]/62 border-t border-[#C8607A]/6 z-20">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={premiumFadeUp}
                className="max-w-[350px] mx-auto text-center space-y-8"
              >
                <div className="space-y-2">
                  <span className="font-sans-lux text-[9px] tracking-[0.4em] uppercase text-[#4A7C59] font-semibold">Qatnashish</span>
                  <h3 className="font-display-lux text-2xl text-[#C8607A] font-medium">Tashrifni Tasdiqlash</h3>
                  <p className="font-serif-lux italic text-[12px] text-[#3D2B2E]/48 tracking-wide">
                    Iltimos, tashrifingizni oldindan tasdiqlang
                  </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-[#C8607A]/14 shadow-[0_20px_48px_rgba(200,96,122,0.08)]">
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div
                        key="form"
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <motion.input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Ism-sharifingiz"
                          animate={nameError ? { x: [-8, 8, -8, 8, 0] } : {}}
                          transition={{ duration: 0.45 }}
                          className={`w-full text-center py-3 bg-transparent border-b text-[17px] font-medium text-[#3D2B2E] placeholder:text-[#3D2B2E]/28 font-serif-lux focus:outline-none transition-colors duration-300 ${nameError ? 'border-red-400' : 'border-[#C8607A]/35 focus:border-[#C8607A]'
                            }`}
                        />

                        <div className="space-y-3 pt-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleRSVP('attending')}
                            disabled={isSubmitting}
                            className="font-sans-lux w-full py-4 flex justify-center items-center gap-2 bg-gradient-to-r from-[#C8607A] to-[#B54D66] text-white rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold shadow-[0_8px_22px_rgba(200,96,122,0.22)] disabled:opacity-55 transition-all duration-300"
                          >
                            {isSubmitting
                              ? <Loader2 size={14} className="animate-spin" />
                              : (<><Heart size={11} className="fill-white" /> Bajonidil Qatnashaman</>)}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleRSVP('declined')}
                            disabled={isSubmitting}
                            className="font-sans-lux w-full py-4 flex justify-center items-center bg-white/52 border border-[#C8607A]/22 text-[#3D2B2E]/62 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300"
                          >
                            {isSubmitting
                              ? <Loader2 size={14} className="animate-spin" />
                              : 'Afsuski, Kela Olmayman'}
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.88, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: easing }}
                        className="py-6 flex flex-col items-center space-y-5"
                      >
                        <motion.div
                          initial={{ rotate: -12, scale: 0.72 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 215, damping: 14 }}
                        >
                          <CheckCircle2 size={54} className="text-[#4A7C59]" />
                        </motion.div>
                        <div className="space-y-1.5">
                          <p className="font-display-lux text-2xl text-[#3D2B2E]">Katta Rahmat!</p>
                          <p className="font-serif-lux italic text-sm text-[#3D2B2E]/62">
                            {rsvpStatus === 'attending'
                              ? "Sizni to'yimizda ko'rishdan xursand bo'lamiz!"
                              : 'Javobingiz qabul qilindi. Duo qilib yuring!'}
                          </p>
                        </div>
                        {rsvpStatus === 'attending' && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleAddToCalendar}
                            className="flex items-center gap-2 px-6 py-3 bg-[#4A7C59] text-white rounded-full text-[9px] tracking-[0.22em] uppercase font-semibold shadow-[0_8px_22px_rgba(74,124,89,0.2)]"
                          >
                            <Calendar size={11} />
                            Taqvimga Qo'shish
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>

            {/* ─── 9. TILAKLAR (WISHES) ─────────────────────── */}
            <section className="py-24 px-6 bg-[#FEF6F0] z-20">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={premiumFadeUp}
                className="max-w-[350px] mx-auto text-center space-y-8"
              >
                <div className="space-y-2">
                  <span className="font-sans-lux text-[9px] tracking-[0.4em] uppercase text-[#4A7C59] font-semibold">So'z va Duo</span>
                  <h3 className="font-display-lux text-2xl text-[#C8607A] font-medium">Tabrik Yuboring</h3>
                  <p className="font-serif-lux italic text-[12px] text-[#3D2B2E]/48">
                    Oilaga samimiy tilagingizni yozib qoldiring
                  </p>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-[#C8607A]/14 shadow-[0_20px_48px_rgba(200,96,122,0.07)]">
                  <AnimatePresence mode="wait">
                    {!wishSent ? (
                      <motion.div
                        key="wish-form"
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-5"
                      >
                        <textarea
                          value={wish}
                          onChange={(e) => setWish(e.target.value)}
                          placeholder="Tabrik so'zlaringizni yozing..."
                          rows={4}
                          className="w-full bg-white/55 border border-[#C8607A]/18 rounded-2xl px-5 py-4 text-[14px] text-[#3D2B2E] font-serif-lux italic placeholder:text-[#3D2B2E]/28 focus:outline-none focus:border-[#C8607A]/45 resize-none transition-colors duration-300"
                        />

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleWish}
                          disabled={isSendingWish || !wish.trim()}
                          className="font-sans-lux w-full py-4 flex justify-center items-center gap-2.5 bg-gradient-to-r from-[#C8607A] to-[#B54D66] text-white rounded-full text-[10px] tracking-[0.25em] uppercase font-semibold shadow-[0_8px_22px_rgba(200,96,122,0.22)] disabled:opacity-48 transition-all duration-300"
                        >
                          {isSendingWish
                            ? <Loader2 size={14} className="animate-spin" />
                            : (<><Send size={12} /> Tabrik Yuborish</>)}
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="wish-sent"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: easing }}
                        className="py-6 flex flex-col items-center space-y-4"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.12, 1] }}
                          transition={{ duration: 1.6, repeat: 2 }}
                        >
                          <Heart size={52} className="text-[#C8607A] fill-[#C8607A]/28" />
                        </motion.div>
                        <div className="space-y-1.5">
                          <p className="font-display-lux text-xl text-[#3D2B2E]">Rahmat!</p>
                          <p className="font-serif-lux italic text-sm text-[#3D2B2E]/58">
                            Tilagingiz oilaga etkazildi.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>

            {/* ─── 10. CLOSING VERSE ────────────────────────── */}
            <section className="py-20 px-8 bg-[#FDF0F5]/68 border-t border-[#C8607A]/8 z-20 text-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={premiumFadeUp}
                className="max-w-[300px] mx-auto space-y-7"
              >
                <div className="flex justify-center items-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.22, 1, 0.22] }}
                      transition={{ duration: 2.8, delay: i * 0.32, repeat: Infinity }}
                    >
                      <Star
                        size={i === 2 ? 14 : 9}
                        className="text-[#C8607A]/55 fill-[#C8607A]/22"
                      />
                    </motion.div>
                  ))}
                </div>

                <p className="font-serif-lux italic text-[#3D2B2E]/58 text-[14.5px] leading-[2.25]">
                  &ldquo;Ikki yurak birga bo'lganda, hayot go'zal bog'ga aylanadi. Olinganingiz muborak bo'lsin!&rdquo;
                </p>

                <div className="space-y-2">
                  <p className="font-script-lux text-[3.2rem] text-[#C8607A]/65 leading-none">Gulzoda & Davron</p>
                  <p className="font-sans-lux text-[8.5px] tracking-[0.4em] uppercase text-[#4A7C59]/62">08 Iyul, 2026</p>
                </div>
              </motion.div>
            </section>

            {/* ─── FOOTER ───────────────────────────────────── */}
            <section className="py-12 bg-[#FEF6F0] border-t border-[#C8607A]/8 flex justify-center z-20">
              <motion.a
                href="https://webleaders.uz"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ opacity: 1, y: -2 }}
                className="flex flex-col items-center justify-center opacity-48 transition-all duration-300"
              >
                <span className="font-sans-lux text-[7.5px] tracking-[0.35em] uppercase text-[#3D2B2E] mb-1.5 font-medium">
                  Created with passion by
                </span>
                <span className="font-sans-lux text-[13px] text-[#C8607A] font-bold tracking-[0.22em]">
                  WEBLEADERS.UZ
                </span>
              </motion.a>
            </section>

          </motion.div>
        )}
      </div>
    </div>
  );
};
// 
export default LuxuryWedding;