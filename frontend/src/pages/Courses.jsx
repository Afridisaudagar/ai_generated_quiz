import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();
  const [quizList, setQuizList] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/quiz/student/all", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setQuizList(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All Quizzes</h1>
            <p className="text-slate-500 font-medium mt-2">Pick a topic and challenge your knowledge 🚀</p>
          </div>
          <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm text-sm font-bold text-slate-700">
             {quizList.length} Quizzes Available
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-48">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizList.map((quiz, i) => (
              <div 
                key={quiz._id} 
                className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                
                {/* Card Icon & Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl
                    ${i % 3 === 0 ? "bg-blue-50 text-blue-600" : i % 3 === 1 ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"}
                  `}>
                    {quiz.subject ? quiz.subject.charAt(0).toUpperCase() : "Q"}
                  </div>
                  <span className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                    {quiz.questions?.length || 0} Qs
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 capitalize line-clamp-2">
                    {quiz.subject || "AI Generated Quiz"}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mb-6">
                    Test your logic, syntax, and conceptual understanding in this interactive challenge.
                  </p>
                </div>

                {/* Build Button */}
                <button
                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                  className="w-full bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white font-bold py-3 rounded-xl transition-all duration-200 border border-slate-200 hover:border-blue-600 shadow-sm"
                >
                  Start Challenge
                </button>

              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && quizList.length === 0 && (
          <div className="text-center bg-white border border-dashed border-slate-200 rounded-3xl p-16 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <span className="text-5xl block mb-4">📭</span>
            <h2 className="text-xl font-bold text-slate-800">No courses available yet</h2>
            <p className="text-slate-500 mt-2 font-medium">Please wait for your admin to generate some AI content.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Courses;
