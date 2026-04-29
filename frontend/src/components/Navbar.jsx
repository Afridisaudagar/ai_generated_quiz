import React, { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: sessionStorage.getItem("username") || "User",
    role: sessionStorage.getItem("role") || "Student"
  });

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (token && userProfile.username === "User") {
      axios.get("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.data && res.data.username) {
            sessionStorage.setItem("username", res.data.username);
            sessionStorage.setItem("role", res.data.role);
            setUserProfile({
              username: res.data.username,
              role: res.data.role
            });
          }
        })
        .catch(err => console.log("Profile fetch error:", err));
    }
  }, [token, userProfile.username]);

  const { username, role } = userProfile;

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("username");
    window.location.href = "/login";
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'All Quizzes', path: '/courses' },
    { name: 'Performance', path: '/chart' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  const aiTools = [
    { name: 'Wellness Hub', path: '/wellness', icon: '❤️' },
    { name: 'Spaced Repetition', path: '/spaced-repetition', icon: '🧠' },
    { name: 'Goal Planning', path: '/goal-learning', icon: '🎯' },
    { name: 'Streaks & Rewards', path: '/streaks', icon: '🔥' },
    { name: 'Doubt Solver', path: '/doubt-solver', icon: '🤖' }
  ];

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-[100] shadow-sm transition-all duration-300 h-16 flex items-center">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center w-full">

          {/* Left: Brand */}
          <div className="flex items-center flex-shrink-0 cursor-pointer group">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
              AI Education
            </span>
          </div>

          {/* Center: Navigation Links Desktop */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-8">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="relative text-[13px] font-bold text-slate-500 hover:text-blue-600 transition-colors duration-300 group"
              >
                {item.name}
                <span className="absolute left-0 bottom-[-4px] w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}

            {/* Dropdown for Learning Tools */}
            <div className="relative" 
                 onMouseEnter={() => setIsToolsOpen(true)}
                 onMouseLeave={() => setIsToolsOpen(false)}>
              <button className="flex items-center gap-1 text-[13px] font-bold text-slate-500 hover:text-blue-600 transition-colors py-2 group">
                AI Learning Lab
                <svg className={`w-4 h-4 transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isToolsOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {aiTools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.path}
                      className="flex items-center gap-3 p-3 text-[13px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                    >
                      <span className="text-lg">{tool.icon}</span>
                      {tool.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: User Avatar & Logout */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-3 group px-3 py-1.5 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer">
              <div className="flex flex-col items-end">
                <span className="text-slate-900 font-bold text-sm leading-tight capitalize">{username}</span>
                <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{role}</span>
              </div>
              <img
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}&size=48`}
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm transition-transform group-hover:scale-105"
              />
            </div>

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-blue-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl md:hidden animate-in slide-in-from-top-2 duration-300 z-[100]">
          <div className="p-4 space-y-1">
            {navLinks.map((item) => (
              <a key={item.name} href={item.path} className="block px-4 py-3 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                {item.name}
              </a>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-100">
                <p className="px-4 text-[10px] font-black uppercase text-slate-400 mb-2">AI Tools</p>
                {aiTools.map((tool) => (
                  <a key={tool.name} href={tool.path} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                    <span>{tool.icon}</span>
                    {tool.name}
                  </a>
                ))}
            </div>
          </div>
          <div className="p-4 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}&size=40`} alt="profile" className="w-10 h-10 rounded-full border border-slate-200" />
              <div>
                <p className="text-sm font-bold text-slate-900 capitalize">{username}</p>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 p-2 bg-white rounded-xl shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;