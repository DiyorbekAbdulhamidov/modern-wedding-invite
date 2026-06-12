"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Play, Disc, MapPin, CheckCircle, Loader2 } from 'lucide-react';

// --- DECORATIVE COMPONENTS ---

const Star = ({ x, y, size, delay, dur }: { x: number; y: number; size: number; delay: number; dur: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none bg-white"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{ opacity: [0.1, 1, 0.2, 0.8, 0.1], scale: [1, 1.4, 0.8, 1.2, 1] }}
    transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const MoonCrescent = ({ size = 80, color = '#FFD580' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className="select-none">
    <circle cx="40" cy="40" r="32" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="0.5" className="opacity-60" />
    <circle cx="52" cy="34" r="26" fill="#060B18" />
    <circle cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="0.5" className="opacity-30" />
    {[[15, 20], [65, 25], [70, 60], [20, 65], [10, 45]].map(([sx, sy], i) => (
      <circle key={i} cx={sx} cy={sy} r="1.5" fill={color} fillOpacity="0.6" />
    ))}
  </svg>
);

const ConstellationLine = () => (
  <svg viewBox="0 0 320 60" className="w-full opacity-30 select-none" fill="none">
    <circle cx="20" cy="30" r="2" fill="#7B61FF" />
    <circle cx="80" cy="15" r="1.5" fill="#4ECDC4" />
    <circle cx="140" cy="35" r="2.5" fill="#7B61FF" />
    <circle cx="200" cy="10" r="1.5" fill="#4ECDC4" />
    <circle cx="260" cy="30" r="2" fill="#7B61FF" />
    <circle cx="300" cy="20" r="1.5" fill="#4ECDC4" />
    <path d="M20 30 L80 15 L140 35 L200 10 L260 30 L300 20" stroke="rgba(123,97,255,0.5)" strokeWidth="0.5" strokeDasharray="3 3" />
    <circle cx="50" cy="50" r="1" fill="#FFD580" fillOpacity="0.5" />
    <circle cx="170" cy="52" r="1" fill="#FFD580" fillOpacity="0.5" />
    <circle cx="290" cy="48" r="1" fill="#FFD580" fillOpacity="0.5" />
  </svg>
);

const NebulaOrb = ({ x, y, size, color, opacity }: { x: string; y: string; size: number; color: string; opacity: number }) => (
  <div
    className="absolute pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 will-change-transform"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
      background: color,
      filter: `blur(${size * 0.6}px)`,
      opacity
    }}
  />
);

// Star field data cache
const starData = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: (i * 12.7) % 100,
  y: (i * 8.3) % 100,
  size: 0.8 + (i % 3) * 0.6,
  delay: (i * 0.17) % 5,
  dur: 2.5 + (i * 0.31) % 3.5,
}));

