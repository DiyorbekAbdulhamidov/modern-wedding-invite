"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, Disc, MapPin, Camera, GlassWater, Utensils, Heart, AlertCircle, Sparkles, BookHeart, Users, CheckCircle } from 'lucide-react';

// --- 1. MUKAMMAL, REALISTIK KABUTAR SVG (Never Break) ---
const RealisticDoveSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    {/* Ko'p qatlamli va detallashgan, haqiqiy kabutar qanotlari va tana shakli */}
    <path d="M504.5 129.2c-3.1-6.1-9.9-9.2-16.5-7.5l-92.4 23.1C359 153.8 318.1 160 276.5 160c-25.9 0-51.7-2.9-77-8.6l-50.6-11.2c-7.3-1.6-14.7.7-19.8 6.1l-60 63.8c-7.5 7.9-6.4 20.8 2.4 27.2l87.2 62.7 5.8 54.1c.8 7.6 6.1 14 13.5 16.3l61 18.6c11.5 3.5 23.4-3.7 25.7-15.5l14.9-74.6 30.6-13.8c31.3-14.1 60.1-33.1 85.3-56.4l57.2-52.7c6.3-5.8 8.1-15.1 4.5-22.7zM129.5 259.9l-61.9-44.5c-6.8-4.9-16.1-3.6-21.3 2.9l-38.6 47.9c-5.5 6.8-4.2 16.8 2.9 22.1l74.1 55.6c8 6 19.3 4.2 25.1-3.9l20.4-28.5c4-5.6 3-13.3-2.2-17.7z" />
  </svg>
);

