"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, Disc, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

const GoldSpark = ({ x, delay, duration, size }: { x: number; delay: number; duration: number; size: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      bottom: 0,
      width: size,
      height: size,
      background: 'radial-gradient(circle, #F0E0A0, #C8A84B)',
      boxShadow: `0 0 ${size * 3}px rgba(200,168,75,0.8)`,
    }}
    initial={{ y: 0, opacity: 0 }}
    animate={{ y: [0, '-110vh'], opacity: [0, 1, 0.8, 0] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
  />
);

const DiamondDivider = () => (
  <div className="flex items-center gap-4 my-2">
    <motion.div className="flex-1 h-[0.5px]" style={{ background: 'linear-gradient(90deg, transparent, #C8A84B)' }} />
    <svg width="16" height="16" viewBox="0 0 16 16">
      <polygon points="8,0 16,8 8,16 0,8" fill="rgba(200,168,75,0.7)" />
      <polygon points="8,3 13,8 8,13 3,8" fill="none" stroke="#C8A84B" strokeWidth="0.5" />
    </svg>
    <motion.div className="flex-1 h-[0.5px]" style={{ background: 'linear-gradient(90deg, #C8A84B, transparent)' }} />
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

  const sparks = Array.from({ length: 22 }, (_, i) => ({
    id: i, x: (i * 4.6) % 100, delay: (i * 0.35) % 9,
    duration: 5 + (i * 0.6) % 5, size: 1.5 + (i % 3),
  }));

  useEffect(() => {
    if (!isStarted) return;
    const target = new Date('2026-05-15T18:00:00').getTime();
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
        body: JSON.stringify({ chat_id: chatId, text: `🎭 RSVP (Sardor & Amira)\n👤 ${guestName}\n📝 ${status === 'attending' ? '✅ Keladi' : '❌ Kelmaydi'}` }),
      }).catch(() => { });
    }
    setRsvpStatus(status);
    setIsSubmitting(false);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div style={{ background: '#050505', minHeight: '100svh' }} className="flex justify-center overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Rajdhani:wght@300;400;500;600&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-cinzel-deco { font-family: 'Cinzel Decorative', serif; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>

      <div className="w-full max-w-[460px] relative overflow-x-hidden" style={{ color: '#E8E0D0' }}>
        <Head><title>Sardor & Amira | Visol Bazmi</title></Head>
        <audio ref={audioRef} loop preload="auto"><source src="/die.mp3" type="audio/mpeg" /></audio>

        {/* SPLASH */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
              style={{ background: '#050505' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: [0.77, 0, 0.175, 1] }}
            >
              <div className="absolute inset-0 overflow-hidden">
                {sparks.map(s => <GoldSpark key={s.id} {...s} />)}
              </div>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #050505 80%)' }} />

              <motion.div className="relative z-20 flex flex-col items-center cursor-pointer" onClick={handleStart}>
                <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease: 'easeOut' }}>
                  <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
                    <div className="absolute inset-0 rounded-full border" style={{ borderColor: 'rgba(200,168,75,0.25)' }} />
                    <div className="absolute rounded-full border" style={{ inset: 12, borderColor: 'rgba(200,168,75,0.5)' }} />
                    <motion.div className="absolute rounded-full" style={{
                      inset: 0, border: '0.5px solid rgba(200,168,75,0.15)',
                      background: 'conic-gradient(transparent 0deg, rgba(200,168,75,0.15) 90deg, transparent 180deg, rgba(200,168,75,0.15) 270deg, transparent)'
                    }} animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
                    <div className="text-center relative z-10">
                      <span className="font-cinzel-deco block leading-none" style={{ fontSize: '3.8rem', color: '#C8A84B' }}>S</span>
                      <span className="font-cormorant block italic" style={{ fontSize: '1.5rem', color: 'rgba(200,168,75,0.6)', lineHeight: 1 }}>&</span>
                      <span className="font-cinzel-deco block leading-none" style={{ fontSize: '3.8rem', color: '#C8A84B' }}>A</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.2 }} className="text-center mt-8 mb-10">
                  <p className="font-rajdhani" style={{ fontSize: 9, letterSpacing: '0.8em', textTransform: 'uppercase', color: '#C8A84B' }}>Visol Bazmi</p>
                  <p className="font-rajdhani mt-2" style={{ fontSize: 8, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(232,224,208,0.35)' }}>15 . 05 . 2026</p>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                  className="flex items-center gap-3 px-10 py-4 hover:bg-[rgba(200,168,75,0.08)] transition-all duration-500"
                  style={{ border: '0.5px solid rgba(200,168,75,0.5)' }}>
                  <Play size={12} color="#C8A84B" />
                  <span className="font-rajdhani" style={{ fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: '#C8A84B' }}>Taklifnomani Ochish</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MUSIC BTN */}
        {isStarted && (
          <motion.button onClick={toggleMusic} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed bottom-8 right-6 z-[150] w-12 h-12 flex items-center justify-center rounded-full active:scale-95 transition-transform"
            style={{ background: 'rgba(13,13,13,0.9)', border: '0.5px solid rgba(200,168,75,0.4)', backdropFilter: 'blur(20px)' }}>
            {isPlaying ? <Disc className="animate-spin" size={18} color="#C8A84B" style={{ animationDuration: '4s' }} /> : <Play size={14} color="#C8A84B" style={{ marginLeft: 2 }} />}
          </motion.button>
        )}

        {/* MAIN */}
        {isStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>

            {/* === HERO === */}
            <section className="relative flex flex-col items-center justify-center text-center px-8 py-24" style={{ minHeight: '100svh', background: '#050505' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="absolute rounded-full pointer-events-none" style={{
                  width: 180 + i * 80, height: 180 + i * 80,
                  left: `${[10, 60, 30, 70][i]}%`, top: `${[20, 60, 70, 15][i]}%`,
                  background: '#C8A84B', filter: 'blur(80px)', opacity: 0.025,
                }} />
              ))}

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="font-rajdhani" style={{ fontSize: 8, letterSpacing: '0.8em', textTransform: 'uppercase', color: '#C8A84B', marginBottom: 56 }}>
                Oila Qurish Tantanasi
              </motion.p>

              <div className="relative w-full">
                <div className="overflow-hidden">
                  <motion.h1 initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="font-cinzel text-left" style={{ fontSize: 'clamp(3rem,12vw,5rem)', color: '#E8E0D0', letterSpacing: '0.12em', lineHeight: 1, fontWeight: 400 }}>
                    SARDOR
                  </motion.h1>
                </div>

                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.6 }}
                  style={{
                    height: 1, marginTop: 20, marginBottom: 20, transformOrigin: 'left',
                    background: 'linear-gradient(90deg, transparent, #C8A84B 20%, #F0E0A0 50%, #C8A84B 80%, transparent)'
                  }} />

                <div className="overflow-hidden">
                  <motion.h1 initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="font-cinzel text-right" style={{ fontSize: 'clamp(3rem,12vw,5rem)', color: '#E8E0D0', letterSpacing: '0.12em', lineHeight: 1, fontWeight: 400 }}>
                    AMIRA
                  </motion.h1>
                </div>
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                className="flex items-center gap-5 mt-16">
                <div style={{ height: 0.5, width: 50, background: 'rgba(200,168,75,0.5)' }} />
                <p className="font-rajdhani" style={{ fontSize: 11, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(232,224,208,0.6)' }}>Май 15 · 2026</p>
                <div style={{ height: 0.5, width: 50, background: 'rgba(200,168,75,0.5)' }} />
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
                className="absolute flex flex-col items-center gap-1" style={{ bottom: 36 }}>
                <motion.div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(200,168,75,0.6), transparent)' }}
                  animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
              </motion.div>
            </section>

            {/* === LETTER === */}
            <section className="py-24 px-6 relative" style={{ background: '#0D0D0D' }}>
              {[['top-0 left-0', 'left-3 top-3'], ['top-0 right-0', 'right-3 top-3'], ['bottom-0 left-0', 'left-3 bottom-3'], ['bottom-0 right-0', 'right-3 bottom-3']].map(([pos, accent], i) => (
                <div key={i} className={`absolute ${pos} w-14 h-14 pointer-events-none`}>
                  <div className={`absolute ${accent} h-8`} style={{ width: 0.5, background: 'rgba(200,168,75,0.4)' }} />
                  <div className={`absolute ${accent} w-8`} style={{ height: 0.5, background: 'rgba(200,168,75,0.4)' }} />
                </div>
              ))}

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
                className="max-w-[340px] mx-auto text-center">
                <p className="font-rajdhani mb-8" style={{ fontSize: 8, letterSpacing: '0.7em', textTransform: 'uppercase', color: '#C8A84B' }}>Qadrli Mehmonlarimiz</p>
                <DiamondDivider />
                <p className="font-cormorant italic px-2 mt-8 mb-6" style={{ fontSize: 17, color: 'rgba(232,224,208,0.75)', lineHeight: 2.4 }}>
                  "Ikkimizning hayotimizning eng yorqin kuni — bu gul muborak kunni sizni ham sevinchamizga sherik qilishni istardik."
                </p>
                <p className="font-cinzel my-8" style={{ fontSize: 13, color: '#C8A84B', letterSpacing: '0.3em' }}>SARDORJON & AMIRAXON</p>
                <p className="font-cormorant italic px-2 mb-8" style={{ fontSize: 17, color: 'rgba(232,224,208,0.75)', lineHeight: 2.4 }}>
                  "visol to'yimizni chin dildan chiqadigan muborakbadulaingiz va duolaringiz bilan bezashingizni so'raymiz."
                </p>
                <DiamondDivider />
              </motion.div>
            </section>

            {/* === PROGRAM === */}
            <section className="py-24 px-8" style={{ background: '#050505' }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
                <p className="font-rajdhani mb-4" style={{ fontSize: 8, letterSpacing: '0.7em', textTransform: 'uppercase', color: '#C8A84B' }}>Tantana Dasturi</p>
                <h2 className="font-cinzel" style={{ fontSize: '1.8rem', color: '#E8E0D0', letterSpacing: '0.25em' }}>OQSHOM TARTIBI</h2>
              </motion.div>

              <div className="max-w-[340px] mx-auto">
                {[
                  { time: '14:00', event: 'ZAGS Marosimi', desc: "Rasmiy ro'yxatdan o'tish" },
                  { time: '17:30', event: 'Welcome Reception', desc: 'Jonli musiqa, kechki shamol' },
                  { time: '18:00', event: 'Asosiy Bazm', desc: '"Versal" Saroyi' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                    className="flex gap-6 py-7" style={{ borderBottom: i < 2 ? '0.5px solid rgba(200,168,75,0.12)' : 'none' }}>
                    <div className="flex flex-col items-center" style={{ paddingTop: 4 }}>
                      <div className="rounded-full" style={{ width: 8, height: 8, background: '#C8A84B', boxShadow: '0 0 12px rgba(200,168,75,0.6)' }} />
                      {i < 2 && <div style={{ width: 0.5, flex: 1, background: 'rgba(200,168,75,0.25)', marginTop: 6 }} />}
                    </div>
                    <div>
                      <p className="font-rajdhani leading-none mb-2" style={{ fontSize: 22, color: '#C8A84B', letterSpacing: '0.1em', fontWeight: 300 }}>{item.time}</p>
                      <p className="font-cinzel mb-1" style={{ fontSize: 12, color: '#E8E0D0', letterSpacing: '0.2em' }}>{item.event}</p>
                      <p className="font-cormorant italic" style={{ fontSize: 15, color: 'rgba(232,224,208,0.4)' }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* === VENUE === */}
            <section className="py-24 px-6" style={{ background: '#0D0D0D' }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-[340px] mx-auto">
                <div className="text-center p-10 relative" style={{ border: '0.5px solid rgba(200,168,75,0.3)' }}>
                  <div className="absolute" style={{ inset: 8, border: '0.5px solid rgba(200,168,75,0.12)', pointerEvents: 'none' }} />
                  <MapPin size={22} color="#C8A84B" style={{ margin: '0 auto 24px', opacity: 0.7 }} />
                  <h3 className="font-cinzel mb-6" style={{ fontSize: 17, color: '#E8E0D0', letterSpacing: '0.35em' }}>MANZIL</h3>
                  <p className="font-cormorant italic mb-6" style={{ fontSize: 16, color: 'rgba(232,224,208,0.65)', lineHeight: 1.8 }}>
                    Toshkent shahri, Yunusobod tumani,<br />
                    <span className="font-cormorant not-italic" style={{ color: '#E8E0D0', fontWeight: 500 }}>"Versal" Saroyi</span>
                  </p>
                  <a href="#" className="font-rajdhani inline-block px-8 py-3 transition-all duration-400 hover:opacity-70"
                    style={{ border: '0.5px solid rgba(200,168,75,0.5)', fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#C8A84B' }}>
                    Xaritada Ochish
                  </a>
                </div>
              </motion.div>
            </section>

            {/* === RSVP === */}
            <section className="py-24 px-6" style={{ background: '#050505' }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-[340px] mx-auto text-center">
                <p className="font-rajdhani mb-4" style={{ fontSize: 8, letterSpacing: '0.7em', textTransform: 'uppercase', color: '#C8A84B' }}>Tashrif Tasdig'i</p>
                <h3 className="font-cinzel mb-12" style={{ fontSize: '1.6rem', color: '#E8E0D0', letterSpacing: '0.3em' }}>RSVP</h3>

                <div className="p-8" style={{ border: '0.5px solid rgba(200,168,75,0.2)' }}>
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="form" exit={{ opacity: 0 }} className="space-y-6">
                        <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                          placeholder="Ism-sharifingiz"
                          className="font-cormorant italic w-full text-center py-3 focus:outline-none transition-colors bg-transparent"
                          style={{
                            fontSize: 19, color: '#E8E0D0', borderBottom: '0.5px solid rgba(200,168,75,0.35)',
                            '::placeholder': 'color: rgba(232,224,208,0.2)'
                          } as any} />
                        <div className="space-y-3 pt-3">
                          <button onClick={() => handleRSVP('attending')} disabled={isSubmitting}
                            className="font-rajdhani w-full flex justify-center items-center transition-colors duration-300"
                            style={{ height: 48, background: '#C8A84B', color: '#050505', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Quvonch bilan boraman'}
                          </button>
                          <button onClick={() => handleRSVP('declined')} disabled={isSubmitting}
                            className="font-rajdhani w-full flex justify-center items-center transition-all duration-300 hover:border-[#C8A84B]"
                            style={{ height: 48, border: '0.5px solid rgba(200,168,75,0.25)', color: 'rgba(232,224,208,0.45)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Afsuski, bora olmayman'}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 flex flex-col items-center">
                        <CheckCircle size={48} color="#C8A84B" style={{ marginBottom: 16 }} />
                        <p className="font-cormorant italic" style={{ fontSize: 22, color: '#E8E0D0' }}>Rahmat!</p>
                        <p className="font-rajdhani mt-2" style={{ fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(200,168,75,0.6)' }}>Javobingiz qabul qilindi</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>

            {/* === COUNTDOWN === */}
            <section className="py-28 px-6 text-center" style={{ background: '#0D0D0D' }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <p className="font-cormorant italic mb-14" style={{ fontSize: 28, color: 'rgba(200,168,75,0.6)' }}>Bayramga qadar...</p>
                <div className="flex justify-center gap-3">
                  {[{ l: 'KUN', v: timeLeft.kun }, { l: 'SOAT', v: timeLeft.soat }, { l: 'DAQIQA', v: timeLeft.daqiqa }, { l: 'SONIYA', v: timeLeft.soniya }].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="flex flex-col items-center py-5" style={{ width: 64, border: '0.5px solid rgba(200,168,75,0.2)' }}>
                      <span className="font-cinzel" style={{ fontSize: 28, color: '#C8A84B', textShadow: '0 0 20px rgba(200,168,75,0.35)', fontWeight: 500 }}>
                        {item.v.toString().padStart(2, '0')}
                      </span>
                      <span className="font-rajdhani mt-2" style={{ fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(232,224,208,0.3)' }}>{item.l}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* === CLOSE === */}
            <section className="py-32 px-6 text-center relative overflow-hidden" style={{ background: '#050505' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(200,168,75,0.04) 0%, transparent 70%)' }} />
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative z-10">
                <DiamondDivider />
                <p className="font-cormorant italic max-w-[260px] mx-auto my-10" style={{ fontSize: 17, color: 'rgba(232,224,208,0.55)', lineHeight: 2 }}>
                  "Baxtimiz sizning ishtiro­kingiz bilan kamolga yetadi."
                </p>
                <h2 className="font-cinzel-deco" style={{ fontSize: '2.5rem', color: '#C8A84B', letterSpacing: '0.35em' }}>S & A</h2>
                <DiamondDivider />
              </motion.div>
            </section>

            <footer className="py-8 text-center" style={{ background: '#0D0D0D', borderTop: '0.5px solid rgba(200,168,75,0.1)' }}>
              <p className="font-rajdhani" style={{ fontSize: 8, letterSpacing: '0.6em', textTransform: 'uppercase', color: 'rgba(200,168,75,0.5)' }}>
                Designed by <Link href="https://webleaders.uz" className="hover:opacity-80 transition-opacity">WebLeaders</Link>
              </p>
            </footer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NoirWedding;