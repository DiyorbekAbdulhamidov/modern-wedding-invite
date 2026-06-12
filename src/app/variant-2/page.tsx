"use client";
// @ts-nocheck

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Play, VolumeX, MapPin, CheckCircle2, Loader2, Calendar, Sparkles } from 'lucide-react';

// Premium 3D Cherry blossom petal SVG with enhanced gradients
const PetalSVG = ({ color, opacity = 1, scale = 1 }: { color: string; opacity?: number; scale?: number }) => (
  <svg
    width={Math.round(22 * scale)}
    height={Math.round(28 * scale)}
    viewBox="0 0 22 28"
    fill="none"
    className="transform-gpu"
    style={{ opacity }}
  >
    <defs>
      <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="#C8607A" stopOpacity={0.4} />
      </linearGradient>
    </defs>
    <ellipse cx="11" cy="14" rx="9" ry="13" fill="url(#petalGrad)" />
    <ellipse cx="11" cy="14" rx="5.5" ry="9" fill="#FFF" fillOpacity={0.3} />
    <path d="M11 4 Q9 14 11 24" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7" fill="none" />
    <path d="M5 10 Q11 14 17 10" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
  </svg>
);

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

const FallingPetal = ({ x, delay, duration, color, rotateDir, blur, scale, opacity }: PetalProps) => (
  <motion.div
    className={`absolute pointer-events-none transform-gpu ${blur}`}
    style={{ left: `${x}%`, top: -40 }}
    animate={{
      y: ['0vh', '110vh'],
      rotate: [0, rotateDir * 540],
      x: [`${x}%`, `${x + rotateDir * 8}%`, `${x - rotateDir * 4}%`]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: [0.25, 0.46, 0.45, 0.94],
      repeatDelay: delay * 0.1
    }}
  >
    <PetalSVG color={color} opacity={opacity} scale={scale} />
  </motion.div>
);

// Luxury Minimalist Botanical Arch
const BotanicalArch = () => (
  <svg viewBox="0 0 300 400" className="w-full h-full drop-shadow-sm select-none pointer-events-none" fill="none">
    <g opacity="0.8">
      {/* Left elegant vine */}
      <path d="M30 390 C 25 260, 15 180, 55 120 C 75 80, 45 60, 70 30" stroke="#4A7C59" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M50 280 C 58 240, 25 220, 38 190" stroke="#4A7C59" strokeWidth="0.8" />
      {/* Right elegant vine */}
      <path d="M270 390 C 275 260, 285 180, 245 120 C 225 80, 255 60, 230 30" stroke="#4A7C59" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M250 280 C 242 240, 275 220, 262 190" stroke="#4A7C59" strokeWidth="0.8" />
      {/* Delicate Upper Arch */}
      <path d="M70 30 C 110 -5, 190 -5, 230 30" stroke="#4A7C59" strokeWidth="1.2" strokeLinecap="round" />

      {/* Luxury Blossom Nodes (Left) */}
      <circle cx="35" cy="150" r="5" fill="#E8A0B0" />
      <circle cx="35" cy="150" r="2" fill="#FFF" />
      <circle cx="20" cy="200" r="6" fill="#F9A8C0" />
      <circle cx="50" cy="110" r="4" fill="#E8A0B0" />
      {/* Luxury Blossom Nodes (Right) */}
      <circle cx="265" cy="150" r="5" fill="#E8A0B0" />
      <circle cx="265" cy="150" r="2" fill="#FFF" />
      <circle cx="280" cy="200" r="6" fill="#F9A8C0" />
      <circle cx="250" cy="110" r="4" fill="#E8A0B0" />

      {/* Centerpiece Monogram Flowers */}
      <circle cx="150" cy="12" r="7" fill="#E8A0B0" />
      <circle cx="150" cy="12" r="2.5" fill="#FFF" />
      <circle cx="132" cy="18" r="5" fill="#F9A8C0" />
      <circle cx="168" cy="18" r="5" fill="#F9A8C0" />
    </g>
  </svg>
);

