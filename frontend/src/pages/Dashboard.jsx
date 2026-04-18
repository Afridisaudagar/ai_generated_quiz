import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "../adminComponent/Chart";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [scores, setScores] = useState([]);
  const [quizList, setQuizList] = useState([]);
  
  // AI State
  const [prompt, setPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const token = sessionStorage.getItem("token");

  const generatePersonalQuiz = async () => {
    try {
      setLoadingAI(true);
      const res = await axios.post(
        "http://localhost:3000/api/quiz/generate",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Navigate to the newly created quiz immediately
      if (res.data && res.data._id) {
        navigate(`/quiz/${res.data._id}`);
      }
    } catch (error) {
      console.error("AI Generation error:", error);
      alert("Failed to generate quiz. Check console.");
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
    <div className="h-full overflow-hidden bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="h-full flex flex-col max-w-7xl mx-auto">

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

          {/* Performance */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col min-h-0">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Performance Overview
            </h2>
            <div className="flex-1 rounded-xl border border-slate-100">
              <Chart scores={scores} />
            </div>
          </div>

          {/* Quick Actions & Recent */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col min-h-0">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              AI Learning Lab
            </h2>

            <div className="bg-slate-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Instant Mastery</p>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Generate Unique Quiz</h3>
              <input 
                type="text" 
                placeholder="Topic (e.g. Python, History)"
                className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
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
            <div className="flex flex-col flex-1 min-h-0">
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
    </div>
  );
};

export default Dashboard;   