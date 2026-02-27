import { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Target, 
  Calendar, 
  Award,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';

// Mock historical data
const weeklyData = [
  { week: 'Week 1', studyHours: 12, tasksCompleted: 15, mockTests: 1 },
  { week: 'Week 2', studyHours: 18, tasksCompleted: 22, mockTests: 2 },
  { week: 'Week 3', studyHours: 15, tasksCompleted: 18, mockTests: 1 },
  { week: 'Current', studyHours: 3, tasksCompleted: 5, mockTests: 0 },
];

const skillHistory = [
  { month: 'Jan', listening: 5.5, reading: 5.5, writing: 5.0, speaking: 5.5 },
  { month: 'Feb', listening: 6.0, reading: 6.0, writing: 5.5, speaking: 6.0 },
  { month: 'Mar', listening: 6.5, reading: 6.5, writing: 6.0, speaking: 6.5 },
  { month: 'Apr', listening: 7.0, reading: 6.5, writing: 6.0, speaking: 6.5 },
  { month: 'May', listening: 7.5, reading: 7.0, writing: 6.5, speaking: 7.0 },
];

export function ProgressView() {
  const { userData } = useData();
  const [timeRange, setTimeRange] = useState('month');

  const stats = userData?.stats;
  const skills = userData?.skillProgress || [];

  const mainStats = [
    { 
      label: 'Study Hours', 
      value: stats?.totalStudyHours?.toFixed(1) || '0', 
      change: '+12%', 
      trend: 'up',
      icon: Clock,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    { 
      label: 'Tasks Completed', 
      value: stats?.tasksCompleted?.toString() || '0', 
      change: '+28%', 
      trend: 'up',
      icon: CheckCircle2,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    { 
      label: 'Mock Tests', 
      value: stats?.mockTestsTaken?.toString() || '0', 
      change: '+3', 
      trend: 'up',
      icon: Target,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    { 
      label: 'Current Streak', 
      value: stats?.streak?.toString() || '0', 
      change: stats && stats.streak > stats.longestStreak ? 'New Record!' : 'Keep going!', 
      trend: 'same',
      icon: Calendar,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            Your Progress
          </h2>
          <p className="text-gray-500 mt-1">
            Track your IELTS journey and see how far you've come
          </p>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge 
                  variant={stat.trend === 'up' ? 'default' : 'secondary'}
                  className={stat.trend === 'up' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                >
                  {stat.trend === 'up' && <ArrowUp className="w-3 h-3 mr-1" />}
                  {stat.trend === 'down' && <ArrowDown className="w-3 h-3 mr-1" />}
                  {stat.trend === 'same' && <Minus className="w-3 h-3 mr-1" />}
                  {stat.change}
                </Badge>
                <span className="text-xs text-muted-foreground">vs last {timeRange}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skill Progress Over Time */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Skill Progress Over Time
          </CardTitle>
          <CardDescription>Your band score improvement across all sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {skills.map((skill) => {
              const history = skillHistory.map(h => ({ 
                month: h.month, 
                score: h[skill.name.toLowerCase() as keyof typeof h] as number 
              }));
              
              return (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${skill.color}`} />
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Started: 5.5</span>
                      <ArrowUp className="w-4 h-4 text-green-500" />
                      <span className="font-bold">{skill.score}</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {history.map((h) => (
                      <div key={h.month} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className={`w-full ${skill.color} rounded-t-sm transition-all hover:opacity-80`}
                          style={{ height: `${(h.score / 9) * 100}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground">{h.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((week) => (
                <div key={week.week} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium">{week.week}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-muted-foreground">Study</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${(week.studyHours / 20) * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-xs text-right">{week.studyHours}h</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 text-xs text-muted-foreground">Tasks</div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(week.tasksCompleted / 25) * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-xs text-right">{week.tasksCompleted}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'First Study Session', date: 'Jan 15, 2024', completed: true },
                { title: '7-Day Streak', date: 'Jan 22, 2024', completed: true },
                { title: 'Completed 50 Tasks', date: 'Feb 10, 2024', completed: true },
                { title: 'Reached Band 7.0', date: 'Mar 5, 2024', completed: true },
                { title: '30-Day Streak', date: 'In Progress', completed: false, progress: 12, total: 30 },
                { title: 'Target Band 8.0', date: 'Goal', completed: false, progress: 7, total: 8 },
              ].map((milestone, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {milestone.completed ? <CheckCircle2 className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${milestone.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {milestone.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{milestone.date}</p>
                  </div>
                  {!milestone.completed && 'progress' in milestone && milestone.progress !== undefined && milestone.total !== undefined && (
                    <div className="w-20">
                      <div className="text-xs text-right mb-1">{milestone.progress}/{milestone.total}</div>
                      <Progress value={(milestone.progress / milestone.total) * 100} className="h-1.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
