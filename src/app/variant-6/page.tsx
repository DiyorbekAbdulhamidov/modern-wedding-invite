"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Play, MapPin, Camera, GlassWater, Utensils, Sparkles, BookHeart, CalendarHeart, CheckCircle, Mail, Calendar, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// ==========================================
// 3D MATH PARTICLE ENGINE (THREE.JS VIBE)
// ==========================================
interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  alpha: number; size: number;
}

const Quantum3DCanvas = ({ isTriggered }: { isTriggered: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);
  const speedRef = useRef<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 450;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Init Universe Particles (Ambient)
    particles.current = Array.from({ length: 120 }, () => ({
      x: (Math.random() - 0.5) * canvas.width * 2,
      y: (Math.random() - 0.5) * canvas.height * 2,
      z: Math.random() * canvas.width,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      vz: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.5 + 0.3,
      size: Math.random() * 1.5 + 0.5
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Smoothly accelerate particles during explosion
      if (isTriggered && speedRef.current < 25) {
        speedRef.current += 0.8;
      }

      particles.current.forEach((p) => {
        p.z += p.vz * speedRef.current;
        p.x += p.vx * (isTriggered ? speedRef.current * 0.5 : 1);
        p.y += p.vy * (isTriggered ? speedRef.current * 0.5 : 1);

        // Reset particle loop
        if (p.z <= 0) {
          p.z = canvas.width;
          p.x = (Math.random() - 0.5) * canvas.width * 2;
          p.y = (Math.random() - 0.5) * canvas.height * 2;
          if (isTriggered) p.alpha = 0; // Fade out exploded ones
        }

        // 3D Perspective Projection Matrix
        const k = canvas.width / p.z;
        const px = p.x * k + cx;
        const py = p.y * k + cy;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const size = p.size * k * 0.8;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.1, size), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(197, 160, 89, ${p.alpha * (k / 3)})`;
          ctx.shadowBlur = isTriggered ? 15 : 5;
          ctx.shadowColor = '#C5A059';
          ctx.fill();
        }
      });

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isTriggered]);

  // Massive explosion injection when clicked
  useEffect(() => {
    if (isTriggered) {
      for (let i = 0; i < 250; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        particles.current.push({
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20,
          z: (canvasRef.current?.width || 450) * 0.8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          vz: -Math.random() * 5 - 2,
          alpha: 1,
          size: Math.random() * 2.5 + 1
        });
      }
    }
  }, [isTriggered]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[90]" />;
};

// --- AUDIO WAVE INTERACTIVE VISUALIZER ---
const AudioWaveform = ({ isPlaying }: { isPlaying: boolean }) => (
  <div className="flex items-end gap-[3px] h-4 w-6 justify-center">
    {[0.7, 1.2, 0.4, 0.9, 0.6, 1.0].map((speed, i) => (
      <motion.div
        key={i}
        className="w-[2px] bg-[#C5A059] rounded-full"
        initial={{ height: "3px" }}
        animate={isPlaying ? { height: ["3px", "18px", "3px"] } : { height: "3px" }}
        transition={{ duration: speed, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
      />
    ))}
  </div>
);

const UltraLuxuryWedding: NextPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<null | 'attending' | 'declined'>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const timelineLineY = useTransform(scrollYProgress, [0.18, 0.5], ["0%", "100%"]);

  // 3D Card Hover / Tilt Effects Matrix
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(springY, [-200, 200], [12, -12]);
  const rotateY = useTransform(springX, [-200, 200], [-12, 12]);
  const glareX = useTransform(springX, [-200, 200], ["0%", "100%"]);
  const glareY = useTransform(springY, [-200, 200], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleStart = () => {
    setIsExploding(true); // Fire 3D explosion first
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => console.log("Blocked."));
    }
    setTimeout(() => {
      setIsStarted(true);
    }, 1200); // Wait for the matrix burst to blind the view beautifully
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const downloadCalendarEvent = () => {
    const iCalendarData = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
      'DESCRIPTION:Sardor & Amira Visol Oqshomi',
      'DTSTART:20260515T130000Z', 'DTEND:20260515T180000Z',
      'LOCATION:Versal Saroyi, Toshkent', 'SUMMARY:Sardor & Amira Nikoh Tantanasi',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([iCalendarData], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'sardor-amira.ics');
    link.click();
  };

  const [timeLeft, setTimeLeft] = useState({ kun: 0, soat: 0, daqiqa: 0, soniya: 0 });
  const targetDate = new Date('2026-05-15T18:00:00').getTime();

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
  }, [isStarted]);

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen flex justify-center selection:bg-[#C5A059] selection:text-white font-sans overflow-hidden antialiased">
      <div className="w-full max-w-[450px] bg-[#FFFFFF] text-[#111111] relative overflow-x-hidden shadow-[0_0_120px_rgba(0,0,0,0.4)]">

        <Head>
          <title>Sardor & Amira | The Royal 3D Masterpiece</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Alex+Brush&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </Head>

        <audio ref={audioRef} loop preload="auto">
          <source src="/die.mp3" type="audio/mpeg" />
        </audio>

        {/* --- 3D PARTICLE BURST SPLASH SCREEN --- */}
        <AnimatePresence>
          {!isStarted && (
            <div className="fixed inset-0 z-[200] flex justify-center items-center overflow-hidden max-w-[450px] mx-auto bg-[#0A0A0A]">
              <Quantum3DCanvas isTriggered={isExploding} />

              {/* Gate Left */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#0A0A0A] border-r-[0.5px] border-[#C5A059]/20 z-10 shadow-[20px_0_50px_rgba(0,0,0,0.8)]"
                exit={{ x: "-100%" }} transition={{ duration: 1.4, ease: [0.85, 0, 0.15, 1] }}
              />
              {/* Gate Right */}
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#0A0A0A] border-l-[0.5px] border-[#C5A059]/20 z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
                exit={{ x: "100%" }} transition={{ duration: 1.4, ease: [0.85, 0, 0.15, 1] }}
              />

              {/* Core Enter Trigger UI */}
              <motion.div
                className="absolute z-20 flex flex-col items-center justify-center text-center px-6"
                exit={{ opacity: 0, scale: 0.7, filter: "blur(15px)" }} transition={{ duration: 0.6 }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="font-['Playfair_Display'] text-[5.5rem] text-[#C5A059] font-extralight tracking-widest leading-none opacity-90 mb-4 selection:bg-transparent"
                >
                  S & A
                </motion.div>
                <p className="font-['Montserrat'] text-[8px] tracking-[0.6em] text-gray-400 uppercase mb-24 font-light">EXCLUSIVE KINETIC INVITATION</p>

                <button
                  onClick={handleStart}
                  className="w-24 h-24 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent border border-[#C5A059]/40 flex flex-col items-center justify-center text-[#C5A059] relative group backdrop-blur-md active:scale-95 transition-all duration-300"
                >
                  <motion.div className="absolute inset-0 rounded-full border border-[#C5A059]/20" animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                  <Play className="w-5 h-5 ml-1 text-[#C5A059] fill-current" />
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- MAIN HIGH-END SITE ARCHITECTURE --- */}
        {isStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10 bg-[#FFFFFF]">

            {/* AMBIENT LIVING UNIVERSE CANVAS BACKGROUND */}
            <Quantum3DCanvas isTriggered={false} />

            {/* FLOATING GLASS PLAYER CONTROLLER */}
            <motion.button
              onClick={toggleMusic}
              className="fixed bottom-6 right-6 z-[150] px-4 h-12 bg-white/70 backdrop-blur-xl rounded-full flex items-center gap-3 shadow-[0_20px_40px_rgba(197,160,89,0.15)] border border-[#C5A059]/20 active:scale-95 transition-all"
            >
              <AudioWaveform isPlaying={isPlaying} />
              <div className="w-[1px] h-3 bg-gray-200" />
              {isPlaying ? <Volume2 className="text-[#C5A059] w-4 h-4 animate-pulse" /> : <VolumeX className="text-gray-400 w-4 h-4" />}
            </motion.button>

            {/* =========================================
                1. HERO SECTION (3D Gyro Hologram)
            ========================================= */}
            <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-16 pb-20 overflow-hidden">
              <span className="font-['Montserrat'] tracking-[0.7em] text-[8px] text-[#C5A059] font-bold uppercase mb-12 block">
                THE WEDDING CELEBRATION
              </span>

              {/* Advanced 3D Interactive Frame Matrix */}
              <div
                className="relative w-[80%] aspect-[3/4] mb-12 perspective-[1000px] cursor-grab active:cursor-grabbing"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                  className="w-full h-full rounded-t-[15rem] rounded-b-[2rem] border-[0.5px] border-[#C5A059]/60 p-2 shadow-[0_35px_80px_rgba(0,0,0,0.08)] bg-white relative group transition-all"
                >
                  <div className="w-full h-full rounded-t-[14.5rem] rounded-b-[1.6rem] overflow-hidden relative" style={{ transform: "translateZ(30px)" }}>
                    <img src="/dreamwedding.jpg" alt="Masterpiece Frame" className="w-full h-full object-cover object-top scale-105 group-hover:scale-100 transition-transform duration-[2s]" />
                    {/* Advanced Glare Reflection Layer */}
                    <motion.div
                      style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.4) ${glareX}, transparent ${glareY})` }}
                      className="absolute inset-0 pointer-events-none mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent opacity-90" />
                  </div>
                </motion.div>
              </div>

              {/* High-End Overlapping Typography */}
              <div className="relative z-30 flex flex-col items-center w-full px-4 text-center">
                <h1 className="font-['Playfair_Display'] text-[5rem] font-light text-[#111] leading-none tracking-tight">Sardor</h1>
                <div className="font-['Alex_Brush'] text-[3.8rem] text-[#C5A059] my-[-15px] italic select-none rotate-[-6deg]">and</div>
                <h1 className="font-['Playfair_Display'] text-[5rem] font-light text-[#111] leading-none tracking-tight ml-12">Amira</h1>

                <div className="flex items-center justify-center gap-4 mt-16 w-full max-w-[260px]">
                  <div className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]" />
                  <p className="font-['Montserrat'] tracking-[0.4em] text-[10px] text-[#111] font-bold">15 . 05 . 2026</p>
                  <div className="h-[0.5px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]" />
                </div>
              </div>
            </section>

            {/* =========================================
                2. ASYMMETRIC TIMELINE (Cinematic Stream)
            ========================================= */}
            <section className="py-28 px-6 relative z-10 bg-[#FAF9F5]">
              <div className="text-left max-w-[340px] mx-auto mb-20">
                <CalendarHeart className="w-6 h-6 text-[#C5A059] mb-4 opacity-80" />
                <h2 className="font-['Playfair_Display'] text-3xl font-light text-[#111] tracking-wide">Taqdir Yo'llari</h2>
                <p className="font-['Montserrat'] text-[8px] tracking-[0.25em] text-gray-400 uppercase mt-1">THE SACRED CHRONICLES</p>
              </div>

              <div className="relative max-w-[340px] mx-auto pl-6">
                {/* Micro-engineered timeline rail */}
                <div className="absolute left-[3px] top-2 bottom-2 w-[0.5px] bg-gray-200" />
                <motion.div
                  style={{ height: timelineLineY }}
                  className="absolute left-[3px] top-2 w-[1px] bg-[#C5A059] origin-top shadow-[0_0_10px_#C5A059]"
                />

                {[
                  { date: "Oktabr, 2024", title: "Ruhlar To'qnashuvi", desc: "Ikki uzoq qalbning bir lahzalik tasodifiy nigohda mangu bog'lanishi." },
                  { date: "Noyabr, 2025", title: "Oq Fotiha Va Rizo", desc: "Oila muqaddasligi yo'lida kattalarning oq duosi va go'zal ahdlashuv." },
                  { date: "May, 2026", title: "Visol Va Abadiyat", desc: "Alloh guvohligida ikki daryoning bitta ummonga aylanish oqshomi." }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-120px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
                    className="relative mb-16 last:mb-0 block"
                  >
                    <div className="absolute left-[-26px] top-1.5 w-2 h-2 rounded-full bg-white border-2 border-[#C5A059] z-20 shadow-sm" />
                    <span className="font-['Montserrat'] text-[8.5px] tracking-[0.2em] text-[#C5A059] font-bold block mb-1 uppercase">{item.date}</span>
                    <h4 className="font-['Playfair_Display'] text-[17px] text-[#111] font-medium mb-2">{item.title}</h4>
                    <p className="font-['Playfair_Display'] text-[13.5px] text-gray-500 italic leading-[1.8]">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* =========================================
                3. VOGUE EDITION EHTIROM MAKTUBI
            ========================================= */}
            <section className="py-28 px-6 bg-[#FFFFFF] relative z-10">
              <div className="relative max-w-[360px] mx-auto">
                {/* Layered Floating Card Design */}
                <div className="absolute inset-0 bg-[#FAF9F5] rounded-[2.5rem] transform translate-y-4 translate-x-2 -rotate-1 pointer-events-none" />

                <div className="bg-white p-12 border border-gray-100/80 shadow-[0_30px_70px_rgba(0,0,0,0.03)] rounded-[2.5rem] relative overflow-hidden text-center z-10">
                  <BookHeart className="w-6 h-6 text-[#C5A059] mx-auto mb-6 opacity-70" />

                  <p className="font-['Montserrat'] text-[8.5px] tracking-[0.4em] text-[#C5A059] uppercase font-bold mb-10">TASHRIFINGIZ — KO'RKIMIZ</p>

                  <div className="font-['Playfair_Display'] text-[15px] text-gray-700 leading-[2.5] italic space-y-6">
                    <p>"Yaratgan ato etgan eng go'zal ne'mat farzand kamolini ko'rmoqdir.</p>
                    <div className="my-8 py-3 border-y border-gray-100/80 not-italic">
                      <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-gray-400 font-bold block mb-1">Kalin & Kuyov:</span>
                      <h3 className="font-['Playfair_Display'] text-[1.3rem] tracking-wide font-medium text-black">Sardorjon & Amiraxon</h3>
                    </div>
                    <p>Ushbu baxt oqshomida siz kabi aziz, qalbi daryo insonlarning samimiy duolari davramizga fayz bag'ishlaydi. Lutfan taklif etamiz."</p>
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <span className="font-['Montserrat'] text-[8px] uppercase tracking-widest text-gray-400 block mb-2">Xonadon Egalari:</span>
                    <p className="font-['Playfair_Display'] text-[16px] text-[#111] font-semibold">Ikromovlar va Aliyevlar oilasi</p>
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================
                4. THE ROYAL PROGRAM (Asymmetric Luxury Card)
            ========================================= */}
            <section className="py-28 px-6 bg-[#FAF9F5] relative z-10">
              <div className="text-center mb-20">
                <h2 className="font-['Playfair_Display'] text-3xl font-light tracking-wide text-[#111]">Tantana Nizomi</h2>
                <p className="font-['Montserrat'] text-[8px] tracking-[0.3em] text-gray-400 uppercase mt-2">CHRONOLOGICAL DYNAMICS</p>
              </div>

              <div className="space-y-6 max-w-[340px] mx-auto">
                {[
                  { icon: Camera, time: "14:00", title: "Kino & Foto Marosim", desc: "Xotiralarga muhrlanadigan go'zal on" },
                  { icon: GlassWater, time: "17:30", title: "Symphony Welcome", desc: "Jonli klassik orkestr ostida qabul" },
                  { icon: Utensils, time: "18:00", title: "Shohona Asosiy Bazm", desc: "Dabdabali \"Versal\" saroyi yorqin oqshomi", dynamic: true }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className={`p-6 rounded-2xl border transition-all duration-400 ${item.dynamic ? 'bg-[#111] text-white border-[#C5A059] shadow-[0_20px_40px_rgba(0,0,0,0.15)]' : 'bg-white border-gray-100 shadow-sm'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.dynamic ? 'bg-[#C5A059]/10 border-[#C5A059]/40 text-[#C5A059]' : 'bg-[#FAF9F5] border-gray-100 text-gray-700'}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-['Playfair_Display'] text-[18px] font-semibold ${item.dynamic ? 'text-[#C5A059]' : 'text-[#111]'}`}>{item.time}</span>
                          <span className={`w-1 h-1 rounded-full ${item.dynamic ? 'bg-[#C5A059]' : 'bg-gray-300'}`} />
                          <h4 className="font-['Montserrat'] text-[10px] font-bold tracking-wider uppercase">{item.title}</h4>
                        </div>
                        <p className={`font-['Playfair_Display'] text-[13px] italic ${item.dynamic ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* =========================================
                5. UX LOCATION & SMART CALENDAR ENGINE
            ========================================= */}
            <section className="py-24 px-6 bg-[#FFFFFF] space-y-8 max-w-[350px] mx-auto">
              {/* Maps Grid */}
              <div className="p-8 rounded-[2rem] border border-gray-100 text-center shadow-[0_15px_40px_rgba(0,0,0,0.02)] bg-white">
                <MapPin className="w-5 h-5 text-[#C5A059] mx-auto mb-4" />
                <h3 className="font-['Playfair_Display'] text-[19px] font-medium text-[#111] mb-2">Manzil Geolokatsiyasi</h3>
                <p className="font-['Montserrat'] text-[11px] text-gray-500 leading-relaxed mb-6">
                  Toshkent sh., Yunusobod tumani, Teleminora ro'parasidan o'ngga burilish.
                </p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-[#111] text-white font-['Montserrat'] text-[9px] tracking-[0.25em] font-bold uppercase rounded-xl hover:bg-[#C5A059] transition-all flex items-center justify-center gap-2 shadow-sm">
                  Xaritada Ko'rish <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              {/* Advanced Calendar Syncer UX */}
              <div className="p-8 rounded-[2rem] border border-gray-100 text-center shadow-[0_15px_40px_rgba(0,0,0,0.02)] bg-[#FAF9F5]">
                <Calendar className="w-5 h-5 text-[#C5A059] mx-auto mb-4" />
                <h3 className="font-['Playfair_Display'] text-[19px] font-medium text-[#111] mb-2">Smart Sinxronizatsiya</h3>
                <p className="font-['Montserrat'] text-[11px] text-gray-500 leading-relaxed mb-6">
                  Ushbu muqaddas sanani unutilmasligi uchun bitta klik orqali shaxsiy taqvimingizga saqlab qo'ying.
                </p>
                <button onClick={downloadCalendarEvent} className="w-full py-4 bg-white border border-gray-200 text-gray-800 font-['Montserrat'] text-[9px] tracking-[0.25em] font-bold uppercase rounded-xl hover:border-[#C5A059] hover:text-[#C5A059] transition-all flex items-center justify-center gap-2">
                  Taqvimga kiritish (ICS)
                </button>
              </div>
            </section>

            {/* =========================================
                6. HIGH-END RSVP SYSTEM (Digital Ticket)
            ========================================= */}
            <section className="py-28 px-6 bg-[#0B0B0B] text-white relative overflow-hidden">
              <div className="relative z-10 max-w-[340px] mx-auto text-center">
                <Mail className="w-5 h-5 text-[#C5A059] mx-auto mb-4" />
                <h3 className="font-['Playfair_Display'] text-2xl mb-2 tracking-wide font-light">Tashrif Tasdig'i</h3>
                <p className="font-['Montserrat'] text-[8px] text-gray-400 tracking-[0.3em] uppercase mb-12">ONLAYN RSVP DEPARTAMENTI</p>

                <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 backdrop-blur-md shadow-2xl">
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="form-container" exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
                        <button onClick={() => setRsvpStatus('attending')} className="w-full py-4 bg-[#C5A059] text-white font-['Montserrat'] text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl hover:bg-[#b08f51] transition-all shadow-lg">
                          Lutfan boraman
                        </button>
                        <button onClick={() => setRsvpStatus('declined')} className="w-full py-4 bg-transparent border border-white/10 text-gray-400 font-['Montserrat'] text-[10px] tracking-[0.2em] uppercase rounded-xl hover:text-white hover:border-white/30 transition-all">
                          Uzr, bora olmayman
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key="success-container" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-6">
                        <div className="w-12 h-12 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-5 h-5 text-[#C5A059]" />
                        </div>
                        <p className="font-['Playfair_Display'] text-[19px] italic text-white mb-1">Munosabatingiz Saqlandi!</p>
                        <p className="font-['Montserrat'] text-[8px] text-gray-500 tracking-widest uppercase">Webleaders Smart System</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* =========================================
                7. THE QUANTUM TIMER
            ========================================= */}
            <section className="py-28 bg-[#FFFFFF] px-6 text-center relative z-10">
              <h2 className="font-['Alex_Brush'] text-[3.5rem] text-[#C5A059] mb-12 select-none">Visolgacha Qolgan Vaqt</h2>

              <div className="flex justify-center gap-3">
                {[
                  { label: 'KUN', value: timeLeft.kun },
                  { label: 'SOAT', value: timeLeft.soat },
                  { label: 'DAQIQA', value: timeLeft.daqiqa },
                  { label: 'SONIYA', value: timeLeft.soniya }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center bg-[#FAF9F5] w-[75px] py-5 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="font-['Playfair_Display'] text-[26px] text-[#111] font-medium mb-0.5">{item.value.toString().padStart(2, '0')}</span>
                    <span className="font-['Montserrat'] text-[7.5px] tracking-widest text-gray-400 font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ULTRA LUXURY FOOTER BRANDING */}
            <footer className="py-16 text-center bg-[#070707] border-t border-white/[0.04] relative z-10">
              <p className="font-['Montserrat'] text-[9px] tracking-[0.6em] text-[#C5A059] uppercase font-bold mb-4">
                DESIGNED BY <Link href="https://webleaders.uz" className="hover:opacity-80 transition-opacity">WEBLEADERS</Link>
              </p>
              <p className="font-['Montserrat'] text-[7px] tracking-[0.25em] text-gray-600 uppercase">
                DIGITAL EXPERIMENTAL ARCHITECTURE © 2026
              </p>
            </footer>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UltraLuxuryWedding;