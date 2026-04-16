export default function StudentList({ students, deleteStudent }) {
  return (
    <div className="max-w-[1000px] mx-auto py-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Manage Students
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track and manage your learners
          </p>
        </div>
      
        <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm text-sm font-bold text-slate-700 flex items-center gap-2">
           <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
           {students.length} Total Students
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((user, index) => (
          <div
            key={user._id}
            className="bg-white border border-slate-100 p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md hover:border-blue-300 transition-all duration-300 flex items-center justify-between gap-4"
          >

            {/* Left */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                {(user.username || user.name || "U").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">
                  {user.username || user.name || "Unknown"}
                </p>
                <p className="text-sm text-slate-500 font-medium truncate mt-0.5">
                  {user.email || "No email provided"}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <span className={`hidden sm:inline-flex px-3 py-1 text-xs font-bold rounded-full ${index === 0 ? "bg-yellow-100 text-yellow-700" : index === 1 ? "bg-slate-200 text-slate-700" : index === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-50 text-slate-500 border border-slate-100"}`}>
                #{index + 1}
              </span>

              <button
                onClick={() => deleteStudent(user._id)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Remove Student"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <div className="text-center mt-16 p-12 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
          <p className="text-xl font-bold text-slate-800">No students found 🚫</p>
          <p className="text-slate-500 mt-2 font-medium">As students register, they will appear here.</p>
        </div>
      )}
    </div>
  );
}