const FlappingDove = ({ delay, positionClass, flip }: { delay: number, positionClass: string, flip?: boolean }) => (
  <motion.div
    className={`fixed z-[150] w-14 h-14 text-[#C5A059] drop-shadow-[0_8px_15px_rgba(197,160,89,0.3)] pointer-events-none ${positionClass}`}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 0.9, scale: 1 }}
    transition={{ duration: 2.5, delay, ease: [0.25, 1, 0.5, 1] }}
  >
    {/* Tana harakati (Havoda muallaq turish) */}
    <motion.div animate={{ y: [0, -18, 0], rotateZ: flip ? [-2, 2, -2] : [2, -2, 2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
      {/* Qanot qoqish illyuziyasi (ScaleY va 3D Rotate) */}
      <motion.div
        animate={{ scaleY: [1, 0.4, 1], rotateX: [0, 15, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
        className={`w-full h-full ${flip ? 'scale-x-[-1]' : ''}`}
      >
        <RealisticDoveSVG className="w-full h-full" />
      </motion.div>
    </motion.div>
  </motion.div>
);

const DelicateGoldDust = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.04]"
    style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', backgroundSize: '35px 35px' }}>
  </div>
);

const MaximumEditorialWedding: NextPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => console.log("Music failed."));
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
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isStarted]);

  const fadeUp: any = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 1, 0.5, 1] } }
  };
  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen flex justify-center selection:bg-[#C5A059] selection:text-white font-sans selection:bg-[#C5A059] selection:text-white overflow-hidden">
      <div className="w-full max-w-[480px] bg-[#FFFFFF] text-[#111111] relative overflow-x-hidden shadow-[0_0_60px_rgba(0,0,0,0.08)] border-x border-gray-100/50">

        <Head>
          <title>Sardor & Amira | Grand Editorial Wedding</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Alex+Brush&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </Head>

        <audio ref={audioRef} loop preload="auto">
          <source src="/die.mp3" type="audio/mpeg" />
        </audio>

        {/* --- 0. SPLASH EKRAN --- */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-[#FFFFFF]"
              exit={{ opacity: 0, y: "-100%" }}
              transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
            >
              <div className="absolute inset-0 bg-[#FFFFFF] opacity-50 bg-[url('https://www.transparenttextures.com/patterns/clean-text-pattern.png')] pointer-events-none"></div>
              <motion.div className="relative z-10 flex flex-col items-center cursor-pointer group" onClick={handleStart}>
                <div className="w-[0.5px] h-20 bg-gradient-to-b from-transparent to-[#C5A059] mb-12 animate-pulse"></div>

                <motion.div
                  className="relative p-14 mb-14"
                  animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 6, repeat: Infinity }}
                >
                  <div className="absolute inset-0 border-[0.5px] border-[#C5A059] rounded-full scale-110 opacity-60"></div>
                  <div className="text-center relative z-10">
                    <span className="font-['Playfair_Display'] text-[4rem] text-[#111] leading-none">S</span>
                    <span className="font-['Great_Vibes'] text-[3.5rem] text-[#C5A059] mx-2 leading-none">&</span>
                    <span className="font-['Playfair_Display'] text-[4rem] text-[#111] leading-none">A</span>
                  </div>
                </motion.div>

                <p className="mt-8 font-['Montserrat'] text-[9px] tracking-[0.5em] uppercase text-gray-400">Hayotning ushbu oqshomida</p>
                <div className="mt-14 flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                  <p className="font-['Montserrat'] text-[8px] tracking-[0.3em] uppercase">Ochish uchun bosing</p>
                  <div className="w-3 h-3 border-b-2 border-r-2 border-[#C5A059] rotate-45 animate-bounce"></div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ASOSIY SAYT KONTENTI --- */}
        {isStarted && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10">

            <DelicateGoldDust />

            {/* JONLI HAQIYQIY KABUTARLAR */}
            <FlappingDove delay={0} positionClass="top-[15%] left-[-15px] lg:left-5" flip={true} />
            <FlappingDove delay={0.5} positionClass="top-[45%] right-[-15px] lg:right-5" />

            {/* PLEYER */}
            <motion.button
              onClick={toggleMusic}
              className="fixed bottom-6 right-6 z-[150] w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_5px_20px_rgba(0,0,0,0.08)] border border-gray-100 active:scale-95 transition-transform"
            >
              {isPlaying ? <Disc className="text-[#C5A059] w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} /> : <Play className="text-[#C5A059] w-4 h-4 ml-1" />}
            </motion.button>

            {/* 1. HERO SECTION (Editorial Arch) */}
            <section className="relative h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#FFFFFF]">
              <div className="absolute inset-0 bg-[#FFFFFF] opacity-30 bg-[url('https://www.transparenttextures.com/patterns/clean-text-pattern.png')] pointer-events-none"></div>

              <motion.p variants={fadeUp} className="font-['Montserrat'] tracking-[0.6em] text-[8px] text-[#C5A059] font-bold uppercase mb-10 z-20">
                Oila Qurish Tantanasi
              </motion.p>

              <motion.div variants={fadeUp} className="relative w-[82%] flex-1 mb-10 z-10">
                <div className="absolute inset-0 rounded-t-[10rem] border-[0.5px] border-[#C5A059]/30 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.05)] bg-white">
                  <div className="w-full h-full rounded-t-[9.5rem] overflow-hidden relative">
                    <img src="/dreamwedding.jpg" alt="Couple" className="w-full h-full object-cover object-top filter brightness-[0.95]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="relative z-30 flex flex-col items-center mt-[-120px] w-full">
                <h1 className="font-['Playfair_Display'] text-[5.5rem] text-[#111] leading-[0.8] tracking-tighter">Sardor</h1>
                <div className="font-['Great_Vibes'] text-[4rem] text-[#C5A059] my-[-25px] relative z-10 rotate-[-5deg]">va</div>
                <h1 className="font-['Playfair_Display'] text-[5.5rem] text-[#111] leading-[0.8] tracking-tighter ml-8">Amira</h1>

                <div className="flex items-center justify-center gap-5 mt-16 w-full max-w-[280px]">
                  <div className="h-[0.5px] flex-1 bg-[#C5A059]/60"></div>
                  <p className="font-['Montserrat'] tracking-[0.4em] text-[10px] text-[#1A1A1A] font-medium">15 . 05 . 2026</p>
                  <div className="h-[0.5px] flex-1 bg-[#C5A059]/60"></div>
                </div>
              </motion.div>
            </section>

            {/* 2. HIKOYA (O'ta nozik tipografiya) */}
            <section className="py-24 px-8 relative z-10 bg-[#FAFAFA] text-center border-y border-gray-100">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center relative max-w-[340px] mx-auto">
                <p className="font-['Great_Vibes'] text-5xl text-[#C5A059] mb-10 opacity-90">Sevgi Qissasi</p>
                <p className="font-['Playfair_Display'] text-[16px] text-gray-700 leading-[2.2] italic px-2">
                  "Hamma narsa kutilmaganda boshlandi. O'sha kuni boshlangan oddiy suhbat, butun umrlik hamrohlikka, bir-birini tushunishga va buyuk muhabbatga aylanishini tasavvur ham qilmagandik..."
                </p>
                <img src="/dd.jpg" alt="ornament" className="w-12 mx-auto mt-12 opacity-50 grayscale" />
              </motion.div>
            </section>

            {/* =========================================
                3. YANGI FOTOSESSIYA BO'LIMI (Galereya)
            ========================================= */}
            <section className="py-24 px-6 bg-white relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
                <Camera className="w-8 h-8 text-[#C5A059] mx-auto mb-6 opacity-80" />
                <h2 className="font-['Playfair_Display'] text-4xl text-[#111] mb-2 tracking-wide">Fotosessiyamiz</h2>
                <div className="w-10 h-px bg-[#C5A059] mx-auto"></div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                {/* 11 ta vizual xilma-xil rasm variantlari */}
                {[
                  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400", size: "col-span-1" },
                  { src: "https://images.unsplash.com/photo-1519741497674-61132ef996abd?w=400", size: "col-span-1" },
                  { src: "/dreamwedding.jpg", size: "col-span-2 row-span-2 h-96" }, // Asosiy rasm (portret/arka)
                  { src: "https://images.unsplash.com/photo-1606490225159-8dd3392479e0?w=400", size: "col-span-1 h-52" },
                  { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400", size: "col-span-1 h-52" },
                  { src: "https://images.unsplash.com/photo-1511116223835-21d743a6549c?w=400", size: "col-span-2 aspect-[16/9]" }, // Uzoqroq plan/aka
                  { src: "https://images.unsplash.com/photo-1494707661005-4c07d3a24147?w=400", size: "col-span-1 aspect-[4/3] grayscale brightness-[1.1]" }, // Qora-oq detail
                  { src: "https://images.unsplash.com/photo-1596700030588-46c59a35e77b?w=400", size: "col-span-1 aspect-[4/3]" }, // Uzuk/ detail
                  { src: "https://images.unsplash.com/photo-1521971714394-b15f0135d943?w=400", size: "col-span-1 aspect-[1/1]" }, // Close up
                  { src: "https://images.unsplash.com/photo-1452664322475-68a86c673e44?w=400", size: "col-span-1 aspect-[1/1]" }  // Detail hand
                ].map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`${photo.size} overflow-hidden rounded-sm border-[0.5px] border-gray-100 shadow-[0_5px_15px_rgba(0,0,0,0.03)] bg-gray-50`}
                  >
                    <img src={photo.src} alt={`Photo ${index + 1}`} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* =========================================
                4. RE-IMAGINED TAKLIFNOMA (Haqiqiy Qog'oz Vizual va Samimiy Xat)
            ========================================= */}
            <section className="py-28 px-5 bg-[#FAFAFA] relative z-10 border-y border-gray-100">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
                <BookHeart className="w-7 h-7 text-[#C5A059] mx-auto mb-6 opacity-70" />
                <h2 className="font-['Playfair_Display'] text-3xl text-[#111] mb-4">Haqiqiy Taklifnoma</h2>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 50, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} className="relative max-w-[360px] mx-auto p-1 text-center">
                {/* Vizual Paper Card */}
                <div className="absolute inset-0 bg-white rounded-md shadow-[0_30px_70px_rgba(0,0,0,0.07)] border border-gray-100/50 scale-100 transform -rotate-[0.5deg]"></div>

                {/* Teksturali qog'oz vizuali (vizual fon orqali) */}
                <div className="bg-[#FFFFFF] p-12 relative z-10 rounded-md border-[0.5px] border-[#C5A059]/40 transform rotate-[0.5deg]">
                  <div className="absolute inset-2 border-[0.5px] border-[#C5A059]/20 pointer-events-none rounded-md"></div>

                  {/* Tepadagi tilla vizual ornament */}
                  <img src="/dd.jpg" alt="Ornament" className="w-16 mx-auto mb-14 opacity-80" />

                  {/* General addressing / Taklif sarlavhasi */}
                  <p className="font-['Montserrat'] text-[9px] tracking-[0.5em] text-[#C5A059] uppercase mb-16 font-semibold">Qadrli Yaqinlarimiz va Do'stlarimiz!</p>

                  {/* Chinakam Samimiy Xat ( written by a person) */}
                  <div className="font-['Playfair_Display'] text-[16px] text-gray-700 leading-[2.6] italic space-y-6 max-w-[280px] mx-auto">
                    <p>"...Chin dildan sevish va sevishish, bu — dunyodagi eng katta baxt. Hayotimizning mana shu eng chiroyli va mukammal kunida, farzandlarimiz —</p>
                    <p className="font-semibold text-black not-italic text-[1.15rem] leading-none my-6">Sardorjon va Amiraxonlar</p>
                    <p>bir-birlariga va'da berishayotganda, siz azizlarning bizning yanimizda bo'lishingiz biz uchun haqiqiy quvonch va baxtdir. Ularning oqshomini samimiy duo va tabriklar bilan bezaylik. Tashrifingiz davramiz ko'rki bo'lishi shubhasiz."</p>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 mt-20 mb-14 text-[#111111] opacity-70">
                    <p className="font-['Montserrat'] tracking-[0.4em] text-[8px] uppercase">Cheksiz hurmat bilan,</p>
                    <h2 className="font-['Playfair_Display'] text-3xl font-semibold tracking-widest my-1">Ikromovlar</h2>
                    <span className="font-['Alex_Brush'] text-[#C5A059] text-3xl rotate-[-10deg]">va</span>
                    <h2 className="font-['Playfair_Display'] text-3xl font-semibold tracking-widest">Aliyevlar</h2>
                    <p className="font-['Montserrat'] tracking-[0.4em] text-[8px] uppercase mt-1">Oila Kattalari</p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 5. TANTANA DASTURI (Dabdabali Xronologiya) */}
            <section className="py-24 px-8 bg-white relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
                <h2 className="font-['Playfair_Display'] text-3xl text-[#111] mb-4 tracking-wide">Dastur</h2>
                <div className="w-10 h-[0.5px] bg-[#C5A059] mx-auto opacity-70"></div>
              </motion.div>

              <div className="relative flex flex-col items-center max-w-[340px] mx-auto">
                <div className="absolute top-0 bottom-0 w-[0.5px] bg-[#C5A059]/40"></div>

                {[
                  { icon: Camera, time: "14:00", title: "ZAGS", desc: "Botanika Bog'ining fotosessiya joyi" },
                  { icon: GlassWater, time: "17:30", title: "Welcome Drink", desc: "Jonli musiqa ostida aperitiflar" },
                ].map((event, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative w-full flex flex-col items-center text-center mb-16 bg-white py-2">
                    <div className="w-12 h-12 bg-[#FFFFFF] border-[0.5px] border-[#C5A059]/60 rounded-full flex items-center justify-center relative z-10 mb-5 shadow-sm">
                      <event.icon className="w-5 h-5 text-[#C5A059]" />
                    </div>
                    <h3 className="font-['Playfair_Display'] text-[26px] text-[#111] mb-1">{event.time}</h3>
                    <h3 className="font-['Playfair_Display'] text-[19px] text-[#555] mb-2 italic tracking-wide">{event.title}</h3>
                    <p className="font-['Montserrat'] text-[10px] text-gray-400 tracking-wider uppercase">{event.desc}</p>
                  </motion.div>
                ))}

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative w-full flex flex-col items-center text-center bg-white py-2">
                  <div className="w-14 h-14 bg-[#111] border-[1px] border-[#C5A059] rounded-full flex items-center justify-center relative z-10 mb-5 shadow-lg">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-[32px] text-[#C5A059] mb-1 italic">18:00</h3>
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#111] mb-4 tracking-wide">Asosiy Bazm</h3>
                  <div className="border-[0.5px] border-[#C5A059]/60 px-10 py-3 bg-white">
                    <p className="font-['Playfair_Display'] text-[19px] text-[#111]">"Versal" Saroyi</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* 6. MANZIL VA LOKATSIYA (Editorial) */}
            <section className="py-24 px-6 bg-[#FAFAFA] relative z-10 border-y border-gray-100 space-y-12">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center px-4 max-w-[340px] mx-auto bg-white p-10 shadow-[0_5px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                <MapPin className="w-6 h-6 text-[#C5A059] mx-auto mb-6 opacity-80" />
                <h3 className="font-['Playfair_Display'] text-2xl text-[#111] mb-4 tracking-wide">Manzil</h3>
                <p className="font-['Montserrat'] text-[11px] text-gray-500 font-light leading-relaxed mb-8">
                  Toshkent shahri, Yunusobod tumani, Teleminora ro'parasidan o'ngga burilishda.
                </p>
                <a href="#" className="border-[0.5px] border-[#111] bg-transparent text-[#111] px-12 py-4 font-['Montserrat'] text-[9px] font-medium tracking-[0.3em] uppercase hover:bg-[#111] hover:text-white transition-colors duration-400 inline-block">
                  Xaritada Ochish
                </a>
              </motion.div>
            </section>

            {/* 7. ESLATMALAR (Samimiy) */}
            <section className="py-20 px-6 bg-white relative z-10 border-b border-gray-100">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-[340px] mx-auto bg-[#FFFFFF] p-10 shadow-inner border border-gray-100">
                <AlertCircle className="w-6 h-6 text-[#C5A059] mx-auto mb-6 opacity-60" />
                <h3 className="font-['Playfair_Display'] text-2xl text-[#111] mb-8">Eslatmalar</h3>
                <ul className="text-left space-y-6 font-['Playfair_Display'] text-[15px] text-gray-700 italic px-2 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mt-2 shrink-0 opacity-70 shadow-inner"></div>
                    <p>Bej, qora va to'q ko'k rangli liboslar so'raymiz.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mt-2 shrink-0 opacity-70 shadow-inner"></div>
                    <p>ZAGS vaqtida telefonlardan foydalanmang.</p>
                  </li>
                </ul>
              </motion.div>
            </section>

            {/* 8. TAYMER */}
            <section className="py-28 bg-[#FFFFFF] px-5 text-center relative z-10">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-['Great_Vibes'] text-[3.5rem] text-[#C5A059] mb-14 drop-shadow-sm">
                Kutish lahzalari
              </motion.h2>

              <div className="flex justify-center gap-6">
                {[
                  { label: 'Kun', value: timeLeft.kun },
                  { label: 'Soat', value: timeLeft.soat },
                  { label: 'Daqiqa', value: timeLeft.daqiqa },
                  { label: 'Soniya', value: timeLeft.soniya }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="font-['Playfair_Display'] text-[28px] text-[#111] mb-2 font-medium">{item.value.toString().padStart(2, '0')}</span>
                    <span className="font-['Montserrat'] text-[8px] tracking-[0.3em] uppercase text-gray-400">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 9. XOTIMA */}
            <section className="py-28 bg-[#FAFAFA] text-center px-6 relative z-10 border-t border-gray-100">
              <Heart className="w-6 h-6 text-[#C5A059] mx-auto mb-8 opacity-60 drop-shadow-md" />
              <p className="font-['Playfair_Display'] text-[16px] text-gray-700 italic max-w-[280px] mx-auto leading-relaxed mb-10">
                Sizning ishtirokingiz kunimizni yanada mukammal qiladi.
              </p>
              <div className="font-['Playfair_Display'] text-[3.5rem] text-[#111] leading-none tracking-wide">S & A</div>
            </section>

            {/* FOOTER */}
            <footer className="py-8 text-center bg-[#111111] relative z-10 border-t border-gray-900">
              <p className="font-['Montserrat'] text-[9px] tracking-[0.5em] text-gray-400 uppercase">
                Premium Design by <span className="text-[#C5A059] font-bold">WebLeaders</span>
              </p>
            </footer>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MaximumEditorialWedding;