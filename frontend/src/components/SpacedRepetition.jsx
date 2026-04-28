import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SpacedRepetition() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [weakTopics, setWeakTopics] = useState([
        { topic: "React Hooks", lastAttempt: "2 days ago", strength: 35, difficulty: "Hard" },
        { topic: "CSS Grid", lastAttempt: "5 days ago", strength: 50, difficulty: "Medium" },
        { topic: "Node.js Middleware", lastAttempt: "1 week ago", strength: 20, difficulty: "Hard" },
        { topic: "SQL Joins", lastAttempt: "3 days ago", strength: 45, difficulty: "Medium" }
    ]);
    const [streak, setStreak] = useState(5); // The "Aag" (Fire) streak mention

    useEffect(() => {
        // In a real app, fetch these from backend based on scores
        setTimeout(() => setLoading(false), 800);
    }, []);

    const startRevision = (topic) => {
        // Logic to start a targeted quiz for that topic
        alert(`Starting revision for: ${topic}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-bold animate-pulse">Analyzing your memory patterns...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            <div className="max-w-5xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <button 
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors mb-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Spaced Repetition</h1>
                        <p className="text-slate-500 mt-1 font-medium">Smart revision system powered by Ebbinghaus Forgetting Curve.</p>
                    </div>

                    {/* The "Aag" (Streak/Fire) Component */}
                    <div className="bg-orange-600 text-white px-8 py-4 rounded-[2rem] shadow-xl shadow-orange-200 flex items-center gap-4 border-4 border-orange-400/30">
                        <div className="text-4xl animate-bounce">🔥</div>
                        <div>
                            <div className="text-3xl font-black">{streak}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Day Streak</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Summary and Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">📈</span>
                                Memory Health
                            </h3>
                            
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-bold text-slate-500">Retention Rate</span>
                                        <span className="text-2xl font-black text-blue-600">68%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full w-[68%]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">In Memory</p>
                                        <p className="text-xl font-black text-slate-800">124</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">To Revise</p>
                                        <p className="text-xl font-black text-red-500">12</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                           <h3 className="text-xl font-black mb-4 relative z-10">AI Analysis</h3>
                           <p className="text-sm text-slate-300 leading-relaxed mb-6 relative z-10">
                              Aapka memory pattern show krta hai ke topics like <span className="text-blue-400 font-bold">Node.js</span> require immediate revision for better long-term retention.
                           </p>
                           <button 
                            onClick={() => alert("AI generation logic here")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all w-full relative z-10"
                           >
                              Generate Smart Quiz
                           </button>
                        </div>
                    </div>

                    {/* Right: Weak Topics List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900">Recommended for Today</h2>
                            <span className="text-xs font-bold text-slate-400 uppercase">Sorted by Urgency</span>
                        </div>

                        <div className="space-y-4">
                            {weakTopics.map((item, idx) => (
                                <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 group">
                                    <div className="flex items-start gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${item.strength < 30 ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"}`}>
                                            {item.strength < 30 ? "⚠️" : "⏳"}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{item.topic}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last: {item.lastAttempt}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.difficulty === 'Hard' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                                    {item.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Topic Strength</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${item.strength < 30 ? "bg-red-500" : "bg-orange-500"}`} style={{ width: `${item.strength}%` }} />
                                                </div>
                                                <span className="text-sm font-black text-slate-700">{item.strength}%</span>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => startRevision(item.topic)}
                                            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all rotate-0 group-hover:rotate-12"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Intervals Info */}
                        <div className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg">💡</div>
                               <p className="text-sm font-bold text-blue-900">Interval Mastery: System is following <span className="underline">Day 1 → 3 → 7</span> cycle.</p>
                            </div>
                            <span className="text-xs font-black text-blue-400 bg-white px-3 py-1 rounded-full uppercase">Enabled</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
