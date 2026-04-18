import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUserId = sessionStorage.getItem("userId");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/leaderboard")
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load leaderboard");
        setLoading(false);
      });
  }, []);

  const topThree = data.slice(0, 3);
  const rest = data.slice(3);

  const getName = (entry) => entry?.user?.username || entry?.user?.name || entry?.username || entry?.name || "Unknown";
  const getAvatar = (userStr) => `https://api.dicebear.com/7.x/notionists/svg?seed=${userStr}&size=48`;

  return (
    <div className="max-w-[1000px] mx-auto py-8 px-4 sm:px-6">

      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
          Top Performers
        </h2>
        <p className="text-slate-500 font-medium mt-2">
          Compete, improve, and dominate the leaderboard 🚀
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
           <div className="animate-spin w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-[12px] text-center font-bold">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Top 3 Section */}
          <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end gap-6 mb-12">
            
            {/* Rank 2 - Silver */}
            {topThree[1] && (
              <div className="order-2 sm:order-1 bg-white border-2 border-[#C0C0C0] p-6 rounded-[12px] w-full sm:w-[220px] text-center shadow-[0_4px_20px_rgba(192,192,192,0.3)] relative flex flex-col items-center group hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-6 w-12 h-12 rounded-full bg-[#C0C0C0] text-white flex items-center justify-center text-xl font-bold shadow-md">
                  2
                </div>
                <img src={getAvatar(getName(topThree[1]))} alt="avatar" className="w-16 h-16 rounded-full mt-4 mb-3 bg-slate-100 border-2 border-[#C0C0C0] p-1" />
                <h3 className="font-bold text-lg text-[#0F172A] truncate w-full">
                  {getName(topThree[1])}
                </h3>
                <div className="mt-3 px-5 py-2 bg-[#F8FAFC] text-slate-700 font-bold rounded-full text-md border border-slate-200">
                  {topThree[1]?.score || 0} pts
                </div>
              </div>
            )}

            {/* Rank 1 - Gold */}
            {topThree[0] && (
              <div className="order-1 sm:order-2 bg-gradient-to-b from-[#FFD700]/10 to-white border-2 border-[#FFD700] p-8 rounded-[12px] w-full sm:w-[260px] text-center shadow-[0_8px_30px_rgba(255,215,0,0.4)] relative flex flex-col items-center transform scale-100 sm:scale-105 hover:scale-110 transition-transform duration-300 z-10">
                <div className="absolute -top-8 w-16 h-16 rounded-full bg-[#FFD700] flex items-center justify-center text-3xl shadow-lg border-4 border-white">
                  👑
                </div>
                <img src={getAvatar(getName(topThree[0]))} alt="avatar" className="w-20 h-20 rounded-full mt-4 mb-3 bg-white border-4 border-[#FFD700] p-1 shadow-sm" />
                <h3 className="font-bold text-xl text-[#0F172A] truncate w-full">
                  {getName(topThree[0])}
                </h3>
                <div className="mt-4 px-6 py-2.5 bg-[#FFD700] text-[#0F172A] font-bold rounded-full text-lg shadow-sm">
                  {topThree[0]?.score || 0} pts
                </div>
              </div>
            )}

            {/* Rank 3 - Bronze */}
            {topThree[2] && (
              <div className="order-3 bg-white border-2 border-[#CD7F32] p-6 rounded-[12px] w-full sm:w-[220px] text-center shadow-[0_4px_20px_rgba(205,127,50,0.3)] relative flex flex-col items-center group hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-6 w-12 h-12 rounded-full bg-[#CD7F32] text-white flex items-center justify-center text-xl font-bold shadow-md">
                  3
                </div>
                <img src={getAvatar(getName(topThree[2]))} alt="avatar" className="w-16 h-16 rounded-full mt-4 mb-3 bg-slate-100 border-2 border-[#CD7F32] p-1" />
                <h3 className="font-bold text-lg text-[#0F172A] truncate w-full">
                  {getName(topThree[2])}
                </h3>
                <div className="mt-3 px-5 py-2 bg-[#F8FAFC] text-slate-700 font-bold rounded-full text-md border border-slate-200">
                  {topThree[2]?.score || 0} pts
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full text-sm whitespace-nowrap min-w-[500px]">
                <thead>
                  <tr className="bg-[#F8FAFC] text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider font-bold">
                    <th className="text-left py-4 px-6">Rank</th>
                    <th className="text-left py-4 px-6">Player</th>
                    <th className="text-right py-4 px-6">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rest.map((d, i) => {
                    const rank = i + 4;
                    const isCurrentUser = d?.user?._id && d?.user?._id === currentUserId;
                    return (
                      <tr
                        key={i}
                        className={`hover:bg-slate-50 transition-colors duration-200 group ${isCurrentUser ? "bg-blue-50/50" : "even:bg-slate-50/30"}`}
                      >
                        <td className="py-4 px-6 text-slate-500 font-bold w-20">
                          #{rank}
                        </td>
                        <td className="py-4 px-6 font-bold text-[#0F172A] flex items-center gap-4">
                          <img src={getAvatar(getName(d))} alt="" className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                          <span className={isCurrentUser ? "text-[#2563EB]" : ""}>
                            {getName(d)}
                            {isCurrentUser && " (You)"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-[#2563EB]">
                          {d?.score || 0} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {data.length === 0 && (
              <div className="text-center py-16 px-6">
                <div className="text-5xl mb-4">🏆</div>
                <p className="text-xl font-bold text-[#0F172A]">
                  No rankings yet
                </p>
                <p className="text-slate-500 mt-2 font-medium">
                  Be the first to perform and claim the top spot!
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}