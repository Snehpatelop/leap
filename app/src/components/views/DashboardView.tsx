import { Sparkles, Target, TrendingUp } from 'lucide-react';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { PointsCard } from '@/components/dashboard/PointsCard';
import { DailyTasks } from '@/components/dashboard/DailyTasks';
import { SkillProgressCard } from '@/components/dashboard/SkillProgressCard';
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar';
import { StudyReminder } from '@/components/dashboard/StudyReminder';
import { Achievements } from '@/components/dashboard/Achievements';
import { Leaderboard } from '@/components/dashboard/Leaderboard';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardView() {
  const { userData } = useData();
  const { user } = useAuth();
  
  const stats = userData?.stats;
  const firstName = user?.name?.split(' ')[0] || 'You';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-indigo-100 text-sm">Welcome back!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Hey {firstName}! 🎯
            </h2>
            <p className="text-indigo-100 max-w-md">
              {stats && stats.streak > 0 
                ? `You're on a ${stats.streak}-day streak! Complete today's tasks to keep it going.`
                : "Start your learning journey today. Every step counts!"}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/20">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats?.daysToExam || 30}</p>
              <p className="text-xs text-indigo-100">Days to Exam</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">{stats?.currentBand?.toFixed(1) || '6.0'}</p>
              <p className="text-xs text-indigo-100">Current Band</p>
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/20 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Target className="w-4 h-4 text-indigo-200" />
              <span className="text-xs text-indigo-100">Target</span>
            </div>
            <p className="text-xl font-bold">{stats?.targetBand || '8.0'}</p>
          </div>
          <div className="text-center border-x border-white/20">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-indigo-200" />
              <span className="text-xs text-indigo-100">Progress</span>
            </div>
            <p className="text-xl font-bold">
              {stats ? Math.round(((stats.currentBand - 5) / (stats.targetBand - 5)) * 100) : 0}%
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span className="text-xs text-indigo-100">Level</span>
            </div>
            <p className="text-xl font-bold">{stats?.level || 1}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakCard />
        <PointsCard />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DailyTasks />
          <SkillProgressCard />
        </div>
        <div className="space-y-6">
          <WeeklyCalendar />
          <StudyReminder />
          <Achievements />
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
