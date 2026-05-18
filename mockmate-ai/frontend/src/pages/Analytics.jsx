import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Award, Target, Activity, Loader2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const userEmail = userStr ? JSON.parse(userStr).email : null;
    axios.get(`/api/interview/history?email=${encodeURIComponent(userEmail || '')}`)
      .then(res => setHistoryData(res.data))
      .catch(() => setHistoryData({ sessions: [], stats: { total_sessions: 0, avg_score: 0, total_time_hours: 0, total_questions: 0 } }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 size={32} className="animate-spin text-indigo-500" /></div>;

  const sessions = historyData?.sessions || [];
  const stats = historyData?.stats || {};

  // Build chart data from real sessions
  const lastSessions = sessions.slice(-10);
  const lineData = {
    labels: lastSessions.map((s, i) => s.date?.split(' ')[0] || `Session ${i + 1}`),
    datasets: [{
      label: 'Score',
      data: lastSessions.map(s => s.score || 0),
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.5)',
      tension: 0.4,
    }],
  };

  // Topic distribution
  const topicCounts = {};
  sessions.forEach(s => { topicCounts[s.topic || 'General'] = (topicCounts[s.topic || 'General'] || 0) + 1; });
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const barData = {
    labels: topTopics.map(([t]) => t),
    datasets: [{
      label: 'Sessions',
      data: topTopics.map(([, v]) => v),
      backgroundColor: [
        'rgba(99, 102, 241, 0.6)', 'rgba(139, 92, 246, 0.6)', 'rgba(236, 72, 153, 0.6)',
        'rgba(20, 184, 166, 0.6)', 'rgba(245, 158, 11, 0.6)',
      ],
      borderRadius: 8,
    }],
  };

  // Advanced AI Placement Readiness Score Engine
  const calculateReadiness = () => {
    if (sessions.length === 0) return { score: 0, completed: 0, advice: "Begin taking Technical Interviews, Aptitude Quizzes, Monaco Coding Rounds, and Group Discussions to calculate your job readiness.", domains: { interview: 0, coding: 0, quiz: 0, gd: 0 } };
    
    // 1. Domain Coverage (Max 60 points) - 15 points per unique placement domain practiced
    const domains = {
      interview: sessions.filter(s => s.type === 'interview' || s.type === 'voice').length,
      coding: sessions.filter(s => s.type === 'coding').length,
      quiz: sessions.filter(s => s.type === 'quiz').length,
      gd: sessions.filter(s => s.type === 'group_discussion').length
    };
    
    let domainPoints = 0;
    let completedCount = 0;
    if (domains.interview > 0) { domainPoints += 7.5; completedCount++; }
    if (domains.coding > 0) { domainPoints += 7.5; completedCount++; }
    if (domains.quiz > 0) { domainPoints += 7.5; completedCount++; }
    if (domains.gd > 0) { domainPoints += 7.5; completedCount++; }
    
    // 2. Volume & Consistency (Max 20 points) - 2 points per completed round to prove stability
    const consistencyPoints = Math.min(20, sessions.length * 2);
    
    // 3. Scorecard contribution (Max 50 points) - Based on scorecard average grade (out of 10)
    const avgScore = stats.avg_score || 0;
    const scorePoints = Math.min(50, avgScore * 5); // 50% weight on actual analyzed grades
    
    const finalScore = Math.min(100, Math.round(domainPoints + consistencyPoints + scorePoints));
    
    let advice = "";
    if (completedCount < 2) {
      advice = "You have only practiced in one domain. A true placement profile requires active participation in Technical Interviews, Monaco IDE coding rounds, and Aptitude quizzes.";
    } else if (domains.coding === 0) {
      advice = "Critical Gap: You have not completed any Coding Sandbox sessions. Most campus selection rounds feature an automatic elimination coding round.";
    } else if (domains.gd === 0) {
      advice = "Communication Gap: You haven't practiced AI simulated Group Discussions yet. Prepare with Sarah, Aarav, and David to score higher on presentation skills.";
    } else if (finalScore < 70) {
      advice = "Keep practicing across multiple tracks. Try to raise your average scorecard grade above 8/10 to unlock elite job readiness.";
    } else {
      advice = "Excellent profile! You are consistently covering all placement domains with outstanding scores. You are highly ready for competitive campus hiring!";
    }
    
    return {
      score: finalScore,
      completed: completedCount,
      domains,
      advice
    };
  };

  const readinessData = calculateReadiness();
  const readiness = readinessData.score;

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#6b7280' } },
      x: { grid: { display: false }, ticks: { color: '#6b7280' } }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Performance <span className="text-gradient">Analytics</span></h1>
        <p className="text-gray-400">
          {sessions.length > 0 
            ? `Tracking ${stats.total_sessions} sessions across ${Object.keys(topicCounts).length} topics.`
            : 'Complete interviews and quizzes to see your analytics here.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Sessions', value: stats.total_sessions, icon: <Activity className="text-violet-400" />, sub: 'All time' },
          { label: 'Avg Score', value: `${stats.avg_score}/10`, icon: <Award className="text-amber-400" />, sub: 'Across sessions' },
          { label: 'Practice Time', value: `${stats.total_time_hours}h`, icon: <TrendingUp className="text-emerald-400" />, sub: 'Total hours' },
          { label: 'Questions', value: stats.total_questions, icon: <Target className="text-indigo-400" />, sub: 'Answered' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-white/5">
            <div className="p-3 bg-white/5 w-fit rounded-2xl mb-4 border border-white/10">{stat.icon}</div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-gray-400">{stat.label}</div>
            <div className="text-xs text-gray-600 mt-2">{stat.sub}</div>
          </div>
        ))}
      </div>

      {sessions.length > 0 ? (
        <>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[32px] border border-white/5">
              <h3 className="text-xl font-bold mb-8">Score Progression</h3>
              <Line data={lineData} options={chartOptions} />
            </div>
            <div className="glass p-8 rounded-[32px] border border-white/5">
              <h3 className="text-xl font-bold mb-8">Topic Distribution</h3>
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          <div className="mt-8 glass p-10 rounded-[40px] border border-white/5 bg-gradient-to-r from-indigo-600/5 to-transparent">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">AI Prediction: Job Readiness</h2>
                <div className="text-gray-400 leading-relaxed">
                  <p className="mb-4 text-slate-300">
                    Based on your <span className="text-white font-extrabold">{stats.total_sessions} sessions</span> with an average scorecard grade of <span className="text-white font-extrabold">{stats.avg_score}/10</span>, your multi-domain readiness is <span className="text-purple-400 font-extrabold">{readiness}%</span>.
                  </p>
                  <p className="text-xs font-semibold text-zinc-300 bg-white/5 p-4 rounded-2xl border border-white/5 mb-6">
                    💡 <span className="text-purple-300">AI Assessment:</span> {readinessData.advice}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <span>{readinessData.domains.interview > 0 ? "✅" : "❌"}</span>
                      <span>Technical Interviews ({readinessData.domains.interview} sessions)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <span>{readinessData.domains.coding > 0 ? "✅" : "❌"}</span>
                      <span>Monaco IDE Coding ({readinessData.domains.coding} sessions)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <span>{readinessData.domains.quiz > 0 ? "✅" : "❌"}</span>
                      <span>Analytical Aptitude ({readinessData.domains.quiz} sessions)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <span>{readinessData.domains.gd > 0 ? "✅" : "❌"}</span>
                      <span>Group Discussions ({readinessData.domains.gd} sessions)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-48 h-48">
                <Doughnut 
                  data={{
                    labels: ['Ready', 'To Improve'],
                    datasets: [{ data: [readiness, 100 - readiness], backgroundColor: ['#8b5cf6', 'rgba(255,255,255,0.05)'], borderWidth: 0 }]
                  }} 
                  options={{ cutout: '80%', plugins: { legend: { display: false } } }}
                />
                <div className="relative -top-28 text-center">
                  <div className="text-3xl font-black">{readiness}%</div>
                  <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Ready</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="glass p-16 rounded-[40px] border border-white/5 text-center">
          <Activity size={48} className="mx-auto mb-6 text-zinc-700" />
          <h3 className="text-2xl font-bold mb-3">No Data Yet</h3>
          <p className="text-zinc-500">Complete your first AI interview or coding challenge to start tracking your progress.</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
