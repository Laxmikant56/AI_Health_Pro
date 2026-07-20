import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Fingerprint, 
  Clock, 
  FlaskConical,
  Utensils,
  Save,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { predictGlucose, getGlucoseStatus } from '../services/healthService';
import { db, serverTimestamp, collection, addDoc, handleFirestoreError, OperationType, User as FirebaseUser } from '../lib/firebase';

export default function IRPredictor({ onBack, user }: { onBack: () => void, user: FirebaseUser | null }) {
  const [age, setAge] = useState(52);
  const [isMale, setIsMale] = useState(true);
  const [thumbValue, setThumbValue] = useState(130.5);
  const [indexValue, setIndexValue] = useState(122.2);
  const [isPostMeal, setIsPostMeal] = useState(false);
  const [prediction, setPrediction] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const val = predictGlucose({ age, isMale, thumbValue, indexValue, isPostMeal });
    setPrediction(val);
    setSaveStatus('idle');
  }, [age, isMale, thumbValue, indexValue, isPostMeal]);

  const handleSaveReading = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveStatus('idle');
    const path = `users/${user.uid}/readings`;
    try {
      await addDoc(collection(db, path), {
        userId: user.uid,
        value: Number(prediction.toFixed(1)),
        type: isPostMeal ? 'post-meal' : 'fasting',
        timestamp: serverTimestamp()
      });
      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const status = getGlucoseStatus(prediction, isPostMeal);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase leading-none">IR GLUCOSE SCAN</h1>
          <p className="text-slate-500 text-lg font-medium mt-1">Non-invasive ML screening protocol</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-teal-600 mb-2">
              <FlaskConical className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wider">Parameters</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Patient Age</label>
                <input 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setIsMale(true)}
                    className={cn(
                      "py-3 rounded-xl border-2 transition-all font-semibold text-sm",
                      isMale ? "bg-teal-50 border-teal-500 text-teal-700" : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    Male
                  </button>
                  <button 
                    onClick={() => setIsMale(false)}
                    className={cn(
                      "py-3 rounded-xl border-2 transition-all font-semibold text-sm",
                      !isMale ? "bg-teal-50 border-teal-500 text-teal-700" : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    <div className="flex items-center gap-1">Thumb IR <Fingerprint className="w-3 h-3" /></div>
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={thumbValue}
                    onChange={(e) => setThumbValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                     <div className="flex items-center gap-1">Index IR <Fingerprint className="w-3 h-3" /></div>
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={indexValue}
                    onChange={(e) => setIndexValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Meal State</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setIsPostMeal(false)}
                    className={cn(
                      "py-3 rounded-xl border-2 transition-all font-semibold text-sm flex items-center justify-center gap-2",
                      !isPostMeal ? "bg-teal-50 border-teal-500 text-teal-700" : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    <Clock className="w-4 h-4" /> Fasting
                  </button>
                  <button 
                    onClick={() => setIsPostMeal(true)}
                    className={cn(
                      "py-3 rounded-xl border-2 transition-all font-semibold text-sm flex items-center justify-center gap-2",
                      isPostMeal ? "bg-teal-50 border-teal-500 text-teal-700" : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    <Utensils className="w-4 h-4" /> Post-Meal
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Prediction Display */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-1 mt-4">
              <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Estimated Glucose</span>
              <div className="flex items-baseline justify-center gap-2 text-teal-600">
                <span className="text-8xl md:text-9xl font-black tabular-nums tracking-tighter">{prediction.toFixed(1)}</span>
                <span className="text-2xl font-black text-slate-400 uppercase tracking-tight">mg/dL</span>
              </div>
            </div>

            <div className={cn(
              "px-8 py-3 rounded-2xl font-black text-xl uppercase tracking-widest animate-pulse shadow-xl",
              status.bg, status.color
            )}>
              {status.label}
            </div>

            {user && (
              <button 
                onClick={handleSaveReading}
                disabled={isSaving || saveStatus === 'success'}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg",
                  saveStatus === 'success' 
                    ? "bg-green-100 text-green-700 border border-green-200" 
                    : "bg-slate-900 text-white hover:bg-slate-800"
                )}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saveStatus === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saveStatus === 'success' ? 'Saved to Profile' : 'Save Reading'}
              </button>
            )}

            <div className="w-full max-w-md space-y-4 pt-4">
               <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((prediction - 70) / 230) * 100)}%` }}
                    className={cn("h-full transition-colors duration-500", 
                      status.label === 'Normal' ? 'bg-green-500' : 
                      status.label === 'Prediabetic' ? 'bg-orange-500' : 'bg-red-500'
                    )}
                  />
               </div>
               <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-tighter">
                  <span>70 (Min)</span>
                  <span>100</span>
                  <span>140</span>
                  <span>200</span>
                  <span>300 (Max)</span>
               </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
