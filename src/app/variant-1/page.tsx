"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle, Loader2, Volume2, VolumeX, Camera, Heart, Calendar } from 'lucide-react';
import * as THREE from 'three';

// --- THREE.JS 3D PROCEDURAL DOVES BACKGROUND ---
const ThreeDovesCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffe6cc, 1.2);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Procedural Low-Poly Dove Creation
    const doveCount = 12;
    const doves: Array<{
      group: THREE.Group;
      leftWing: THREE.Mesh;
      rightWing: THREE.Mesh;
      speed: number;
      wingSpeed: number;
      amplitude: number;
      phase: number;
    }> = [];

    const doveMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      flatShading: true,
      shininess: 30
    });

    for (let i = 0; i < doveCount; i++) {
      const doveGroup = new THREE.Group();

      // Body (Cone Shape)
      const bodyGeo = new THREE.ConeGeometry(0.15, 0.8, 4);
      bodyGeo.rotateX(Math.PI / 2);
      const body = new THREE.Mesh(bodyGeo, doveMaterial);
      doveGroup.add(body);

      // Tail
      const tailGeo = new THREE.PlaneGeometry(0.3, 0.4);
      const tail = new THREE.Mesh(tailGeo, doveMaterial);
      tail.position.set(0, 0, -0.5);
      tail.rotateX(Math.PI / 6);
      doveGroup.add(tail);

      // Left Wing
      const leftWingGeo = new THREE.BufferGeometry();
      const leftVertices = new Float32Array([
        0, 0, 0,      // root
        -1.2, 0.2, 0.2, // tip
        -0.4, 0, -0.4  // back
      ]);
      leftWingGeo.setAttribute('position', new THREE.BufferAttribute(leftVertices, 3));
      leftWingGeo.computeVertexNormals();
      const leftWing = new THREE.Mesh(leftWingGeo, doveMaterial);
      doveGroup.add(leftWing);

      // Right Wing
      const rightWingGeo = new THREE.BufferGeometry();
      const rightVertices = new Float32Array([
        0, 0, 0,
        1.2, 0.2, 0.2,
        0.4, 0, -0.4
      ]);
      rightWingGeo.setAttribute('position', new THREE.BufferAttribute(rightVertices, 3));
      rightWingGeo.computeVertexNormals();
      const rightWing = new THREE.Mesh(rightWingGeo, doveMaterial);
      doveGroup.add(rightWing);

      // Random Initial Scale & Position
      const scale = 0.6 + Math.random() * 0.6;
      doveGroup.scale.set(scale, scale, scale);

      doveGroup.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );

      scene.add(doveGroup);

      doves.push({
        group: doveGroup,
        leftWing,
        rightWing,
        speed: 0.02 + Math.random() * 0.03,
        wingSpeed: 8 + Math.random() * 6,
        amplitude: 0.4 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      doves.forEach((dove) => {
        // Move Forward (Fly along Z and X)
        dove.group.position.z += dove.speed;
        dove.group.position.x += Math.sin(elapsedTime + dove.phase) * 0.01;
        dove.group.position.y += Math.cos(elapsedTime + dove.phase) * 0.008;

        // Wing Flapping Animation (Rotate wings on Z axis)
        const wingRotation = Math.sin(elapsedTime * dove.wingSpeed + dove.phase) * dove.amplitude;
        dove.leftWing.rotation.z = wingRotation;
        dove.rightWing.rotation.z = -wingRotation;

        // Subtle tilting into movement
        dove.group.rotation.y = Math.sin(elapsedTime + dove.phase) * 0.15;
        dove.group.rotation.z = Math.cos(elapsedTime + dove.phase) * 0.05;

        // Respawn when out of view bounds
        if (dove.group.position.z > 12) {
          dove.group.position.z = -15;
          dove.group.position.x = (Math.random() - 0.5) * 20;
          dove.group.position.y = (Math.random() - 0.5) * 15;
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-10" />;
};

// --- MAIN MASTERPIECE PAGE ---

const AbsoluteAvantGardeWedding: NextPage = () => {
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
      .catch((err) => console.log("Audio deferred:", err));
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    }
  };

  const handleRSVP = async (status: 'attending' | 'declined') => {
    if (!guestName.trim()) {
      alert('Iltimos, ismingizni yozib qoldiring.');
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
            text: `🦅 *Couture RSVP Tizimi*\n\n👤 *Mehmon:* ${guestName}\n*Holati:* ${status === 'attending' ? '✅ Keladi' : '❌ Kelmaydi'}`,
            parse_mode: 'Markdown'
          }),
        });
      } catch (error) {
        console.error(error);
      }
    }

    setRsvpStatus(status);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-[#F6F6F2] min-h-[100svh] text-[#111111] flex justify-center overflow-hidden font-outfit antialiased selection:bg-[#D4AF37]/30">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Outfit:wght@200;300;400;500&family=Pinyon+Script&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-outfit { font-family: 'Outfit', sans-serif; }
        .font-pinyon { font-family: 'Pinyon Script', cursive; }
        
        .luxury-text-gradient {
          background: linear-gradient(135deg, #111111 0%, #4a3b2c 50%, #111111 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <div className="w-full max-w-[450px] relative bg-white/90 backdrop-blur-md shadow-[0_0_80px_rgba(0,0,0,0.04)] border-x border-[#EBEBE3]">
        <Head>
          <title>Sardor & Amira | High-End Wedding Invitation</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <audio ref={audioRef} loop preload="auto">
          <source src="/die.mp3" type="audio/mpeg" />
        </audio>

        {/* 3D Dynamic Layers */}
        {isStarted && <ThreeDovesCanvas />}

        {/* --- CINEMATIC OPENING SCREEN --- */}
        <AnimatePresence>
          {!isStarted && (
            <motion.div
              className="fixed inset-0 z-[300] flex flex-col items-center justify-between bg-[#FFFFFF] px-10 py-16 text-center"
              exit={{ opacity: 0, scale: 1.08, filter: "blur(15px)" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-full flex items-center justify-between border-b border-[#F0F0E8] pb-4">
                <span className="font-outfit text-[9px] tracking-[0.5em] text-[#999] uppercase">M26 · Invitation</span>
                <span className="font-outfit text-[9px] tracking-[0.5em] text-[#999] uppercase">Tashkent</span>
              </div>

              <div className="my-auto space-y-6 relative">
                <motion.div
                  initial={{ rotate: -10, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 1.5 }}
                  className="font-pinyon text-7xl text-[#C5A880]"
                >
                  Welcome
                </motion.div>
                <h1 className="font-cinzel text-3xl sm:text-4xl font-light tracking-[0.25em] text-[#111] leading-relaxed luxury-text-gradient">
                  SARDOR <br />& AMIRA
                </h1>
                <p className="font-outfit text-[10px] tracking-[0.6em] uppercase text-[#C5A880] font-medium">VISOL OKSHOMI</p>
              </div>

              <motion.button
                onClick={handleStart}
                whileHover={{ letterSpacing: "0.5em" }}
                className="w-full py-4 bg-[#111111] text-white font-outfit text-[10px] tracking-[0.4em] uppercase transition-all duration-500 rounded-none shadow-xl"
              >
                Kirish Tantanasi
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- STICKY HUD MUSIC CONTROL --- */}
        {isStarted && (
          <motion.button
            onClick={toggleMusic}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-6 z-[200] w-12 h-12 flex items-center justify-center rounded-full bg-white/90 border border-[#EBEBE3] shadow-lg text-[#111]"
          >
            {isPlaying ? <Volume2 size={16} className="animate-bounce" /> : <VolumeX size={16} />}
          </motion.button>
        )}

        {/* --- MAIN HIGH-DYNAMIC SCROLLER --- */}
        {isStarted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-20">

            {/* HERO HERO HERO */}
            <section className="min-h-[100svh] flex flex-col justify-between px-8 py-16 text-center relative">
              <div className="pt-4 flex flex-col items-center">
                <Heart size={18} strokeWidth={1} className="text-[#C5A880] animate-pulse" />
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#C5A880] to-transparent mt-3" />
              </div>

              <div className="my-auto space-y-12">
                <div className="relative">
                  <span className="absolute -top-12 left-1/2 -translate-x-1/2 font-pinyon text-8xl text-[#F6F6F2] -z-10 select-none">Love</span>
                  <h2 className="font-cinzel text-5xl font-light tracking-[0.15em] text-[#111] mb-4">SARDOR</h2>
                  <p className="font-pinyon text-4xl text-[#C5A880] my-2">and</p>
                  <h2 className="font-cinzel text-5xl font-light tracking-[0.15em] text-[#111] mt-4">AMIRA</h2>
                </div>

                <div className="space-y-2">
                  <p className="font-outfit text-xs tracking-[0.4em] font-light text-[#555]">SHANBA KUNI SOAT 17:00</p>
                  <p className="font-cinzel text-xl tracking-[0.2em] font-medium text-[#C5A880]">20.06.2026</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p className="font-outfit text-[9px] tracking-[0.4em] text-[#999] uppercase">Pastga varaqlang</p>
                <div className="w-5 h-8 border border-[#111]/20 rounded-full mt-2 flex justify-center p-1">
                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1.5 bg-[#C5A880] rounded-full" />
                </div>
              </div>
            </section>

            {/* INTRO DUO IMAGE & PARALLAX FLUID CONTENT */}
            <section className="py-24 px-6 bg-white border-y border-[#F0F0E8]">
              <div className="space-y-12 max-w-[360px] mx-auto">

                {/* Image Placeholder Element with Framing */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2 }}
                  className="relative p-3 border border-[#EBEBE3] bg-[#FAF9F5] group overflow-hidden"
                >
                  <div className="w-full h-[400px] bg-[#EBEBE3] relative overflow-hidden flex items-center justify-center">
                    {/* Siz bu yerga istalgan to'y rasmini qo'yasiz */}
                    <img
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
                      alt="Wedding Couple Frame"
                      className="w-full h-full object-cover grayscale contrast-115 group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <Camera size={24} className="absolute text-white/50 stroke-1 pointer-events-none" />
                  </div>
                </motion.div>

                <div className="text-center space-y-6">
                  <span className="font-outfit text-[9px] tracking-[0.6em] uppercase text-[#C5A880] block">Taklif xati</span>
                  <h3 className="font-cinzel text-2xl font-light tracking-wide text-[#111]">AZIZ MEHMONIMIZ</h3>
                  <p className="font-outfit text-sm text-[#444] font-light leading-relaxed">
                    Hayotimizning yangi va eng chiroyli davri boshlanayotgan ushbu kunda, hayotimizning ajralmas qismiga aylangan siz kabi qadrdonlarimizni yonimizda ko'rishdan baxtiyor bo'lamiz. Visol oqshomimizning fayzi va quvonchi siz bilan to'liq bo'ladi.
                  </p>
                </div>
              </div>
            </section>

            {/* HIGH-TECH COUNTDOWN */}
            <section className="py-20 px-8 bg-[#FAF9F5] text-center relative border-b border-[#F0F0E8]">
              <div className="max-w-[320px] mx-auto space-y-8">
                <div className="flex items-center justify-center gap-2">
                  <Calendar size={14} className="text-[#C5A880]" />
                  <span className="font-outfit text-[10px] tracking-[0.4em] uppercase text-[#777] font-medium">Gala-Kechaga Qadar</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "KUN", value: timeLeft.kun },
                    { label: "SOAT", value: timeLeft.soat },
                    { label: "MIN", value: timeLeft.daqiqa },
                    { label: "SEK", value: timeLeft.soniya }
                  ].map((t, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="bg-white border border-[#EBEBE3] py-4 flex flex-col items-center shadow-xs"
                    >
                      <span className="font-cinzel text-3xl font-light text-[#111]">{t.value.toString().padStart(2, '0')}</span>
                      <span className="font-outfit text-[8px] tracking-widest text-[#999] mt-2 font-medium">{t.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* VISUAL CHRONOLOGY / TIMELINE */}
            <section className="py-24 px-8 bg-white">
              <div className="max-w-[320px] mx-auto">
                <div className="text-center mb-16">
                  <span className="font-outfit text-[9px] tracking-[0.6em] uppercase text-[#C5A880] block mb-2">Xronologiya</span>
                  <h3 className="font-cinzel text-2xl font-light tracking-[0.2em]">BAZMI TARTIBI</h3>
                </div>

                <div className="space-y-12">
                  {[
                    { time: "14:00", name: "Nikoh Guvohnomasi", loc: "FHDYo Saroyi marosimi" },
                    { time: "17:00", name: "Welcome Cocktail", loc: "Live saksofon ijrosi va fureshet" },
                    { time: "18:00", name: "Katta Tantana", loc: "Versal Saroyi ochilish eshiklari" }
                  ].map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className="group flex justify-between items-start border-b border-[#F0F0E8] pb-6"
                    >
                      <div className="w-1/4">
                        <span className="font-cinzel text-xl text-[#C5A880] font-medium group-hover:tracking-widest transition-all duration-300">{event.time}</span>
                      </div>
                      <div className="w-3/4 text-right space-y-1">
                        <h4 className="font-cinzel text-base font-light text-[#111] tracking-wide">{event.name}</h4>
                        <p className="font-outfit text-xs text-[#777] font-light italic">{event.loc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ADVANCED GALLERIA GRID */}
            <section className="py-24 px-6 bg-[#FAF9F5] border-y border-[#F0F0E8]">
              <div className="max-w-[380px] mx-auto space-y-6">
                <div className="text-center mb-10">
                  <span className="font-outfit text-[9px] tracking-[0.5em] uppercase text-[#C5A880] block mb-2">Moments</span>
                  <h3 className="font-cinzel text-2xl font-light tracking-wide">PRE-WEDDING</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-[#EBEBE3] h-[220px] relative border border-[#EBEBE3] p-1.5 bg-white">
                      <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Gallery item" />
                    </div>
                    <div className="bg-[#EBEBE3] h-[150px] relative border border-[#EBEBE3] p-1.5 bg-white">
                      <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Gallery item" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="bg-[#EBEBE3] h-[150px] relative border border-[#EBEBE3] p-1.5 bg-white">
                      <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Gallery item" />
                    </div>
                    <div className="bg-[#EBEBE3] h-[220px] relative border border-[#EBEBE3] p-1.5 bg-white">
                      <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Gallery item" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* LOCATION MAP */}
            <section className="py-24 px-6 bg-white">
              <div className="max-w-[340px] mx-auto text-center space-y-6">
                <MapPin size={22} className="text-[#C5A880] mx-auto stroke-1 animate-bounce" />
                <h4 className="font-cinzel text-xl font-light tracking-widest text-[#111]">"VERSAL" RESTORANI</h4>
                <p className="font-outfit text-xs text-[#555] font-light leading-relaxed max-w-[260px] mx-auto">
                  Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi, 1A-uy
                </p>

                <div className="pt-4">
                  <Link
                    href="https://maps.google.com"
                    target="_blank"
                    className="font-outfit text-[10px] tracking-[0.4em] uppercase bg-[#111] text-white px-8 py-4 inline-block hover:bg-[#C5A880] transition-colors duration-300 shadow-md"
                  >
                    Xaritadan Ko'rish
                  </Link>
                </div>
              </div>
            </section>

            {/* RSVP PRESTIGE FORM */}
            <section className="py-24 px-6 bg-[#FAF9F5] border-t border-[#F0F0E8]">
              <div className="max-w-[330px] mx-auto text-center space-y-8">
                <div>
                  <span className="font-outfit text-[9px] tracking-[0.6em] uppercase text-[#C5A880] block mb-2">Registration</span>
                  <h3 className="font-cinzel text-2xl font-light tracking-wide text-[#111]">TASHRIFNI TASDIQLASH</h3>
                </div>

                <div className="bg-white p-8 border border-[#EBEBE3] shadow-xs">
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="form-container" exit={{ opacity: 0 }} className="space-y-6">
                        <div className="text-left space-y-2">
                          <label className="font-outfit text-[9px] tracking-widest uppercase text-[#555] font-medium">Sizning Ismingiz</label>
                          <input
                            type="text"
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                            placeholder="Masalan: Sardor Komilov"
                            className="w-full font-cinzel text-base py-3 bg-transparent text-[#111] border-b border-[#EBEBE3] focus:border-[#C5A880] focus:outline-none transition-colors placeholder:text-[#ccc]"
                          />
                        </div>

                        <div className="space-y-2 pt-4">
                          <button
                            onClick={() => handleRSVP('attending')}
                            disabled={isSubmitting}
                            className="w-full h-12 bg-[#111] text-white font-outfit text-[9px] tracking-[0.3em] uppercase font-medium disabled:opacity-50 active:scale-[0.99] transition-transform flex items-center justify-center"
                          >
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "Mamnuniyat bilan boraman"}
                          </button>
                          <button
                            onClick={() => handleRSVP('declined')}
                            disabled={isSubmitting}
                            className="w-full h-12 border border-[#EBEBE3] bg-transparent text-[#666] font-outfit text-[9px] tracking-[0.3em] uppercase font-light disabled:opacity-50 active:scale-[0.99] transition-transform flex items-center justify-center"
                          >
                            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "Afsuski qatnasha olmayman"}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="success-container" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 flex flex-col items-center">
                        <CheckCircle size={36} strokeWidth={1} className="text-[#C5A880] mb-4" />
                        <h4 className="font-cinzel text-lg font-light text-[#111]">Tashrif Qayd Etildi!</h4>
                        <p className="font-outfit text-[10px] tracking-widest text-[#777] uppercase mt-2">
                          {rsvpStatus === 'attending' ? "Sizni kutib qolamiz" : "Ezgu tilaklaringiz uchun rahmat"}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* ARTISTIC COUTURE CLOSING */}
            <section className="py-32 px-6 bg-white text-center">
              <div className="max-w-[280px] mx-auto space-y-8">
                <span className="font-pinyon text-5xl text-[#C5A880] block">Finis</span>
                <p className="font-cinzel text-lg font-light italic text-[#444] leading-relaxed">
                  "Koinotdagi eng go'zal ittifoq guvohi bo'ling."
                </p>
                <div className="w-12 h-[0.5px] bg-[#C5A880] mx-auto" />
                <h2 className="font-cinzel text-3xl font-light tracking-[0.4em] text-[#111] pl-[0.4em]">S & A</h2>
              </div>
            </section>

            {/* CREDITS FOOTER */}
            <footer className="py-8 bg-[#FAF9F5] border-t border-[#EBEBE3] text-center">
              <p className="font-outfit text-[8px] tracking-[0.5em] uppercase text-[#999]">
                Engineered with high taste by <Link href="https://webleaders.uz" target="_blank" className="text-[#111] underline font-medium">WebLeaders</Link>
              </p>
            </footer>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AbsoluteAvantGardeWedding;