"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BlogHeroProps {
  title: string;
  subtitle: string;
}

const techIcons = ["⚡", "🚀", "💻", "🔧", "⚙️", "🌐", "📱", "🔬", "🎯", "💡"];

export default function BlogHero({ title, subtitle }: BlogHeroProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="relative px-4 py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Floating Tech Icons */}
        {isClient &&
          techIcons.map((icon, index) => (
            <motion.div
              key={index}
              className="absolute text-blue-400/20 text-2xl"
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              }}
              animate={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
                rotate: [0, 360],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              {icon}
            </motion.div>
          ))}

        {/* Gradient Orbs */}
        <motion.div
          className="absolute bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl rounded-full w-96 h-96"
          // animate={{
          //   x: mousePosition.x * 0.1,
          //   y: mousePosition.y * 0.1,
          // }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
          style={{
            left: "20%",
            top: "30%",
          }}
        />
        <motion.div
          className="absolute bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl rounded-full w-72 h-72"
          // animate={{
          //   x: mousePosition.x * -0.05,
          //   y: mousePosition.y * -0.05,
          // }}
          transition={{ type: "spring", stiffness: 30, damping: 40 }}
          style={{
            right: "20%",
            top: "20%",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Tech Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 mb-8 px-4 py-2 border border-blue-500/20 rounded-full font-medium text-blue-400 text-sm"
          >
            <span className="bg-blue-400 rounded-full w-2 h-2 animate-pulse"></span>
            Tech Blog
          </motion.div>

          {/* Title with Glitch Effect */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300 mb-6 font-bold text-transparent text-6xl md:text-8xl"
          >
            {title}
            <motion.div
              className="absolute inset-0 bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-transparent"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 0.1,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 2,
              }}
            >
              {title}
            </motion.div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mx-auto max-w-4xl text-gray-300 text-xl md:text-2xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Animated Lines */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full w-32 h-1"
        />

        {/* Stats or indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex justify-center items-center gap-8 mt-12 text-gray-400"
        >
          <div className="flex items-center gap-2">
            <div className="bg-green-400 rounded-full w-2 h-2 animate-pulse"></div>
            <span className="text-sm">Live Updates</span>
          </div>
          <div className="bg-gray-600 w-px h-4"></div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-sm">Latest Tech</span>
          </div>
          <div className="bg-gray-600 w-px h-4"></div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-sm">Fast Reads</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
