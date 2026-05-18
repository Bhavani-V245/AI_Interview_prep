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
    axios.get('/api/interview/history')
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

  const readiness = Math.min(100, Math.round(stats.avg_score * 10));

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
                <p className="text-gray-400 leading-relaxed">Based on your {stats.total_sessions} sessions with an average score of <span className="text-white font-bold">{stats.avg_score}/10</span>, you are at <span className="text-white font-bold">{readiness}%</span> readiness. {readiness >= 80 ? 'You are ready for senior-level interviews!' : readiness >= 50 ? 'Keep practicing to improve your consistency.' : 'Focus on building fundamentals through more practice sessions.'}</p>
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
