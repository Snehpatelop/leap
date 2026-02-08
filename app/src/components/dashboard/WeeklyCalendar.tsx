import { useState } from 'react';
import { Calendar, CheckCircle2, Sparkles, Clock, Trophy, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

export function WeeklyCalendar() {
  const { userData } = useData();
  const [showChallenge, setShowChallenge] = useState(true);

  const weeklyGoals = userData?.weeklyGoals || [];
  const completedDays = weeklyGoals.filter(g => g.completed).length;
  const totalTasks = weeklyGoals.reduce((acc, g) => acc + g.tasks, 0);

  const today = new Date().getDay();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              Weekly Study Plan
            </CardTitle>
            <CardDescription>Your personalized 7-day learning schedule</CardDescription>
          </div>
          <Badge variant="secondary" className="text-indigo-600 bg-indigo-50">
            {completedDays}/7 days
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week view */}
        <div className="flex justify-between items-center gap-1">
          {days.map((dayName, index) => {
            const goal = weeklyGoals[index];
            const isToday = index === today;
            const isCompleted = goal?.completed;
            const hasTasks = goal && goal.tasks > 0;

            return (
              <div key={dayName} className="flex flex-col items-center flex-1">
                <div 
                  className={cn(
                    "w-full aspect-square max-w-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 cursor-pointer",
                    isCompleted 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                      : isToday 
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-200'
                        : hasTasks 
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{dayName[0]}</span>
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  isToday ? 'text-indigo-600' : 
                  isCompleted ? 'text-green-600' : 'text-muted-foreground'
                )}>
                  {dayName}
                </span>
                {hasTasks && (
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {goal.tasks} tasks
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Weekly stats */}
        <div className="mt-5 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Weekly Progress</p>
                <p className="text-xs text-muted-foreground">{totalTasks} tasks completed</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">{Math.round((completedDays / 7) * 100)}%</p>
            </div>
          </div>
        </div>

        {/* Weekend challenge */}
        {showChallenge && (
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-amber-900">Weekend Challenge!</p>
                  <button 
                    onClick={() => setShowChallenge(false)}
                    className="text-amber-400 hover:text-amber-600"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  Complete a full mock test this weekend to earn 2x points and unlock the "Weekend Warrior" badge!
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Trophy className="w-4 h-4 mr-1" />
                    Take Challenge
                  </Button>
                  <span className="text-xs text-amber-600 flex items-center gap-1">
                    <ChevronRight className="w-3 h-3" />
                    500 bonus points
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
