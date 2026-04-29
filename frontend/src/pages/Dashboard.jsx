import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "../adminComponent/Chart";
import { useNavigate } from "react-router-dom";
import BossBattle from "../components/BossBattle";

const Dashboard = () => {
  const navigate = useNavigate();

  const [scores, setScores] = useState([]);
  const [quizList, setQuizList] = useState([]);
  
  // AI State
  const [prompt, setPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [showRoadmap, setShowRoadmap] = useState(false);

  // Badge/Streak State
  const [badgeData, setBadgeData] = useState({ badges: [], streak: 0 });

  const token = sessionStorage.getItem("token");

  const generatePersonalQuiz = async () => {
    try {
      setLoadingAI(true);
      const res = await axios.post(
        "http://localhost:3000/api/quiz/generate",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data && res.data._id) {
        navigate(`/quiz/${res.data._id}`);
      }
    } catch (error) {
      console.error("AI Generation error:", error);
      alert("Failed to generate quiz.");
    } finally {
      setLoadingAI(false);
    }
  };

  const generateRoadmap = async (goalPrompt) => {
    try {
      setLoadingAI(true);
      const targetGoal = goalPrompt || prompt;
      const res = await axios.post(
        "http://localhost:3000/api/quiz/roadmap/generate",
        { goal: targetGoal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoadmapData(res.data);
      setShowRoadmap(true);
      setPrompt(""); // Clear prompt after roadmap
    } catch (error) {
      console.error("Roadmap error:", error);
      alert("Failed to generate roadmap strategy.");
    } finally {
      setLoadingAI(false);
    }
  };

  // Fetch my scores
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/quiz/my-scores", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setScores(res.data.map(s => s.score));
      })
      .catch(() => setScores([]));
  }, [token]);

  // Fetch rank from leaderboard (optional but nice)
  useEffect(() => {
    axios.get("http://localhost:3000/api/leaderboard")
      .then(res => {
        const userId = sessionStorage.getItem("userId");
        const rankIndex = res.data.findIndex(d => 
          (d.user && (d.user._id === userId || d.user === userId)) || d._id === userId
        );
        if (rankIndex !== -1) {
          sessionStorage.setItem("myRank", rankIndex + 1);
        }
      })
      .catch(() => {});
  }, []);

  const fetchBadges = () => {
    axios.get("http://localhost:3000/api/quiz/user/badges", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBadgeData(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchBadges();
  }, [token]);

  // fetch quizzes
  useEffect(() => {
    axios.get("http://localhost:3000/api/quiz/student/all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setQuizList(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Track your learning progress and upcoming tasks
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <p className="text-slate-500 font-medium">Total Score</p>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">
              {scores.length ? scores.reduce((a, b) => a + b, 0) : 0}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p className="text-slate-500 font-medium">Quizzes Completed</p>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">
              {scores.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              </div>
              <p className="text-slate-500 font-medium">Leaderboard Rank</p>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">
              #{sessionStorage.getItem("myRank") || "-"}
            </h2>
          </div>

        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Performance */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Performance Overview
            </h2>
            <div className="rounded-xl border border-slate-100">
              <Chart scores={scores} />
            </div>

            {/* Achievement Collection */}
            <div className="mt-8 pt-8 border-t border-slate-50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    My Achievements
                    <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs font-black">🔥 {badgeData.streak} Day Streak</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Badges earned through Boss Battles and quizzes</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {badgeData.badges.length > 0 ? badgeData.badges.map((badge, idx) => (
                  <div key={idx} className="group relative flex flex-col items-center bg-slate-50 border border-slate-100 p-4 rounded-2xl w-24 transition-all hover:bg-white hover:border-orange-200 hover:shadow-lg hover:scale-105">
                    <span className="text-3xl mb-2 drop-shadow-sm group-hover:scale-125 transition-transform">{badge.icon || "🏆"}</span>
                    <span className="text-[10px] font-black text-slate-400 text-center leading-tight uppercase group-hover:text-orange-600 mt-1">{badge.name.replace("Badge", "")}</span>
                    <span className="text-[8px] text-slate-300 font-bold mt-1">{new Date(badge.date).toLocaleDateString()}</span>
                  </div>
                )) : (
                  <div className="w-full py-8 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                    <p className="text-sm font-bold text-slate-300">No badges earned yet. Defeat the Boss to claim your first!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col">
            
            {/* Featured Section: Boss Battle & Wellness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Daily Boss Battle */}
                <div className="sm:col-span-2">
                    <BossBattle onComplete={fetchBadges} />
                </div>

                {/* Wellness Hub */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5 group cursor-pointer hover:shadow-md transition-all duration-300" 
                    onClick={() => navigate("/wellness")}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:scale-110">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Wellness</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Student Wellness Hub</h3>
                  <p className="text-xs text-slate-500 mb-4">Track your mood and get personal guidance.</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 font-sans">
                    How are you feeling today?
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </div>

                {/* Goal-Based Learning */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 group cursor-pointer hover:shadow-md transition-all duration-300"
                    onClick={() => navigate("/goal-learning")}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <circle cx="12" cy="12" r="6" strokeWidth="2" />
                        <circle cx="12" cy="12" r="2" strokeWidth="2" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Growth</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-0.5">Goal-Based Learning</h3>
                  <p className="text-xs leading-relaxed text-slate-500 mb-4">
                    Personalized AI roadmaps (e.g. <span className="font-bold text-blue-600">"Crack placement in 3 months"</span>) with daily topics and practice plans.
                  </p>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600 font-sans">
                    Run AI Roadmap
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                </div>

                {/* Spaced Repetition */}
                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 rounded-2xl p-5 group cursor-pointer hover:shadow-md transition-all duration-300"
                    onClick={() => navigate("/spaced-repetition")}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-purple-600 shadow-sm transition-transform group-hover:scale-110">
                      <span className="text-xl">🧠</span>
                    </div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Memory</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Spaced Repetition</h3>
                  <p className="text-[10px] leading-relaxed text-slate-500 mb-4">
                    Smart revision of weak topics at optimized intervals (Day 1 → 3 → 7).
                  </p>
                  <div className="flex items-center gap-1 text-xs font-bold text-purple-600 font-sans">
                    Check Weak Topics
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  </div>
                </div>

                {/* Streaks & Progress */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 group cursor-pointer hover:shadow-md transition-all duration-300"
                    onClick={() => navigate("/streaks")}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-600 shadow-sm transition-transform group-hover:scale-110">
                      <span className="text-xl">🎮</span>
                    </div>
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Rewards</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Streaks & Progress</h3>
                  <p className="text-[10px] leading-relaxed text-slate-500 mb-4">
                    🔥 {badgeData.streak} Day Streak! Track badges, daily challenges, and leaderboard rank.
                  </p>
                  <div className="flex items-center gap-1 text-xs font-bold text-orange-600 font-sans">
                    View Achievements
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  </div>
                </div>

                  {/* Smart Doubt Solver */}
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-2xl p-5 group cursor-pointer hover:shadow-md transition-all duration-300"
                      onClick={() => navigate("/doubt-solver")}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-cyan-600 shadow-sm transition-transform group-hover:scale-110">
                        <span className="text-xl">🤖</span>
                      </div>
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Tutor</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">Smart Doubt Solver</h3>
                    <p className="text-[10px] leading-relaxed text-slate-500 mb-4">
                      AI tutor that explains concepts like a teacher. Step-by-step guidance.
                    </p>
                    <button 
                      className="w-full bg-white hover:bg-slate-50 text-cyan-600 text-[10px] font-black py-2 rounded-lg transition-all border border-cyan-100 shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/doubt-solver", { state: { weakMode: true } });
                      }}
                    >
                      Explain like I’m a weak student
                    </button>
                  </div>

            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-4">
              AI Learning Lab
            </h2>

            <div className="bg-slate-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">AI Learning Lab</p>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Generate Roadmap or Quiz</h3>
              <input 
                id="ai-lab-input"
                type="text" 
                placeholder="Topic (e.g. Python, History)"
                className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                id="start-ai-btn"
                disabled={loadingAI || !prompt.trim()}
                onClick={generatePersonalQuiz}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
              >
                {loadingAI ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Creating...
                  </>
                ) : "Start AI Session"}
              </button>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Quick Actions
            </h2>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => {
                  if (quizList.length > 0) {
                    navigate(`/quiz/${quizList[0]._id}`);
                  } else {
                    alert("No quizzes available yet!");
                  }
                }}
                className="w-full bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                Latest Official Quiz
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>

              <button
                onClick={() => navigate("/leaderboard")}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-medium py-3 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                View Leaderboard
              </button>
            </div>


            {/* Previous quizzes */}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Previous Quizzes
              </h3>

              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {quizList.map((q, index) => (
                  <div
                    key={q._id}
                    onClick={() => navigate(`/quiz/${q._id}`)}
                    className="group cursor-pointer bg-white border border-slate-100 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-900 capitalize group-hover:text-blue-600 transition-colors">
                          {q.subject || "AI Quiz"}
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {q.questions.length} Questions
                        </p>
                      </div>

                      <div className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full">
                        Quiz {index + 1}
                      </div>
                    </div>
                  </div>
                ))}
                {quizList.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-sm border border-dashed border-slate-200 rounded-xl">
                    No quizzes completed yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Roadmap Modal */}
      {showRoadmap && roadmapData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
           <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                 <div>
                    <h2 className="text-2xl font-black">{roadmapData.title || "AI Personalized Roadmap"}</h2>
                    <p className="text-blue-100 text-sm font-medium">Your 3-month strategic plan is ready.</p>
                 </div>
                 <button 
                  onClick={() => setShowRoadmap(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                 >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Milestones */}
                    <div className="lg:col-span-1 space-y-6">
                       <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-sm">🎯</span>
                          Monthly Goals
                       </h3>
                       <div className="space-y-4">
                          {roadmapData.milestones.map((m, i) => (
                             <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute left-0 top-0 w-1 h-full bg-orange-400"></div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Month {i+1}</p>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">{m}</p>
                             </div>
                          ))}
                       </div>

                       <div className="pt-6">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">📊</span>
                                Quiz Strategy
                            </h3>
                            <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg shadow-indigo-200">
                                <p className="text-sm leading-relaxed font-medium">
                                    {roadmapData.quizStrategy}
                                </p>
                            </div>
                       </div>
                    </div>

                    {/* Right: Weekly Plan */}
                    <div className="lg:col-span-2 space-y-6">
                       <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">📅</span>
                          Weekly Focus (Month 1)
                       </h3>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {roadmapData.weeklyPlan.map((w, i) => (
                             <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-300">
                                <div className="flex justify-between items-start mb-3">
                                   <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase">Week {w.week}</span>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2 truncate" title={w.topic}>{w.topic}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed italic">{w.task}</p>
                             </div>
                          ))}
                       </div>

                       <div className="bg-white p-6 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-xl">💡</div>
                            <div>
                                <h4 className="font-bold text-slate-900">Next Step</h4>
                                <p className="text-xs text-slate-500 mt-1 max-w-xs">Use the weekly topics above to search for quizzes in our AI Lab for targeted practice.</p>
                            </div>
                       </div>
                    </div>

                 </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
                 <button 
                  onClick={() => setShowRoadmap(false)}
                  className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                 >
                    Got it, let's start!
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;   