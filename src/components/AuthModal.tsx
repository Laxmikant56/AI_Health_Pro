import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, LogIn, UserPlus, Fingerprint, Chrome, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  signInWithGoogle, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  auth
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

export default function AuthModal({ isOpen, onClose, accentColor }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const internalEmail = `${userId.trim().toLowerCase()}@healthpro.local`;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim().length < 3) {
      setError('User ID must be at least 3 characters');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, internalEmail, password);
        await updateProfile(userCredential.user, { displayName: name || userId });
      } else {
        await signInWithEmailAndPassword(auth, internalEmail, password);
      }
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This User ID is already taken. Please choose a different one.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid User ID format. Use alphanumeric characters only.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid User ID or password.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center text-center space-y-2 mb-8">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-xl", accentColor)}>
              <Fingerprint className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {mode === 'login' ? 'Authentication Required' : 'Register Profile'}
            </h2>
            <p className="text-slate-500 text-sm">
              {mode === 'login' ? 'Enter your unique User ID' : 'Create a unique ID to secure your data'}
            </p>
          </div>

          <div className="space-y-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-4 text-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Unique User ID</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. laxmikant_123"
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-4 text-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl pl-12 pr-4 text-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 dark:text-red-400 font-medium leading-relaxed">{error}</p>
                </motion.div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full h-12 flex items-center justify-center gap-2 text-white rounded-2xl font-black p-4 text-sm shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
                  accentColor
                )}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
