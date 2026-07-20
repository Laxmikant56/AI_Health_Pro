import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Activity, Calendar, History, TrendingUp, Award, AwardIcon, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, onSnapshot, collection, query, orderBy, User as FirebaseUser, doc, updateDoc } from '../lib/firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UserProfile({ 
  onBack, 
  themeColor,
  user
}: { 
  onBack: () => void,
  themeColor: 'teal' | 'purple' | 'rose' | 'orange',
  user: FirebaseUser | null
}) {
  const [profile, setProfile] = useState<any>(null);
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubProfile = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data());
      }
    });

    const q = query(collection(db, `users/${user.uid}/readings`), orderBy('timestamp', 'asc'));
    const unsubReadings = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        ...d.data(),
        id: d.id,
        date: d.data().timestamp?.toDate().toLocaleDateString() || 'N/A',
        time: d.data().timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'N/A'
      }));
      setReadings(data);
      setLoading(false);
    });

    return () => {
      unsubProfile();
      unsubReadings();
    };
  }, [user]);

  const accentColors = {
    teal: 'text-teal-600 bg-teal-50',
    purple: 'text-purple-600 bg-purple-50',
    rose: 'text-rose-600 bg-rose-50',
    orange: 'text-orange-600 bg-orange-50'
  };

  const bgAccents = {
    teal: 'bg-teal-600',
    purple: 'bg-purple-600',
    rose: 'bg-rose-600',
    orange: 'bg-orange-600'
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
        <p className="text-slate-400 font-medium">Syncing profile data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <User className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold">Sign in to track progress</h2>
        <p className="text-slate-500">Your health data, glucose history, and personalized plans will appear here once you login.</p>
        <button onClick={onBack} className="text-teal-600 font-bold hover:underline">Go Back</button>
      </div>
    );
  }

  const avgGlucose = readings.length > 0 ? (readings.reduce((acc, curr) => acc + curr.value, 0) / readings.length).toFixed(1) : '0';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold tracking-tight">Your Health Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 space-y-6">
            {isEditing ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 space-y-4">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Name</label>
                  <input 
                    value={editFormData.name || profile?.name || ''} 
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} 
                    className="w-full text-slate-900 dark:text-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500" 
                    placeholder="Name" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Dietary Preference</label>
                  <input 
                    value={editFormData.diet || profile?.diet || ''} 
                    onChange={(e) => setEditFormData({...editFormData, diet: e.target.value})} 
                    className="w-full text-slate-900 dark:text-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 outline-none focus:border-emerald-500" 
                    placeholder="e.g. Vegetarian" 
                  />
                </div>
                <div className="flex gap-2 pt-2">
                    <button 
                      onClick={async () => {
                        await updateDoc(doc(db, 'users', user!.uid), editFormData);
                        setIsEditing(false);
                      }} 
                      className="flex-1 bg-emerald-600 text-white rounded-2xl py-3 font-bold hover:bg-emerald-700"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl py-3 font-bold hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                </div>
              </div>
            ) : (
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 text-center space-y-4 relative overflow-hidden">
                <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 opacity-30", bgAccents[themeColor])} />
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden relative">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile?.name || user.displayName || 'Guest User'}</h2>
                  <p className="text-slate-400 text-sm">
                    ID: {user.email?.includes('@healthpro.local') ? user.email.split('@')[0] : user.email}
                  </p>
                </div>
                <div className="pt-4 flex justify-center gap-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase rounded-full">Pro Status</span>
                  {profile?.diet && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">{profile.diet}</span>
                  )}
                </div>
                <button 
                  onClick={() => {
                    setEditFormData({ name: profile?.name || '', diet: profile?.diet || '' });
                    setIsEditing(true);
                  }}
                  className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Current Health Stats</h3>
            <div className="space-y-4">
              <StatItem icon={<TrendingUp className="w-4 h-4" />} label="Avg Glucose" value={`${avgGlucose} mg/dL`} />
              <StatItem icon={<Activity className="w-4 h-4" />} label="Total Readings" value={readings.length.toString()} />
              <StatItem icon={<Calendar className="w-4 h-4" />} label="Plan Status" value={profile ? 'Active' : 'Not Generated'} />
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={cn("p-8 rounded-[2rem] text-white space-y-4 shadow-xl", bgAccents[themeColor])}>
              <Award className="w-8 h-8 opacity-50" />
              <h3 className="text-2xl font-bold">Health Streak</h3>
              <p className="text-white/80 text-sm">You have logged readings for {new Set(readings.map(r => r.date)).size} different days. Keep it up!</p>
              <div className="h-2 bg-white/20 rounded-full">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((readings.length / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="bg-slate-900 rounded-[2rem] text-white p-8 space-y-4 shadow-xl">
               <History className="w-8 h-8 opacity-50" />
               <h3 className="text-2xl font-bold">Recent Readings</h3>
               <ul className="space-y-3">
                 {readings.slice(-3).reverse().map((r, i) => (
                   <li key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                     <span className="text-slate-400 uppercase text-[10px] font-bold">{r.date} {r.time}</span>
                     <span className="font-bold text-teal-400">{r.value} mg/dL</span>
                   </li>
                 ))}
                 {readings.length === 0 && <li className="text-slate-500 text-sm italic">No readings logged yet.</li>}
               </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Glucose Level Analysis</h3>
            <div className="h-64 w-full">
              {readings.length >= 2 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={readings}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      minTickGap={30}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={themeColor === 'teal' ? '#0d9488' : themeColor === 'purple' ? '#9333ea' : themeColor === 'orange' ? '#ea580c' : '#e11d48'} 
                      strokeWidth={4} 
                      dot={{ fill: 'white', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                  <p className="text-slate-400 text-sm">Log at least 2 readings to see trend analysis.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-slate-500">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="font-bold">{value}</span>
    </div>
  );
}
