import React, { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: sessionStorage.getItem("username") || "User",
    role: sessionStorage.getItem("role") || "Student"
  });

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    // If we have a token but no username, fetch it
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

  // generic logout function
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Brand */}
          <div className="flex items-center flex-shrink-0 cursor-pointer group">
            <div className="flex flex-col transition-transform duration-300 group-hover:scale-105">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#22C55E]">
                AI Education
              </span>
            </div>
          </div>

          {/* Center: Navigation Links Desktop */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8 gap-8">
            {[
              { name: 'Dashboard', path: '/dashboard' },
              { name: 'All Quizzes', path: '/courses' },
              { name: 'Performance', path: '/chart' },
              { name: 'Leaderboard', path: '/leaderboard' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="relative text-sm font-bold text-slate-500 hover:text-[#2563EB] transition-colors duration-300 group"
              >
                {item.name}
                <span className="absolute left-0 bottom-[-4px] w-0 h-0.5 bg-[#2563EB] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right: User Avatar & Menu */}
          <div className="hidden md:flex items-center gap-6">
            
            <div className="w-px h-6 bg-slate-200"></div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="flex flex-col items-end text-right">
                <span className="text-[#0F172A] font-bold text-sm leading-tight group-hover:text-[#2563EB] transition-colors capitalize">
                  {username}
                </span>
                <span className="text-slate-400 text-xs font-medium capitalize">
                  {role}
                </span>
              </div>
              <img
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}&size=48`}
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm group-hover:border-[#2563EB] transition-colors"
              />
            </div>

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-500 hover:text-[#2563EB] p-2 focus:outline-none"
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
      <div className={`md:hidden transition-all duration-300 ease-in-out border-t border-slate-100 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <div className="px-4 pt-2 pb-6 space-y-1 bg-white">
          {[
              { name: 'Dashboard', path: '/dashboard' },
              { name: 'All Quizzes', path: '/courses' },
              { name: 'Performance', path: '/chart' },
              { name: 'Leaderboard', path: '/leaderboard' }
          ].map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="block px-3 py-3 text-base font-bold text-slate-600 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors border-l-4 border-transparent hover:border-[#2563EB]"
            >
              {item.name}
            </a>
          ))}
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between px-3">
             <div className="flex items-center gap-3">
               <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${username}&size=48`}
                  alt="profile"
                  className="w-10 h-10 rounded-full border-2 border-slate-100"
                />
               <div>
                 <p className="text-sm font-bold text-[#0F172A] capitalize">{username}</p>
                 <p className="text-xs font-medium text-slate-400 capitalize">{role}</p>
               </div>
             </div>
             <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 p-2 rounded-lg bg-slate-50">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
             </button>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;