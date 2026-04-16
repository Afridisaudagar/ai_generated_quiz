import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Leaderboard from "../adminComponent/Leaderboard";
import Chart from "../adminComponent/Chart";
import axios from "axios";
import AiQuiz from "../adminComponent/AiQuiz";
import AdminQuiz from "../adminComponent/AdminQuiz";
import StudentList from "../adminComponent/StudentList";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [scores, setScores] = useState([]);
  const [students, setStudents] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [quizList, setQuizList] = useState([]);

  const [form, setForm] = useState({
    subject: "",
    questions: ""
  });

  // ✅ AI state
  const [prompt, setPrompt] = useState("");
  const [skills, setSkills] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [loadingAI, setLoadingAI] = useState(false);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/leaderboard")
      .then(res => setScores(res.data.map(s => s.score)))
      .catch(() => setScores([10, 20, 30]));
  }, []);

  // students
  const fetchStudents = () => {
    axios
      .get("http://localhost:3000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setStudents(res.data));
  };

  const deleteStudent = (id) => {
    axios
      .delete(`http://localhost:3000/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchStudents());
  };

  // quiz
  const fetchQuiz = () => {
    axios.get("http://localhost:3000/api/quiz/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setQuizList(res.data));
  };

  useEffect(() => {
    if (activeTab === "quiz") fetchQuiz();
    if (activeTab === "students") fetchStudents();
  }, [activeTab]);

  const createQuiz = () => {
    axios.post(
      "http://localhost:3000/api/quiz/create",
      {
        subject: form.subject,
        questions: JSON.parse(form.questions)
      },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setShowForm(false);
      setForm({ subject: "", questions: "" });
      fetchQuiz();
    });
  };

  const deleteQuiz = (id) => {
    axios.delete(
      `http://localhost:3000/api/quiz/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => fetchQuiz());
  };

  // ✅ AI generate function
  const generateAIQuiz = async () => {
    try {
      setLoadingAI(true);

      await axios.post(
        "http://localhost:3000/api/quiz/generate",
        { prompt, skills, timeLimit },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPrompt("");
      setSkills("");
      setTimeLimit(30);
      setActiveTab("quiz");
      fetchQuiz();

    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="w-full min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">

        {/* Admin Header & Tabs */}
        <div className="mb-8">
          
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Admin Control Panel
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                Manage platform resources, view metrics, and generate AI quizzes.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
               <button
                 onClick={() => window.location.href = "/dashboard"}
                 className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-2"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                 Dashboard
               </button>
               <button
                 onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
                 className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl text-sm hover:bg-red-100 transition-colors"
               >
                 Logout
               </button>
            </div>
          </div>

          {/* Underline Tabs */}
          <div className="flex gap-8 overflow-x-auto w-full border-b border-slate-200 custom-scrollbar">
            {[
              { id: "leaderboard", label: "Leaderboard" },
              { id: "students", label: "Students" },
              { id: "quiz", label: "Quizzes" },
              { id: "chart", label: "Performance" },
              { id: "ai", label: "AI Generator" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-3 text-sm font-bold transition-all whitespace-nowrap
                ${activeTab === tab.id
                    ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                    : "text-slate-500 hover:text-[#0F172A]"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Content Area */}
        <div className="w-full pb-10">

          {activeTab === "leaderboard" && <Leaderboard />}

          {activeTab === "students" && (
            <StudentList
              students={students}
              deleteStudent={deleteStudent}
            />
          )}

          {activeTab === "quiz" && (
            <AdminQuiz
              quizList={quizList}
              deleteQuiz={deleteQuiz}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "chart" && (
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Aggregate Analytics</h2>
              <Chart scores={scores} />
            </div>
          )}

          {activeTab === "ai" && (
            <AiQuiz
              prompt={prompt}
              setPrompt={setPrompt}
              skills={skills}
              setSkills={setSkills}
              timeLimit={timeLimit}
              setTimeLimit={setTimeLimit}
              loadingAI={loadingAI}
              generateAIQuiz={generateAIQuiz}
            />
          )}

        </div>

      </div>
    </div>
  );
};

export default Admin;