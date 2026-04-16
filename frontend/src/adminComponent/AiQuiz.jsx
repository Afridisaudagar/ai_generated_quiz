export default function AiQuiz({
  prompt,
  setPrompt,
  skills,
  setSkills,
  timeLimit,
  setTimeLimit,
  loadingAI,
  generateAIQuiz
}) {
  return (
    <div className="max-w-2xl mx-auto py-8">

      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-sm">
            🤖
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              AI Quiz Generator
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Create instant assessments using GenAI
            </p>
          </div>
        </div>

        {/* Topic Input */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-semibold text-slate-700">
            Topic or Subject
          </label>
          <textarea
            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder-slate-400 resize-none font-medium"
            placeholder="e.g. React Hooks, the Solar System, European History..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* Skills & Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Skills to test (comma separated)
            </label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder-slate-400 font-medium"
              placeholder="e.g. logic, syntax, memory"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Time Limit (Minutes)
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium cursor-pointer"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>1 Hour</option>
            </select>
          </div>
        </div>

        {/* Dynamic Mode Notification */}
        <div className="mt-6 flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            ✓
          </div>
          <p className="text-sm font-medium text-green-700">
            <span className="font-bold">Dynamic Uniqueness Enabled:</span> Every student who takes this quiz will receive a 100% unique set of questions.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={generateAIQuiz}
          disabled={loadingAI || !prompt.trim()}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 rounded-xl font-bold transition-all shadow-sm flex justify-center items-center gap-2"
        >
          {loadingAI ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Generating AI Questions...
            </>
          ) : (
            <>Generate Magic Quiz</>
          )}
        </button>

        {/* Info */}
        <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
           <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           <p className="text-sm text-slate-600 font-medium">
            Our AI engine will automatically generate 5 high-quality multiple choice questions based on your topic.
           </p>
        </div>

      </div>
    </div>
  );
}