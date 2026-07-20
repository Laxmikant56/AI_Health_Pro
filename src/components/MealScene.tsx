import React from 'react';
import { motion } from 'motion/react';

interface MealSceneProps {
  type: 'morning' | 'noon' | 'evening' | 'night';
}

export default function MealScene({ type }: MealSceneProps) {
  if (type === 'morning') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-t from-[#ff9e2c] via-[#ff7e5f] to-[#60a5fa] opacity-80 transition-colors duration-1000">
        {/* Morning Sun with Halo */}
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: [180, 40, 45], opacity: 1 }}
          transition={{ duration: 4, times: [0, 0.8, 1], ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-b from-[#fff7ad] to-[#ffdd00] rounded-full blur-xl shadow-[0_0_150px_#ffdd00]"
        />
        
        {/* Dual Rotating Rays */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-10"
          style={{ background: 'conic-gradient(from 0deg, transparent, white, transparent 15%, white 30%, transparent 45%, white 60%, transparent 75%, white 90%, transparent)' }}
        />

        {/* Morning Mist */}
        <motion.div 
          animate={{ x: [-100, 100], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 inset-x-0 h-32 bg-white/30 blur-[60px]"
        />

        {/* Birds in V-Formation */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -150, y: 80 + i * 15 }}
            animate={{ 
              x: 800, 
              y: [80 + i * 15, 60 + i * 15, 80 + i * 15] 
            }}
            transition={{ 
              duration: 20 + i, 
              repeat: Infinity, 
              delay: i * 0.5,
              ease: "linear"
            }}
            className="absolute z-10 flex gap-1 scale-75"
          >
            <motion.div 
              animate={{ rotate: [15, -15, 15] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="w-4 h-[1.5px] bg-black/30 -rotate-12"
            />
            <motion.div 
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="w-4 h-[1.5px] bg-black/30 rotate-12"
            />
          </motion.div>
        ))}

        {/* Drifting Clouds */}
        <motion.div
          animate={{ x: [-50, 150, -50], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-20 w-48 h-12 bg-white/40 rounded-full blur-2xl"
        />
      </div>
    );
  }

  if (type === 'noon') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#1d4ed8] via-[#60a5fa] to-[#93c5fd] opacity-70">
        {/* High Sun with Flare Effect */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-10 right-10 w-28 h-28 bg-[#fafaf9] rounded-full blur-2xl shadow-[0_0_150px_#fef08a,0_0_60px_#ffffff]"
        />
        
        {/* Sun Flare Rings */}
        <motion.div 
          animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-10 w-48 h-48 border-[20px] border-white/20 rounded-full blur-xl"
        />

        {/* Moving Lens Flare */}
        <motion.div 
          animate={{ x: [-20, 20], y: [-10, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/20 rounded-full blur-sm"
        />

        {/* Heat Distortions */}
        <div className="absolute inset-x-0 bottom-0 h-40 opacity-30">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i }}
              className="absolute inset-0 bg-white/20 blur-[40px] rounded-full"
              style={{ transform: `scale(${1 + i * 0.2})` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'evening') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#0f172a]">
        {/* Sunset Sky Palette */}
        <motion.div 
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-t from-[#f97316] via-[#d946ef]/60 to-[#1e1b4b]" 
        />

        {/* Setting Sun with Corona */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: [0, 260], opacity: [0, 1, 0.7] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-56 bg-gradient-to-b from-[#fbbf24] via-[#f43f5e] to-[#881337] rounded-full blur-[4px] shadow-[0_0_120px_#f97316]"
        />

        {/* God Rays (Falling) */}
        <div className="absolute inset-0 opacity-20 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: [-20, -15, -20], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 5 + i, repeat: Infinity }}
              className="absolute -top-20 left-1/2 h-[800px] w-20 bg-gradient-to-b from-orange-300/40 to-transparent blur-3xl origin-top"
              style={{ marginLeft: `${(i - 2) * 150}px` }}
            />
          ))}
        </div>

        {/* Dark Horizon */}
        <div className="absolute bottom-0 w-full h-1/3">
          <div className="absolute inset-0 bg-[#020617]/60 backdrop-blur-3xl border-t border-white/5" />
          {/* Water Reflection */}
          <motion.div 
            animate={{ scaleX: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-0 left-1/4 right-1/4 h-1 bg-white/20 blur-md rounded-full"
          />
        </div>
      </div>
    );
  }

  if (type === 'night') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b]">
        {/* Twinkling Stars Density */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0.1, 1, 0.1],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            className="absolute bg-white rounded-full shadow-[0_0_5px_white]"
            style={{ 
              width: Math.random() * 2 + 0.5, 
              height: Math.random() * 2 + 0.5, 
              top: `${Math.random() * 90}%`, 
              left: `${Math.random() * 100}%` 
            }}
          />
        ))}

        {/* Occasional Shooting Star */}
        <motion.div
          animate={{ 
            x: [-100, 600], 
            y: [100, 400],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatDelay: 8,
            ease: "easeOut"
          }}
          className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent rotate-[35deg] blur-[1px]"
        />

        {/* Glowing Crescent Moon */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 right-12 w-20 h-20 bg-slate-100 rounded-full blur-[1px] shadow-[0_0_60px_rgba(255,255,255,0.3)]"
        >
          <div className="absolute top-1.5 left-4 w-18 h-18 bg-[#0f172a] rounded-full" />
        </motion.div>

        {/* Ambient Nebula Glow */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute inset-0 bg-indigo-500/10 blur-[150px] pointer-events-none"
        />
      </div>
    );
  }

  return null;
}
