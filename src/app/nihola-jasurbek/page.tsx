"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, Disc, MapPin, Music, GlassWater, Heart, Sparkles, BookHeart, CalendarHeart, CheckCircle, Mail, Loader2, Flower2 } from 'lucide-react';
import Link from 'next/link';

// --- 1. HAQIQIY KABUTAR SVG ---
const RealisticDoveSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M504.5 129.2c-3.1-6.1-9.9-9.2-16.5-7.5l-92.4 23.1C359 153.8 318.1 160 276.5 160c-25.9 0-51.7-2.9-77-8.6l-50.6-11.2c-7.3-1.6-14.7.7-19.8 6.1l-60 63.8c-7.5 7.9-6.4 20.8 2.4 27.2l87.2 62.7 5.8 54.1c.8 7.6 6.1 14 13.5 16.3l61 18.6c11.5 3.5 23.4-3.7 25.7-15.5l14.9-74.6 30.6-13.8c31.3-14.1 60.1-33.1 85.3-56.4l57.2-52.7c6.3-5.8 8.1-15.1 4.5-22.7zM129.5 259.9l-61.9-44.5c-6.8-4.9-16.1-3.6-21.3 2.9l-38.6 47.9c-5.5 6.8-4.2 16.8 2.9 22.1l74.1 55.6c8 6 19.3 4.2 25.1-3.9l20.4-28.5c4-5.6 3-13.3-2.2-17.7z" />
  </svg>
);

const FlappingDove = ({ delay, positionClass, flip }: { delay: number, positionClass: string, flip?: boolean }) => (
  <motion.div
    className={`fixed z-[150] w-14 h-14 text-[#D4AF37] drop-shadow-[0_8px_15px_rgba(212,175,55,0.25)] pointer-events-none ${positionClass}`}
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

// --- 2. GULLI ORNAMENT (Qiz bazmiga mos, nafisroq) ---
const FloralOrnamentSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 30 C 80 10, 60 50, 40 30 S 10 20, 0 30" stroke="currentColor" strokeWidth="0.5" fill="transparent" />
    <path d="M100 30 C 120 10, 140 50, 160 30 S 190 20, 200 30" stroke="currentColor" strokeWidth="0.5" fill="transparent" />
    <circle cx="100" cy="30" r="4" fill="currentColor" fillOpacity="0.3" />
    <circle cx="100" cy="30" r="2" fill="currentColor" />
    <path d="M100 35 L 100 50" stroke="currentColor" strokeWidth="0.5" />
    <circle cx="100" cy="53" r="1.5" fill="currentColor" />
    <path d="M95 25 Q 100 15 105 25 Z" fill="currentColor" fillOpacity="0.4" />
  </svg>
);

// --- 3. YUMSHOQ CHANG (Gold Dust) ---
const SoftGoldDust = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.02]"
    style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
  </div>
);

