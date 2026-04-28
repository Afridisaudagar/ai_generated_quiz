import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StreaksProgress() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const [badgeData, setBadgeData] = useState({ badges: [], streak: 0 });
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const [dailyChallenges, setDailyChallenges] = useState([
        { id: 1, text: "Complete one AI Quiz", completed: true, points: 50 },
        { id: 2, text: "Review 3 weak topics", completed: false, points: 30 },
        { id: 3, text: "Check your Wellness mood", completed: false, points: 20 }
    ]);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/quiz/user/badges", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBadgeData(res.data);
            } catch (err) {
                console.error("Error fetching badges:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBadges();
    }, [token]);

    const handleClaimStreak = () => {
        setClaiming(true);
        setTimeout(() => {
            setClaiming(false);
            setClaimed(true);
            // Simulate incrementing streak visually
            setBadgeData(prev => ({ ...prev, streak: prev.streak + 1 }));
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <p className="text-slate-500 font-bold">Checking your achievements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <button 
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors mb-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Streaks Hub</h1>
                        <p className="text-slate-500 mt-1 font-medium">Keep the 🔥 burning with daily activities.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Streak & Daily Challenges */}
                    <div className="lg:col-span-1 space-y-8">
                        
                        {/* Interactive Streak Game Card */}
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-b from-orange-50/30 to-transparent pointer-events-none" />
                           
                           {/* Aag (Fire) Animation */}
                           <div className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center text-6xl mb-6 shadow-inner ring-8 ring-orange-50 transition-all duration-700 ${claiming ? 'scale-125 rotate-12' : 'scale-100'}`}>
                             {claiming ? '🎆' : '🔥'}
                             <div className="absolute inset-0 rounded-full animate-ping bg-orange-200/50" />
                           </div>

                           <div className="relative z-10 w-full">
                              <h2 className="text-7xl font-black text-slate-900 mb-1">{badgeData.streak}</h2>
                              <p className="text-orange-600 font-black uppercase tracking-[0.2em] text-xs">Active Streak</p>
                              
                              <div className="mt-8 mb-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-1000" 
                                    style={{ width: `${(badgeData.streak % 7) * 14.28}%` }}
                                  />
                              </div>
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-8">Next Badge in {7 - (badgeData.streak % 7)} Days</p>

                              <button 
                                onClick={handleClaimStreak}
                                disabled={claimed || claiming}
                                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${claimed ? 'bg-green-100 text-green-600 cursor-default' : 'bg-slate-900 text-white hover:bg-orange-600 hover:shadow-lg active:scale-95'}`}
                              >
                                {claiming ? 'Analyzing Consistency...' : claimed ? 'Today Claimed ✓' : 'Claim Daily Streak'}
                              </button>
                           </div>
                        </div>

                        {/* Daily Challenges */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
                           <h3 className="text-xl font-black mb-6 flex items-center justify-between relative z-10">
                             <span>Daily Quests</span>
                             <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full uppercase tracking-tighter">Day 1 of 30</span>
                           </h3>
                           <div className="space-y-4 relative z-10">
                             {dailyChallenges.map((challenge) => (
                               <div key={challenge.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                                 <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${challenge.completed ? "bg-blue-500 border-blue-500" : "border-slate-700 group-hover:border-blue-400"}`}>
                                    {challenge.completed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                 </div>
                                 <div className="flex-1">
                                   <p className={`text-sm font-bold transition-all ${challenge.completed ? "text-slate-500 line-through" : "text-slate-200"}`}>{challenge.text}</p>
                                   <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                                      <div className={`h-full bg-blue-500 ${challenge.completed ? 'w-full' : 'w-0'}`} />
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                        </div>
                    </div>

                    {/* Right: Badges & Progress */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Achievement Collection */}
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mb-32" />
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <h3 className="text-2xl font-black text-slate-900">Achievement Museum</h3>
                                <div className="flex gap-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">Total: {badgeData.badges.length}</span>
                                    <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">Rank: Pro</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                                {badgeData.badges.length > 0 ? badgeData.badges.map((badge, idx) => (
                                    <div key={idx} className="flex flex-col items-center bg-white border border-slate-50 p-6 rounded-[2.5rem] transition-all hover:border-orange-200 hover:shadow-2xl hover:-translate-y-2 group shadow-sm">
                                        <div className="text-5xl mb-4 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
                                            {badge.icon || "🏆"}
                                        </div>
                                        <p className="text-[11px] font-black text-slate-900 text-center uppercase tracking-tight">
                                            {badge.name.replace("Badge", "")}
                                        </p>
                                        <div className="h-1 w-8 bg-orange-100 rounded-full mt-2 group-hover:w-12 transition-all" />
                                    </div>
                                )) : (
                                    <div className="col-span-4 py-20 text-center">
                                        <div className="text-7xl mb-6 opacity-20">🏷️</div>
                                        <p className="text-slate-400 font-bold max-w-xs mx-auto">Lock badges by winning Boss Battles and maintaining streaks!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social/Leaderboard Progress */}
                        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl">
                            <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-48 -mb-48" />
                            
                            <div className="relative z-10 max-w-xl">
                                <h3 className="text-4xl font-black mb-4 tracking-tight leading-tight">Master the leaderboard and lead your squad!</h3>
                                <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                                    Consistency hi aapki sabse badi power hai. Har streak point aapko global ranking mein top par le jayega.
                                </p>
                                
                                <div className="flex flex-wrap gap-4">
                                    <button 
                                        onClick={() => navigate("/leaderboard")}
                                        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-base flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40 active:scale-95"
                                    >
                                        Global Ranks
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                    </button>
                                    <button className="bg-white/10 text-white px-10 py-4 rounded-2xl font-black text-base hover:bg-white/20 transition-all">
                                        Invite Squad
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
