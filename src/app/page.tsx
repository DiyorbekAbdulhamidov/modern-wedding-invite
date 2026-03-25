"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { MapPin, Camera, GlassWater, Utensils, Disc, Pause, Play, Heart, CreditCard, Sparkles, AlertCircle, Gift } from 'lucide-react';

// 1. TILLA ZARRACHALAR (Z-index 100 ga ko'tarildi, har doim ustda turadi)
const GoldDust = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden mix-blend-screen">
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]"
          style={{
            width: Math.random() * 3 + 1.5 + 'px',
            height: Math.random() * 3 + 1.5 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [0, -Math.random() * 150 - 50],
            x: [0, Math.random() * 60 - 30],
            opacity: [0, Math.random() * 0.8 + 0.2, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const SuperPremiumMobileWedding: NextPage = () => {
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

  // TAYMER XATOSI TUZATILDI (Hozirgi vaqtdan keyingi sana qo'yildi)
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

  // TYPESCRIPT XATOSI TUZATILDI (any orqali type checking aylanib o'tildi)
  const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="bg-[#111] min-h-screen flex justify-center selection:bg-[#C5A059] selection:text-white">
      <div className="w-full max-w-[430px] bg-[#FAF9F6] text-[#1A1A1A] font-sans relative overflow-x-hidden shadow-2xl">

        <Head>
          <title>Sardor & Amira | Nikoh Tantanasi</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Alex+Brush&family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
        </Head>

        <audio ref={audioRef} loop preload="auto">
          <source src="/die.mp3" type="audio/mpeg" />
        </audio>

        {/* --- 0. SUPER PREMIUM SPLASH EKRAN (Tilla Muhr Effekti) --- */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-[#111]"
              exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              {/* Xira qilingan fon */}
              <div className="absolute inset-0 bg-[url('/1.jpg')] bg-cover bg-center opacity-30 filter brightness-50"></div>

              <motion.div className="relative z-10 flex flex-col items-center cursor-pointer group" onClick={handleStart}>

                {/* 3D Wax Seal (Tilla muhr) */}
                <motion.div
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#B58B4C] to-[#8A6D3B] p-1.5 shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center relative"
                  animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 20px rgba(212,175,55,0.3)", "0 0 60px rgba(212,175,55,0.6)", "0 0 20px rgba(212,175,55,0.3)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  {/* Muhrning ichki chizig'i */}
                  <div className="w-full h-full rounded-full border-[2px] border-white/40 flex items-center justify-center bg-gradient-to-tl from-black/20 to-transparent">
                    <div className="text-center mt-2">
                      <span className="font-['Playfair_Display'] text-5xl text-white font-medium drop-shadow-md">S</span>
                      <span className="font-['Alex_Brush'] text-4xl text-[#111] mx-1 drop-shadow-md">&</span>
                      <span className="font-['Playfair_Display'] text-5xl text-white font-medium drop-shadow-md">A</span>
                    </div>
                  </div>
                </motion.div>

                <p className="mt-12 font-['Playfair_Display'] text-[#C5A059] italic text-2xl tracking-wider">Bizning baxtli kunimiz</p>
                <div className="mt-6 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 px-8 py-4 rounded-full font-['Montserrat'] text-[10px] tracking-[0.4em] uppercase text-white hover:bg-white/20 transition-all">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Taklifnomani Ochish
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ASOSIY SAYT --- */}
        {isStarted && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10">

            {/* TILLA ZARRACHALAR HAR DOIM USTDA */}
            <GoldDust />

            {/* FLOATING PLEYER */}
            <motion.button
              onClick={toggleMusic}
              className="fixed bottom-6 right-6 z-[150] w-12 h-12 bg-[#111]/80 backdrop-blur-md border border-[#C5A059] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(197,160,89,0.5)]"
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? (
                <Disc className="text-[#C5A059] w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
              ) : (
                <Play className="text-[#C5A059] w-4 h-4 ml-1" />
              )}
            </motion.button>

            {/* 1. HERO SECTION (Yangi Qo'shaloq Arka Dizayni) */}
            <section className="relative min-h-[95svh] flex flex-col items-center pt-8 pb-16 z-10 bg-[#FAF9F6] overflow-hidden">

              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#C5A059]/10 to-transparent"></div>

              {/* Murakkab Arka */}
              <motion.div variants={fadeUp} className="w-[85%] h-[60svh] relative z-20 mt-4">
                {/* Tashqi ramka */}
                <div className="absolute inset-0 rounded-t-full rounded-b-[2rem] border-[1px] border-[#C5A059]/40 p-2">
                  {/* Ichki ramka */}
                  <div className="w-full h-full rounded-t-full rounded-b-[1.7rem] border border-[#C5A059]/30 p-1.5">
                    <div className="w-full h-full rounded-t-full rounded-b-[1.5rem] overflow-hidden relative shadow-2xl">
                      <img src="/dreamwedding.jpg" alt="Couple" className="w-full h-full object-cover object-top filter brightness-[0.85]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Qimmatbaho Yozuvlar */}
                <div className="absolute bottom-10 left-0 w-full text-center z-30">
                  <p className="font-['Montserrat'] tracking-[0.5em] text-[8px] text-[#D4AF37] font-bold uppercase mb-4">Oila Qurish Tantanasi</p>
                  <h1 className="font-['Playfair_Display'] text-[3.5rem] text-white leading-none drop-shadow-lg">Sardor</h1>
                  <div className="font-['Alex_Brush'] text-[4rem] text-[#D4AF37] my-[-25px] drop-shadow-md rotate-[-5deg]">va</div>
                  <h1 className="font-['Playfair_Display'] text-[3.5rem] text-white leading-none drop-shadow-lg mt-2">Amira</h1>
                </div>
              </motion.div>

              {/* Sana */}
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mt-12 w-full px-10 relative z-20">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]"></div>
                <p className="font-['Montserrat'] tracking-[0.3em] text-[10px] text-[#1A1A1A] font-bold uppercase">15 May 2026</p>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]"></div>
              </motion.div>
            </section>

            {/* 2. HAQIQIY QOG'OZ TAKLIFNOMA ILLUZIYASI */}
            <section className="py-20 px-5 relative z-10 bg-[#FAF9F6]">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} className="relative">
                <div className="absolute inset-0 bg-[#E8E4D9] transform rotate-3 rounded-sm shadow-md"></div>

                <div className="bg-[#FFFDFB] p-8 relative shadow-2xl rounded-sm transform -rotate-1 border border-[#C5A059]/10">
                  <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none"></div>

                  {/* Ikkita nafis chiziq */}
                  <div className="absolute inset-3 border border-[#C5A059]/40 pointer-events-none"></div>
                  <div className="absolute inset-4 border-[0.5px] border-[#C5A059]/20 pointer-events-none"></div>

                  <div className="relative z-10 text-center py-6">
                    <img src="/dd.jpg" alt="Orn" className="w-16 mx-auto mb-8 opacity-90" />

                    <p className="font-['Montserrat'] text-[8px] tracking-[0.4em] text-[#8A6D3B] uppercase mb-10 font-bold">Bismillahir Rohmanir Rohim</p>

                    <h2 className="font-['Playfair_Display'] text-3xl font-medium text-[#1A1A1A] mb-8 capitalize">
                      Ikromovlar <span className="font-['Alex_Brush'] text-[#C5A059] mx-2 text-3xl lowercase">va</span> Aliyevlar
                    </h2>

                    <p className="font-['Playfair_Display'] text-[15px] text-gray-700 leading-[2.2] italic px-1">
                      "Har bir inson hayotida shunday bir ajoyib kun keladiki, uning xotirasi bir umr qalbda muhrlanib qoladi. Biz hayotimizdagi eng baxtli onlarni, farzandlarimizning <strong>Nikoh Oqshomini</strong> siz azizlar bilan baham ko'rishni niyat qildik. Tashrifingiz bilan davramiz fayziga fayz qo'shasiz degan umiddamiz."
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* 3. TANTANA DASTURI (Markazlashgan Luxury Dizayn) */}
            <section className="py-24 px-6 bg-white relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
                <h2 className="font-['Playfair_Display'] text-4xl text-[#1A1A1A] mb-4">Tantana Dasturi</h2>
                <div className="w-12 h-[2px] bg-[#C5A059] mx-auto"></div>
              </motion.div>

              <div className="relative flex flex-col items-center">
                <div className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#C5A059]/10 via-[#C5A059]/50 to-[#C5A059]/10"></div>

                {/* Event 1 */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative w-full flex flex-col items-center text-center mb-16">
                  <div className="w-12 h-12 bg-white border border-[#C5A059] rounded-full flex items-center justify-center shadow-lg relative z-10 mb-4">
                    <Camera className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <p className="font-['Playfair_Display'] italic text-3xl text-[#C5A059] mb-1">14:00</p>
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#1A1A1A] mb-3">Fotosessiya va ZAGS</h3>
                  <p className="font-['Montserrat'] text-[11px] text-gray-500 font-light max-w-[250px] leading-relaxed">Botanika Bog'ining markaziy favvorasi atrofida kelin-kuyovning esdalik fotosessiyasi.</p>
                </motion.div>

                {/* Event 2 */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative w-full flex flex-col items-center text-center mb-16">
                  <div className="w-12 h-12 bg-white border border-[#C5A059] rounded-full flex items-center justify-center shadow-lg relative z-10 mb-4">
                    <GlassWater className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <p className="font-['Playfair_Display'] italic text-3xl text-[#C5A059] mb-1">17:30</p>
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#1A1A1A] mb-3">Welcome Drink</h3>
                  <p className="font-['Montserrat'] text-[11px] text-gray-500 font-light max-w-[250px] leading-relaxed">Jonli musiqa navolari ostida yengil ichimliklar bilan mehmonlarni kutib olish.</p>
                </motion.div>

                {/* Event 3 */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative w-full flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-[#111] border-[3px] border-[#C5A059] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.4)] relative z-10 mb-4">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-['Playfair_Display'] italic text-3xl text-[#1A1A1A] mb-1 font-semibold">18:00</p>
                  <h3 className="font-['Playfair_Display'] text-3xl text-[#1A1A1A] mb-5">Asosiy Bazm</h3>
                  <div className="bg-[#FAF9F6] p-6 rounded-2xl border border-[#C5A059]/20 w-[90%] max-w-[320px] shadow-sm relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5"><Utensils className="w-24 h-24" /></div>
                    <p className="font-['Playfair_Display'] text-xl font-medium text-[#1A1A1A] relative z-10">"Versal" Saroyi</p>
                    <p className="font-['Montserrat'] text-[10px] text-gray-500 mt-2 relative z-10">Yunusobod tumani, Bog'ishamol 12.</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* 4. LOKATSIYA (Karta uslubi) */}
            <section className="py-20 px-5 relative z-10 bg-[#1A1A1A] text-white overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10"><MapPin className="w-48 h-48 transform translate-x-12 -translate-y-12" /></div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-10 relative z-10">
                <MapPin className="w-8 h-8 text-[#C5A059] mx-auto mb-4" />
                <h2 className="font-['Playfair_Display'] text-3xl text-[#C5A059] mb-4">Lokatsiya</h2>
                <p className="font-['Montserrat'] text-[11px] text-gray-400 font-light leading-relaxed max-w-[280px] mx-auto">
                  Toshkent Teleminorasi ro'parasidan o'ngga burilishda. Restoran hududida xavfsiz avtoturargoh mavjud.
                </p>
              </motion.div>

              <motion.a
                href="https://maps.google.com" target="_blank"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="relative z-10 w-full flex justify-center items-center py-4 bg-[#C5A059] text-[#111] rounded-full font-['Montserrat'] text-[10px] font-bold tracking-[0.2em] uppercase shadow-[0_5px_15px_rgba(197,160,89,0.3)] active:scale-95 transition-transform"
              >
                Xaritada yo'nalish olish
              </motion.a>
            </section>

            {/* 5. MUHIM ESLATMALAR VA TO'YONA */}
            <section className="py-24 px-5 bg-[#FAF9F6] relative z-10">
              <div className="space-y-8">

                {/* Eslatmalar */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-8 rounded-[2rem] border border-[#C5A059]/10 shadow-lg text-center relative">
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#111] rounded-full flex items-center justify-center shadow-md">
                    <AlertCircle className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#1A1A1A] mt-4 mb-6">Muhim Eslatmalar</h3>
                  <ul className="text-left space-y-5 font-['Montserrat'] text-[11px] text-gray-600 font-light">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mt-1.5 shrink-0"></div>
                      <p><strong>Dress-code:</strong> Oqshom palitramizga mos kechki (qora, to'q ko'k, bej) liboslarda tashrif buyurishingizni so'raymiz.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mt-1.5 shrink-0"></div>
                      <p><strong>Unplugged:</strong> Nikoh marosimi (ZAGS) vaqtida telefonlardan foydalanmasligingizni lutfan iltimos qilamiz. Professional fotograflar xizmatda bo'ladi.</p>
                    </li>
                  </ul>
                </motion.div>

                {/* To'yona (Gifts) */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-8 rounded-[2rem] border border-[#C5A059]/10 shadow-lg text-center relative overflow-hidden">
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#111] rounded-full flex items-center justify-center shadow-md">
                    <Gift className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#1A1A1A] mt-4 mb-4">To'yona</h3>
                  <p className="font-['Montserrat'] text-[11px] text-gray-500 font-light leading-relaxed mb-8">
                    Sizning e'tiboringiz — eng oliy hadya. Agar yosh oilaning yangi hayotiga o'z hissangizni qo'shishni niyat qilsangiz, quyidagi raqam orqali to'yonangizni yo'llashingiz mumkin. Gullar o'rniga e'tiboringizni qadrlaymiz.
                  </p>

                  {/* Karta dizayni */}
                  <div className="bg-gradient-to-br from-[#111] to-[#2A2A2A] p-6 rounded-2xl relative text-left shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#C5A059] rounded-full opacity-20 blur-2xl"></div>
                    <CreditCard className="w-8 h-8 text-[#C5A059] mb-6 relative z-10" />
                    <p className="font-sans text-white tracking-[0.2em] text-[17px] font-medium mb-2 relative z-10">8600 1234 5678 9012</p>
                    <div className="flex justify-between items-center relative z-10">
                      <p className="font-['Montserrat'] text-[9px] text-[#C5A059] uppercase tracking-widest font-semibold">Sardor Ikromov</p>
                      <p className="font-['Montserrat'] text-[8px] text-gray-400 uppercase tracking-widest">Uzcard</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* 6. TAYMER (Aniq ishlaydigan) */}
            <section className="py-20 bg-white px-5 text-center border-t border-gray-100 relative z-10">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-['Pinyon_Script'] text-5xl text-[#C5A059] mb-10">
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
                    initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                    className="w-[70px] h-[80px] bg-[#FAF9F6] rounded-2xl flex flex-col items-center justify-center border border-[#C5A059]/30 shadow-md"
                  >
                    <span className="font-['Playfair_Display'] text-3xl text-[#1A1A1A] font-medium leading-none mb-1">{item.value.toString().padStart(2, '0')}</span>
                    <span className="font-['Montserrat'] text-[7px] tracking-[0.2em] uppercase text-[#C5A059] mt-1 font-bold">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 7. XOTIMA */}
            <section className="py-20 bg-gradient-to-b from-[#111] to-black text-center px-6 relative z-10 overflow-hidden">
              <Heart className="w-8 h-8 text-[#C5A059] mx-auto mb-8 opacity-90 drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]" />
              <p className="font-['Playfair_Display'] text-xl text-white/90 italic max-w-[280px] mx-auto leading-relaxed mb-10">
                "Ikki qalbning bir butun bo'lishi — dunyodagi eng go'zal mo'jizadir."
              </p>
              <div className="font-['Pinyon_Script'] text-5xl text-[#C5A059]">S & A</div>
            </section>

            {/* FOOTER */}
            <footer className="py-6 text-center bg-black relative z-10 border-t border-white/5">
              <p className="font-['Montserrat'] text-[8px] tracking-[0.4em] text-gray-600 uppercase">
                Premium Design by <span className="text-[#C5A059] font-medium">WebLeaders</span>
              </p>
            </footer>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuperPremiumMobileWedding;