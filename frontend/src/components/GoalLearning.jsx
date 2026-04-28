import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GoalLearning() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const [goal, setGoal] = useState("");
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState(null);

    const generateRoadmap = async () => {
        if (!goal.trim()) return;
        try {
            setLoading(true);
            const res = await axios.post(
                "http://localhost:3000/api/quiz/roadmap/generate",
                { goal },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRoadmap(res.data);
        } catch (error) {
            console.error("Roadmap error:", error);
            alert("Failed to generate your personalized roadmap.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div className="max-w-2xl">
                        <button 
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors mb-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Personalized Roadmaps</h1>
                        <p className="text-slate-500 mt-2 font-medium">Define your target, and our AI will architect a 3-month strategic learning journey for you.</p>
                    </div>

                    <div className="bg-blue-600 p-1 rounded-[2rem] shadow-xl shadow-blue-100">
                        <div className="bg-white px-8 py-4 rounded-[1.8rem] flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl shadow-inner">🎯</div>
                            <div>
                                <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Goals</div>
                                <div className="text-xl font-black text-slate-800">{roadmap ? "1 Target" : "No Target Set"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input Section */}
                {!roadmap && (
                    <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl flex flex-col items-center text-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-3xl mb-8">🚀</div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">What's your ultimate goal?</h2>
                        <p className="text-slate-500 mb-10 max-w-lg">Whether it's "Crack Google Interview in 3 months" or "Master Data Science," we'll create the strategy.</p>
                        
                        <div className="w-full flex flex-col sm:flex-row gap-4">
                            <input 
                                type="text"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                placeholder="e.g. Crack placement in 3 months"
                                className="flex-1 bg-slate-50 border-2 border-slate-100 px-6 py-4 rounded-2xl text-lg font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
                            />
                            <button 
                                onClick={generateRoadmap}
                                disabled={loading || !goal.trim()}
                                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-600 active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300 flex items-center justify-center gap-3 whitespace-nowrap"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Architecting...
                                    </>
                                ) : (
                                    <>
                                        Generate Roadmap
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Roadmap Display Section */}
                {roadmap && (
                    <div className="animate-in fade-in zoom-in duration-500 space-y-8">
                        
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl" />
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black mb-2">{roadmap.title}</h2>
                                <div className="flex items-center gap-4 text-blue-400 font-bold text-sm">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        3 Month Plan
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                    <span>AI Optimized</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setRoadmap(null)}
                                className="absolute top-10 right-10 text-slate-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Monthly Milestones */}
                            <div className="lg:col-span-1 space-y-6">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <span className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg">🏁</span>
                                    Milestones
                                </h3>
                                <div className="space-y-4">
                                    {roadmap.milestones.map((m, i) => (
                                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-all">
                                            <div className="absolute left-0 top-0 w-1.5 h-full bg-orange-500" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Month {i+1}</p>
                                            <p className="font-bold text-slate-800 leading-relaxed">{m}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-900 rounded-3xl p-6 text-white mt-10">
                                    <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm">🧠</span>
                                        Quiz Strategy
                                    </h3>
                                    <p className="text-sm text-slate-400 leading-relaxed italic">
                                        "{roadmap.quizStrategy}"
                                    </p>
                                </div>
                            </div>

                            {/* Weekly Plan */}
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <span className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">🗓️</span>
                                    Month 1: Immediate Action
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {roadmap.weeklyPlan.map((w, i) => (
                                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Week {w.week}</span>
                                                <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-400 transition-colors" />
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 mb-3">{w.topic}</h4>
                                            <p className="text-sm text-slate-500 leading-relaxed">{w.task}</p>
                                            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                                                <span className="text-[10px] font-black text-slate-300 uppercase">Step {i+1} of 12</span>
                                                <button className="text-blue-600 text-sm font-black flex items-center gap-1 hover:gap-2 transition-all">
                                                    Start Unit
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
