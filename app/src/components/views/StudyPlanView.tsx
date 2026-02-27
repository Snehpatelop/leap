import { useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Play, Lock, Sparkles, Target, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudyCalendar } from '@/components/calendar/StudyCalendar';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const dailySchedule = [
  { time: '7:00 AM', activity: 'Morning Vocabulary', duration: '15 min', type: 'writing' },
  { time: '9:00 AM', activity: 'Listening Practice', duration: '30 min', type: 'listening' },
  { time: '2:00 PM', activity: 'Reading Passage', duration: '25 min', type: 'reading' },
  { time: '7:00 PM', activity: 'Speaking Exercise', duration: '20 min', type: 'speaking' },
];

export function StudyPlanView() {
  const { userData } = useData();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);

  const studyPlan = userData?.studyPlan || [];
  const stats = userData?.stats;

  const isWeekLocked = (weekIndex: number) => {
    if (weekIndex === 0) return false;
    const prevWeek = studyPlan[weekIndex - 1];
    return prevWeek ? prevWeek.completed < prevWeek.tasks * 0.7 : true;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Your Study Plan
          </h2>
          <p className="text-gray-500 mt-1">
            Personalized 4-week roadmap to reach band {stats?.targetBand || '8.0'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-indigo-100 text-indigo-700 px-3 py-1">
            <Target className="w-4 h-4 mr-1" />
            {stats?.daysToExam || 30} days left
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress', value: `${Math.round(studyPlan.reduce((acc, w) => acc + w.completed, 0) / studyPlan.reduce((acc, w) => acc + w.tasks, 0) * 100) || 0}%`, icon: TrendingUp, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
          { label: 'Weeks Completed', value: `${studyPlan.filter(w => w.completed >= w.tasks).length}/4`, icon: CheckCircle2, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
          { label: 'Tasks Done', value: `${studyPlan.reduce((acc, w) => acc + w.completed, 0)}`, icon: Target, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
          { label: 'Study Hours', value: `${stats?.totalStudyHours?.toFixed(1) || '0'}h`, icon: Clock, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="roadmap">
            <Target className="w-4 h-4 mr-2" />
            4-Week Roadmap
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <StudyCalendar />
        </TabsContent>

        <TabsContent value="roadmap">
          <Tabs value={selectedWeek.toString()} onValueChange={(v) => setSelectedWeek(parseInt(v))}>
            <TabsList className="grid grid-cols-4 w-full">
              {studyPlan.map((week, index) => (
                <TabsTrigger 
                  key={week.week} 
                  value={index.toString()}
                  className="relative"
                >
                  {week.week}
                  {week.completed >= week.tasks && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {studyPlan.map((week, weekIndex) => (
              <TabsContent key={week.week} value={weekIndex.toString()} className="mt-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          {week.week}: {week.focus}
                          {isWeekLocked(weekIndex) && <Lock className="w-5 h-5 text-gray-400" />}
                        </CardTitle>
                        <CardDescription>
                          {week.completed}/{week.tasks} tasks completed
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-indigo-600">
                          {Math.round((week.completed / week.tasks) * 100)}%
                        </p>
                      </div>
                    </div>
                    <Progress value={(week.completed / week.tasks) * 100} className="h-2 mt-4" />
                  </CardHeader>
                  <CardContent>
                    {isWeekLocked(weekIndex) ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <Lock className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">Complete 70% of previous week to unlock</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Finish {Math.ceil(studyPlan[weekIndex - 1]?.tasks * 0.7 - (studyPlan[weekIndex - 1]?.completed || 0))} more tasks
                        </p>
                      </div>
                    ) : (
                      <Tabs value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(parseInt(v))}>
                        <TabsList className="grid grid-cols-7 w-full mb-6">
                          {weekDays.map((day, index) => (
                            <TabsTrigger key={day} value={index.toString()} className="text-xs">
                              {day.slice(0, 3)}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {weekDays.map((day, dayIndex) => (
                          <TabsContent key={day} value={dayIndex.toString()}>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{day}'s Schedule</h3>
                                <Badge variant="outline">
                                  <Clock className="w-3 h-3 mr-1" />
                                  90 min total
                                </Badge>
                              </div>

                              <div className="space-y-3">
                                {dailySchedule.map((item, index) => (
                                  <div 
                                    key={index}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer group"
                                  >
                                    <div className="w-16 text-sm font-medium text-gray-500">
                                      {item.time}
                                    </div>
                                    <div className={cn(
                                      "w-10 h-10 rounded-lg flex items-center justify-center",
                                      item.type === 'listening' && 'bg-blue-100 text-blue-600',
                                      item.type === 'reading' && 'bg-green-100 text-green-600',
                                      item.type === 'writing' && 'bg-purple-100 text-purple-600',
                                      item.type === 'speaking' && 'bg-orange-100 text-orange-600',
                                    )}>
                                      <Play className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">{item.activity}</p>
                                      <p className="text-xs text-muted-foreground">{item.duration}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100">
                                      Start
                                    </Button>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <Sparkles className="w-5 h-5 text-indigo-600" />
                                  <span className="font-medium text-indigo-900">Daily Goal</span>
                                </div>
                                <p className="text-sm text-indigo-700">
                                  Complete at least 3 tasks today to maintain your streak and earn bonus points!
                                </p>
                              </div>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