// --- MAIN COMPONENT ---

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
        clearInterval(timerInterval);
      }
    };

    calculateTime();
    const timerInterval = setInterval(calculateTime, 1000);
    return () => clearInterval(timerInterval);
  }, [isStarted]);

  const handleStart = () => {
    setIsStarted(true);
    audioRef.current?.play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.log("Audio playback delayed or blocked:", err));
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
      alert('Iltimos, ismingizni kiriting!');
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
            text: `✨ *RSVP Yangi Jashn*\n\n👤 *Mehmon:* ${guestName}\n📝 *Holati:* ${status === 'attending' ? '✅ Keladi' : '❌ Kelmaydi'}`,
            parse_mode: 'Markdown'
          }),
        });
      } catch (error) {
        console.error("Telegram API Error:", error);
      }
    }

    setRsvpStatus(status);
    setIsSubmitting(false);
  };

  const cosmicFade: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="bg-[#060B18] min-h-[100svh] text-[#D8E8FF] flex justify-center overflow-hidden font-raleway antialiased selection:bg-[#7B61FF]/30">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100;200;300;400&family=Raleway:wght@100;200;300;400&family=Sacramento&display=swap');
        .font-josefin { font-family: 'Josefin Sans', sans-serif; }
        .font-raleway { font-family: 'Raleway', sans-serif; }
        .font-sacramento { font-family: 'Sacramento', cursive; }
        
        .cosmic-glow-purple { text-shadow: 0 0 30px rgba(123,97,255,0.6), 0 0 60px rgba(123,97,255,0.3); }
        .cosmic-glow-teal { text-shadow: 0 0 30px rgba(78,205,196,0.6), 0 0 60px rgba(78,205,196,0.3); }
        .cosmic-glow-gold { text-shadow: 0 0 30px rgba(255,213,128,0.6), 0 0 60px rgba(255,213,128,0.3); }
      `}</style>

      <div className="w-full max-w-[460px] relative overflow-x-hidden shadow-2xl bg-[#060B18]">
        <Head>
          <title>Kosmik Muhabbat | Visol Bazmi</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <audio ref={audioRef} loop preload="auto">
          <source src="/die.mp3" type="audio/mpeg" />
        </audio>

        {/* --- SPLASH SCREEN --- */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-[#060B18]"
              exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            >
              <div className="absolute inset-0 pointer-events-none">
                {starData.map(s => <Star key={s.id} {...s} />)}
              </div>

              <NebulaOrb x="20%" y="30%" size={200} color="#7B61FF" opacity={0.08} />
              <NebulaOrb x="80%" y="70%" size={250} color="#4ECDC4" opacity={0.06} />
              <NebulaOrb x="50%" y="50%" size={300} color="#6B3F7C" opacity={0.05} />

              <motion.div className="relative z-20 flex flex-col items-center cursor-pointer group" onClick={handleStart}>
                {/* Orbit System */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  className="relative mb-10 flex items-center justify-center w-[200px] h-[200px]"
                >
                  <div className="absolute inset-0 rounded-full border-[0.5px] border-[#7B61FF]/20" />
                  <div className="absolute inset-3 rounded-full border-[0.5px] border-[#4ECDC4]/15" />

                  {/* Outer Orbit Dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="absolute w-2 h-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#4ECDC4] shadow-[0_0_12px_#4ECDC4] translate-x-[82px]" />
                    </motion.div>
                  </div>

                  {/* Inner Orbit Dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="absolute w-1.5 h-1.5"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFD580] shadow-[0_0_10px_#FFD580] translate-x-[60px]" />
                    </motion.div>
                  </div>

                  {/* Center Monogram */}
                  <div className="relative z-10 flex flex-col items-center pt-2">
                    <MoonCrescent size={60} color="#FFD580" />
                    <div className="mt-2 text-center">
                      <span className="font-josefin block text-3xl font-thin tracking-[0.4em] text-[#D8E8FF] cosmic-glow-purple">
                        S & A
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.2 }} className="text-center mb-10">
                  <p className="font-sacramento text-4xl text-[#FFD580] cosmic-glow-gold">Kosmik Muhabbat</p>
                  <p className="font-josefin mt-4 text-[10px] tracking-[0.6em] uppercase text-[#D8E8FF]/35 font-light">
                    20 . 06 . 2026
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="flex items-center gap-3 px-8 py-3.5 border-[0.5px] border-[#7B61FF]/40 bg-[#7B61FF]/10 rounded-sm transition-all duration-300 group-hover:bg-[#7B61FF]/20"
                >
                  <Play size={10} className="text-[#7B61FF] fill-[#7B61FF]" />
                  <span className="font-josefin text-[10px] tracking-[0.4em] uppercase text-[#D8E8FF] font-light">Taklifnomani Ochish</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- PERSISTENT MUSIC FLOATER --- */}
        {isStarted && (
          <motion.button
            onClick={toggleMusic}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-8 right-6 z-[150] w-12 h-12 flex items-center justify-center active:scale-95 transition-transform rounded-full bg-[#060B18]/90 border-[0.5px] border-[#7B61FF]/40 backdrop-blur-md shadow-[0_0_20px_rgba(123,97,255,0.2)]"
          >
            {isPlaying ? (
              <Disc className="animate-spin text-[#7B61FF]" size={18} style={{ animationDuration: '5s' }} />
            ) : (
              <Play className="text-[#7B61FF] fill-[#7B61FF] ml-0.5" size={14} />
            )}
          </motion.button>
        )}

        {/* --- MAIN CONTENT SCROLLER --- */}
        {isStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>

            {/* HERO SECTION */}
            <section className="relative text-center min-h-[100svh] flex flex-col items-center justify-center bg-[#060B18] px-6 py-16">
              <div className="absolute inset-0 pointer-events-none">
                {starData.map(s => <Star key={s.id} {...s} />)}
              </div>
              <NebulaOrb x="15%" y="20%" size={220} color="#7B61FF" opacity={0.07} />
              <NebulaOrb x="85%" y="75%" size={280} color="#4ECDC4" opacity={0.05} />

              <div className="relative z-10 w-full flex flex-col items-center">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }}>
                  <MoonCrescent size={70} color="#FFD580" />
                </motion.div>

                <ConstellationLine />

                <p className="font-josefin my-6 text-[10px] tracking-[0.7em] uppercase text-[#4ECDC4] font-light">
                  Oila Qurish Tantanasi
                </p>

                <div className="space-y-2 my-4">
                  <h1 className="font-josefin text-5xl sm:text-6xl text-[#D8E8FF] tracking-[0.2em] font-extralight cosmic-glow-purple">
                    SARDOR
                  </h1>

                  <div className="flex items-center justify-center gap-4 my-2">
                    <div className="h-[0.5px] w-10 bg-gradient-to-r from-transparent to-[#7B61FF]" />
                    <span className="font-sacramento text-3xl text-[#FFD580] cosmic-glow-gold">va</span>
                    <div className="h-[0.5px] w-10 bg-gradient-to-r from-[#7B61FF] to-transparent" />
                  </div>

                  <h1 className="font-josefin text-5xl sm:text-6xl text-[#D8E8FF] tracking-[0.2em] font-extralight cosmic-glow-teal">
                    AMIRA
                  </h1>
                </div>

                <ConstellationLine />

                <div className="flex items-center gap-4 mt-6">
                  <div className="h-[0.5px] w-8 bg-[#7B61FF]/50" />
                  <p className="font-josefin text-[11px] tracking-[0.4em] uppercase text-[#D8E8FF]/60 font-light">
                    20 · Iyun · 2026
                  </p>
                  <div className="h-[0.5px] w-8 bg-[#4ECDC4]/50" />
                </div>
              </div>
            </section>

            {/* INVITATION LETTER */}
            <section className="py-24 px-6 relative bg-[#0D1530]">
              <NebulaOrb x="80%" y="30%" size={200} color="#7B61FF" opacity={0.06} />
              <NebulaOrb x="10%" y="70%" size={180} color="#4ECDC4" opacity={0.05} />

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="max-w-[340px] mx-auto text-center relative z-10">
                {/* Geometrical Cosmic Emblem */}
                <svg width="80" height="40" viewBox="0 0 80 40" className="mx-auto mb-6">
                  <path d="M40 5 L60 20 L40 35 L20 20 Z" fill="none" stroke="#7B61FF" strokeWidth="0.5" className="opacity-60" />
                  <path d="M40 12 L52 20 L40 28 L28 20 Z" fill="#7B61FF" className="opacity-20" />
                  <circle cx="40" cy="20" r="3" fill="#FFD580" className="opacity-60" />
                  <line x1="0" y1="20" x2="18" y2="20" stroke="#7B61FF" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-40" />
                  <line x1="62" y1="20" x2="80" y2="20" stroke="#7B61FF" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-40" />
                </svg>

                <p className="font-josefin mb-6 text-[10px] tracking-[0.6em] uppercase text-[#7B61FF] font-light">
                  Qadrli Mehmonlarimiz
                </p>

                <div className="h-[0.5px] bg-gradient-to-r from-transparent via-[#7B61FF]/50 to-transparent mb-8" />

                <p className="font-raleway italic text-[15px] text-[#D8E8FF]/80 leading-[2.4] font-light">
                  "Ikki yulduz bir-birini uzoqdan topar ekan — ular uchrashgan kun koinotning eng yorqin kuni bo'ladi. Bizning uchrashuvimiz ham shunday bo'ldi."
                </p>

                <p className="font-josefin my-8 text-xs text-[#D8E8FF] tracking-[0.3em] font-normal">
                  SARDORJON & AMIRAXON
                </p>

                <p className="font-raleway italic text-[15px] text-[#D8E8FF]/80 leading-[2.4] font-light">
                  Porloq va unutilmas visol oqshomimizni duolaringiz hamda samimiy tabassumingiz bilan bezashingizni iltimos qilamiz.
                </p>

                <div className="h-[0.5px] bg-gradient-to-r from-transparent via-[#4ECDC4]/50 to-transparent mt-8" />
              </motion.div>
            </section>

            {/* EVENT TIMELINE */}
            <section className="py-24 px-6 relative bg-[#060B18]">
              <div className="absolute inset-0 pointer-events-none">
                {starData.slice(0, 30).map(s => <Star key={s.id} {...s} />)}
              </div>
              <NebulaOrb x="50%" y="50%" size={400} color="#7B61FF" opacity={0.04} />

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="max-w-[340px] mx-auto relative z-10">
                <div className="text-center mb-12">
                  <p className="font-josefin mb-3 text-[10px] tracking-[0.6em] uppercase text-[#4ECDC4] font-light">Tantana Dasturi</p>
                  <h2 className="font-josefin text-2xl text-[#D8E8FF] tracking-[0.25em] font-extralight cosmic-glow-purple">OQSHOM TARTIBI</h2>
                </div>

                {[
                  { time: '14:00', event: 'ZAGS Marosimi', desc: "Rasmiy ro'yxatdan o'tish", icon: '✦', color: 'text-[#FFD580]', glow: 'cosmic-glow-gold' },
                  { time: '17:00', event: 'Welcome Reception', desc: 'Musiqa va samimiy suhbat', icon: '◈', color: 'text-[#4ECDC4]', glow: 'cosmic-glow-teal' },
                  { time: '18:00', event: "Asosiy To'y Bazmi", desc: '"Versal" Saroyi', icon: '❋', color: 'text-[#7B61FF]', glow: 'cosmic-glow-purple' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    className="flex items-start gap-5 mb-6 p-5 border-[0.5px] border-[#7B61FF]/15 bg-[#7B61FF]/5 border-l-2 rounded-xs"
                    style={{ borderLeftColor: item.time === '14:00' ? '#FFD580' : item.time === '17:00' ? '#4ECDC4' : '#7B61FF' }}
                  >
                    <div className="flex-shrink-0 mt-0.5 text-lg select-none">
                      <span className={`${item.color} filter drop-shadow-xs`}>{item.icon}</span>
                    </div>
                    <div>
                      <p className={`font-josefin text-2xl font-light tracking-wide ${item.color} ${item.glow}`}>{item.time}</p>
                      <p className="font-josefin mt-1 text-xs text-[#D8E8FF] tracking-widest font-normal">{item.event}</p>
                      <p className="font-raleway italic mt-1 text-[13px] text-[#D8E8FF]/40 font-light">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {/* VENUE MAP */}
            <section className="py-24 px-6 bg-[#0D1530]">
              <NebulaOrb x="30%" y="60%" size={200} color="#4ECDC4" opacity={0.06} />
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="max-w-[340px] mx-auto relative z-10">
                <div className="text-center p-8 sm:p-10 relative border-[0.5px] border-[#4ECDC4]/25 bg-[#4ECDC4]/5 backdrop-blur-xs">

                  {/* Absolute Corner Stars */}
                  {[[false, false], [true, false], [false, true], [true, true]].map(([bottom, right], i) => (
                    <div key={i} className={`absolute ${bottom ? '-bottom-1.5' : '-top-1.5'} ${right ? '-right-1.5' : '-left-1.5'}`}>
                      <svg width="12" height="12" viewBox="0 0 12 12">
                        <polygon points="6,0 7.5,4.5 12,6 7.5,7.5 6,12 4.5,7.5 0,6 4.5,4.5" fill="#4ECDC4" className="opacity-60" />
                      </svg>
                    </div>
                  ))}

                  <MapPin size={22} className="text-[#4ECDC4] mx-auto mb-4 filter drop-shadow-[0_0_8px_#4ECDC4]" />
                  <h3 className="font-josefin mb-4 text-sm text-[#D8E8FF] tracking-[0.4em] font-light">MANZIL</h3>
                  <p className="font-raleway italic mb-3 text-[14px] text-[#D8E8FF]/60 leading-relaxed font-light">
                    Toshkent shahri, Yunusobod tumani,
                  </p>
                  <p className="font-josefin mb-8 text-[14px] text-[#4ECDC4] tracking-widest font-normal cosmic-glow-teal">
                    "VERSAL" SAROYI
                  </p>

                  <Link
                    href="https://maps.google.com"
                    target="_blank"
                    className="font-josefin inline-block px-6 py-3 border-[0.5px] border-[#4ECDC4]/50 text-[10px] tracking-[0.4em] uppercase text-[#4ECDC4] font-light rounded-xs transition-all duration-300 hover:bg-[#4ECDC4]/10 active:scale-98"
                  >
                    Xaritada Ochish
                  </Link>
                </div>
              </motion.div>
            </section>

            {/* RSVP FORM */}
            <section className="py-24 px-6 relative bg-[#060B18]">
              <div className="absolute inset-0 pointer-events-none">
                {starData.slice(20, 50).map(s => <Star key={s.id} {...s} />)}
              </div>
              <NebulaOrb x="70%" y="30%" size={240} color="#7B61FF" opacity={0.06} />

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="max-w-[340px] mx-auto text-center relative z-10">
                <svg width="40" height="40" viewBox="0 0 40 40" className="mx-auto mb-4 select-none">
                  <polygon points="20,0 24,14 40,14 27,22 32,38 20,28 8,38 13,22 0,14 16,14" fill="#FFD580" fillOpacity="0.2" stroke="#FFD580" strokeWidth="0.5" />
                  <polygon points="20,6 23,14 32,14 25,19 28,29 20,23 12,29 15,19 8,14 17,14" fill="#FFD580" fillOpacity="0.5" />
                </svg>

                <h3 className="font-josefin mb-2 text-xl text-[#D8E8FF] tracking-[0.3em] font-light cosmic-glow-purple">TASHRIF TASDIG'I</h3>
                <p className="font-josefin mb-8 text-[9px] tracking-[0.4em] uppercase text-[#D8E8FF]/40 font-extralight">Ismingizni yulduzlar orasiga qo'shing</p>

                <div className="p-6 sm:p-8 border-[0.5px] border-[#7B61FF]/20 bg-[#7B61FF]/5 backdrop-blur-xs rounded-xs">
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="form" exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <input
                          type="text"
                          value={guestName}
                          onChange={e => setGuestName(e.target.value)}
                          placeholder="Ism-sharifingiz"
                          className="font-josefin w-full text-center py-2 bg-transparent text-[#D8E8FF] placeholder:text-[#D8E8FF]/20 text-base font-light tracking-wide border-b-[0.5px] border-[#7B61FF]/30 focus:border-[#4ECDC4] focus:outline-none transition-colors duration-300"
                        />
                        <div className="space-y-3 pt-2">
                          <button
                            onClick={() => handleRSVP('attending')}
                            disabled={isSubmitting}
                            className="font-josefin w-full h-12 flex justify-center items-center bg-gradient-to-r from-[#7B61FF] to-[#4ECDC4] text-white text-[10px] tracking-[0.3em] uppercase font-light rounded-xs shadow-md active:scale-[0.99] transition-transform disabled:opacity-50"
                          >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Yulduzlarga qo'shilaman"}
                          </button>
                          <button
                            onClick={() => handleRSVP('declined')}
                            disabled={isSubmitting}
                            className="font-josefin w-full h-12 flex justify-center items-center border-[0.5px] border-[#7B61FF]/30 text-[#D8E8FF]/40 text-[10px] tracking-[0.3em] uppercase font-extralight rounded-xs hover:bg-white/[0.02] active:scale-[0.99] transition-transform disabled:opacity-50"
                          >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Afsuski, bora olmayman'}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 flex flex-col items-center">
                        <CheckCircle size={40} className="text-[#4ECDC4] mb-4 filter drop-shadow-[0_0_10px_#4ECDC4]" />
                        <p className="font-josefin text-base text-[#D8E8FF] tracking-[0.2em] font-light">Rahmat!</p>
                        <p className="font-josefin mt-2 text-[9px] tracking-[0.3em] uppercase text-[#4ECDC4]/70 font-light">
                          {rsvpStatus === 'attending' ? "Sizni tantanada kutib qolamiz" : "Istaklaringiz uchun rahmat"}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>

            {/* COUNTDOWN TIMER */}
            <section className="py-24 px-6 text-center relative bg-[#0D1530]">
              <NebulaOrb x="50%" y="50%" size={350} color="#7B61FF" opacity={0.07} />
              <div className="absolute inset-0 pointer-events-none">
                {starData.slice(0, 25).map(s => <Star key={s.id} {...s} />)}
              </div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="relative z-10">
                <p className="font-sacramento text-5xl text-[#FFD580] mb-10 cosmic-glow-gold">
                  Bayramga qadar...
                </p>

                <div className="flex justify-center gap-2.5 sm:gap-3 select-none">
                  {[
                    { label: 'KUN', value: timeLeft.kun },
                    { label: 'SOAT', value: timeLeft.soat },
                    { label: 'DAQIQA', value: timeLeft.daqiqa },
                    { label: 'SONIYA', value: timeLeft.soniya }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex flex-col items-center py-4 relative overflow-hidden w-16 border-[0.5px] border-[#7B61FF]/25 bg-[#7B61FF]/5 rounded-xs"
                    >
                      <span className={`font-josefin text-2xl font-extralight tracking-wide ${i % 2 === 0 ? 'text-[#7B61FF] cosmic-glow-purple' : 'text-[#4ECDC4] cosmic-glow-teal'}`}>
                        {item.value.toString().padStart(2, '0')}
                      </span>
                      <span className="font-josefin mt-2 text-[8px] tracking-[0.2em] text-[#D8E8FF]/35 font-light">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* CLOSING BANNER */}
            <section className="py-32 px-6 text-center relative bg-[#060B18]">
              <div className="absolute inset-0 pointer-events-none">
                {starData.map(s => <Star key={s.id} {...s} />)}
              </div>
              <NebulaOrb x="50%" y="40%" size={400} color="#7B61FF" opacity={0.07} />
              <NebulaOrb x="30%" y="70%" size={250} color="#4ECDC4" opacity={0.05} />

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cosmicFade} className="relative z-10 max-w-[320px] mx-auto">
                <div className="h-[0.5px] bg-gradient-to-r from-transparent via-[#7B61FF]/40 to-transparent mb-10" />
                <MoonCrescent size={60} color="#FFD580" />
                <p className="font-raleway italic text-[15px] text-[#D8E8FF]/60 leading-[2.2] my-8 font-light">
                  "Baxtimiz sizning nurli ishtirokingiz bilan kamolga yetadi."
                </p>
                <h2 className="font-josefin text-4xl text-[#D8E8FF] tracking-[0.4em] font-extralight cosmic-glow-purple pl-[0.4em]">S & A</h2>
                <div className="h-[0.5px] bg-gradient-to-r from-transparent via-[#4ECDC4]/40 to-transparent mt-10" />
              </motion.div>
            </section>

            {/* FOOTER */}
            <footer className="py-8 text-center bg-[#030610] border-t-[0.5px] border-[#7B61FF]/15">
              <p className="font-josefin text-[8px] tracking-[0.5em] uppercase text-[#7B61FF]/40 font-light">
                Designed by <Link href="https://webleaders.uz" target="_blank" className="hover:text-[#4ECDC4] transition-colors duration-300">WebLeaders</Link>
              </p>
            </footer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CelestialWedding;