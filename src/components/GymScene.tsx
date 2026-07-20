import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Activity, Timer, Zap } from 'lucide-react';

export default function GymScene() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90 transition-colors duration-1000">
      {/* Moving Activity Line (Heartbeat) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-32 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <motion.path
            d="M0,50 L200,50 L220,20 L240,80 L260,50 L500,50 L520,10 L540,90 L560,50 L800,50 L820,30 L840,70 L860,50 L1000,50"
            fill="none"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Floating Gym Equipment */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            x: [Math.random() * 800, Math.random() * 800],
            y: [Math.random() * 500, Math.random() * 500],
            rotate: [0, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute text-white"
        >
          {i % 3 === 0 && <Dumbbell className="w-12 h-12" />}
          {i % 3 === 1 && <Timer className="w-10 h-10" />}
          {i % 3 === 2 && <Zap className="w-8 h-8 text-yellow-400" />}
        </motion.div>
      ))}

      {/* Ambient Pulses */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px]"
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />
    </div>
  );
}
