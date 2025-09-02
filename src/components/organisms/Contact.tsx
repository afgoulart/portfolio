"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "@/lib/i18n-context";
import { useState } from "react";
import { SocialLink } from '@/components/molecules';
import { Card, Button } from '@/components/atoms';
import { contactInfo } from "@/lib/data";

export default function Contact() {
  const t = useTranslations("contact");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the message according to the template
    const whatsappMessage = `*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Message:* ${formData.message}`;
    
    // WhatsApp URL
    const whatsappUrl = `https://wa.me/5521985364597?text=${whatsappMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {t("title")}
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-white">{t("subtitle")}</h3>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">{t("description")}</p>

            <div className="space-y-4">
              <motion.a
                href={`mailto:${contactInfo.email}`}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{contactInfo.email}</p>
                </div>
              </motion.a>

              {contactInfo.phone && (
                <motion.a
                  href={`tel:${contactInfo.phone}`}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Telefone</p>
                    <p className="text-white font-medium">{contactInfo.phone}</p>
                  </div>
                </motion.a>
              )}

              <motion.a
                href="https://wa.me/5521985364597"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">💬</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">WhatsApp</p>
                  <p className="text-white font-medium">+55 21 98536-4597</p>
                </div>
              </motion.a>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Localização</p>
                  <p className="text-white font-medium">{contactInfo.location}</p>
                </div>
              </motion.div>

              <div className="flex gap-4 mt-6">
                {contactInfo.linkedin && (
                  <SocialLink
                    href={contactInfo.linkedin}
                    icon="💼"
                    label="LinkedIn"
                    className="bg-blue-600/20 border-blue-600/30 hover:bg-blue-600/30"
                  />
                )}
                {contactInfo.github && (
                  <SocialLink
                    href={contactInfo.github}
                    icon="🐙"
                    label="GitHub"
                    className="bg-gray-600/20 border-gray-600/30 hover:bg-gray-600/30"
                  />
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">{t('sendMessage') || 'Send a Message'}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {t('whatsappDescription') || 'Fill out the form below and click send to contact me via WhatsApp'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('name') || 'Name'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder={t('namePlaceholder') || 'Your name'}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('email') || 'Email'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder={t('emailPlaceholder') || 'your@email.com'}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('message') || 'Message'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                    placeholder={t('messagePlaceholder') || 'Your message...'}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">💬</span>
                  {t('sendWhatsapp') || 'Send via WhatsApp'}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
