import type { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';

const WeddingLanding: NextPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-ivory text-dark font-sans overflow-x-hidden">
      <Head>
        <title>Sardor & Amira | To'y Taklifnomasi</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      {/* --- YORUG' HERO SECTION --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Fon: Orqa fondagi nafis gul yoki tekstura (juda och xira qilingan) */}
        <div className="absolute inset-0 bg-champagne-100 opacity-40"></div>

        {/* Markaziy kontent */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.p
            className="font-sans text-sm md:text-base tracking-[0.3em] uppercase mb-6 text-champagne-800 font-medium"
            variants={fadeInUp}
          >
            Assalomu Alaykum
          </motion.p>

          <motion.div variants={fadeInUp} className="relative mb-10">
            {/* O'ta nafis Serif shriftidagi ismlar */}
            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-dark mb-4">
              Sardor <span className="text-champagne-400 italic font-light">&</span> Amira
            </h1>
            <div className="w-24 h-[1px] bg-champagne-600 mx-auto mt-6"></div>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl font-light tracking-wide mb-12 text-gray-600"
            variants={fadeInUp}
          >
            Hayotimizning eng go'zal kuni — <br className="hidden md:block" /> oila qurish tantanamizda sizni kutib qolamiz.
          </motion.p>

          <motion.a
            href="#rsvp"
            variants={fadeInUp}
            className="inline-block bg-champagne-600 text-white px-12 py-4 rounded-full font-medium tracking-widest uppercase hover:bg-champagne-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
          >
            Tasdiqlash
          </motion.a>
        </motion.div>

        {/* Pastga yo'naltiruvchi nafis chiziq */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-xs tracking-widest uppercase text-champagne-800 mb-2">Pastga</span>
          <div className="w-[1px] h-12 bg-champagne-400"></div>
        </motion.div>
      </section>

      {/* Qolgan seksiyalar (Sana, Manzil, RSVP) shunga moslab ochiq ranglarda davom etadi... */}
    </div>
  );
};

export default WeddingLanding;