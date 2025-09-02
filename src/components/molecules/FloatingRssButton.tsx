"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingRssButtonProps {
  locale: string;
}

export default function FloatingRssButton({ locale }: FloatingRssButtonProps) {
  const [isHovered, setIsHovered] = useState(true);

  const getRssUrl = () => {
    return `/rss-${locale}.xml`;
  };

  const getRssLabel = () => {
    return locale === "pt" ? "RSS Feed" : "RSS Feed";
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5, type: "spring", stiffness: 300 }}
      className={cn(
        "right-6 bottom-6 z-50 fixed",
        "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
        "text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
      )}
    >
      <motion.a
        href={getRssUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("group relative flex flex-row justify-around items-center gap-2 px-6 py-3")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* RSS Icon */}
        <motion.div animate={{ rotate: isHovered ? 360 : 0 }} transition={{ duration: 0.6 }}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 11a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M4 4a16 16 0 0 1 16 16" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="5" cy="19" r="1" fill="currentColor" />
          </svg>
        </motion.div>

        {/* RSS Label */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isHovered ? "auto" : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <span className="font-medium text-sm whitespace-nowrap">{getRssLabel()}</span>
        </motion.div>

        {/* Pulse animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Notification dot */}
        <motion.div
          className="-top-1 -right-1 absolute bg-green-400 border-2 border-gray-900 rounded-full w-3 h-3"
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.a>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
          y: isHovered ? 0 : 10,
        }}
        transition={{ duration: 0.2 }}
        className="right-0 bottom-full absolute bg-gray-800 shadow-lg mb-2 px-3 py-2 rounded-lg text-white text-sm whitespace-nowrap pointer-events-none"
      >
        {locale === "pt" ? "Assinar Feed RSS" : "Subscribe to RSS Feed"}
        <div className="top-full right-3 absolute border-t-4 border-t-gray-800 border-transparent border-r-4 border-l-4 w-0 h-0"></div>
      </motion.div>
    </motion.div>
  );
}
