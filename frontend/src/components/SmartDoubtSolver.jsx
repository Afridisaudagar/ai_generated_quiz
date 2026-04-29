import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SmartDoubtSolver = () => {
  const location = useLocation();
  const [question, setQuestion] = useState("");
  const [style, setStyle] = useState("English mode (Formal)");
  const [isWeakStudent, setIsWeakStudent] = useState(false);

  useEffect(() => {
    if (location.state && location.state.weakMode) {
      setIsWeakStudent(true);
    }
  }, [location.state]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const token = sessionStorage.getItem("token");

  const solveDoubt = async () => {
    if (!question.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/ai/solve-doubt",
        { question, style, isWeakStudent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (error) {
      console.error("Doubt Solver error:", error);
      alert("Failed to solve doubt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = [
    { name: "Simple mode", icon: "🌱", desc: "Beginner-friendly" },
    { name: "Hinglish mode", icon: "🗣️", desc: "Conversational mix" },
    { name: "English mode", icon: "📖", desc: "Formal explanation" },
  ];

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-200 mb-4 animate-bounce-subtle">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Smart Doubt Solver</h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Your personalized AI tutor. Ask anything, and I'll explain it in a way that sticks.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10 transition-all">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Your Doubt</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Explain the concept of Recursion in simple terms..."
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {styles.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setStyle(s.name)}
                  className={`p-4 rounded-2xl border transition-all text-left group ${
                    style === s.name 
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                      : "bg-white border-slate-100 text-slate-600 hover:border-blue-200"
                  }`}
                >
                  <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">{s.icon}</span>
                  <p className="font-bold text-sm">{s.name}</p>
                  <p className={`text-[10px] ${style === s.name ? "text-blue-100" : "text-slate-400"}`}>{s.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  setIsWeakStudent(!isWeakStudent);
                }}
                className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                  isWeakStudent 
                    ? "bg-orange-50 border-orange-400 text-orange-600 shadow-inner" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-orange-200 hover:text-orange-400"
                }`}
              >
                {isWeakStudent ? "✅ Weak Student Mode active" : "Explain like I’m a weak student"}
              </button>
              
              <button
                onClick={solveDoubt}
                disabled={loading || !question.trim()}
                className="flex-[1.5] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Generating brilliance...</span>
                  </>
                ) : (
                  <>
                    <span>Solve Doubt</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Result Area */}
        {result && (
          <div className="space-y-6 pb-20 animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
              <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <h2 className="text-2xl font-black mb-2">{result.title}</h2>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                  <span>✨</span> {style} {isWeakStudent && "• Focused Support"}
                </div>
              </div>

              <div className="p-8 sm:p-12 space-y-10">
                
                {/* Steps */}
                <div className="space-y-8">
                  {result.explanationSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-6 group">
                      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                        {step.step}
                      </div>
                      <div className="pt-2">
                        <p className="text-slate-700 leading-relaxed text-lg">{step.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-slate-100" />

                {/* Example & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl">
                    <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="text-lg">💡</span> Real-world Example
                    </h4>
                    <p className="text-orange-900 leading-relaxed font-medium italic">"{result.example}"</p>
                  </div>

                  <div className="bg-green-50 border border-green-100 p-6 rounded-3xl">
                    <h4 className="text-xs font-black text-green-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="text-lg">🎯</span> Summary
                    </h4>
                    <p className="text-green-900 leading-relaxed font-medium">{result.summary}</p>
                  </div>
                </div>

                {/* Visual Suggestion */}
                <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl">🖼️</div>
                  <div>
                    <h4 className="text-sm font-black text-blue-600 uppercase mb-1">Visualize This:</h4>
                    <p className="text-blue-900 text-sm leading-relaxed">{result.visualSuggestion}</p>
                  </div>
                </div>

                {/* Follow up */}
                <div className="bg-slate-900 p-8 rounded-[2rem] text-center space-y-4">
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Check your understanding</p>
                  <p className="text-white text-xl font-bold">{result.followUp}</p>
                  <button 
                    onClick={() => {
                        setQuestion("");
                        setResult(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-blue-400 hover:text-blue-300 font-black text-sm transition-colors pt-2"
                  >
                    Ask another doubt →
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartDoubtSolver;
