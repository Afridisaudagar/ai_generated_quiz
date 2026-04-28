import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Chart from "./adminComponent/Chart";
import Chats from "./components/Chats";
import Leaderboard from "./adminComponent/Leaderboard";
import Quiz from "./components/Quiz";
import Navbar from "./components/Navbar";
import Courses from "./pages/Courses";
import Wellness from "./components/Wellness";
import SpacedRepetition from "./components/SpacedRepetition";
import GoalLearning from "./components/GoalLearning";
import StreaksProgress from "./components/StreaksProgress";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  const location = useLocation();
  const hideNavbar = ["/", "/login", "/register", "/admin"].includes(location.pathname);

  return (
      <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
        {!hideNavbar && <Navbar />}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Student Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
            <Route path="/chart" element={<ProtectedRoute><Chart /></ProtectedRoute>} />
            <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
            <Route path="/spaced-repetition" element={<ProtectedRoute><SpacedRepetition /></ProtectedRoute>} />
            <Route path="/goal-learning" element={<ProtectedRoute><GoalLearning /></ProtectedRoute>} />
            <Route path="/streaks" element={<ProtectedRoute><StreaksProgress /></ProtectedRoute>} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />
          </Routes>   
        </div>
      </div>
  );
};

export default App;