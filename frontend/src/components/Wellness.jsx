import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Wellness = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        mood: "",
        sleep: "",
        mindset: "",
        goal: ""
    });
    const [result, setResult] = useState(null);

    const moods = [
        { key: "stressed", label: "Stressed", icon: "😰", color: "bg-red-50 text-red-600 border-red-100" },
        { key: "tired", label: "Tired", icon: "😴", color: "bg-amber-50 text-amber-600 border-amber-100" },
        { key: "motivated", label: "Motivated", icon: "🚀", color: "bg-green-50 text-green-600 border-green-100" },
        { key: "anxious", label: "Anxious", icon: "😟", color: "bg-purple-50 text-purple-600 border-purple-100" },
        { key: "happy", label: "Happy", icon: "😊", color: "bg-blue-50 text-blue-600 border-blue-100" }
    ];

    const sleepOptions = ["Less than 4 hours", "4 to 6 hours", "6 to 8 hours", "More than 8 hours"];

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        const token = sessionStorage.getItem("token");
        try {
            const res = await axios.post("http://localhost:3000/api/wellness/advice", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResult(res.data);
            setStep(4); // Result step
        } catch (error) {
            console.error("Wellness error:", error);
            const errMsg = error.response?.data?.message || error.message || "Something went wrong.";
            alert(`Error: ${errMsg}. Please check if the server is running on port 3000.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center font-sans">
            <div className={`${step === 4 ? "max-w-5xl" : "max-w-2xl"} w-full transition-all duration-500`}>
                
                {/* Header/Back */}
                <div className="flex justify-between items-center mb-8">
                    <button 
                        onClick={() => step === 4 ? setStep(0) : navigate("/dashboard")}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        {step === 4 ? "Start New Assessment" : "Back to Dashboard"}
                    </button>
                    {step < 4 && (
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">
                            Step {step + 1} of 4
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 sm:p-12 transition-all">
                    
                    {/* Step 0: Mood */}
                    {step === 0 && (
                        <div className="transition-opacity duration-300">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">How are you feeling?</h2>
                            <p className="text-slate-500 text-center mb-10">Select your current mood to begin.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {moods.map((m) => (
                                    <button
                                        key={m.key}
                                        onClick={() => {
                                            setFormData({...formData, mood: m.key});
                                            handleNext();
                                        }}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 bg-white border-slate-100 text-slate-400 hover:bg-slate-50 hover:scale-105 hover:border-blue-200 cursor-pointer`}
                                    >
                                        <span className="text-3xl mb-2">{m.icon}</span>
                                        <span className="text-sm font-bold">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 1: Sleep */}
                    {step === 1 && (
                        <div className="transition-opacity duration-300">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Sleep Quality</h2>
                            <p className="text-slate-500 text-center mb-10">How much rest did you get last night?</p>
                            <div className="space-y-3">
                                {sleepOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            setFormData({...formData, sleep: opt});
                                            handleNext();
                                        }}
                                        className="w-full p-4 text-left rounded-xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all font-medium text-slate-700 flex justify-between items-center group cursor-pointer"
                                    >
                                        {opt}
                                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </button>
                                ))}
                            </div>
                            <button onClick={handleBack} className="mt-8 text-sm text-slate-400 hover:text-slate-600 font-bold cursor-pointer">Previous Step</button>
                        </div>
                    )}

                    {/* Step 2: Mindset */}
                    {step === 2 && (
                        <div className="transition-opacity duration-300">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">What's on your mind?</h2>
                            <p className="text-slate-500 text-center mb-8">Share your thoughts or any stress you're feeling.</p>
                            <textarea 
                                autoFocus
                                className="w-full h-40 p-4 border border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-800 relative z-10"
                                placeholder="..."
                                value={formData.mindset}
                                onChange={(e) => setFormData({...formData, mindset: e.target.value})}
                            ></textarea>
                            <div className="flex justify-between items-center mt-8">
                                <button onClick={handleBack} className="text-sm text-slate-400 hover:text-slate-600 font-bold cursor-pointer">Previous Step</button>
                                <button 
                                    onClick={handleNext} 
                                    disabled={!formData.mindset.trim()}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold disabled:bg-slate-200 transition-colors cursor-pointer"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Goal */}
                    {step === 3 && (
                        <div className="transition-opacity duration-300">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Daily Goal</h2>
                            <p className="text-slate-500 text-center mb-8">What is one thing you want to achieve today?</p>
                            <input 
                                type="text"
                                autoFocus
                                className="w-full p-4 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-800 relative z-10"
                                placeholder="..."
                                value={formData.goal}
                                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                            />
                            <div className="flex justify-between items-center mt-10">
                                <button onClick={handleBack} className="text-sm text-slate-400 hover:text-slate-600 font-bold cursor-pointer">Previous Step</button>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={loading || !formData.goal.trim()}
                                    className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold disabled:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            AI is thinking...
                                        </>
                                    ) : (
                                        "Get AI Advice"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Results */}
                    {step === 4 && result && (
                        <div className="transition-all duration-700 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">AI Personalized Advice</h2>
                            
                            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Analysis
                                </h3>
                                <p className="text-slate-600 leading-relaxed italic">{result.analysis}</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Recommendations (Aap yeh kro)
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {result.recommendations.map((rec, i) => (
                                        <div key={i} className="bg-white border border-slate-100 p-4 rounded-xl flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {i + 1}
                                            </div>
                                            <p className="text-slate-700 text-sm font-medium">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                                <button 
                                    onClick={() => setStep(0)}
                                    className="w-full mt-10 p-4 border-2 border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 font-bold rounded-2xl transition-all cursor-pointer"
                                >
                                    Start New Assessment
                                </button>
                            </div>

                            {/* New Goal-Based Learning Card on the right */}
                            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 flex flex-col gap-6 sticky top-24">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                            <circle cx="12" cy="12" r="6" strokeWidth="2" />
                                            <circle cx="12" cy="12" r="2" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest">New Feature</span>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">Goal-Based Learning</h3>
                                    <p className="text-sm leading-relaxed text-slate-500">
                                        AI generates a personalized roadmap based on your goal, such as <span className="text-blue-600 font-bold">"Crack placement in 3 months"</span>. It suggests daily topics, practice questions, and revision plans.
                                    </p>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-slate-400">
                                    🎯 Start your 3-month roadmap journey today!
                                </div>

                                <button 
                                    onClick={() => navigate("/dashboard")}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                                >
                                    Try it on Dashboard
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Wellness;
