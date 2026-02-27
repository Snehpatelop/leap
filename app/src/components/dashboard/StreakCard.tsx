import { useState, useEffect } from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

export function StreakCard() {
  const { userData } = useData();
  const [animate, setAnimate] = useState(false);
  
  const stats = userData?.stats;
  const streak = stats?.streak || 0;
  const longestStreak = stats?.longestStreak || 0;

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [streak]);

  // Generate week days based on actual weekly goals data
  const today = new Date().getDay();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyGoals = userData?.weeklyGoals || [];
  const weekDays = days.map((day, index) => {
    const isToday = index === today;
    const goal = weeklyGoals[index];
    const isCompleted = goal ? goal.completed || goal.tasks > 0 : false;
    return { day, isToday, isCompleted };
  });

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '0.5s' }} />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-200" />
              <p className="text-orange-100 text-sm font-medium">Current Streak</p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold transition-transform ${animate ? 'scale-125' : ''}`}>
                {streak}
              </span>
              <span className="text-orange-100">days</span>
            </div>
            <p className="text-orange-100 text-sm mt-2">
              {streak > 0 ? "You're on fire! Keep it up! 🔥" : "Start your streak today!"}
            </p>
            {longestStreak > streak && (
              <p className="text-orange-200 text-xs mt-1 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Longest: {longestStreak} days
              </p>
            )}
          </div>
          <div className={`w-20 h-20 rounded-full bg-white/20 flex items-center justify-center shadow-lg ${animate ? 'animate-bounce' : ''}`}>
            <Flame className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Week progress */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-orange-100 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              This Week
            </span>
            <span className="text-xs text-orange-100">
              {weekDays.filter(d => d.isCompleted).length}/7 days
            </span>
          </div>
          <div className="flex gap-1.5">
            {weekDays.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                    day.isCompleted 
                      ? 'bg-white text-orange-600 shadow-lg' 
                      : day.isToday 
                        ? 'bg-white/30 text-white border-2 border-white/50'
                        : 'bg-white/10 text-white/50'
                  }`}
                >
                  {day.isCompleted ? (
                    <Flame className="w-4 h-4" />
                  ) : (
                    day.day[0]
                  )}
                </div>
                <span className={`text-[10px] mt-1 ${day.isToday ? 'text-white font-medium' : 'text-orange-200'}`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
