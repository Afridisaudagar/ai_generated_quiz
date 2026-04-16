import { useState } from "react";

export default function AdminQuiz({
  quizList,
  deleteQuiz,
  setActiveTab
}) {
  return (
    <div className="max-w-[1000px] mx-auto py-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Quiz Management
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Create, view, and manage available quizzes
          </p>
        </div>

        <button
          onClick={() => setActiveTab("ai")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 font-bold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Create Quiz
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quizList.map((q, index) => (
          <div
            key={q._id}
            className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between"
          >
            {/* Top Section */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shadow-sm">
                  {q.subject?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 capitalize">
                    {q.subject || "AI Quiz"}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium mt-0.5 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {q.questions.length} Questions
                  </p>
                </div>
              </div>
              <span className="text-xs bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1.5 rounded-full font-bold">
                #{index + 1}
              </span>
            </div>

            <div className="w-full h-px bg-slate-100 my-4"></div>

            {/* Bottom Actions */}
            <div className="flex justify-end">
              <button
                onClick={() => deleteQuiz(q._id)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Empty State */}
      {quizList.length === 0 && (
        <div className="text-center mt-16 p-12 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            📭
          </div>
          <p className="text-xl font-bold text-slate-800">No quizzes available</p>
          <p className="text-slate-500 mt-2 font-medium">
            Create your first AI-generated quiz to get started.
          </p>
          <button
            onClick={() => setActiveTab("ai")}
            className="mt-6 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
          >
            Create Now
          </button>
        </div>
      )}
    </div>
  );
}