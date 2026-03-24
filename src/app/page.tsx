"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useState, useRef, useEffect, ReactNode } from 'react';
import { MapPin, Clock, Heart, Users, CalendarDays, Sparkles } from 'lucide-react';

// --- 3D TILT EFFEKTI UCHUN KOMPONENT ---
interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

const TiltCard = ({ children, className }: TiltCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

// --- TILLA ZARRACHALAR VA GULBARGLAR YOG'DUYISI ---
const ParticleShower = () => {
  const particles = Array.from({ length: 40 });
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${i % 2 === 0 ? 'bg-[#D4AF37]' : 'bg-white border border-[#D4AF37]/30'}`}
          style={{
            width: Math.random() * (i % 2 === 0 ? 4 : 8) + 2 + 'px',
            height: Math.random() * (i % 2 === 0 ? 4 : 8) + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * -100 + '%',
            opacity: Math.random() * 0.4 + 0.3,
            filter: i % 2 === 0 ? 'blur(1px)' : 'none',
          }}
          animate={{
            top: '110%',
            x: Math.random() * 200 - 100 + 'px',
            rotateZ: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const WeddingLanding: NextPage = () => {
  const [isOpened, setIsOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Xavfsiz musiqa yoqish (Fayl bo'lmasa xato bermaydi)
  const openInvitation = async () => {
    setIsOpened(true);
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.warn("Musiqa fayli topilmadi (public/music.mp3) yoki brauzer blokladi. Sayt ovozsiz ishlaydi.");
      }
    }
  };

  // TAYMER MANTIG'I
  const [timeLeft, setTimeLeft] = useState({ kun: 0, soat: 0, daqiqa: 0 });
  const targetDate = new Date('2024-05-15T18:00:00').getTime();

  useEffect(() => {
    const interval = setInterval(() => {
      const distance = targetDate - new Date().getTime();
      if (distance > 0) {
        setTimeLeft({
          kun: Math.floor(distance / (1000 * 60 * 60 * 24)),
          soat: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          daqiqa: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Animatsiya variantlari
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1A1A1A] font-sans selection:bg-[#D4AF37]/20 selection:text-[#8A6D3B] overflow-x-hidden relative" style={{ perspective: "2000px" }}>
      <Head>
        <title>Sardor & Amira | Qirollik To'y Tantanasi</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      {/* AUDIO FAYL (onerror himoyasi bilan) */}
      <audio ref={audioRef} loop preload="auto" onError={() => console.log("music.mp3 yuklashda xato.")}>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {/* 0. 3D SPLASH SCREEN (Tilla Konvert) */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#F4EFEA] p-4"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              rotateY: 90,
              scale: 0.8,
              transition: { duration: 1.5, ease: [0.65, 0, 0.35, 1] }
            }}
            style={{ transformOrigin: "center center -500px", backfaceVisibility: "hidden" }}
          >
            {/* Konvert fon teksturasi */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h80v80H0V0zm40 40L0 80h80L40 40zm0 0L0 0h80L40 40z' fill='%23D4AF37' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>

            <TiltCard className="w-full max-w-lg cursor-pointer group" >
              <motion.div
                onClick={openInvitation}
                className="bg-white border-2 border-[#D4AF37] p-12 md:p-16 text-center shadow-[0_30px_70px_rgba(197,160,89,0.3)] relative overflow-hidden rounded-sm"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                {/* Tilla muhr (Wax Seal) effekti */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 z-10">
                  <div className="w-24 h-24 rounded-full border-2 border-white/50 flex flex-col items-center justify-center bg-gradient-to-b from-[#C5A059] to-[#8A6D3B]">
                    <span className="font-['Cinzel'] text-5xl text-white font-bold mb-1">S&A</span>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/80">15.05.2024</span>
                  </div>
                </div>

                {/* Konvert chiziqlari */}
                <div className="absolute inset-0 border-[15px] border-white/80 z-0"></div>
                <div className="absolute inset-2 border border-[#D4AF37]/20 z-0"></div>

                <div className="relative z-0 opacity-10">
                  <h1 className="font-serif text-3xl text-[#2A2A2A] mb-4">Qirollik To'y Tantanasi</h1>
                  <p className="font-sans text-xs tracking-widest text-[#8A6D3B]">Toshkent shahri, 2024</p>
                </div>
              </motion.div>
              <p className="font-['Cinzel'] text-[#8A6D3B] tracking-[0.3em] uppercase text-xs text-center mt-8 group-hover:text-[#D4AF37] transition-colors">Taklifnomani ochish uchun bosing</p>
            </TiltCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ASOSIY KONTENT */}
      {isOpened && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5 }}>

          {/* ZARRACHALAR YOG'DUYISI */}
          <ParticleShower />

          {/* ORQA FON: Parallaks effekti bilan Tilla Barokko naqshi */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
            style={{
              y: backgroundY,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M80 160c-44.183 0-80-35.817-80-80S35.817 0 80 0s80 35.817 80 80-35.817 80-80 80zm0-4c42.01 0 76-33.99 76-76S122.01 4 80 4 4 37.99 4 80s33.99 76 76 76z' fill='%23D4AF37' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '120px 120px'
            }}
          ></motion.div>

          {/* --- 1. HERO SECTION (QIROLLIK KIRISHI) --- */}
          <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-10 pb-24 z-20">

            {/* Tepaga zarhal bezak */}
            <motion.img
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
              src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Gold_decorative_element.png"
              alt="ornament"
              className="w-48 md:w-64 opacity-80 mb-12 filter drop-shadow-[0_10px_20px_rgba(212,175,55,0.4)]"
            />

            <motion.div
              className="text-center w-full max-w-5xl mx-auto"
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.4 } } }}
            >
              <motion.p variants={fadeInUp} className="font-['Cinzel'] tracking-[0.5em] text-[#C5A059] text-xs md:text-sm mb-8 uppercase font-medium border-y border-[#D4AF37]/30 py-3 px-10 inline-block bg-white/30 backdrop-blur-sm">
                Nikoh Tantanamizga Taklif Etamiz
              </motion.p>

              <motion.div variants={fadeInUp} className="mb-6 relative">
                {/* Orqa fonda katta xira ismlar (bo'shliqni to'ldirish) */}
                <span className="absolute inset-0 font-['Great_Vibes'] text-[10rem] md:text-[20rem] text-[#D4AF37] opacity-[0.03] select-none pointer-events-none transform -translate-y-1/2">S&A</span>

                <h1 className="font-['Playfair_Display'] text-7xl md:text-[10rem] text-[#1A1A1A] leading-[0.8] mb-4 drop-shadow-lg font-medium relative z-10">
                  Sardor
                </h1>
                <div className="font-['Great_Vibes'] text-8xl md:text-[11rem] text-[#D4AF37] my-[-30px] md:my-[-50px] z-20 relative drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
                  va
                </div>
                <h1 className="font-['Playfair_Display'] text-7xl md:text-[10rem] text-[#1A1A1A] leading-[0.8] mt-4 drop-shadow-lg font-medium relative z-10">
                  Amira
                </h1>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center justify-center gap-6 mt-20">
                <div className="w-20 md:w-32 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
                <p className="font-sans tracking-[0.4em] text-[#8A6D3B] text-sm font-semibold uppercase relative">
                  <Sparkles className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[#D4AF37]/60 w-5 h-5 animate-pulse" />
                  15 . 05 . 2024
                </p>
                <div className="w-20 md:w-32 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
              </motion.div>
            </motion.div>
          </section>

          {/* --- 2. OTA-ONALAR TAKLIFNOMASI (DABDABALI RAMKADA) --- */}
          <section className="py-24 px-6 relative z-20 bg-white/70 backdrop-blur-md shadow-[0_0_60px_rgba(0,0,0,0.03)] border-y border-[#D4AF37]/20">
            <motion.div
              className="max-w-4xl mx-auto text-center border-4 border-[#D4AF37]/50 p-10 md:p-16 relative bg-[#FCFAF8] shadow-[0_0_50px_rgba(197,160,89,0.1)]"
              initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}
            >
              {/* Burchaklardagi dabdabali tilla bezaklar */}
              <div className="absolute top-[-15px] left-[-15px] w-16 h-16 border-t-4 border-l-4 border-[#C5A059] rounded-tl-xl"></div>
              <div className="absolute top-[-15px] right-[-15px] w-16 h-16 border-t-4 border-r-4 border-[#C5A059] rounded-tr-xl"></div>
              <div className="absolute bottom-[-15px] left-[-15px] w-16 h-16 border-b-4 border-l-4 border-[#C5A059] rounded-bl-xl"></div>
              <div className="absolute bottom-[-15px] right-[-15px] w-16 h-16 border-b-4 border-r-4 border-[#C5A059] rounded-br-xl"></div>

              <h2 className="font-['Great_Vibes'] text-5xl md:text-6xl text-[#D4AF37] mb-10">Bismillahir Rohmanir Rohim</h2>

              <div className="font-sans tracking-[0.2em] text-gray-500 text-xs md:text-sm leading-relaxed mb-12 uppercase font-medium">
                Oila kattalari nomidan lutfan taklif: <br />
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 mt-6 text-[#1A1A1A]">
                  <span className="font-serif text-3xl capitalize">Tohirjon va Nodira</span>
                  <Users className="w-8 h-8 text-[#D4AF37]/50 rotate-90 hidden md:block" />
                  <span className="font-serif text-3xl capitalize">Shuhrat va Dilnoza</span>
                </div>
              </div>

              <p className="font-serif text-xl md:text-2xl text-gray-700 leading-loose italic max-w-2xl mx-auto border-t border-[#D4AF37]/20 pt-10">
                Siz azizlarni farzandlarimiz — <br />
                <span className="text-[#1A1A1A] font-bold text-2xl not-italic block my-2">Sardorjon va Amiraxon</span>
                ning hayotlaridagi eng quvonchli va hayajonli lahzalar, oila qurish tantanasi — Nikoh Oqshomida aziz mehmonimiz bo'lishga lutfan taklif etamiz.
              </p>
            </motion.div>
          </section>

          {/* --- 3. TANTANA MANZILI (3D TILT KARTALARI) --- */}
          <section className="py-32 px-4 relative z-20">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                className="font-serif text-5xl md:text-6xl text-center text-[#1A1A1A] mb-24 drop-shadow-sm font-medium"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
              >
                Tantana Manzillari
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-12 lg:gap-16">

                {/* ZAGS KARTASI (Oq/Tilla) */}
                <TiltCard className="group">
                  <motion.div
                    className="bg-white border border-[#D4AF37]/30 p-10 md:p-14 text-center rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] h-full relative overflow-hidden"
                    initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
                  >
                    {/* Fon naqshi */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l15 15-15 15L15 15z' fill='%23C5A059' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDFBF7] rounded-bl-full shadow-inner border-l border-b border-[#D4AF37]/20 flex items-center justify-center">
                      <CalendarDays className="w-12 h-12 text-[#D4AF37]" />
                    </div>

                    <h3 className="font-serif text-3xl text-[#1A1A1A] mb-2 mt-20 relative z-10 font-medium">Nikoh Marosimi</h3>
                    <div className="font-sans text-[#D4AF37] tracking-[0.3em] mb-10 text-xs font-semibold uppercase relative z-10">SOAT 14:00</div>
                    <div className="w-16 h-[2px] bg-[#D4AF37]/60 mx-auto mb-10 relative z-10 animate-[shimmer_3s_infinite_alternate]"></div>

                    <div className="space-y-4 font-sans text-gray-500 font-light text-base leading-relaxed mb-10 relative z-10">
                      <p className="flex items-center justify-center gap-3"><Clock className="w-5 h-5 text-[#C5A059]" /> 15 May, Chorshanba</p>
                      <p className="flex items-start justify-center gap-3 text-left max-w-sm mx-auto"><MapPin className="w-6 h-6 text-[#C5A059] shrink-0" /> Botanika Bog'i markaziy favvorasi oldida.<br />Toshkent shahri, Yunusobod tumani.</p>
                    </div>
                  </motion.div>
                </TiltCard>

                {/* BAZM KARTASI (VERSAL - Maksimal Dabdaba) */}
                <TiltCard className="group mt-12 md:mt-0 md:-translate-y-12">
                  <motion.div
                    className="bg-gradient-to-br from-[#FCFAF8] to-[#FFF9F2] border-2 border-[#D4AF37] p-10 md:p-14 text-center rounded-2xl shadow-[0_30px_90px_rgba(197,160,89,0.3)] h-full relative overflow-hidden"
                    initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}
                  >
                    {/* Burchak bezaklari */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37]"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]"></div>

                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#FCFAF8] p-4 rounded-full border border-[#D4AF37]/30 shadow-xl">
                      <Heart className="w-12 h-12 text-[#D4AF37] animate-[pulse_2s_infinite]" />
                    </div>

                    <h3 className="font-['Cinzel'] text-4xl text-[#1A1A1A] mb-2 mt-20 relative z-10 tracking-widest uppercase font-semibold">"Versal" Saroyi</h3>
                    <div className="font-sans text-[#D4AF37] tracking-[0.3em] mb-10 text-xs font-semibold uppercase relative z-10 border border-[#D4AF37]/40 inline-block px-4 py-1">Asosiy Tantana</div>
                    <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mb-10 relative z-10 animate-[shimmer_2s_infinite]"></div>

                    <div className="space-y-4 font-sans text-[#2A2A2A] font-medium text-lg leading-relaxed mb-12 relative z-10">
                      <p className="flex items-center justify-center gap-3"><Clock className="w-5 h-5 text-[#C5A059]" /> SOAT 18:00 dan</p>
                      <p className="flex items-start justify-center gap-3 text-left max-w-sm mx-auto"><MapPin className="w-6 h-6 text-[#C5A059] shrink-0" /> Toshkent shahri, Yunusobod tumani, Bog'ishamol ko'chasi, 12-uy.</p>
                    </div>

                    <a href="https://maps.google.com/?q=Versal+To'yxonasi+Toshkent" target="_blank" className="inline-block border-2 border-[#D4AF37] text-[#8A6D3B] font-['Cinzel'] text-xs font-semibold tracking-[0.3em] uppercase px-10 py-4 hover:bg-[#D4AF37] hover:text-white transition-all duration-300 rounded-full relative z-10 hover:shadow-[0_10px_30px_rgba(197,160,89,0.4)]">
                      Xaritani ochish
                    </a>
                  </motion.div>
                </TiltCard>

              </div>
            </div>
          </section>

          {/* --- 4. TAYMER (QIROLLIK KUTISHI - Eng Pastda) --- */}
          <section className="py-28 bg-white relative z-20 border-t border-[#D4AF37]/20 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
            <div className="max-w-4xl mx-auto px-4 text-center">

              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Gold_decorative_element.png" alt="ornament" className="w-24 mx-auto opacity-30 mb-8 rotate-180" />

              <motion.h2
                className="font-['Great_Vibes'] text-5xl md:text-6xl text-[#C5A059] mb-16 drop-shadow-sm font-medium"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
              >
                Tantanaga qolgan vaqt
              </motion.h2>

              <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto justify-center items-center">
                {[
                  { label: 'Kun', value: timeLeft.kun },
                  { label: 'Soat', value: timeLeft.soat },
                  { label: 'Daqiqa', value: timeLeft.daqiqa }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center bg-[#FCFAF8] p-6 rounded-t-full rounded-b-xl border border-[#D4AF37]/20 shadow-[0_10px_40px_rgba(197,160,89,0.08)]"
                    initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.2, duration: 1 }}
                  >
                    <span className="font-serif text-5xl md:text-8xl text-[#1A1A1A] mb-1 font-medium drop-shadow-[0_2px_5px_rgba(0,0,0,0.1)]">{item.value.toString().padStart(2, '0')}</span>
                    <span className="font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#C5A059] font-bold border-t border-[#D4AF37]/30 pt-2">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 text-center relative z-20 bg-[#FAF8F5] border-t border-gray-100">
            <p className="font-['Cinzel'] text-[10px] tracking-[0.4em] text-gray-400 uppercase">
              Exclusive design by <span className="text-[#D4AF37] font-semibold">WebLeaders</span>
            </p>
          </footer>

        </motion.div>
      )}
    </div>
  );
};

export default WeddingLanding;