import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController
);

export default function Chart({ scores = [] }) {

  const totalQuizzes = scores.length;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const estimatedTime = `${totalQuizzes * 10}m`;
  
  const courseCompletion = Math.min(Math.round((totalQuizzes / 10) * 100), 100);
  const skillLevel = Math.min(Math.round((averageScore / 10) * 100), 100);

  const chartData = {
    labels: scores.map((_, i) => `Quiz ${i + 1}`),
    datasets: [
      {
        type: 'bar',
        label: "Score",
        data: scores,
        backgroundColor: "#2563EB",
        borderRadius: 8,
        barThickness: 32,
        hoverBackgroundColor: "#1D4ED8"
      },
      {
        type: 'line',
        label: "Trend",
        data: scores,
        borderColor: '#22C55E',
        backgroundColor: '#22C55E',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#22C55E',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0F172A',
        padding: 12,
        titleFont: { size: 14, family: "'Inter', sans-serif" },
        bodyFont: { size: 14, family: "'Inter', sans-serif" },
        displayColors: true,
        cornerRadius: 8,
        boxPadding: 4,
        usePointStyle: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#F1F5F9',
          drawBorder: false,
        },
        border: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif" },
          color: '#64748B'
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        border: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif" },
          color: '#64748B'
        }
      }
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-8 font-sans text-[#0F172A]">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
        <p className="text-slate-500 mt-2 font-medium">Detailed overview of your learning progress and statistics.</p>
      </div>

      {/* Top Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Quizzes</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#0F172A]">{totalQuizzes}</span>
            <span className="text-sm text-slate-500 font-medium mb-1 border px-2 py-0.5 rounded-md bg-slate-50">Attempted</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(34,197,94,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Average Score</h3>
            <div className="w-10 h-10 rounded-full bg-green-50 text-[#22C55E] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#0F172A]">{averageScore}</span>
            <span className="text-sm text-slate-500 font-medium mb-1">pts/quiz</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(234,179,8,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Highest Score</h3>
            <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#0F172A]">{highestScore}</span>
            <span className="text-sm font-bold text-yellow-600 mb-1 border border-yellow-200 px-2 py-0.5 rounded-md bg-yellow-50">Best</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(168,85,247,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Time Spent</h3>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-[#0F172A]">{estimatedTime}</span>
            <span className="text-sm text-slate-500 font-medium mb-1">Learning</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Charts Section */}
        <div className="xl:col-span-2 bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A]">Performance Over Time</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Score distribution and progress trend</p>
            </div>
            {/* Legend/Key */}
            <div className="hidden sm:flex items-center gap-4 text-sm font-bold text-slate-500">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-[#2563EB]"></div>
                  Score
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-[#22C55E]"></div>
                  Trend
               </div>
            </div>
          </div>
          
          <div className="w-full h-full min-h-[350px] relative">
            {scores.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                <p className="font-bold text-slate-400">No data available to display chart</p>
              </div>
            )}
          </div>
        </div>

        {/* Progress & Additional Insights Section */}
        <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-shadow duration-300 flex flex-col gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">Track Progress</h3>
            <p className="text-sm text-slate-500 font-medium">Keep hitting your milestones to complete goals.</p>
          </div>

          {/* Progress 1 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700">Course Completion</span>
              <span className="text-sm font-bold text-[#2563EB]">{courseCompletion}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 mb-1 overflow-hidden shadow-inner">
              <div 
                className="bg-[#2563EB] h-3.5 rounded-full transition-all duration-1000 ease-out relative" 
                style={{ width: `${courseCompletion}%` }}
              >
                <div className="absolute inset-0 bg-white/20"></div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium text-right mt-1">{totalQuizzes}/10 Modules</p>
          </div>

          {/* Progress 2 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700">Overall Skill Level</span>
              <span className="text-sm font-bold text-[#22C55E]">{skillLevel}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 mb-1 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-[#22C55E] to-emerald-400 h-3.5 rounded-full transition-all duration-1000 ease-out relative" 
                style={{ width: `${skillLevel}%` }}
              >
                 <div className="absolute inset-0 bg-white/20"></div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium text-right mt-1">Based on avg. score</p>
          </div>

          {/* Extra generic insight or motivation */}
          <div className="mt-auto bg-blue-50/50 p-5 rounded-xl border border-blue-100 flex items-start gap-4">
            <div className="mt-1 w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/30">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1E3A8A]">Keep it up!</h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">
                You are on a great learning path. Consistent practice leads to mastery.
              </p>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}