import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const token = sessionStorage.getItem("token");

  // Move submitQuiz up so it's defined before the useEffect that calls it
  const submitQuiz = async () => {
    let score = 0;

    questions.forEach((q, i) => {
      if (answers[i] === q.answer) score++;
    });

    try {
        await axios.post(
          "http://localhost:3000/api/quiz/submit",
          { score },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    } catch (err) {
        console.error("Submission error:", err);
    }

    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchQuiz = () => {
      setLoading(true);
      setError(null);
      axios.get(`http://localhost:3000/api/quiz/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.data) {
            throw new Error("Quiz data not found");
          }
          setQuestions(res.data.questions || []);
          if (res.data.timeLimit) {
            setTimeLeft(res.data.timeLimit * 60);
          } else {
            setTimeLeft(30 * 60); // Default 30 mins
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError("Failed to load quiz. Please try again later.");
          setLoading(false);
        });
    };

    fetchQuiz();
  }, [id, token]);

  // Countdown Logic
  useEffect(() => {
    if (loading || error || timeLeft === null) return;
    
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, error]);

  const handleSelect = (option) => {
    setAnswers({
      ...answers,
      [current]: option,
    });
  };

  const nextQuestion = () => setCurrent(current + 1);
  const prevQuestion = () => setCurrent(current - 1);

  // Format time
  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            🤖
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Preparing Your Unique Challenge</h2>
        <p className="text-slate-500 max-w-xs mx-auto animate-pulse">
          Our AI is generating a custom set of questions specifically for you...
        </p>
      </div>
    );
  }

  if (error || !questions.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 text-center max-w-md w-full">
          <span className="text-5xl block mb-6">{error ? "⚠️" : "📭"}</span>
          <h2 className="text-2xl font-bold text-slate-800">{error || "No Questions Found"}</h2>
          <p className="text-slate-500 mt-3 font-medium">
            {error ? "There was an error connecting to the server." : "Check back later for new content."}
          </p>
          <button 
            onClick={() => navigate("/courses")}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-2xl p-6 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all">

        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-900">
              Quiz Challenge
            </h1>
            <div className={`flex items-center gap-2 mt-1 font-bold ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-blue-600"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {formatTime(timeLeft)}
            </div>
          </div>
          <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
            {current + 1} <span className="text-blue-400">/</span> {questions.length}
          </span>
        </div>

        <div className="mb-8">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-medium text-slate-800 mb-6 leading-relaxed">
          {questions[current].question}
        </h2>

        <div className="space-y-4">
          {questions[current].options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 font-medium border ${answers[current] === option
                  ? "bg-blue-50 border-blue-600 text-blue-700 shadow-sm ring-1 ring-blue-600"
                  : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold transition-colors ${answers[current] === option ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-between items-center pt-6 border-t border-slate-100">
          <button
            onClick={prevQuestion}
            disabled={current === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-colors duration-200 ${current === 0 ? "text-slate-400 bg-slate-50 cursor-not-allowed" : "text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300"}`}
          >
            Previous
          </button>

          {current === questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-[0_4px_14px_0_rgb(34,197,94,0.39)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Next Step
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Quiz;