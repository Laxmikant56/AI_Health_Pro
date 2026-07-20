import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Dumbbell, 
  ChevronRight, 
  Loader2, 
  Trophy,
  Flame,
  Calendar,
  Utensils,
  Target,
  Zap,
  Check,
  Save,
  Loader2 as LoaderIcon,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  ThermometerSun,
  Info,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateAIPLAN } from '../services/healthService';
import Markdown from 'react-markdown';
import GymScene from './GymScene';
import MealScene from './MealScene';

import { db, serverTimestamp, doc, setDoc, handleFirestoreError, OperationType, User as FirebaseUser, onSnapshot, getDoc } from '../lib/firebase';

export default function GymPlan({ onBack, user, themeColor = 'orange' }: { onBack: () => void, user: FirebaseUser | null, themeColor?: string }) {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    currentWeight: '',
    targetWeight: '',
    height: '',
    gender: 'male',
    goal: 'fat_loss',
    experience: 'beginner',
    days: '3',
    diet: 'vegetarian',
    allergies: ''
  });
  const [planData, setPlanData] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [mealSelections, setMealSelections] = useState<Record<string, number>>({});
  const [workoutSelections, setWorkoutSelections] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            age: data.age?.toString() || prev.age,
            currentWeight: data.weight?.toString() || prev.currentWeight,
            height: data.height?.toString() || prev.height,
            diet: data.diet || prev.diet
          }));
        }
      });
      return () => unsub();
    }
  }, [user]);

  const handleSavePlan = async () => {
    if (!user || !planData) return;
    setIsSaving(true);
    setSaveStatus('idle');
    const path = `users/${user.uid}`;
    try {
      await setDoc(doc(db, path), {
        uid: user.uid,
        name: formData.name,
        username: user.email?.split('@')[0],
        gymPlan: planData,
        gymFormData: formData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
      handleFirestoreError(error, OperationType.UPDATE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleMeal = (mealId: string) => {
    setMealSelections(prev => ({
      ...prev,
      [mealId]: ((prev[mealId] || 0) + 1) % 3
    }));
  };

  const toggleWorkout = (workoutId: string) => {
    setWorkoutSelections(prev => ({
      ...prev,
      [workoutId]: ((prev[workoutId] || 0) + 1) % 3
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');

    // 1. Try to fetch from Firestore first
    if (user) {
        const planPath = `users/${user.uid}/plans/gym`;
        try {
            console.log("GymPlan: Attempting to fetch plan from", planPath);
            const docRef = doc(db, planPath);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("GymPlan: Plan found in DB");
                setPlanData(docSnap.data().plan);
                setStep('result');
                return; // STOP execution
            } else {
                console.log("GymPlan: Plan not found in DB");
            }
        } catch (e: any) {
            console.error("GymPlan: Error accessing db for plan", e);
            if (e.message?.includes('Missing or insufficient permissions')) {
                // If it's a permission error, we should stop and inform the user
                 handleFirestoreError(e, OperationType.GET, planPath);
                 return; // Prevent AI generation if DB access fails catastrophically
            }
        }
    }

    const prompt = `
      Create a comprehensive 4-week gym and INDIAN nutrition architectural plan for ${formData.name}.
      Goal: ${formData.goal}, Diet: ${formData.diet}.
      
      CUISINE FOCUS: Indian (e.g., Paneer, Dal, Chicken Tikka, Millet Roti, etc.)
      PORTION FOCUS: Specify exact quantities.
      WORKOUT FOCUS: Indian-style bodyweight/yoga/gym exercises for the goal.

      JSON OUTPUT FORMAT ONLY:
      {
        "workoutMarkdown": "Comprehensive 4-week workout split in Markdown - focus on structured daily exercises.",
        "nutritionalMarkdown": "Detailed 7-day weekly meal plan (Mon-Sun) in Markdown table style...",
        "workouts": [
           {
             "title": "Daily Training Session",
             "options": [
               {"name": "Option A (Gym/Strength)", "desc": "Structured strength exercises, Indian style."},
               {"name": "Option B (Yoga/Flexibility)", "desc": "Yoga and mobility training, Indian style."},
               {"name": "Option C (Mixed/Active)", "desc": "Cardio and lighter bodyweight, Indian style."}
             ]
           }
        ],
        "days": [
          {
            "day": "Day 1",
            "meals": [
              {
                "id": "d1-m1",
                "time": "8:00 AM",
                "label": "Traditional Breakfast",
                "type": "morning",
                "options": [
                  {"name": "Option A", "desc": "Precise Indian dish with specific quantity."},
                  {"name": "Option B", "desc": "Alternative Indian choice 1 with quantity."},
                  {"name": "Option C", "desc": "Alternative Indian choice 2 with quantity."}
                ],
                "why": "Specific benefit for ${formData.goal}."
              },
              {
                "id": "d1-m2",
                "time": "1:00 PM",
                "label": "Satvic Lunch",
                "type": "noon",
                "options": [
                  {"name": "Thali Style", "desc": "Detailed quantity of roti/dal/sabzi."},
                  {"name": "Protein Alternative", "desc": "Paneer/Lentil portion."}
                ],
                "why": "Impact on training energy."
              },
              {
                "id": "d1-m3",
                "time": "4:30 PM",
                "label": "Evening Chai & Snack",
                "type": "evening",
                "options": [
                  {"name": "Indian Snack", "desc": "E.g. Roasted Makhana (1 bowl)."},
                  {"name": "Protein Snack", "desc": "E.g. Sprouted Moong Salad."}
                ],
                "why": "Reason for choice."
              },
              {
                "id": "d1-m4",
                "time": "8:00 PM",
                "label": "Light Indian Dinner",
                "type": "night",
                "options": [
                  {"name": "Light Roti/Sabzi", "desc": "Specific quantity."},
                  {"name": "Protein Recovery", "desc": "E.g. Vegetable Dalia Khichdi."}
                ],
                "why": "Overnight recovery."
              }
            ]
          }
        ]
      }
    `;

    const result = await generateAIPLAN(prompt);

    if (!result) {
      console.error("AI Generation failed - no result returned");
      setPlanData({ 
        error: "Generation failed. This is likely due to a missing Gemini API Key in the environment. If you are on Netlify, please add GEMINI_API_KEY to your site settings.",
        workoutMarkdown: "# Generation Error\nCould not generate your fitness plan. Please check your internet connection or API settings.", 
        meals: [] 
      });
      setStep('result');
      return;
    }

    try {
      const cleanJson = result?.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson || '{}');
      setPlanData(parsed);
      setStep('result');

      // Save plan to database
      if (user) {
        try {
            await setDoc(doc(db, `users/${user.uid}/plans/gym`), { plan: parsed, updatedAt: serverTimestamp() });
        } catch (e) {
            console.error("Failed to save plan to DB", e);
        }
      }
    } catch (e) {
      console.error("Failed to parse AI plan", e);
      // Fallback if parsing fails - wrap plain text in pseudo-object
      setPlanData({ 
        workoutMarkdown: result, 
        meals: [],
        parseError: true
      });
      setStep('result');
    }
  };

  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 animate-pulse rounded-full" />
          <Loader2 className="w-16 h-16 text-orange-600 animate-spin relative" />
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Architecting Strategy</h2>
          <p className="text-slate-500 animate-pulse text-2xl font-bold uppercase tracking-widest opacity-50">Calculating your 7-day protocol...</p>
        </div>
      </div>
    );
  }

  if (step === 'result' && planData) {
    return (
      <div className="space-y-12 max-w-5xl mx-auto relative min-h-screen pb-20">
        <div className="fixed inset-0 z-0">
          <GymScene />
        </div>

        <div className="relative z-10 flex items-center justify-between px-4">
          <button 
            onClick={() => setStep('form')}
            className="flex items-center gap-2 text-white/70 font-bold text-sm hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" /> Edit Profile
          </button>
          <div className="flex gap-2">
            {user && !planData.error && (
              <button 
                onClick={handleSavePlan}
                disabled={isSaving}
                className={cn(
                  "px-6 py-2.5 rounded-2xl text-sm font-black transition-all flex items-center gap-2 backdrop-blur-md",
                  saveStatus === 'success' 
                    ? "bg-green-500/20 text-green-100 border border-green-500/30" 
                    : "bg-orange-600 text-white hover:bg-orange-700 shadow-xl shadow-orange-500/30"
                )}
              >
                {isSaving ? <LoaderIcon className="w-3 h-3 animate-spin" /> : saveStatus === 'success' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saveStatus === 'success' ? 'PROTOCOL SAVED' : 'SAVE PROTOCOL'}
              </button>
            )}
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl text-xs font-bold transition-all backdrop-blur-md">Export Guide</button>
          </div>
        </div>

        {planData.error && (
          <div className="relative z-10 mx-4 bg-red-500/20 border border-red-500/30 backdrop-blur-md p-6 rounded-3xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="text-white font-bold">Protocol Generation Failed</h3>
              <p className="text-red-100/70 text-sm leading-relaxed">{planData.error}</p>
            </div>
          </div>
        )}

        {/* Meal Plan Section with Navigation */}
        {planData.days && planData.days.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tighter">
                <Utensils className="w-8 h-8 text-orange-500" />
                Nutritional Blueprint
              </h2>
              
              <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto max-w-[50%] no-scrollbar">
                {planData.days.map((d: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(i)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                      selectedDay === i ? "bg-white text-teal-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    Day {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {planData.days[selectedDay]?.meals?.map((meal: any) => {
                const selectedIdx = mealSelections[meal.id] || 0;
                const currentOption = meal.options[selectedIdx];

                return (
                  <motion.div 
                    key={meal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                      className="relative bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm group min-h-[300px] flex flex-col"
                  >
                    <div className="absolute inset-0 z-0 opacity-40 transition-opacity group-hover:opacity-60 pointer-events-none">
                      <MealScene type={meal.type} />
                    </div>

                    <div className="relative z-10 p-8 space-y-6 h-full flex flex-col">
                      <div className="flex justify-between items-start">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                          meal.type === 'morning' ? 'bg-teal-500 shadow-teal-100' :
                          meal.type === 'noon' ? 'bg-amber-500 shadow-amber-100' :
                          meal.type === 'evening' ? 'bg-rose-500 shadow-rose-100' :
                          'bg-indigo-600 shadow-indigo-100'
                        )}>
                          {meal.type === 'morning' && <Sunrise className="w-6 h-6" />}
                          {meal.type === 'noon' && <Sun className="w-6 h-6" />}
                          {meal.type === 'evening' && <Sunset className="w-6 h-6" />}
                          {meal.type === 'night' && <Moon className="w-6 h-6" />}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-400 block uppercase tracking-widest leading-none">{meal.time}</span>
                          <span className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{meal.label}</span>
                        </div>
                      </div>

                      {meal.type === 'noon' && (
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full w-fit flex items-center gap-2"
                    >
                      <ThermometerSun className="w-3 h-3" /> Stay Hydrated
                    </motion.div>
                  )}

                  <div className="space-y-4 flex-grow">
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{currentOption.name}</h4>
                      <p className="text-slate-500 text-lg leading-relaxed font-medium">{currentOption.desc}</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-100">
                      <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider mb-1">Impact Analysis</p>
                      <p className="text-xs text-slate-600 leading-relaxed italic">"{meal.why}"</p>
                    </div>
                  </div>

                      <div className="pt-4 flex justify-between items-center mt-auto border-t border-slate-100/50">
                        <div className="flex gap-1">
                          {[0, 1, 2].map(i => (
                            <div key={i} className={cn("w-2 h-2 rounded-full transition-colors", i === selectedIdx ? "bg-teal-500" : "bg-slate-200")} />
                          ))}
                        </div>
                        <button 
                          onClick={() => toggleMeal(meal.id)}
                          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-teal-600 transition-colors py-2 px-4 rounded-xl bg-slate-100 hover:bg-teal-50"
                        >
                          <RefreshCw className={cn("w-3 h-3 transition-transform duration-500", selectedIdx !== 0 ? "rotate-180" : "rotate-0")} />
                          Change Meal
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -ml-32 -mt-32 opacity-50" />
          
          <div className="relative z-10 space-y-12">
             <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-10">
                <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-orange-200/50">
                  <Zap className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8]">Fitness<br/>Architect</h1>
                  <p className="text-slate-400 font-black text-sm tracking-[0.4em] mt-3">ATHLETE: {formData.name.toUpperCase()} • {formData.goal.replace('_', ' ').toUpperCase()}</p>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-orange-600">
                    <Dumbbell className="w-8 h-8" />
                    <h2 className="text-3xl font-black uppercase tracking-tight">Training Protocol</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert prose-purple max-w-none bg-white/50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                    <div className="markdown-body">
                       <Markdown>{planData.workoutMarkdown}</Markdown>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-orange-500">
                    <Calendar className="w-8 h-8" />
                    <h2 className="text-3xl font-black uppercase tracking-tight">Weekly Nutrition</h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert prose-purple max-w-none bg-white/50 p-8 rounded-[2rem] border border-slate-100 shadow-xl">
                    <div className="markdown-body">
                       <Markdown>{planData.nutritionalMarkdown}</Markdown>
                    </div>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-slate-100 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-10 space-y-6">
                  <div className="flex items-center gap-3 text-orange-600 font-black text-xl uppercase tracking-tighter">
                    <Trophy className="w-6 h-6" /> Benchmarks
                  </div>
                  <ul className="space-y-4 text-lg text-slate-600 dark:text-slate-400 font-bold">
                    <li className="flex gap-4"><span className="text-orange-600">WK 1</span> Establish Baselines</li>
                    <li className="flex gap-4"><span className="text-orange-600">WK 2</span> Peak Volume +10%</li>
                    <li className="flex gap-4"><span className="text-orange-600">WK 3</span> Maximum Intensity</li>
                    <li className="flex gap-4"><span className="text-orange-600">WK 4</span> Metabolic Deload</li>
                  </ul>
                </div>

                <div className="bg-orange-600 rounded-[2.5rem] p-10 text-white space-y-6 shadow-2xl shadow-orange-600/30">
                   <div className="flex items-center gap-3 font-black text-xl uppercase tracking-tighter">
                    <Flame className="w-6 h-6" /> Metabolic Engine
                  </div>
                  <p className="text-orange-50 text-xl leading-relaxed font-bold tracking-tight">
                    Optimized for {formData.goal.replace('_', ' ')}. Adherence to these {formData.days} days/week is mandatory for your {formData.targetWeight}kg target.
                  </p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gym & Fitness Plan</h1>
          <p className="text-slate-500 text-sm">Engineered training and nutrition protocols</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10">
        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
               <Dumbbell className="w-4 h-4 text-purple-600" />
             </div>
             Body Composition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest px-1">Full Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Arjun Kumar"
                className="w-full text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest px-1">Age</label>
                <input 
                  required
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest px-1">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest px-1">Current Weight (kg)</label>
              <input 
                required
                type="number" 
                value={formData.currentWeight}
                onChange={(e) => setFormData({...formData, currentWeight: e.target.value})}
                className="w-full text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest px-1">Target Weight (kg)</label>
              <input 
                required
                type="number" 
                value={formData.targetWeight}
                onChange={(e) => setFormData({...formData, targetWeight: e.target.value})}
                className="w-full text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest px-1">Height (cm)</label>
              <input 
                required
                type="number" 
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
                className="w-full text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
               <Target className="w-4 h-4 text-purple-600" />
             </div>
             Training Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest px-1">Primary Goal</label>
              <select 
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                className="w-full text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
              >
                <option value="fat_loss">Fat Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="strength">Pure Strength</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest px-1">Experience</label>
              <select 
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
              >
                <option value="beginner">Beginner (0-1 yr)</option>
                <option value="intermediate">Intermediate (1-3 yrs)</option>
                <option value="advanced">Advanced (3+ yrs)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest px-1">Gym Days / Week</label>
              <select 
                value={formData.days}
                onChange={(e) => setFormData({...formData, days: e.target.value})}
                className="w-full text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none"
              >
                <option value="2">2 Days (Maintenance)</option>
                <option value="3">3 Days (Full Body)</option>
                <option value="4">4 Days (Upper/Lower)</option>
                <option value="5">5 Days (Bro Split)</option>
                <option value="6">6 Days (PPL Split)</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
               <Utensils className="w-4 h-4 text-orange-600" />
             </div>
             Fueling Strategy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest px-1">Dietary Preference</label>
              <select 
                value={formData.diet}
                onChange={(e) => setFormData({...formData, diet: e.target.value})}
                className="w-full text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto / Low Carb</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest px-1">Allergies</label>
              <input 
                type="text" 
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                placeholder="e.g. Soy, Nuts, Dairy"
                className="w-full text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none"
              />
            </div>
          </div>
        </section>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-orange-100 transition-all flex items-center justify-center gap-3 group text-xl uppercase tracking-tighter"
          >
            Generate Architecture <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
