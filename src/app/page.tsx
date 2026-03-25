"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { MapPin, Camera, GlassWater, Utensils, Disc, Pause, Play, Heart, CreditCard, Sparkles, AlertCircle, Quote, Image as ImageIcon, Gift } from 'lucide-react';

// --- 1. TILLA ZARRACHALAR (Butun sayt bo'ylab yog'ilib turadi) ---
const GoldDust = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden mix-blend-screen">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-[#D4AF37] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [0, -Math.random() * 200 - 50],
            x: [0, Math.random() * 60 - 30],
            opacity: [0, Math.random() * 0.8 + 0.2, 0],
          }}
          transition={{
            duration: Math.random() * 12 + 8,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const CinematicMobileWedding: NextPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => console.log("Musiqa yuklanmadi."));
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const [timeLeft, setTimeLeft] = useState({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
  const targetDate = new Date('2026-05-15T18:00:00').getTime();

  useEffect(() => {
    if (!isStarted) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          kun: Math.floor(distance / (1000 * 60 * 60 * 24)),
          soat: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          daqiqa: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          soniya: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isStarted]);

  const fadeUp: any = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.25 } }
  };

  return (
    // ASOSIY FON: O'ta to'q kinematografik fon (Deep Dark Mode)
    <div className="bg-[#050505] min-h-screen flex justify-center selection:bg-[#C5A059] selection:text-white">
      <div className="w-full max-w-[430px] bg-[#0a0a0a] text-white font-sans relative overflow-x-hidden shadow-2xl">

        <Head>
          <title>Sardor & Amira | Cinematic Wedding</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Alex+Brush&family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
        </Head>

        <audio ref={audioRef} loop preload="auto">
          <source src="/die.mp3" type="audio/mpeg" />
        </audio>

        {/* --- 0. SUPER PREMIUM SPLASH EKRAN --- */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-[#050505]"
              exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-[url('/1.jpg')] bg-cover bg-center opacity-30 filter brightness-[0.3] contrast-125"></div>

              <motion.div className="relative z-10 flex flex-col items-center cursor-pointer group" onClick={handleStart}>
                {/* 3D Wax Seal */}
                <motion.div
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#B58B4C] to-[#5c4724] p-1 shadow-[0_0_50px_rgba(212,175,55,0.3)] flex items-center justify-center relative"
                  animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 30px rgba(212,175,55,0.2)", "0 0 70px rgba(212,175,55,0.5)", "0 0 30px rgba(212,175,55,0.2)"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="w-full h-full rounded-full border-[2px] border-white/20 flex items-center justify-center bg-gradient-to-tl from-black/40 to-transparent">
                    <div className="text-center mt-2">
                      <span className="font-['Playfair_Display'] text-5xl text-white font-medium drop-shadow-lg">S</span>
                      <span className="font-['Alex_Brush'] text-4xl text-[#D4AF37] mx-2 drop-shadow-md">&</span>
                      <span className="font-['Playfair_Display'] text-5xl text-white font-medium drop-shadow-lg">A</span>
                    </div>
                  </div>
                </motion.div>

                <p className="mt-12 font-['Playfair_Display'] text-[#C5A059] italic text-2xl tracking-wider opacity-90">Kutish lahzalari tugadi</p>
                <div className="mt-8 flex items-center gap-3 bg-white/5 backdrop-blur-md border border-[#D4AF37]/30 px-8 py-4 rounded-full font-['Montserrat'] text-[10px] tracking-[0.4em] uppercase text-white hover:bg-white/10 transition-all shadow-lg">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Taklifnomani Ochish
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ASOSIY SAYT KONTENTI --- */}
        {isStarted && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10">

            <GoldDust />

            {/* FLOATING PLEYER */}
            <motion.button
              onClick={toggleMusic}
              className="fixed bottom-6 right-6 z-[150] w-12 h-12 bg-black/60 backdrop-blur-xl border border-[#C5A059]/40 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)]"
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? (
                <Disc className="text-[#C5A059] w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
              ) : (
                <Play className="text-[#C5A059] w-4 h-4 ml-1" />
              )}
            </motion.button>

            {/* 1. CINEMATIC HERO SECTION */}
            <section className="relative h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
              <motion.div className="absolute inset-0 z-0" animate={{ scale: [1, 1.15] }} transition={{ duration: 30, repeat: Infinity, repeatType: "mirror", ease: "linear" }}>
                <img src="/dreamwedding.jpg" alt="Couple" className="w-full h-full object-cover object-top filter brightness-[0.4] contrast-125 saturate-50" />
              </motion.div>

              <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-transparent to-[#0a0a0a] pointer-events-none"></div>

              <motion.div variants={fadeUp} className="relative z-20 flex flex-col items-center justify-center w-[88%] h-[75svh]">
                {/* Tilla chiziqlar */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent to-[#C5A059]/70"></div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-t from-transparent to-[#C5A059]/70"></div>

                {/* Shisha Panel (Glassmorphism) */}
                <div className="w-full h-full border border-white/10 bg-black/20 backdrop-blur-md rounded-[2.5rem] p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col justify-center items-center relative overflow-hidden">

                  {/* Animatsiyali burchaklar */}
                  <motion.div className="absolute top-5 left-5 w-8 h-8 border-t-[1px] border-l-[1px] border-[#C5A059] opacity-70" animate={{ x: [0, -4, 0], y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div className="absolute top-5 right-5 w-8 h-8 border-t-[1px] border-r-[1px] border-[#C5A059] opacity-70" animate={{ x: [0, 4, 0], y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div className="absolute bottom-5 left-5 w-8 h-8 border-b-[1px] border-l-[1px] border-[#C5A059] opacity-70" animate={{ x: [0, -4, 0], y: [0, 4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div className="absolute bottom-5 right-5 w-8 h-8 border-b-[1px] border-r-[1px] border-[#C5A059] opacity-70" animate={{ x: [0, 4, 0], y: [0, 4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

                  {/* Sana */}
                  <div className="absolute top-12 flex flex-col items-center gap-2 opacity-90">
                    <span className="font-['Montserrat'] tracking-[0.4em] text-[9px] text-[#C5A059] font-medium uppercase">15 May</span>
                    <div className="w-12 h-[1px] bg-[#C5A059]/40"></div>
                    <span className="font-['Montserrat'] tracking-[0.4em] text-[9px] text-[#C5A059] font-medium uppercase">2026</span>
                  </div>

                  {/* Typography */}
                  <div className="text-center w-full relative z-30 mt-10">
                    <p className="font-['Montserrat'] tracking-[0.5em] text-[8px] text-white/60 font-medium uppercase mb-6">Nikoh Oqshomi</p>
                    <h1 className="font-['Playfair_Display'] text-[4.5rem] text-white leading-[0.85] drop-shadow-2xl">Sardor</h1>
                    <div className="font-['Alex_Brush'] text-[5rem] text-[#D4AF37] my-[-25px] drop-shadow-lg rotate-[-8deg] relative z-10">va</div>
                    <h1 className="font-['Playfair_Display'] text-[4.5rem] text-white leading-[0.85] drop-shadow-2xl mt-2">Amira</h1>
                  </div>

                  {/* Skroll Indicator */}
                  <div className="absolute bottom-8 flex flex-col items-center gap-4">
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-[1px] h-12 bg-gradient-to-b from-[#C5A059] to-transparent" />
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 2. BIZNING HIKOYA (Yangi Cinematic Bo'lim) */}
            <section className="py-24 px-6 relative z-10 bg-[#0a0a0a]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="text-center relative">
                <Quote className="w-10 h-10 text-[#C5A059] mx-auto mb-6 opacity-30 transform rotate-180" />
                <h2 className="font-['Playfair_Display'] text-3xl text-white mb-6">Bizning Hikoya</h2>
                <div className="w-10 h-[1px] bg-[#C5A059]/50 mx-auto mb-8"></div>
                <p className="font-['Montserrat'] text-[12px] text-gray-400 font-light leading-loose max-w-[320px] mx-auto text-justify text-center">
                  "Hamma narsa tasodifdan boshlandi. O'sha kuni boshlangan oddiy suhbat, butun umrlik hamrohlikka aylanishini tasavvur ham qilmagandik. Oradan yillar o'tib, biz nafaqat do'st, balki bir-birini qadrlaydigan juftlikka aylandik."
                </p>
                <Quote className="w-10 h-10 text-[#C5A059] mx-auto mt-6 opacity-30" />
              </motion.div>
            </section>

            {/* 3. OTA-ONALAR LUTFI (Dark Glassmorphism) */}
            <section className="py-20 px-5 relative z-10 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="relative">
                {/* Shisha quti */}
                <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 relative shadow-2xl rounded-3xl border border-white/10 overflow-hidden">
                  {/* Orqa fon porlashi */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#C5A059] rounded-full opacity-[0.05] blur-3xl"></div>

                  <div className="relative z-10 text-center py-2">
                    <img src="/dd.jpg" alt="Orn" className="w-14 mx-auto mb-8 opacity-60 filter invert" />
                    <p className="font-['Montserrat'] text-[8px] tracking-[0.4em] text-[#C5A059] uppercase mb-10 font-bold">Lutfan Taklif Etamiz</p>

                    <div className="flex flex-col items-center gap-2 mb-10">
                      <h2 className="font-['Playfair_Display'] text-3xl font-medium text-white tracking-wide">Ikromovlar</h2>
                      <span className="font-['Alex_Brush'] text-[#C5A059] text-3xl">va</span>
                      <h2 className="font-['Playfair_Display'] text-3xl font-medium text-white tracking-wide">Aliyevlar</h2>
                    </div>

                    <p className="font-['Playfair_Display'] text-[15px] text-gray-400 leading-[2.2] italic px-1">
                      Farzandlarimizning hayotidagi eng quvonchli onlar — <strong className="font-medium text-white not-italic">Nikoh Oqshomida</strong> sizni aziz mehmonimiz sifatida ko'rishdan baxtiyormiz.
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 4. TANTANA DASTURI (Glowing Timeline) */}
            <section className="py-24 px-6 relative z-10 bg-[#111]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
                <h2 className="font-['Playfair_Display'] text-4xl text-white mb-3">Tantana Dasturi</h2>
                <p className="font-['Montserrat'] text-[9px] uppercase tracking-widest text-[#C5A059]">Oqshom xronologiyasi</p>
              </motion.div>

              <div className="relative flex flex-col items-center">
                {/* Yonib turuvchi tilla chiziq */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#111] via-[#C5A059] to-[#111] shadow-[0_0_15px_rgba(197,160,89,0.5)]"></div>

                {/* Event 1 */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative w-full flex flex-col items-center text-center mb-16">
                  <div className="w-12 h-12 bg-black border border-[#C5A059]/50 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)] relative z-10 mb-5">
                    <Camera className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl w-[90%] max-w-[320px]">
                    <p className="font-['Playfair_Display'] italic text-3xl text-[#C5A059] mb-2">14:00</p>
                    <h3 className="font-['Playfair_Display'] text-2xl text-white mb-2">ZAGS va Fotosessiya</h3>
                    <p className="font-['Montserrat'] text-[11px] text-gray-400 font-light leading-relaxed">Botanika Bog'ining markaziy favvorasi atrofida.</p>
                  </div>
                </motion.div>

                {/* Event 2 */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative w-full flex flex-col items-center text-center mb-16">
                  <div className="w-12 h-12 bg-black border border-[#C5A059]/50 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)] relative z-10 mb-5">
                    <GlassWater className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl w-[90%] max-w-[320px]">
                    <p className="font-['Playfair_Display'] italic text-3xl text-[#C5A059] mb-2">17:30</p>
                    <h3 className="font-['Playfair_Display'] text-2xl text-white mb-2">Welcome Drink</h3>
                    <p className="font-['Montserrat'] text-[11px] text-gray-400 font-light leading-relaxed">Jonli musiqa ostida yengil ichimliklar tortig'i.</p>
                  </div>
                </motion.div>

                {/* Event 3 */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="relative w-full flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-[#C5A059] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(197,160,89,0.6)] relative z-10 mb-5">
                    <Utensils className="w-6 h-6 text-black" />
                  </div>
                  <div className="bg-gradient-to-br from-[#2a2a2a] to-[#111] border border-[#C5A059]/30 p-6 rounded-2xl w-[90%] max-w-[320px] shadow-2xl">
                    <p className="font-['Playfair_Display'] italic text-3xl text-[#C5A059] mb-2 font-semibold">18:00</p>
                    <h3 className="font-['Playfair_Display'] text-3xl text-white mb-3">Asosiy Bazm</h3>
                    <p className="font-['Playfair_Display'] text-lg text-white/90">"Versal" Saroyi</p>
                    <p className="font-['Montserrat'] text-[10px] text-gray-500 mt-2">Yunusobod tumani, Bog'ishamol 12.</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* 5. ATMOSFERA / GALEREYA (Yangi Bo'lim) */}
            <section className="py-20 px-5 bg-[#050505]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
                <h2 className="font-['Playfair_Display'] text-3xl text-white mb-3">Kechki Atmosfera</h2>
                <div className="w-8 h-[1px] bg-[#C5A059] mx-auto"></div>
              </motion.div>
              <div className="grid grid-cols-2 gap-3">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="h-48 bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative group">
                  <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop" alt="Vibe 1" className="w-full h-full object-cover opacity-60 filter grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="h-48 bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative group mt-6">
                  <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop" alt="Vibe 2" className="w-full h-full object-cover opacity-60 filter grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                </motion.div>
              </div>
            </section>

            {/* 6. DRESS CODE & MUHIM ESLATMALAR (Dark Glass Cards) */}
            <section className="py-20 px-5 bg-gradient-to-b from-[#050505] to-[#111] relative z-10">
              <div className="space-y-6">

                {/* Eslatmalar */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-lg text-center">
                  <AlertCircle className="w-6 h-6 text-[#C5A059] mx-auto mb-5" />
                  <h3 className="font-['Playfair_Display'] text-2xl text-white mb-5">Muhim Eslatmalar</h3>
                  <ul className="text-left space-y-5 font-['Montserrat'] text-[11px] text-gray-400 font-light">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mt-1.5 shrink-0 shadow-[0_0_5px_#C5A059]"></div>
                      <p><strong className="text-white font-medium">Dress-code:</strong> Oqshom palitramizga mos qora, to'q ko'k va bej rangli kechki liboslarda tashrif buyurishingizni so'raymiz.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mt-1.5 shrink-0 shadow-[0_0_5px_#C5A059]"></div>
                      <p><strong className="text-white font-medium">Unplugged:</strong> ZAGS vaqtida telefonlardan foydalanmasligingizni iltimos qilamiz.</p>
                    </li>
                  </ul>
                </motion.div>

                {/* Logistika & Karta */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-lg text-center">
                  <MapPin className="w-6 h-6 text-[#C5A059] mx-auto mb-4" />
                  <h3 className="font-['Playfair_Display'] text-2xl text-white mb-4">Lokatsiya</h3>
                  <p className="font-['Montserrat'] text-[11px] text-gray-400 font-light leading-relaxed mb-6">
                    Toshkent Teleminorasi ro'parasidan o'ngga burilishda. Restoran hududida maxsus xavfsiz avtoturargoh mavjud.
                  </p>
                  <a href="https://maps.google.com" target="_blank" className="inline-block w-full py-4 bg-[#C5A059]/10 border border-[#C5A059]/50 text-[#C5A059] rounded-full font-['Montserrat'] text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-[#C5A059] hover:text-black transition-colors">
                    Xaritada Ochish
                  </a>
                </motion.div>
              </div>
            </section>

            {/* 7. TO'YONA (Black Card Design) */}
            <section className="py-20 px-5 bg-[#111] relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <Gift className="w-8 h-8 text-[#C5A059] mx-auto mb-5" />
                <h3 className="font-['Playfair_Display'] text-3xl text-white mb-4">To'yona</h3>
                <p className="font-['Montserrat'] text-[11px] text-gray-400 font-light leading-relaxed mb-10 max-w-[300px] mx-auto">
                  Sizning e'tiboringiz — biz uchun eng oliy hadyadir. Agar yosh oilaning yangi hayotiga hissa qo'shishni niyat qilsangiz, quyidagi hisob raqamidan foydalanishingiz mumkin.
                </p>

                {/* Black Card Glassmorphism */}
                <div className="bg-gradient-to-br from-[#222] to-black p-6 rounded-2xl relative text-left shadow-[0_15px_30px_rgba(0,0,0,0.8)] border border-white/10 w-[95%] mx-auto overflow-hidden group">
                  {/* Tilla porlash */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C5A059] rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>

                  <CreditCard className="w-8 h-8 text-[#C5A059] mb-8 relative z-10 opacity-80" />

                  <p className="font-sans text-white tracking-[0.25em] text-[18px] font-medium mb-3 relative z-10 drop-shadow-md">
                    8600 1234 5678 9012
                  </p>

                  <div className="flex justify-between items-center relative z-10 border-t border-white/10 pt-3">
                    <p className="font-['Montserrat'] text-[10px] text-white/80 uppercase tracking-widest font-medium">Sardor Ikromov</p>
                    <p className="font-['Montserrat'] text-[8px] text-[#C5A059] uppercase tracking-widest font-bold">Uzcard</p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 8. TAYMER (Dark Glass Mode) */}
            <section className="py-24 bg-gradient-to-b from-[#111] to-[#050505] px-5 text-center relative z-10">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-['Alex_Brush'] text-5xl text-[#C5A059] mb-12 drop-shadow-lg">
                Baxtli onlargacha...
              </motion.h2>

              <div className="flex justify-center gap-3">
                {[
                  { label: 'Kun', value: timeLeft.kun },
                  { label: 'Soat', value: timeLeft.soat },
                  { label: 'Daqiqa', value: timeLeft.daqiqa },
                  { label: 'Soniya', value: timeLeft.soniya }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }}
                    className="w-[72px] h-[85px] bg-white/5 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                  >
                    <span className="font-['Playfair_Display'] text-[28px] text-white font-medium leading-none mb-2">{item.value.toString().padStart(2, '0')}</span>
                    <span className="font-['Montserrat'] text-[7px] tracking-[0.2em] uppercase text-[#C5A059] font-semibold">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 9. XOTIMA */}
            <section className="py-20 bg-[#050505] text-center px-6 relative z-10 overflow-hidden">
              <Heart className="w-8 h-8 text-[#C5A059] mx-auto mb-8 opacity-70 filter drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]" />
              <p className="font-['Playfair_Display'] text-xl text-white/80 italic max-w-[280px] mx-auto leading-relaxed mb-10">
                "Sizning ishtirokingiz bizning kunimizni mukammal qiladi."
              </p>
              <div className="font-['Alex_Brush'] text-[3.5rem] text-[#C5A059] drop-shadow-md">S & A</div>
            </section>

            {/* FOOTER */}
            <footer className="py-8 text-center bg-black relative z-10 border-t border-white/5">
              <p className="font-['Montserrat'] text-[8px] tracking-[0.4em] text-gray-500 uppercase">
                Premium Design by <span className="text-[#C5A059] font-medium tracking-widest">WebLeaders</span>
              </p>
            </footer>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CinematicMobileWedding;