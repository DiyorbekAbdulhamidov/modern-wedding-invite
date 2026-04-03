"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, Disc, MapPin, Camera, GlassWater, Utensils, Heart, AlertCircle, Sparkles, BookHeart, CheckCircle, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

// --- 1. HAQIQIY KABUTAR SVG ---
const RealisticDoveSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M504.5 129.2c-3.1-6.1-9.9-9.2-16.5-7.5l-92.4 23.1C359 153.8 318.1 160 276.5 160c-25.9 0-51.7-2.9-77-8.6l-50.6-11.2c-7.3-1.6-14.7.7-19.8 6.1l-60 63.8c-7.5 7.9-6.4 20.8 2.4 27.2l87.2 62.7 5.8 54.1c.8 7.6 6.1 14 13.5 16.3l61 18.6c11.5 3.5 23.4-3.7 25.7-15.5l14.9-74.6 30.6-13.8c31.3-14.1 60.1-33.1 85.3-56.4l57.2-52.7c6.3-5.8 8.1-15.1 4.5-22.7zM129.5 259.9l-61.9-44.5c-6.8-4.9-16.1-3.6-21.3 2.9l-38.6 47.9c-5.5 6.8-4.2 16.8 2.9 22.1l74.1 55.6c8 6 19.3 4.2 25.1-3.9l20.4-28.5c4-5.6 3-13.3-2.2-17.7z" />
  </svg>
);

const FlappingDove = ({ delay, positionClass, flip }: { delay: number, positionClass: string, flip?: boolean }) => (
  <motion.div
    className={`fixed z-[150] w-14 h-14 text-[#C5A059] drop-shadow-[0_8px_15px_rgba(197,160,89,0.25)] pointer-events-none ${positionClass}`}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 0.9, scale: 1 }}
    transition={{ duration: 2.5, delay, ease: [0.25, 1, 0.5, 1] }}
  >
    <motion.div animate={{ y: [0, -18, 0], rotateZ: flip ? [-2, 2, -2] : [2, -2, 2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
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

// --- 2. O'TA NAFIS QIROLLIK ORNAMENTI ---
const LuxuryOrnamentSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 2C100 2 95 18 80 18C65 18 60 2 60 2C60 2 55 18 40 18C25 18 0 18 0 18M100 2C100 2 105 18 120 18C135 18 140 2 140 2C140 2 145 18 160 18C175 18 200 18 200 18" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="100" cy="20" r="3" fill="currentColor" fillOpacity="0.5" />
    <circle cx="100" cy="20" r="1.5" fill="currentColor" />
    <path d="M100 25L100 38" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="100" cy="40" r="1" fill="currentColor" />
  </svg>
);

const DelicateGoldDust = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.03]"
    style={{ backgroundImage: 'radial-gradient(#C5A059 1px, transparent 1px)', backgroundSize: '35px 35px' }}>
  </div>
);

