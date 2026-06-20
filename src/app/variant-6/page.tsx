"use client";

import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MapPin, CheckCircle, Loader2, Sparkles, Compass, Eye } from 'lucide-react';
import * as THREE from 'three';

// --- THREE.JS: GENERATIVE 3D FLOATING ORGANIC PETALS ---
const ThreeOrganicPetals = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Refined Luxury Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xfff5ea, 1.5, 30);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xd4af37, 0.5, 20);
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);

    // Creating Organic Petal Meshes
    const petalCount = 22;
    const petals: Array<{
      mesh: THREE.Mesh;
      baseSpeed: number;
      rotSpeed: THREE.Vector3;
      oscFreq: number;
      oscAmp: number;
      phase: number;
    }> = [];

    // Luxury Matte Translucent Material
    const petalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfffaf0,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.6, // Glass-like transparency
      ior: 1.2,
      side: THREE.DoubleSide,
      flatShading: true
    });

    for (let i = 0; i < petalCount; i++) {
      const geometry = new THREE.SphereGeometry(0.35, 7, 7);

      const pos = geometry.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        let x = pos.getX(j);
        let y = pos.getY(j);
        let z = pos.getZ(j);
        pos.setZ(j, z + Math.sin(x * 2) * 0.15);
      }
      geometry.computeVertexNormals();

      const mesh = new THREE.Mesh(geometry, petalMaterial);

      const scaleX = 0.8 + Math.random() * 0.8;
      const scaleY = 0.2 + Math.random() * 0.3;
      const scaleZ = 1.5 + Math.random() * 1.5;
      mesh.scale.set(scaleX, scaleY, scaleZ);

      mesh.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8
      );

      scene.add(mesh);

      petals.push({
        mesh,
        baseSpeed: 0.008 + Math.random() * 0.012,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015
        ),
        oscFreq: 0.5 + Math.random() * 1.5,
        oscAmp: 0.005 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      petals.forEach((p) => {
        p.mesh.position.y -= p.baseSpeed;
        p.mesh.position.x += Math.sin(elapsedTime * p.oscFreq + p.phase) * p.oscAmp;

        p.mesh.position.x += (mouseX * 2 - p.mesh.position.x) * 0.01;
        p.mesh.position.y += (-mouseY * 2 - p.mesh.position.y) * 0.01;

        p.mesh.rotation.x += p.rotSpeed.x;
        p.mesh.rotation.y += p.rotSpeed.y;
        p.mesh.rotation.z += p.rotSpeed.z;

        if (p.mesh.position.y < -8) {
          p.mesh.position.y = 8;
          p.mesh.position.x = (Math.random() - 0.5) * 16;
        }
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-10" />;
};

// --- MAIN TEMPLATE COMPONENT ---
const LiquidLiquidWedding: NextPage = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<null | 'yes' | 'no'>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const triggerRSVP = async (choice: 'yes' | 'no') => {
    if (!name.trim()) return alert("Iltimos, ismingizni kiriting.");
    setLoading(true);

    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `🪐 *Liquid Avant-Garde RSVP*\n\n👤 *Mehmon:* ${name}\n*Qaror:* ${choice === 'yes' ? '👑 Keladi' : '🕊️ Afsuski yoq'}`,
            parse_mode: 'Markdown'
          })
        });
      } catch (err) {
        console.error(err);
      }
    }
    setRsvpStatus(choice);
    setLoading(false);
  };

  return (
    <div ref={containerRef} className="bg-[#FAF9F6] min-h-[100svh] text-[#0A0A0A] flex justify-center overflow-hidden font-syncopate antialiased selection:bg-[#E5D3B3]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Syne:wght@400;500;700&family=Cinzel+Decorative:wght@400;700&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-decorative { font-family: 'Cinzel Decorative', serif; }
        
        .outline-text {
          -webkit-text-stroke: 1px #0A0A0A;
          color: transparent;
        }
      `}</style>

      <div className="w-full max-w-[460px] relative bg-[#FCFBF9] shadow-[0_0_100px_rgba(0,0,0,0.02)] border-x border-[#ECEAE4]">
        <Head>
          <title>The Monolith Tapes | S & A</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        {isUnlocked && <ThreeOrganicPetals />}

        {/* --- ANTI-CONVENTIONAL UNLOCK LAYER --- */}
        <AnimatePresence>
          {!isUnlocked && (
            <motion.div
              className="fixed inset-0 z-[300] flex flex-col items-stretch justify-between bg-[#0A0A0A] p-8 text-[#FAF9F6]"
              exit={{ y: "-100%", transition: { duration: 1.4, ease: [0.85, 0, 0.15, 1] } }}
            >
              <div className="flex justify-between items-center text-[8px] tracking-[0.6em] text-[#666] uppercase">
                <span>Abstract Core</span>
                <span>Vol. VI</span>
              </div>

              <div className="space-y-4 my-auto">
                <h1 className="font-decorative text-4xl font-bold tracking-widest text-center leading-relaxed">
                  S <span className="font-playfair italic font-light text-xl text-[#C5A880]">and</span> A
                </h1>
                <div className="h-[1px] w-full bg-[#222]" />
                <p className="font-syne text-[10px] tracking-[0.4em] text-center text-[#999] uppercase">
                  An Experience Beyond Traditions
                </p>
              </div>

              <motion.button
                onClick={() => setIsUnlocked(true)}
                whileTap={{ scale: 0.98 }}
                className="w-full py-6 bg-[#FAF9F6] text-[#0A0A0A] font-syne text-[11px] tracking-[0.5em] uppercase font-bold flex items-center justify-center gap-3 transition-all"
              >
                <Compass size={14} className="animate-spin" /> VERSIYANI OCHISH
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN ASYMMETRICAL EDITORIAL CORE --- */}
        {isUnlocked && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-20">

            {/* HERO SECTION: THE MONOLITH TYPOGRAPHY */}
            <section className="min-h-[100svh] px-6 py-12 flex flex-col justify-between relative">
              <div className="w-full flex justify-between items-start">
                <span className="font-syne text-[9px] tracking-[0.5em] uppercase text-[#C5A880]">June 2026</span>
                <span className="font-playfair italic text-sm text-[#0A0A0A]">№ 06</span>
              </div>

              <motion.div style={{ y: textY }} className="w-full my-auto text-left space-y-0 relative">
                <h1 className="font-syne text-7xl font-bold tracking-tighter leading-[0.8] text-[#0A0A0A] uppercase">
                  SARDOR
                </h1>
                <div className="py-2 pl-4 flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-[#0A0A0A]/10" />
                  <span className="font-playfair italic text-4xl text-[#C5A880]">amira</span>
                </div>
                <h1 className="font-syne text-7xl font-bold tracking-tighter leading-[0.8] uppercase outline-text">
                  MARRIAGE
                </h1>
              </motion.div>

              <div className="grid grid-cols-2 items-end gap-4 pt-4 border-t border-[#0A0A0A]/5">
                <div>
                  <p className="font-syne text-[8px] tracking-[0.3em] uppercase text-[#777]">Konseptual Studio</p>
                  <p className="font-playfair italic text-xs text-[#0A0A0A] mt-1">Versal Tapes, Tashkent</p>
                </div>
                <div className="text-right">
                  <span className="font-syne text-2xl font-medium tracking-tight text-[#0A0A0A]">20.06</span>
                </div>
              </div>
            </section>

            {/* MANIFESTO / STATEMENT BLOCK */}
            <section className="py-32 px-6 bg-[#0A0A0A] text-[#FAF9F6] relative z-20">
              <div className="max-w-[340px] mx-auto space-y-12">
                <div className="flex items-center gap-3">
                  <Sparkles size={12} className="text-[#C5A880]" />
                  <span className="font-syne text-[8px] tracking-[0.5em] uppercase text-[#666]">Manifesto</span>
                </div>

                <p className="font-playfair text-2xl font-light leading-relaxed italic text-zinc-300">
                  "Biz an'analarni buzmagan holda, yangi koinot yaratmoqchimiz. Ikki hayotning bir butunlik kasb etish lahzasi."
                </p>

                <div className="space-y-4 font-syne text-xs font-light text-zinc-400 leading-loose">
                  <p>Hurmatli qadrdonimiz, hayotimizning eng radikal va eng chiroyli qarorini nishonlash arafasidatiz. Ushbu installyatsiyada sizning borligingiz biz uchun san'at asaridek qadrli.</p>
                </div>
              </div>
            </section>

            {/* GALLERY: MULTI-LAYER ASYMMETRICAL GRIDS */}
            <section className="py-32 px-6 relative">
              <div className="max-w-[380px] mx-auto space-y-24">

                <div className="relative">
                  <motion.div style={{ y: imageY }} className="w-2/3 bg-zinc-200 aspect-[3/4] overflow-hidden border border-[#ECEAE4] p-2 bg-white shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
                      alt="Editorial Frame"
                      className="w-full h-full object-cover grayscale contrast-125 hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                  <div className="absolute right-0 bottom-4 w-1/2 font-syne space-y-2 text-right bg-white/60 backdrop-blur-md p-4 border border-[#ECEAE4]/40">
                    <span className="text-[8px] tracking-[0.3em] text-[#C5A880] uppercase block">Frame 01 //</span>
                    <h4 className="text-xs font-bold uppercase tracking-tight">ELEGANT CHAOS</h4>
                  </div>
                </div>

                <div className="flex justify-end relative">
                  <motion.div className="w-3/4 bg-zinc-200 aspect-square overflow-hidden border border-[#ECEAE4] p-2 bg-white shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop"
                      alt="Editorial Frame 2"
                      className="w-full h-full object-cover grayscale brightness-95"
                    />
                  </motion.div>
                </div>

              </div>
            </section>

            {/* CHRONOLOGY: TIMELINE LABS */}
            <section className="py-32 px-6 bg-[#F6F5F0] border-y border-[#ECEAE4]">
              <div className="max-w-[340px] mx-auto space-y-12">
                <div className="text-left">
                  <span className="font-syne text-[8px] tracking-[0.6em] uppercase text-[#C5A880] block mb-2">Chronology</span>
                  <h3 className="font-syne text-3xl font-bold uppercase tracking-tighter">TIME SCHEDULE</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { hr: "14", min: "00", event: "REGISTRATION LAB", detail: "FHDYo tantanali marosim qismi" },
                    { hr: "17", min: "00", event: "AMBIENT HOURS / WELCOME", detail: "Klassik fureshet va mehmonlar oqimi" },
                    { hr: "18", min: "30", event: "MAIN AUDIO-VISUAL BANQUET", detail: "Asosiy kecha, badiiy qism va installyatsiya" }
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 bg-white border border-[#ECEAE4] flex items-center justify-between gap-4">
                      <div className="flex items-baseline font-syne text-2xl font-bold text-[#C5A880]">
                        <span>{item.hr}</span>
                        <span className="text-xs text-[#0A0A0A]/30 mx-0.5">:</span>
                        <span className="text-sm font-medium text-[#0A0A0A]">{item.min}</span>
                      </div>
                      <div className="text-right font-syne space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-tight">{item.event}</h4>
                        <p className="text-[10px] text-[#777] font-light">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* LOCATION MAP MODULE */}
            <section className="py-32 px-6 bg-white text-center">
              <div className="max-w-[320px] mx-auto space-y-8">
                <div className="w-12 h-12 rounded-full border border-[#0A0A0A] flex items-center justify-center mx-auto animate-spin">
                  <Eye size={16} strokeWidth={1.5} />
                </div>

                <div className="space-y-2">
                  <h4 className="font-syne text-xl font-bold uppercase tracking-tighter">VERSAL HALL</h4>
                  <p className="font-playfair italic text-sm text-[#555]">Yunusobod tumani, Amir Temur prospekti, Toshkent</p>
                </div>

                <Link
                  href="https://maps.google.com"
                  target="_blank"
                  className="font-syne text-[10px] tracking-[0.4em] uppercase border border-[#0A0A0A] px-10 py-4 inline-block hover:bg-[#0A0A0A] hover:text-white transition-all duration-300"
                >
                  NAVIGATSIYANI OCHISH
                </Link>
              </div>
            </section>

            {/* RSVP CONTROL CENTER */}
            <section className="py-32 px-6 bg-[#0A0A0A] text-[#FAF9F6] border-t border-zinc-800">
              <div className="max-w-[340px] mx-auto text-center space-y-10">
                <div className="space-y-2">
                  <span className="font-syne text-[8px] tracking-[0.6em] uppercase text-[#C5A880] block">System RSVP</span>
                  <h3 className="font-syne text-2xl font-bold uppercase tracking-tight">TASHRIF MATRIXI</h3>
                </div>

                <div className="bg-[#111111] p-6 border border-zinc-800 text-left space-y-6">
                  <AnimatePresence mode="wait">
                    {!rsvpStatus ? (
                      <motion.div key="rsvp-form" exit={{ opacity: 0 }} className="space-y-6">
                        <div className="space-y-2">
                          <label className="font-syne text-[8px] tracking-widest text-zinc-500 uppercase block">Mehmon Identifikatsiyasi</label>
                          <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="ISM / FAMILIYA"
                            className="w-full bg-transparent font-syne text-sm py-3 border-b border-zinc-800 text-white focus:border-[#C5A880] focus:outline-none transition-colors placeholder:text-zinc-700 uppercase"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-4">
                          <button
                            onClick={() => triggerRSVP('yes')}
                            disabled={loading}
                            className="py-4 bg-[#FAF9F6] text-[#0A0A0A] font-syne text-[9px] tracking-widest uppercase font-bold disabled:opacity-40 active:scale-95 transition-transform flex items-center justify-center"
                          >
                            {loading ? <Loader2 size={12} className="animate-spin" /> : "KELAMAN"}
                          </button>
                          <button
                            onClick={() => triggerRSVP('no')}
                            disabled={loading}
                            className="py-4 border border-zinc-800 bg-transparent text-zinc-400 font-syne text-[9px] tracking-widest uppercase font-light disabled:opacity-40 active:scale-95 transition-transform flex items-center justify-center"
                          >
                            {loading ? <Loader2 size={12} className="animate-spin" /> : "ISHTIROK ETMASLIK"}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="rsvp-success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-4">
                        <CheckCircle size={32} className="text-[#C5A880] mx-auto stroke-1" />
                        <h4 className="font-syne text-sm font-bold uppercase tracking-wider">XABAR YUBORILDI</h4>
                        <p className="font-playfair italic text-xs text-zinc-400">
                          {rsvpStatus === 'yes' ? "Siz bilan birga mukammallikka erishamiz." : "Tilaklaringiz tizimda saqlanib qoldi."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* FINAL BADGE */}
            <section className="py-32 px-6 bg-[#FCFBF9] text-center border-t border-[#ECEAE4]">
              <div className="max-w-[260px] mx-auto space-y-6">
                <h1 className="font-decorative text-2xl font-bold tracking-[0.3em] text-[#0A0A0A]">S & A</h1>
                <div className="h-[1px] w-6 bg-[#C5A880] mx-auto" />
                <p className="font-syne text-[8px] tracking-[0.5em] text-[#999] uppercase">END OF EXHIBITION</p>
              </div>
            </section>

            {/* COUTURE FOOTER */}
            <footer className="py-8 bg-[#FAF9F6] text-center border-t border-[#ECEAE4]/60">
              <p className="font-syne text-[7px] tracking-[0.6em] uppercase text-zinc-400">
                Architected by <Link href="https://webleaders.uz" target="_blank" className="text-[#0A0A0A] font-bold underline">WebLeaders Labs</Link>
              </p>
            </footer>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LiquidLiquidWedding;