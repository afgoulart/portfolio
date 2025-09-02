'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { SocialLink } from '@/components';

const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production' ? '/portfolio' : '';
};

export default function LanguageSelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl"
        >
          👨‍💻
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          André Filipe de Moraes Goulart
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Senior Software Engineer
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <p className="text-gray-400 mb-8 text-lg">Escolha seu idioma / Choose your language</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link href={`${getBaseUrl()}/pt`}>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer min-w-[200px]"
            >
              <div className="text-4xl mb-4">🇧🇷</div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Português
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Versão em português brasileiro
              </p>
            </motion.div>
          </Link>

          <Link href={`${getBaseUrl()}/en`}>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-white/20 transition-all duration-300 cursor-pointer min-w-[200px]"
            >
              <div className="text-4xl mb-4">🇺🇸</div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                English
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                English version
              </p>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex justify-center space-x-6"
        >
          <SocialLink
            href="https://www.linkedin.com/in/afgoulart"
            icon="💼"
            label="LinkedIn"
            className="bg-blue-600/20 border-blue-600/30 hover:bg-blue-600/30"
          />
          <SocialLink
            href="https://github.com/afgoulart"
            icon="🐙"
            label="GitHub"
            className="bg-gray-600/20 border-gray-600/30 hover:bg-gray-600/30"
          />
          <SocialLink
            href="mailto:afgoulart.rj@gmail.com"
            icon="📧"
            label="Email"
            className="bg-purple-600/20 border-purple-600/30 hover:bg-purple-600/30"
          />
        </motion.div>
      </motion.div>

      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}