const UltraLuxuryWedding: NextPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<null | 'attending' | 'declined'>(null);
  const [guestName, setGuestName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // TELEGRAMGA YUBORISH FUNKSIYASI
  const handleRSVPSubmit = async (status: 'attending' | 'declined') => {
    if (!guestName.trim()) {
      alert("Iltimos, ism-sharifingizni kiriting!");
      return;
    }

    setIsSubmitting(true);

    const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    const statusText = status === 'attending' ? "✅ Qatnashadi" : "❌ Qatnashmaydi";
    const message = `🎊 To'yga yangi javob!\n\n👤 Ism: ${guestName}\n📝 Holat: ${statusText}`;

    try {
      if (token && chatId) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
          })
        });
      } else {
        console.warn("Telegram Token yoki Chat ID topilmadi. .env faylini tekshiring.");
      }
      // Muvaffaqiyatli jo'natilgach, ekranda tasdiqni ko'rsatamiz
      setRsvpStatus(status);
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [timeLeft, setTimeLeft] = useState({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
  const targetDate = new Date('2026-04-25T13:00:00').getTime();

  useEffect(() => {
    if (!isStarted) return;
    const timer = setInterval(() => {
      const distance = targetDate - new Date().getTime();
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
  }, [isStarted, targetDate]);

  const fadeUp: any = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };
  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen flex justify-center selection:bg-[#C5A059] selection:text-white font-sans overflow-hidden">
      <div className="w-full max-w-[460px] bg-[#FFFFFF] text-[#111111] relative overflow-x-hidden shadow-[0_0_80px_rgba(0,0,0,0.06)] border-x border-gray-100/50">

        <Head>
          <title>Ulug'bek & Kamola | Ultra Luxury Wedding</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Alex+Brush&family=Great+Vibes&family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
        </Head>

        <audio ref={audioRef} loop preload="auto">
          <source src="/die.mp3" type="audio/mpeg" />
        </audio>

        {/* --- 0. SPLASH EKRAN (BULUTLI) --- */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-[#FFFFFF] overflow-hidden"
              exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            >
              <motion.div
                className="absolute inset-0 z-0 opacity-[0.85] mix-blend-multiply"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=1080&auto=format&fit=crop')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "sepia(0.2) hue-rotate(-5deg) brightness(1.1) contrast(0.9)"
                }}
                animate={{ scale: [1, 1.15], x: [0, -15] }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/70 z-10 pointer-events-none"></div>

              <motion.div className="relative z-20 flex flex-col items-center cursor-pointer group w-full px-6" onClick={handleStart}>

                <motion.div
                  className="text-center mb-8 drop-shadow-[0_15px_30px_rgba(197,160,89,0.3)] flex items-center justify-center gap-3"
                  animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="font-['Playfair_Display'] text-[5rem] text-[#C5A059] font-medium leading-none tracking-tighter">U</span>
                  <span className="font-['Great_Vibes'] text-[3rem] text-[#C5A059] opacity-80">&</span>
                  <span className="font-['Playfair_Display'] text-[5rem] text-[#C5A059] font-medium leading-none tracking-tighter">K</span>
                </motion.div>

                <p className="font-['Montserrat'] text-[9px] tracking-[0.6em] uppercase text-gray-800 font-semibold drop-shadow-md mb-28">
                  Samoviy Oqshom
                </p>

                <div className="flex flex-col items-center gap-4 bg-white/50 backdrop-blur-md px-10 py-5 rounded-full border border-white/60 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:bg-white/80 transition-all duration-700">
                  <Play className="w-4 h-4 text-[#C5A059] ml-1" />
                  <p className="font-['Montserrat'] text-[8px] tracking-[0.4em] uppercase text-[#111] font-semibold">Tashrif Buyurish</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ASOSIY SAYT KONTENTI --- */}
        {isStarted && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 bg-[#FFFFFF]">

            <DelicateGoldDust />

            {/* JONLI KABUTARLAR */}
            <FlappingDove delay={0.5} positionClass="top-[12%] left-[-15px] lg:left-2" flip={true} />
            <FlappingDove delay={1.5} positionClass="top-[55%] right-[-15px] lg:right-2" />

            {/* O'TA NAFIS PLEYER */}
            <motion.button
              onClick={toggleMusic}
              className="fixed bottom-8 right-6 z-[150] w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-[0.5px] border-[#C5A059]/40 active:scale-95 transition-transform"
            >
              {isPlaying ? <Disc className="text-[#C5A059] w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} /> : <Play className="text-[#C5A059] w-4 h-4 ml-1" />}
            </motion.button>

            {/* =========================================
                1. HERO SECTION (Tilla chiziqli Arka)
            ========================================= */}
            <section className="relative h-[95svh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#FFFFFF]">
              <motion.p variants={fadeUp} className="font-['Montserrat'] tracking-[0.6em] text-[8px] text-[#C5A059] font-semibold uppercase mb-10 z-20">
                Oila Qurish Tantanasi
              </motion.p>

              <motion.div variants={fadeUp} className="relative w-[80%] flex-1 mb-8 z-10">
                <div className="absolute inset-0 rounded-t-[12rem] border-[0.5px] border-[#C5A059]/50 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.05)] bg-white">
                  <div className="absolute inset-2 border-[0.5px] border-[#C5A059]/20 rounded-t-[11rem] pointer-events-none z-20"></div>
                  <div className="w-full h-full rounded-t-[11.5rem] overflow-hidden relative">
                    <img src="/dreamwedding.jpg" alt="Couple" className="w-full h-full object-cover object-top filter brightness-[0.95]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-transparent to-transparent"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="relative z-30 flex flex-col items-center mt-[-100px] w-full">
                <h1 className="font-['Playfair_Display'] text-[4rem] sm:text-[4.5rem] text-[#111] leading-[0.8] tracking-[-0.02em]">Ulug'bek</h1>
                <div className="font-['Great_Vibes'] text-[3.5rem] text-[#C5A059] my-[-20px] relative z-10 rotate-[-5deg]">va</div>
                <h1 className="font-['Playfair_Display'] text-[4rem] sm:text-[4.5rem] text-[#111] leading-[0.8] tracking-[-0.02em] ml-8">Kamola</h1>

                <div className="flex items-center justify-center gap-5 mt-16 w-full max-w-[280px]">
                  <div className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/60"></div>
                  <p className="font-['Montserrat'] tracking-[0.4em] text-[10px] text-[#111] font-medium">25 . 04 . 2026</p>
                  <div className="h-[0.5px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/60"></div>
                </div>
              </motion.div>
            </section>

            {/* =========================================
                2. HIKOYA (O'ta nozik tipografiya)
            ========================================= */}
            <section className="py-24 px-8 relative z-10 bg-[#FAFAFA] text-center border-y border-gray-100">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center relative max-w-[340px] mx-auto">
                <p className="font-['Great_Vibes'] text-5xl text-[#C5A059] mb-10 opacity-90">Sevgi Qissasi</p>
                <p className="font-['Playfair_Display'] text-[16px] text-gray-700 leading-[2.2] italic px-2">
                  "Hamma narsa kutilmaganda boshlandi. O'sha kuni boshlangan oddiy suhbat, butun umrlik hamrohlikka, bir-birini tushunishga va buyuk muhabbatga aylanishini tasavvur ham qilmagandik..."
                </p>
                <LuxuryOrnamentSVG className="w-24 mx-auto text-[#C5A059] mt-12 opacity-50" />
              </motion.div>
            </section>

            {/* =========================================
                3. OTA-ONALAR MAKTUBI
            ========================================= */}
            <section className="py-28 px-5 bg-[#FFFFFF] relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
                <BookHeart className="w-7 h-7 text-[#C5A059] mx-auto mb-6 opacity-80" />
                <h2 className="font-['Playfair_Display'] text-3xl text-[#111] mb-2">Ehtirom Maktubi</h2>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative max-w-[360px] mx-auto text-center">
                <div className="absolute inset-0 bg-white rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.06)] border border-gray-100 transform rotate-[-0.5deg]"></div>

                <div className="bg-[#FFFFFF] p-12 relative z-10 rounded-sm border-[0.5px] border-[#C5A059]/40 transform rotate-[0.5deg]">
                  <div className="absolute inset-[6px] border-[0.5px] border-[#C5A059]/20 pointer-events-none rounded-sm"></div>

                  <LuxuryOrnamentSVG className="w-32 mx-auto text-[#C5A059] mb-12 opacity-80" />

                  <p className="font-['Montserrat'] text-[9px] tracking-[0.5em] text-[#C5A059] uppercase mb-12 font-semibold">Qadrli Yaqinlarimiz!</p>

                  <div className="font-['Playfair_Display'] text-[15px] text-gray-700 leading-[2.6] italic space-y-6 max-w-[280px] mx-auto">
                    <p>"Farzand — ota-ona uchun Yaratganning eng buyuk in'omi. Bugun shu in'omlarning kamolini ko'rish nasib etmoqda.</p>
                    <p className="font-semibold text-black not-italic text-[1.1rem] leading-none my-6">Ulug'bek va Kamolaxonlarning</p>
                    <p>visol oqshomini chin dildan chiqadigan samimiy duolaringiz va tabriklaringiz bilan bezash uchun sizni lutfan taklif etamiz. Fayzli qadamingiz to'yimiz ko'rkidir."</p>
                  </div>

                  <div className="flex flex-col items-center gap-2 mt-16 mb-2 text-[#111111]">
                    <p className="font-['Montserrat'] tracking-[0.4em] text-[8px] uppercase opacity-60 mb-2">Hurmat bilan,</p>
                    <h2 className="font-['Playfair_Display'] text-[28px] font-medium tracking-widest text-[#C5A059]">Ulug'bek</h2>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* =========================================
                4. TANTANA FAYZI (Dastur)
            ========================================= */}
            <section className="py-24 px-8 bg-[#FAFAFA] relative z-10 border-y border-gray-100">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
                <h2 className="font-['Playfair_Display'] text-3xl text-[#111] mb-4 tracking-wide">Tantana Fayzi</h2>
                <LuxuryOrnamentSVG className="w-24 mx-auto text-[#C5A059] opacity-50" />
              </motion.div>

              <div className="relative flex flex-col items-center max-w-[340px] mx-auto">
                <div className="absolute top-0 bottom-0 w-[0.5px] bg-[#C5A059]/40"></div>

                {[
                  { icon: Utensils, time: "Nahorgi Osh", title: "Dasturxon Fayzi", desc: "Ertalabki palovga marhamat" },
                  { icon: BookHeart, time: "08:00", title: "Hatmi Qur'on", desc: "Qur'on tilovati va oq fotixa" },
                ].map((event, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative w-full flex flex-col items-center text-center mb-16 bg-[#FAFAFA] py-2">
                    <div className="w-12 h-12 bg-[#FFFFFF] border-[0.5px] border-[#C5A059]/60 rounded-full flex items-center justify-center relative z-10 mb-5 shadow-sm">
                      <event.icon className="w-5 h-5 text-[#C5A059]" />
                    </div>
                    <h3 className="font-['Playfair_Display'] text-[24px] text-[#111] mb-1">{event.time}</h3>
                    <h3 className="font-['Playfair_Display'] text-[18px] text-[#666] mb-2 italic">{event.title}</h3>
                    <p className="font-['Montserrat'] text-[9px] text-gray-400 tracking-widest uppercase">{event.desc}</p>
                  </motion.div>
                ))}

                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative w-full flex flex-col items-center text-center bg-[#FAFAFA] py-2">
                  <div className="w-16 h-16 bg-[#111] border-[1px] border-[#C5A059] rounded-full flex items-center justify-center relative z-10 mb-5 shadow-xl">
                    <Heart className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-[32px] text-[#C5A059] mb-1 italic font-medium">13:00</h3>
                  <h3 className="font-['Playfair_Display'] text-2xl text-[#111] mb-5 tracking-wide">To'y Bazmi</h3>
                  <div className="border-[0.5px] border-[#C5A059]/60 px-8 py-3 bg-white shadow-sm">
                    <p className="font-['Playfair_Display'] text-[16px] sm:text-[18px] text-[#111] font-medium tracking-wide">"Bohodirjon" To'yxonasi</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* =========================================
                5. MANZIL
            ========================================= */}
            <section className="py-24 px-6 bg-[#FFFFFF] relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center px-4 max-w-[340px] mx-auto bg-[#FFFFFF] p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border-[0.5px] border-[#C5A059]/30">
                <MapPin className="w-7 h-7 text-[#C5A059] mx-auto mb-6 opacity-80" />
                <h3 className="font-['Playfair_Display'] text-2xl text-[#111] mb-5 tracking-wide">Manzil</h3>
                <p className="font-['Montserrat'] text-[12px] text-gray-700 font-medium leading-relaxed mb-8">
                  "Bohodirjon" To'yxonasi
                </p>
                <a href="https://maps.app.goo.gl/GEGwZe2Lk4HrmYHr5" target="_blank" rel="noopener noreferrer" className="border-[0.5px] border-[#111] bg-transparent text-[#111] px-10 py-4 font-['Montserrat'] text-[9px] font-semibold tracking-[0.3em] uppercase hover:bg-[#111] hover:text-white transition-colors duration-400 inline-block">
                  Xaritada Ochish
                </a>
              </motion.div>
            </section>

            {/* =========================================
                6. RSVP (Tashrif Tasdig'i & Telegram Ulanish)
            ========================================= */}
            <section className="py-24 px-6 bg-[#FAFAFA] relative z-10 border-y border-gray-100">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-[340px] mx-auto">
                <Mail className="w-8 h-8 text-[#C5A059] mx-auto mb-6 opacity-80" />
                <h3 className="font-['Playfair_Display'] text-3xl text-[#111] mb-4">Tashrif Tasdig'i</h3>
                <p className="font-['Montserrat'] text-[10px] text-gray-500 font-light leading-relaxed mb-10 uppercase tracking-[0.2em]">
                  Lutfan o'z ismingizni kiritib, tashrifingizni bildiring
                </p>

                <div className="bg-white p-8 border-[0.5px] border-[#C5A059]/40 shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-sm">
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="space-y-5">

                        {/* Ism kiritish maydoni */}
                        <div className="relative">
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Ism-sharifingiz"
                            className="w-full bg-transparent border-b border-gray-300 text-center py-3 text-[#111] placeholder:text-gray-400 focus:outline-none focus:border-[#C5A059] transition-colors font-['Playfair_Display'] text-[18px] italic"
                          />
                        </div>

                        {/* Tasdiqlash Tugmalari */}
                        <div className="pt-4 space-y-4">
                          <button
                            onClick={() => handleRSVPSubmit('attending')}
                            disabled={isSubmitting}
                            className="w-full py-4 bg-[#111] text-white font-['Montserrat'] text-[10px] tracking-[0.3em] uppercase hover:bg-[#C5A059] transition-colors flex justify-center items-center h-12"
                          >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" /> : "Quvonch bilan boraman"}
                          </button>
                          <button
                            onClick={() => handleRSVPSubmit('declined')}
                            disabled={isSubmitting}
                            className="w-full py-4 bg-transparent border-[0.5px] border-gray-300 text-gray-600 font-['Montserrat'] text-[10px] tracking-[0.3em] uppercase hover:border-[#C5A059] hover:text-[#C5A059] transition-colors flex justify-center items-center h-12"
                          >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" /> : "Afsuski, bora olmayman"}
                          </button>
                        </div>

                      </motion.div>
                    ) : (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-6 flex flex-col items-center">
                        <CheckCircle className="w-12 h-12 text-[#C5A059] mb-4" />
                        <p className="font-['Playfair_Display'] text-[20px] text-[#111] italic mb-2">Javobingiz qabul qilindi!</p>
                        <p className="font-['Montserrat'] text-[10px] text-gray-500 uppercase tracking-widest">E'tiboringiz uchun rahmat</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>

            {/* =========================================
                7. TAYMER
            ========================================= */}
            <section className="py-28 bg-[#FFFFFF] px-5 text-center relative z-10">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-['Great_Vibes'] text-[3.8rem] text-[#C5A059] mb-14 drop-shadow-sm">
                Kutish lahzalari
              </motion.h2>

              <div className="flex justify-center gap-4 sm:gap-6">
                {[
                  { label: 'Kun', value: timeLeft.kun },
                  { label: 'Soat', value: timeLeft.soat },
                  { label: 'Daqiqa', value: timeLeft.daqiqa },
                  { label: 'Soniya', value: timeLeft.soniya }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center bg-[#FAFAFA] w-16 sm:w-20 py-5 border-[0.5px] border-[#C5A059]/30 shadow-sm"
                  >
                    <span className="font-['Playfair_Display'] text-[26px] text-[#111] mb-2 font-medium">{item.value.toString().padStart(2, '0')}</span>
                    <span className="font-['Montserrat'] text-[7px] sm:text-[8px] tracking-[0.3em] uppercase text-[#C5A059] font-bold">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* =========================================
                8. XOTIMA
            ========================================= */}
            <section className="py-32 bg-[#FAFAFA] text-center px-6 relative z-10 border-t border-gray-100">
              <LuxuryOrnamentSVG className="w-24 mx-auto text-[#C5A059] mb-10 opacity-70" />
              <p className="font-['Playfair_Display'] text-[17px] text-gray-700 italic max-w-[280px] mx-auto leading-relaxed mb-10">
                Bizning baxtimiz, sizning tashrifingiz bilan to'kis bo'ladi.
              </p>
              <div className="font-['Playfair_Display'] text-[4.5rem] text-[#111] leading-none tracking-wide">U & K</div>
            </section>

            {/* FOOTER */}
            <footer className="py-10 text-center bg-[#111111] relative z-10 border-t border-[#C5A059]/30">
              <p className="font-['Montserrat'] text-[9px] tracking-[0.6em] text-[#C5A059] uppercase font-semibold">
                Designed By <Link href={"https://webleaders.uz"}>WebLeaders</Link>
              </p>
              <p className="font-['Montserrat'] text-[7px] tracking-[0.2em] text-gray-500 uppercase mt-4">
                Exclusive Wedding Digital Design
              </p>
            </footer>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UltraLuxuryWedding;