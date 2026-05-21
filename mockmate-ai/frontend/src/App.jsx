import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import VoiceInterview from './pages/VoiceInterview';
import CodingRound from './pages/CodingRound';
import CodingPractice from './pages/CodingPractice';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Analytics from './pages/Analytics';
import Quiz from './pages/Quiz';
import TypingTest from './pages/TypingTest';
import GroupDiscussion from './pages/GroupDiscussion';

import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
            <Route path="/voice-interview" element={<ProtectedRoute><VoiceInterview /></ProtectedRoute>} />
            <Route path="/coding" element={<ProtectedRoute><CodingRound /></ProtectedRoute>} />
            <Route path="/coding-practice" element={<ProtectedRoute><CodingPractice /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/typing" element={<ProtectedRoute><TypingTest /></ProtectedRoute>} />
            <Route path="/gd" element={<ProtectedRoute><GroupDiscussion /></ProtectedRoute>} />
          </Routes>
        </Layout>
        <ToastContainer position="bottom-right" theme="dark" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
