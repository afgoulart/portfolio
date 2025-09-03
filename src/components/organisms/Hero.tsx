"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "@/lib/i18n-context";
import { Button } from "@/components/atoms";

export default function Hero() {
  const t = useTranslations("hero");
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative flex justify-center items-center min-h-screen overflow-hidden">
      <motion.div style={{ y, opacity }} className="z-10 mx-auto px-4 max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6 font-bold text-transparent text-5xl md:text-7xl"
        >
          {t("greeting")}
          <br />
          <span className="text-white">{t("name")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 text-gray-300 text-xl md:text-2xl leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex sm:flex-row flex-col justify-center items-center gap-4"
        >
          {/* <Button size="lg" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
            {t('viewProjects')}
          </Button> */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t("contact")}
          </Button>
        </motion.div>
      </motion.div>

      <div className="-z-10 absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="top-1/4 left-1/4 absolute bg-blue-500/10 blur-3xl rounded-full w-72 h-72"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="right-1/4 bottom-1/4 absolute bg-purple-500/10 blur-3xl rounded-full w-96 h-96"
        />
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="bottom-8 left-1/2 absolute -translate-x-1/2 transform"
      >
        <div className="flex justify-center border-2 border-white/30 rounded-full w-6 h-10">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-white/60 mt-2 rounded-full w-1 h-3"
          />
        </div>
      </motion.div>
    </section>
  );
}
