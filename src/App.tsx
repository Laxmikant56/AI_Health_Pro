import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Activity, 
  Dumbbell, 
  CircleGauge, 
  ChevronRight, 
  ArrowLeft,
  Settings,
  Info,
  Calendar,
  Utensils,
  Target,
  Sunrise,
  Moon,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  LogIn
} from 'lucide-react';
import { cn } from './lib/utils';
import DiabeticPlan from './components/DiabeticPlan';
import GymPlan from './components/GymPlan';
import IRPredictor from './components/IRPredictor';
import ChatBot from './components/ChatBot';
import UserProfile from './components/UserProfile';
import AuthModal from './components/AuthModal';
import { auth, logout, onAuthStateChanged, User } from './lib/firebase';

type View = 'home' | 'diabetic' | 'gym' | 'ir' | 'profile';
type ThemeColor = 'teal' | 'purple' | 'rose' | 'orange';
type ThemeMode = 'light' | 'dark';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [themeColor, setThemeColor] = useState<ThemeColor>('orange');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const themeClasses = {
    teal: 'selection:bg-teal-100 selection:text-teal-900',
    purple: 'selection:bg-purple-100 selection:text-purple-900',
    rose: 'selection:bg-rose-100 selection:text-rose-900',
    orange: 'selection:bg-orange-100 selection:text-orange-900'
  };

  const accentColors = {
    teal: 'bg-teal-600 text-teal-600',
    purple: 'bg-purple-600 text-purple-600',
    rose: 'bg-rose-600 text-rose-600',
    orange: 'bg-orange-600 text-orange-600'
  };

  const renderView = () => {
    switch (view) {
      case 'diabetic': return <DiabeticPlan onBack={() => setView('home')} user={user} />;
      case 'gym': return <GymPlan onBack={() => setView('home')} user={user} themeColor={themeColor} />;
      case 'ir': return <IRPredictor onBack={() => setView('home')} user={user} />;
      case 'profile': return <UserProfile onBack={() => setView('home')} themeColor={themeColor} user={user} />;
      default: return <Home onSelect={setView} themeColor={themeColor} user={user} />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 font-sans",
      themeMode === 'light' ? "bg-[#F8FAFC] text-[#1E293B]" : "bg-slate-950 text-slate-100",
      themeClasses[themeColor]
    )}>
      <nav className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md transition-colors",
        themeMode === 'light' ? "bg-white/80 border-slate-200" : "bg-slate-900/80 border-slate-800"
      )}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setView('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-colors", accentColors[themeColor].split(' ')[0])}>
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI Health <span className={themeMode === 'light' ? accentColors[themeColor].split(' ')[1] : 'text-slate-100'}>Pro</span></span>
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full mr-2">
              {(['orange', 'teal', 'purple', 'rose'] as ThemeColor[]).map(c => (
                <button
                  key={c}
                  onClick={() => setThemeColor(c)}
                  className={cn(
                    "w-6 h-6 rounded-full transition-all border-2",
                    c === 'teal' ? 'bg-teal-500' : c === 'purple' ? 'bg-purple-500' : c === 'rose' ? 'bg-rose-500' : 'bg-orange-500',
                    themeColor === c ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-100"
                  )}
                />
              ))}
            </div>

            <button 
              onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
            >
              {themeMode === 'light' ? <Moon className="w-5 h-5" /> : <Sunrise className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={() => setView('profile')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
            >
              <UserIcon className="w-5 h-5" />
            </button>

            {user ? (
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 rounded-full text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 text-white rounded-full text-xs font-bold shadow-lg transition-all",
                  accentColors[themeColor].split(' ')[0]
                )}
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={view + themeMode + themeColor}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} themeColor={themeColor} />

      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
            accentColor={accentColors[themeColor].split(' ')[0]}
          />
        )}
      </AnimatePresence>

      <footer className="mt-auto py-12 px-4 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          ⚕️ AI Health Pro provides health insights and screening aids. These results are not a substitute for professional medical advice, diagnosis, or treatment.
        </p>
      </footer>
    </div>
  );
}

function Home({ onSelect, themeColor, user }: { onSelect: (view: View) => void, themeColor: ThemeColor, user: User | null }) {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-8 pt-16 pb-8">
        <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter text-slate-900 mx-auto max-w-6xl leading-[0.8] mb-4">
          HEALTH <span className={themeColor === 'orange' ? 'text-orange-600' : 'text-teal-600'}>PRO</span>
        </h1>
        <p className="text-2xl md:text-3xl text-slate-500 max-w-3xl mx-auto font-bold lowercase tracking-tight">
          Modern intelligence for your body
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        <FeatureCard 
          icon={<Utensils className="w-6 h-6 text-orange-600" />}
          title="Diabetic Meal Plan"
          description="Personalized 7-week cycles of glucose-conscious recipes and exercise routines tailored to your levels."
          tag="AI GEN"
          color="orange"
          themeColor={themeColor}
          onClick={() => onSelect('diabetic')}
        />
        <FeatureCard 
          icon={<Dumbbell className="w-6 h-6 text-purple-600" />}
          title="Gym & Fitness Plan"
          description="Complete 7-day workout routines and nutrition protocols architected for your specific body goals."
          tag="PRO ROUTINE"
          color="purple"
          themeColor={themeColor}
          onClick={() => onSelect('gym')}
        />
        <FeatureCard 
          icon={<CircleGauge className="w-6 h-6 text-cyan-600" />}
          title="IR Glucose Predictor"
          description="ML-driven screening using infrared sensor data for rapid glucose estimation."
          tag="ML MODEL"
          color="cyan"
          themeColor={themeColor}
          onClick={() => onSelect('ir')}
        />
      </div>

    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  tag, 
  color, 
  themeColor,
  onClick 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  tag: string,
  color: 'orange' | 'purple' | 'cyan',
  themeColor: ThemeColor,
  onClick: () => void 
}) {
  const colorMap = {
    orange: 'bg-orange-50 text-orange-700 border-orange-100 hover:border-orange-200 shadow-orange-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-200 shadow-purple-100',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100 hover:border-cyan-200 shadow-cyan-100'
  };

  return (
    <motion.button
      whileHover={{ y: -8 }}
      onClick={onClick}
      className={cn(
        "relative text-left p-8 rounded-[2rem] border-2 transition-all duration-300 bg-white group",
        "border-slate-100 shadow-sm hover:shadow-2xl",
        themeColor === 'orange' ? "hover:border-orange-500/20 hover:shadow-orange-900/5" :
        themeColor === 'purple' ? "hover:border-purple-500/20 hover:shadow-purple-900/5" :
        themeColor === 'rose' ? "hover:border-rose-500/20 hover:shadow-rose-900/5" :
        "hover:border-teal-500/20 hover:shadow-teal-900/5"
      )}
    >
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform duration-300 shadow-sm")}>
        {icon}
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest uppercase py-1 px-3 bg-slate-100 text-slate-500 rounded-full">
            {tag}
          </span>
        </div>
        <h3 className="text-3xl font-black tracking-tight text-slate-900">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-lg font-medium">
          {description}
        </p>
      </div>
      <div className="absolute top-8 right-8 text-slate-200 group-hover:text-teal-600 transition-colors">
        <ChevronRight className="w-6 h-6" />
      </div>
    </motion.button>
  );
}