const ElegantBridalShower: NextPage = () => {
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

  // TELEGRAMGA YUBORISH
  const handleRSVPSubmit = async (status: 'attending' | 'declined') => {
    if (!guestName.trim()) {
      alert("Iltimos, ismingizni kiriting!");
      return;
    }

    setIsSubmitting(true);

    const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    const statusText = status === 'attending' ? "✅ Keladi" : "❌ Kelmaydi";
    const message = `🌸 Qiz Bazmiga yangi javob!\n\n👑 Kelin: Nihola\n👤 Mehmon: ${guestName}\n📝 Holati: ${statusText}`;

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
        console.warn("Telegram Token or Chat ID is missing in .env file.");
      }
      setRsvpStatus(status);
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [timeLeft, setTimeLeft] = useState({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
  const targetDate = new Date('2026-04-08T18:00:00').getTime();

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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };
  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  // Nejniy ranglar
  const goldColor = "#CBA135";
  const softBg = "#FDFCFB"; // Juda och, issiqroq oq

  return (
    <div className={`bg-[${softBg}] min-h-screen flex justify-center selection:bg-[${goldColor}] selection:text-white font-sans overflow-hidden`}>
      <div className="w-full max-w-[460px] bg-white text-[#222222] relative overflow-x-hidden shadow-[0_0_80px_rgba(0,0,0,0.04)] border-x border-gray-50/50">

        <Head>
          <title>Nihola & Jasurbek | Qiz Bazmi</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Alex+Brush&family=Great+Vibes&family=Montserrat:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
        </Head>

        <audio ref={audioRef} loop preload="auto">
          <source src="/die.mp3" type="audio/mpeg" />
        </audio>

        {/* --- 0. SPLASH EKRAN --- */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-white overflow-hidden"
              exit={{ opacity: 0, filter: "blur(15px)", scale: 1.05 }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1] }}
            >
              <motion.div
                className="absolute inset-0 z-0 opacity-[0.4] mix-blend-multiply"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1080&auto=format&fit=crop')", // Yumshoqroq gul fon
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "sepia(0.1) hue-rotate(-10deg) brightness(1.2)"
                }}
                animate={{ scale: [1, 1.1], x: [0, -10] }}
                transition={{ duration: 30, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/90 z-10 pointer-events-none"></div>

              <motion.div className="relative z-20 flex flex-col items-center cursor-pointer group w-full px-6" onClick={handleStart}>

                <motion.div
                  className={`text-center mb-6 drop-shadow-[0_15px_30px_rgba(203,161,53,0.2)] flex items-center justify-center gap-3`}
                  animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className={`font-['Playfair_Display'] text-[5rem] text-[${goldColor}] font-medium leading-none tracking-tighter`}>N</span>
                  <span className={`font-['Great_Vibes'] text-[3rem] text-[${goldColor}] opacity-70`}>&</span>
                  <span className={`font-['Playfair_Display'] text-[5rem] text-[${goldColor}] font-medium leading-none tracking-tighter`}>J</span>
                </motion.div>

                <p className="font-['Montserrat'] text-[10px] tracking-[0.5em] uppercase text-gray-600 font-medium drop-shadow-sm mb-28">
                  Qiz Bazmi
                </p>

                <div className="flex flex-col items-center gap-4 bg-white/70 backdrop-blur-md px-10 py-5 rounded-full border border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:bg-white transition-all duration-700">
                  <Play className={`w-4 h-4 text-[${goldColor}] ml-1`} />
                  <p className="font-['Montserrat'] text-[8px] tracking-[0.4em] uppercase text-[#333] font-semibold">Tashrif Buyurish</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ASOSIY KONTENT --- */}
        {isStarted && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-10 bg-white">

            <SoftGoldDust />

            {/* KABUTARLAR (O'ng va chap) */}
            <FlappingDove delay={0.8} positionClass="top-[10%] left-[-10px] lg:left-4" flip={true} />
            <FlappingDove delay={1.8} positionClass="top-[60%] right-[-10px] lg:right-4" />

            {/* PLEYER */}
            <motion.button
              onClick={toggleMusic}
              className={`fixed bottom-8 right-6 z-[150] w-12 h-12 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-[0.5px] border-[${goldColor}]/30 active:scale-95 transition-transform`}
            >
              {isPlaying ? <Disc className={`text-[${goldColor}] w-5 h-5 animate-spin`} style={{ animationDuration: '4s' }} /> : <Play className={`text-[${goldColor}] w-4 h-4 ml-1`} />}
            </motion.button>

            {/* =========================================
                1. HERO SECTION (Nafis arka)
            ========================================= */}
            <section className="relative h-[90svh] w-full flex flex-col items-center justify-center overflow-hidden bg-white">
              <motion.p variants={fadeUp} className={`font-['Montserrat'] tracking-[0.5em] text-[9px] text-[${goldColor}] font-medium uppercase mb-10 z-20`}>
                Maxsus Oqshom
              </motion.p>

              <motion.div variants={fadeUp} className="relative w-[78%] flex-1 mb-8 z-10">
                {/* Yumshoq ramka */}
                <div className={`absolute inset-0 rounded-t-[14rem] border-[0.5px] border-[${goldColor}]/30 p-2 shadow-[0_15px_50px_rgba(0,0,0,0.03)] bg-white`}>
                  <div className={`absolute inset-2 border-[0.5px] border-[${goldColor}]/15 rounded-t-[13rem] pointer-events-none z-20`}></div>
                  <div className="w-full h-full rounded-t-[13.5rem] overflow-hidden relative bg-gray-50">
                    <img src="/dreamwedding.jpg" alt="Couple" className="w-full h-full object-cover object-top opacity-95" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="relative z-30 flex flex-col items-center mt-[-90px] w-full">
                <h1 className="font-['Playfair_Display'] text-[4rem] sm:text-[4.5rem] text-[#222] leading-[0.8] tracking-[-0.01em]">Nihola</h1>
                <div className={`font-['Great_Vibes'] text-[3rem] text-[${goldColor}] my-[-15px] relative z-10 rotate-[-3deg]`}>va</div>
                <h1 className="font-['Playfair_Display'] text-[4rem] sm:text-[4.5rem] text-[#222] leading-[0.8] tracking-[-0.01em] ml-6">Jasurbek</h1>

                <div className="flex items-center justify-center gap-4 mt-14 w-full max-w-[260px]">
                  <div className={`h-[0.5px] flex-1 bg-gradient-to-r from-transparent to-[${goldColor}]/50`}></div>
                  <p className="font-['Montserrat'] tracking-[0.3em] text-[10px] text-[#444] font-medium">08 . 04 . 2026</p>
                  <div className={`h-[0.5px] flex-1 bg-gradient-to-l from-transparent to-[${goldColor}]/50`}></div>
                </div>
              </motion.div>
            </section>

            {/* =========================================
                2. QIZ BAZMI HIKOYASI (Nejniy)
            ========================================= */}
            <section className={`py-24 px-8 relative z-10 bg-[${softBg}] text-center border-y border-gray-100/50`}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center relative max-w-[320px] mx-auto">
                <p className={`font-['Great_Vibes'] text-5xl text-[${goldColor}] mb-8 opacity-90`}>Qiz Bazmi</p>
                <p className="font-['Playfair_Display'] text-[15px] text-gray-600 leading-[2.2] italic px-2">
                  "Har bir qizning hayotidagi eng hayajonli, eng shirin damlaridan biri... Kelinlik libosini kiyishdan avval, eng yaqin dugonalarim va qadrdonlarim davrasida ushbu oqshomni nishonlashni istadim."
                </p>
                <FloralOrnamentSVG className={`w-24 mx-auto text-[${goldColor}] mt-10 opacity-60`} />
              </motion.div>
            </section>

            {/* =========================================
                3. TAKLIFNOMA MAKTUBI
            ========================================= */}
            <section className="py-28 px-5 bg-white relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
                <Heart className={`w-6 h-6 text-[${goldColor}] mx-auto mb-4 opacity-70`} />
                <h2 className="font-['Playfair_Display'] text-3xl text-[#222] mb-2">Samimiy Taklif</h2>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative max-w-[340px] mx-auto text-center">
                {/* Qog'oz soyasi */}
                <div className="absolute inset-0 bg-white rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-50 transform rotate-[-0.5deg]"></div>

                <div className={`bg-white p-12 relative z-10 rounded-sm border-[0.5px] border-[${goldColor}]/30 transform rotate-[0.5deg]`}>
                  <div className={`absolute inset-[5px] border-[0.5px] border-[${goldColor}]/15 pointer-events-none rounded-sm`}></div>

                  <FloralOrnamentSVG className={`w-28 mx-auto text-[${goldColor}] mb-10 opacity-70`} />

                  <p className={`font-['Montserrat'] text-[8px] tracking-[0.4em] text-[${goldColor}] uppercase mb-10 font-semibold`}>Mehribon Yaqinlarim!</p>

                  <div className="font-['Playfair_Display'] text-[15px] text-gray-700 leading-[2.5] italic space-y-6 max-w-[260px] mx-auto">
                    <p>"Yangi hayot ostonasida turar ekanman, mening quvonchimga sherik bo'lishingizni chin dildan xohlayman.</p>
                    <p className="font-medium text-black not-italic text-[1.1rem] leading-tight my-5">Nihola va Jasurbeklarning</p>
                    <p>oilaviy hayotga ilk qadamlarini qo'yishdan oldingi ushbu qiz bazmi oqshomida dildan suhbat qurish va vaqtni maroqli o'tkazish uchun sizni kutib qolaman."</p>
                  </div>

                  <div className="flex flex-col items-center gap-1 mt-14 mb-2 text-[#333]">
                    <p className="font-['Montserrat'] tracking-[0.3em] text-[7px] uppercase opacity-50 mb-2">Mehr bilan,</p>
                    <h2 className={`font-['Playfair_Display'] text-[26px] font-medium tracking-wide text-[${goldColor}]`}>Nihola</h2>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* =========================================
                4. DASTUR VAQTI
            ========================================= */}
            <section className={`py-24 px-8 bg-[${softBg}] relative z-10 border-y border-gray-100/50`}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
                <h2 className="font-['Playfair_Display'] text-3xl text-[#222] mb-4 tracking-wide">Oqshom Fayzi</h2>
                <FloralOrnamentSVG className={`w-20 mx-auto text-[${goldColor}] opacity-40`} />
              </motion.div>

              <div className="relative flex flex-col items-center max-w-[320px] mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative w-full flex flex-col items-center text-center py-4">
                  <div className={`w-16 h-16 bg-[#222] border-[1px] border-[${goldColor}] rounded-full flex items-center justify-center relative z-10 mb-6 shadow-lg`}>
                    <Music className="w-6 h-6 text-white font-light" />
                  </div>
                  <h3 className={`font-['Playfair_Display'] text-[32px] text-[${goldColor}] mb-1 italic font-medium`}>18:00</h3>
                  <h3 className="font-['Playfair_Display'] text-[22px] text-[#222] mb-4 tracking-wide">Qiz Bazmi Boshlanishi</h3>
                  <p className="font-['Montserrat'] text-[9px] text-gray-500 tracking-widest uppercase">Musiqa, raqs va shirin xotiralar</p>
                </motion.div>
              </div>
            </section>

            {/* =========================================
                5. MANZIL (Piskent, Lola To'yxonasi)
            ========================================= */}
            <section className="py-24 px-6 bg-white relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`text-center px-6 max-w-[320px] mx-auto bg-white p-10 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border-[0.5px] border-[#C5A059]/20`}>
                <MapPin className={`w-6 h-6 text-[#C5A059] mx-auto mb-5 opacity-80`} />
                <h3 className="font-['Playfair_Display'] text-2xl text-[#222] mb-4 tracking-wide">Manzil</h3>
                <p className="font-['Montserrat'] text-[11px] text-gray-600 font-light leading-relaxed mb-6">
                  Toshkent viloyati, Piskent tumani, Bobur Mirzo ko'chasi,<br /> <span className="font-medium text-[#222]">Lola to'yxonasi</span>
                </p>
                {/* 100% Aniq koordinatani ochadigan silka */}
                <a
                  href="https://www.google.com/maps?q=40.898729,69.350592"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`border-[0.5px] border-[#333] bg-transparent text-[#333] px-8 py-3.5 font-['Montserrat'] text-[8px] font-medium tracking-[0.2em] uppercase hover:bg-[#333] hover:text-white transition-colors duration-400 inline-block`}
                >
                  Xaritada Ochish
                </a>
              </motion.div>
            </section>

            {/* =========================================
                6. RSVP (Tashrif Tasdig'i & Telegram Ulanish)
            ========================================= */}
            <section className={`py-24 px-6 bg-[${softBg}] relative z-10 border-y border-gray-100/50`}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-[340px] mx-auto">
                <Flower2 className={`w-7 h-7 text-[${goldColor}] mx-auto mb-5 opacity-70`} />
                <h3 className="font-['Playfair_Display'] text-[28px] text-[#222] mb-3">Tashrifingiz</h3>
                <p className="font-['Montserrat'] text-[9px] text-gray-500 font-light leading-relaxed mb-8 uppercase tracking-[0.15em]">
                  Iltimos, o'z ismingizni qoldiring
                </p>

                <div className={`bg-white p-8 border-[0.5px] border-[${goldColor}]/30 shadow-[0_5px_20px_rgba(0,0,0,0.02)] rounded-sm`}>
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="space-y-6">

                        <div className="relative">
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Ism-sharifingiz"
                            className={`w-full bg-transparent border-b border-gray-200 text-center py-2 text-[#333] placeholder:text-gray-300 focus:outline-none focus:border-[${goldColor}] transition-colors font-['Playfair_Display'] text-[16px] italic`}
                          />
                        </div>

                        <div className="pt-2 space-y-3">
                          <button
                            onClick={() => handleRSVPSubmit('attending')}
                            disabled={isSubmitting}
                            className={`w-full py-3.5 bg-[#222] text-white font-['Montserrat'] text-[9px] tracking-[0.2em] uppercase hover:bg-[${goldColor}] transition-colors flex justify-center items-center h-11`}
                          >
                            {isSubmitting ? <Loader2 className={`w-4 h-4 animate-spin text-[${goldColor}]`} /> : "Bajonidil qatnashaman"}
                          </button>
                          <button
                            onClick={() => handleRSVPSubmit('declined')}
                            disabled={isSubmitting}
                            className={`w-full py-3.5 bg-transparent border-[0.5px] border-gray-200 text-gray-500 font-['Montserrat'] text-[9px] tracking-[0.2em] uppercase hover:border-[${goldColor}] hover:text-[${goldColor}] transition-colors flex justify-center items-center h-11`}
                          >
                            {isSubmitting ? <Loader2 className={`w-4 h-4 animate-spin text-[${goldColor}]`} /> : "Afsuski, kela olmayman"}
                          </button>
                        </div>

                      </motion.div>
                    ) : (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-6 flex flex-col items-center">
                        <CheckCircle className={`w-10 h-10 text-[${goldColor}] mb-4`} />
                        <p className="font-['Playfair_Display'] text-[18px] text-[#222] italic mb-2">Javobingiz uchun rahmat!</p>
                        <p className="font-['Montserrat'] text-[9px] text-gray-400 uppercase tracking-widest">Sizni kutib qolamiz</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </section>

            {/* =========================================
                7. TAYMER
            ========================================= */}
            <section className="py-28 bg-white px-5 text-center relative z-10">
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`font-['Great_Vibes'] text-[3.5rem] text-[${goldColor}] mb-12 opacity-90`}>
                Kutish onlari
              </motion.h2>

              <div className="flex justify-center gap-3 sm:gap-5">
                {[
                  { label: 'Kun', value: timeLeft.kun },
                  { label: 'Soat', value: timeLeft.soat },
                  { label: 'Daqiqa', value: timeLeft.daqiqa },
                  { label: 'Soniya', value: timeLeft.soniya }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                    className={`flex flex-col items-center bg-[${softBg}] w-[60px] sm:w-[70px] py-4 border-[0.5px] border-[${goldColor}]/20 rounded-sm`}
                  >
                    <span className="font-['Playfair_Display'] text-[22px] text-[#222] mb-1.5 font-medium">{item.value.toString().padStart(2, '0')}</span>
                    <span className={`font-['Montserrat'] text-[6.5px] tracking-[0.2em] uppercase text-[${goldColor}] font-medium`}>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* =========================================
                8. XOTIMA
            ========================================= */}
            <section className={`py-32 bg-[${softBg}] text-center px-6 relative z-10 border-t border-gray-100/50`}>
              <FloralOrnamentSVG className={`w-20 mx-auto text-[${goldColor}] mb-8 opacity-60`} />
              <p className="font-['Playfair_Display'] text-[16px] text-gray-600 italic max-w-[260px] mx-auto leading-relaxed mb-8">
                Tashrifingiz oqshomimizni yanada go'zal qiladi.
              </p>
              <div className="font-['Playfair_Display'] text-[3.5rem] text-[#222] leading-none tracking-wide">N & J</div>
            </section>

            {/* FOOTER */}
            <footer className="py-8 text-center bg-[#1a1a1a] relative z-10 border-t border-gray-800">
              <p className={`font-['Montserrat'] text-[8px] tracking-[0.4em] text-[${goldColor}] uppercase font-medium`}>
                Designed By <Link href={"https://webleaders.uz"}>WebLeaders</Link>
              </p>
            </footer>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ElegantBridalShower;