const LineDivider = () => (
  <div className="flex items-center justify-center gap-3 my-8 select-none">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-1.5 h-1.5 rounded-full bg-[#C8607A]"
      />
    ))}
  </div>
);

const SakuraWedding: NextPage = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<null | 'attending' | 'declined'>(null);
  const [guestName, setGuestName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setTimeLeft] = useState({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Advanced Cinematic 3D Layered Petal Configurations
  const computedPetals = useMemo<PetalProps[]>(() => [
    { x: 8, delay: 0, duration: 8, color: '#F9A5C0', rotateDir: 1, blur: 'blur-none', scale: 1, opacity: 0.9 },
    { x: 22, delay: 2, duration: 11, color: '#E8A076', rotateDir: -1, blur: 'blur-[1px]', scale: 0.8, opacity: 0.7 },
    { x: 35, delay: 0.5, duration: 7, color: '#FDDDE6', rotateDir: 1, blur: 'blur-[2px]', scale: 1.3, opacity: 0.6 },
    { x: 50, delay: 3.5, duration: 12, color: '#F9D5C8', rotateDir: -1, blur: 'blur-none', scale: 0.9, opacity: 0.85 },
    { x: 68, delay: 1.5, duration: 9, color: '#E8A0B0', rotateDir: 1, blur: 'blur-none', scale: 1.1, opacity: 0.9 },
    { x: 82, delay: 4, duration: 10, color: '#FDDDE6', rotateDir: -1, blur: 'blur-[1px]', scale: 0.7, opacity: 0.65 },
    { x: 94, delay: 2.5, duration: 7.5, color: '#F9A5C0', rotateDir: 1, blur: 'blur-none', scale: 1, opacity: 0.8 },
    { x: 15, delay: 5, duration: 13, color: '#E8A0B0', rotateDir: -1, blur: 'blur-[2px]', scale: 1.4, opacity: 0.5 },
  ], []);

  useEffect(() => {
    if (!isStarted) return;
    const target = new Date('2026-08-28T18:00:00').getTime();

    const calculateTime = () => {
      const difference = target - Date.now();
      if (difference > 0) {
        setTimeLeft({
          kun: Math.floor(difference / 86400000),
          soat: Math.floor((difference % 86400000) / 3600000),
          daqiqa: Math.floor((difference % 3600000) / 60000),
          soniya: Math.floor((difference % 60000) / 1000),
        });
      } else {
        setTimeLeft({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
      }
    };

    calculateTime();
    const intervalId = setInterval(calculateTime, 1000);
    return () => clearInterval(intervalId);
  }, [isStarted]);

  const handleStart = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio autoplay prevented. Interaction requested.", err));
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
      setNameError(true);
      setTimeout(() => setNameError(false), 600);
      return;
    }

    setIsSubmitting(true);
    const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (token && chatId) {
      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `🌸 *Qiz Bazmi RSVP (Nihola)*\n\n👤 *Mehmon:* ${guestName.trim()}\n📝 *Holati:* ${status === 'attending' ? '✅ Keladi (Bajonidil)' : '❌ Kelolmaydi'}`,
            parse_mode: 'Markdown'
          }),
        });
      } catch (error) {
        console.error("RSVP Transmission failure:", error);
      }
    }

    setRsvpStatus(status);
    setIsSubmitting(false);
  };

  const handleAddToCalendar = () => {
    const title = "Nihola's Bridal Shower / Qiz Bazmi";
    const details = "Nihola va Jasurbeklarning visol oqshomidan avvalgi qiz bazmi taklifnomasi.";
    const location = "Lola To'yxonasi, Piskent tumani";
    const startDate = "20260828T180000";
    const endDate = "20260828T230000";
    const gCalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
    window.open(gCalUrl, '_blank');
  };

  const premiumFadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="bg-[#FEF6F0] min-h-screen text-[#3D2B2E] flex justify-center overflow-hidden antialiased selection:bg-[#C8607A]/10 selection:text-[#C8607A]" ref={containerRef}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;1,9..144,300&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Plus+Jakarta+Sans:wght@300;400;500&family=Pinyon+Script&display=swap');
        .font-serif-lux { font-family: 'Fraunces', serif; }
        .font-script-lux { font-family: 'Pinyon Script', cursive; }
        .font-sans-lux { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-display-lux { font-family: 'Playfair Display', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-full max-w-[450px] bg-[#FEF6F0] relative overflow-x-hidden shadow-[0_0_80px_rgba(200,96,122,0.08)] flex flex-col justify-between">
        <Head>
          <title>Nihola — Qiz Bazmi Taklifnomasi</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        </Head>

        <audio ref={audioRef} loop preload="auto">
          <source src="/die.mp3" type="audio/mpeg" />
        </audio>

        {/* ================= PREMIUM SPLASH SCREEN ================= */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#FEF6F0] px-6"
              exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.03 }}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                {computedPetals.slice(0, 4).map((p, i) => <FallingPetal key={i} {...p} />)}
              </div>

              <motion.div
                className="relative z-20 flex flex-col items-center text-center cursor-pointer group"
                onClick={handleStart}
                initial="hidden"
                animate="visible"
                // @ts-ignore
                variants={premiumFadeUp}
              >
                <div className="relative w-44 h-44 flex items-center justify-center mb-8">
                  <motion.svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 160 160"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  >
                    <circle cx="80" cy="80" r="74" fill="none" stroke="#C8607A" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.3" />
                    <circle cx="80" cy="80" r="66" fill="none" stroke="#4A7C59" strokeWidth="0.5" opacity="0.2" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <circle key={angle} cx="80" cy="14" r="2" fill="#C8607A" opacity="0.6" transform={`rotate(${angle} 80 80)`} />
                    ))}
                  </motion.svg>

                  <div className="flex flex-col items-center justify-center mt-2">
                    <span className="font-script-lux text-6xl text-[#C8607A] leading-none select-none">N</span>
                    <span className="font-sans-lux text-[9px] tracking-[0.4em] uppercase text-[#4A7C59] font-medium mt-3 opacity-90">Qiz Bazmi</span>
                  </div>
                </div>

                <div className="space-y-2 mb-12">
                  <p className="font-sans-lux text-[10px] tracking-[0.6em] uppercase text-[#4A7C59] font-semibold">Tashrif Buyurishingiz</p>
                  <p className="font-serif-lux text-xs italic text-[#3D2B2E]/60">boshlanishi uchun ekranga bosing</p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-md rounded-full border border-[#C8607A]/25 shadow-[0_12px_30px_rgba(200,96,122,0.12)] transition-all duration-500 group-hover:border-[#C8607A]/50 group-hover:shadow-[0_16px_35px_rgba(200,96,122,0.18)]"
                >
                  <Play size={10} className="fill-[#C8607A] text-[#C8607A] ml-0.5 animate-pulse" />
                  <span className="font-sans-lux text-[10px] tracking-[0.3em] uppercase text-[#C8607A] font-semibold">Taklifnomani ochish</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= LUXURY CONTROLS (FIXED) ================= */}
        {isStarted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="fixed bottom-6 right-6 z-[150] flex flex-col gap-3"
          >
            <button
              onClick={toggleMusic}
              className="w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full border border-[#C8607A]/20 shadow-[0_10px_25px_rgba(200,96,122,0.15)] active:scale-95 transition-all duration-300 group"
            >
              {isPlaying ? (
                <div className="flex items-end justify-center gap-0.5 w-4 h-4">
                  {[0.6, 1, 0.4, 0.8].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '20%'] }}
                      transition={{ duration: 1 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-[2px] bg-[#C8607A] rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <VolumeX size={15} className="text-[#C8607A]/70 group-hover:text-[#C8607A]" />
              )}
            </button>
          </motion.div>
        )}

        {/* ================= MAIN INVITE INTERFACE ================= */}
        {isStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="w-full flex-grow flex flex-col justify-between"
          >
            {/* --- HERO SECTION --- */}
            <section className="relative text-center min-h-[100svh] flex flex-col items-center justify-center px-6 py-12">
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                {computedPetals.map((p, i) => <FallingPetal key={i} {...p} />)}
              </div>

              <div className="w-full flex flex-col items-center justify-between min-h-[85svh] z-20">
                <motion.p
                  initial={{ opacity: 0, letterSpacing: '0.3em' }}
                  animate={{ opacity: 0.8, letterSpacing: '0.5em' }}
                  transition={{ duration: 1.5 }}
                  className="font-sans-lux text-[10px] uppercase text-[#4A7C59] font-semibold tracking-[0.5em]"
                >
                  Bismillahir Rahmanir Rahim
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="relative w-64 max-w-[70%] aspect-[3/4] my-8 drop-shadow-[0_20px_50px_rgba(200,96,122,0.1)]"
                >
                  <div className="absolute inset-0 z-30 pointer-events-none scale-[1.03]">
                    <BotanicalArch />
                  </div>
                  <div className="w-full h-full overflow-hidden rounded-t-[120px] rounded-b-[4px] border-[0.5px] border-[#C8607A]/20 bg-[#F9EDE8] p-1.5 shadow-inner">
                    <div className="w-full h-full overflow-hidden rounded-t-[115px] rounded-b-[2px] relative group">
                      <img
                        src="/dreamwedding.jpg"
                        alt="Nihola Portrait"
                        className="w-full h-full object-cover filter brightness-[1.02] contrast-[0.98] saturate-[0.9] transition-transform duration-[4s] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FEF6F0]/80 via-transparent to-transparent opacity-60" />
                    </div>
                  </div>
                </motion.div>

                <div className="space-y-3">
                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                    className="font-script-lux text-[4.8rem] text-[#C8607A] leading-[0.7]"
                  >
                    Nihola
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 1.2, delay: 0.7 }}
                    className="font-serif-lux italic text-[15px] tracking-[0.12em] text-[#3D2B2E]"
                  >
                    ning qiz bazmi taklifnomasi
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="flex items-center gap-5 mt-8 opacity-80"
                >
                  <div className="h-[0.5px] w-8 bg-gradient-to-r from-transparent to-[#C8607A]" />
                  <p className="font-sans-lux text-[11px] tracking-[0.4em] text-[#3D2B2E] font-medium">28 · 08 · 2026</p>
                  <div className="h-[0.5px] w-8 bg-gradient-to-l from-transparent to-[#C8607A]" />
                </motion.div>
              </div>
            </section>

            {/* --- STORY / INSPIRATION --- */}
            <section className="py-24 px-8 text-center bg-[#FDF0F5]/60 relative border-y border-[#C8607A]/5">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C8607A]/5 to-transparent opacity-30 pointer-events-none" />
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                // @ts-ignore
                variants={premiumFadeUp}
                className="max-w-[320px] mx-auto space-y-6 relative z-10"
              >
                <div className="w-12 h-12 rounded-full border border-[#C8607A]/20 flex items-center justify-center mx-auto bg-white/40 backdrop-blur-sm shadow-sm">
                  <Sparkles size={14} className="text-[#C8607A]/80" />
                </div>
                <h2 className="font-display-lux text-2xl tracking-wide text-[#C8607A] font-medium">Hayotning Go'zal Onlari</h2>
                <p className="font-serif-lux italic text-[#3D2B2E]/70 text-[15px] leading-[2.2] px-2">
                  &ldquo;Har bir qizning qalbidagi eng shirin orzular ro'yobi... Oq libos kiyish arafasida, eng yaqinlarim va dugonalarim davrasida hayotimning yangi sahifasini sizlar bilan nishonlashni istayman.&rdquo;
                </p>
                <LineDivider />
              </motion.div>
            </section>

            {/* --- LETTER SECTION --- */}
            <section className="py-28 px-6 bg-[#FEF6F0]">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                // @ts-ignore
                variants={premiumFadeUp}
                className="max-w-[360px] mx-auto"
              >
                <div className="relative p-8 sm:p-10 text-center bg-white rounded-2xl border border-[#C8607A]/15 shadow-[0_25px_70px_rgba(200,96,122,0.05),_0_10px_30px_rgba(0,0,0,0.01)] group">
                  <div className="absolute inset-2.5 border border-[#C8607A]/10 rounded-xl pointer-events-none transition-all duration-500 group-hover:inset-3" />

                  <p className="font-sans-lux text-[9px] tracking-[0.4em] uppercase text-[#C8607A] font-semibold mb-8">Ehtirom Ila Lutfan Kutamiz</p>

                  <div className="font-serif-lux text-[15px] text-[#3D2B2E]/80 leading-[2.4] space-y-4">
                    <p className="italic">&ldquo;Yangi hayot bo'sag'asida turar ekanman, qalbimdagi eng begubor quvonchlarimga sherik bo'lishingizni chin dildan istayman.</p>
                    <div className="py-2">
                      <p className="font-display-lux not-italic text-lg text-[#3D2B2E] tracking-wide font-semibold">Nihola va Jasurbeklarning</p>
                      <p className="font-sans-lux text-[10px] tracking-[0.2em] text-[#4A7C59] font-medium mt-1 uppercase">visol oqshomi oldidan</p>
                    </div>
                    <p className="italic">tashkil etilgan qizlar davrasidagi shirin suhbat va go'zal kechada sizni ko'rish men uchun cheksiz baxtdir.&rdquo;</p>
                  </div>

                  <p className="font-script-lux text-5xl text-[#C8607A] mt-10 leading-none">Nihola</p>

                  <div className="flex justify-center items-center gap-2 mt-8 opacity-40">
                    <div className="w-6 h-[0.5px] bg-[#4A7C59]" />
                    <div className="w-1.5 h-1.5 rotate-45 border border-[#4A7C59] bg-transparent" />
                    <div className="w-6 h-[0.5px] bg-[#4A7C59]" />
                  </div>
                </div>
              </motion.div>
            </section>

            {/* --- PROGRAM DETAILS --- */}
            <section className="py-24 px-6 bg-[#FDF0F5]/50 relative border-t border-[#C8607A]/5">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                // @ts-ignore
                variants={premiumFadeUp}
                className="max-w-[320px] mx-auto text-center space-y-8"
              >
                <div className="space-y-2">
                  <span className="font-sans-lux text-[9px] tracking-[0.4em] uppercase text-[#4A7C59] font-semibold">Tadbir Rejasi</span>
                  <h2 className="font-display-lux text-2xl font-medium text-[#C8607A]">Oqshom Vaqti</h2>
                </div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white p-8 rounded-2xl border border-[#C8607A]/10 shadow-[0_15px_40px_rgba(200,96,122,0.04)]"
                >
                  <p className="font-display-lux text-4xl text-[#C8607A] font-light tracking-wide">18:00</p>
                  <div className="w-8 h-[0.5px] bg-[#C8607A]/30 mx-auto my-3" />
                  <p className="font-sans-lux text-[11px] tracking-[0.2em] uppercase text-[#3D2B2E] font-semibold">Dastur Boshlanishi</p>
                  <p className="font-serif-lux italic text-xs text-[#3D2B2E]/50 mt-1.5">Milliy an&apos;analar, shirin tantana va raqslar</p>
                </motion.div>
              </motion.div>
            </section>

            {/* --- VENUE / MANZIL --- */}
            <section className="py-26 px-6 bg-[#FEF6F0]">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                // @ts-ignore
                variants={premiumFadeUp}
                className="max-w-[340px] mx-auto text-center"
              >
                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#C8607A]/15 shadow-[0_20px_50px_rgba(200,96,122,0.05)] space-y-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto bg-[#C8607A]/10">
                    <MapPin size={18} className="text-[#C8607A]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display-lux text-xl font-medium text-[#3D2B2E]">Tantanali Manzil</h3>
                    <p className="font-serif-lux italic text-[14px] text-[#3D2B2E]/60 leading-relaxed">
                      Tashkent viloyati, Piskent tumani,<br />Bobur Mirzo ko&apos;chasi
                    </p>
                  </div>

                  <div className="bg-[#FEF6F0]/60 py-3 rounded-xl border border-[#C8607A]/5">
                    <p className="font-sans-lux text-xs tracking-[0.15em] text-[#3D2B2E] font-bold uppercase">&ldquo;Lola&rdquo; Tantanalar Saroyi</p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href="https://www.google.com/maps?q=40.898729,69.350592"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans-lux block w-full text-center py-3.5 bg-[#C8607A] text-white rounded-full text-[10px] tracking-[0.25em] uppercase font-semibold shadow-[0_10px_25px_rgba(200,96,122,0.2)] hover:bg-[#B54D66] transition-colors"
                    >
                      Geolokatsiyani Ko&apos;rish
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* --- RSVP FORM --- */}
            <section className="py-26 px-6 bg-[#FDF0F5]/60 border-t border-[#C8607A]/5">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                // @ts-ignore
                variants={premiumFadeUp}
                className="max-w-[350px] mx-auto text-center space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="font-display-lux text-2xl text-[#C8607A] font-medium">Tashrifni Tasdiqlash</h3>
                  <p className="font-serif-lux italic text-xs text-[#3D2B2E]/50 tracking-wider">Davramizda ko&apos;rishish niyatida ismingizni qoldiring</p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-[#C8607A]/15 shadow-[0_20px_45px_rgba(200,96,122,0.04)]">
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div
                        key="rsvp-form"
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                      >
                        <div className="relative">
                          <motion.input
                            type="text"
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                            placeholder="Ism-sharifingiz"
                            animate={nameError ? { x: [-10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                            className={`w-full text-center py-3 bg-transparent border-b text-[18px] font-medium text-[#3D2B2E] placeholder:text-[#3D2B2E]/20 font-serif-lux focus:outline-none transition-colors ${nameError ? 'border-red-400' : 'border-[#C8607A]/30 focus:border-[#C8607A]'}`}
                          />
                        </div>

                        <div className="space-y-3 pt-2">
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleRSVP('attending')}
                            disabled={isSubmitting}
                            className="font-sans-lux w-full h-12 flex justify-center items-center bg-[#C8607A] text-white rounded-full text-[10px] tracking-[0.2em] uppercase font-semibold shadow-[0_8px_20px_rgba(200,96,122,0.15)] disabled:opacity-50"
                          >
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Bajonidil Qatnashaman'}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleRSVP('declined')}
                            disabled={isSubmitting}
                            className="font-sans-lux w-full h-12 flex justify-center items-center bg-transparent border border-[#C8607A]/30 text-[#3D2B2E]/60 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium"
                          >
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Afsuski, Kela Olmayman'}
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="rsvp-success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-6 flex flex-col items-center space-y-4"
                      >
                        <motion.div
                          initial={{ rotate: -10, scale: 0.8 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <CheckCircle2 size={48} className="text-[#4A7C59]" />
                        </motion.div>
                        <div className="space-y-1">
                          <p className="font-display-lux text-2xl text-[#3D2B2E]">Katta Rahmat!</p>
                          <p className="font-serif-lux italic text-sm text-[#3D2B2E]/60">Sizning javobingiz muvaffaqiyatli saqlandi.</p>
                        </div>
                        {rsvpStatus === 'attending' && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToCalendar}
                            className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-[#4A7C59] text-white rounded-full text-[10px] tracking-[0.2em] uppercase font-semibold shadow-[0_8px_20px_rgba(74,124,89,0.15)] mx-auto"
                          >
                            <Calendar size={12} />
                            Kalendarga Qo'shish
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SakuraWedding;