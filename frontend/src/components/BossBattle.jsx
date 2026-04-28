import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BossBattle = ({ onComplete }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState("countdown"); // countdown | loading | battle | result
    const [timeLeftToStart, setTimeLeftToStart] = useState("");
    const [isActive, setIsActive] = useState(false);
    
    // Quiz State
    const [quizData, setQuizData] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [battleTimeLeft, setBattleTimeLeft] = useState(300); // 5 minutes
    const [showDefeat, setShowDefeat] = useState(false);
    const [showVictory, setShowVictory] = useState(false);
    const [claimLoading, setClaimLoading] = useState(false);

    const token = sessionStorage.getItem("token");

    // Countdown logic to 8 PM
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const target = new Date();
            target.setHours(20, 0, 0, 0); // 8:00 PM

            if (now >= target) {
                setIsActive(true);
                setTimeLeftToStart("Active Now!");
            } else {
                setIsActive(false);
                const diff = target - now;
                const h = Math.floor(diff / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimeLeftToStart(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Battle Timer logic
    useEffect(() => {
        if (step === "battle" && battleTimeLeft > 0) {
            const timer = setInterval(() => setBattleTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (step === "battle" && battleTimeLeft === 0) {
            handleBattleEnd();
        }
    }, [step, battleTimeLeft]);

    const startBattle = async () => {
        setStep("loading");
        try {
            const res = await axios.post("http://localhost:3000/api/quiz/boss-battle/generate", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuizData(res.data);
            setStep("battle");
        } catch (error) {
            console.error("Boss error:", error);
            alert("The Boss is currently hidden. Try again in a moment.");
            setStep("countdown");
        }
    };

    const handleBattleEnd = async () => {
        let score = 0;
        quizData.questions.forEach((q, i) => {
            if (answers[i] === q.answer) score++;
        });

        const percentage = (score / quizData.questions.length) * 100;
        
        if (percentage >= 70) {
            setStep("victory");
            // Claim badge
            setClaimLoading(true);
            try {
                await axios.post("http://localhost:3000/api/quiz/boss-battle/claim", { score: percentage }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Badge claim failed:", err);
            } finally {
                setClaimLoading(false);
            }
        } else {
            setStep("defeat");
        }
    };

    if (step === "loading") {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-slate-800">The Boss is arriving...</h3>
                <p className="text-slate-500">Preparing 5 minutes of ultimate challenge.</p>
            </div>
        );
    }

    if (step === "battle" && quizData) {
        const q = quizData.questions[currentIdx];
        const progress = ((currentIdx + 1) / quizData.questions.length) * 100;

        return (
            <div className="p-4 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Level: Hard
                        </div>
                        <div className={`text-xl font-mono font-bold ${battleTimeLeft < 30 ? "text-red-500 animate-pulse" : "text-slate-700"}`}>
                            {Math.floor(battleTimeLeft / 60)}:{(battleTimeLeft % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                    <div className="text-sm font-bold text-slate-400">
                        {currentIdx + 1} / {quizData.questions.length}
                    </div>
                </div>

                <div className="h-1.5 w-full bg-slate-100 rounded-full mb-8 overflow-hidden">
                    <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
                    {q.question}
                </h2>

                <div className="grid gap-3 mb-10">
                    {q.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => setAnswers({...answers, [currentIdx]: opt})}
                            className={`p-4 rounded-xl text-left border-2 transition-all font-medium ${answers[currentIdx] === opt ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm" : "border-slate-100 hover:border-purple-200 hover:bg-slate-50 text-slate-700"}`}
                        >
                            <span className="inline-block w-8 font-bold opacity-30">{String.fromCharCode(65+i)}</span>
                            {opt}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between">
                    <button 
                        onClick={() => setCurrentIdx(prev => prev - 1)}
                        disabled={currentIdx === 0}
                        className="px-6 py-2 rounded-lg font-bold text-slate-400 disabled:opacity-0 transition-opacity"
                    >
                        Back
                    </button>
                    {currentIdx === quizData.questions.length - 1 ? (
                        <button 
                            onClick={handleBattleEnd}
                            disabled={!answers[currentIdx]}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 transition-all"
                        >
                            Strike Final Blow!
                        </button>
                    ) : (
                        <button 
                            onClick={() => setCurrentIdx(prev => prev + 1)}
                            disabled={!answers[currentIdx]}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-3 rounded-xl font-bold transition-all"
                        >
                            Next Move
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (step === "victory") {
        return (
            <div className="p-12 text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100">
                <span className="text-7xl block mb-6 animate-bounce">🏆</span>
                <h2 className="text-3xl font-black text-green-900 mb-4">YOU DEFEATED THE BOSS!</h2>
                <p className="text-green-700 font-medium mb-8">Your mastery is unparalleled. The Daily Warrior Badge has been added to your collection.</p>
                <button 
                    onClick={() => {
                        onComplete && onComplete();
                        setStep("countdown");
                    }}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                >
                    View My Badges
                </button>
            </div>
        );
    }

    if (step === "defeat") {
        return (
            <div className="p-12 text-center bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl border border-red-100">
                <span className="text-7xl block mb-6 grayscale">💀</span>
                <h2 className="text-3xl font-black text-red-900 mb-4">BOSS DEFEATED YOU</h2>
                <p className="text-red-700 font-medium mb-8">The Boss was too strong this time. Sharpen your skills and try again tomorrow!</p>
                <button 
                    onClick={() => {
                        onComplete && onComplete();
                        setStep("countdown");
                    }}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                    Return to Training
                </button>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden bg-white border-2 rounded-2xl p-6 transition-all duration-500 ${isActive ? "border-purple-400 shadow-xl shadow-purple-100 ring-2 ring-purple-100" : "border-slate-100"}`}>
            {isActive && <div className="absolute top-0 right-0 p-2"><span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span></span></div>}
            
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all ${isActive ? "bg-purple-600 text-white rotate-12" : "bg-slate-100 text-slate-400"}`}>
                    ⚔️
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase">Daily Boss Battle</h3>
                    <p className="text-xs font-bold text-slate-500">{isActive ? "CHALLENGE ACTIVE" : "LOCKS AT 8:00 PM"}</p>
                </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                <div className="flex justify-between items-center bg-white border border-slate-100 rounded-lg px-4 py-2 mb-3">
                    <span className="text-xs font-bold text-slate-400">T-MINUS</span>
                    <span className={`text-xl font-mono font-bold ${isActive ? "text-purple-600" : "text-slate-800"}`}>
                        {timeLeftToStart}
                    </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Assemble your knowledge. Defeat the daily boss to earn the **Warrior Badge** and build your win streak.
                </p>
            </div>

            <button
                disabled={!isActive}
                onClick={startBattle}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-wider transition-all duration-300 transform ${isActive ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 hover:-translate-y-1 hover:brightness-110 active:translate-y-0" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}
            >
                {isActive ? "Enter the Arena" : "Arena Locked"}
            </button>
        </div>
    );
};

export default BossBattle;
