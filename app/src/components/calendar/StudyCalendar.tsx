import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Flame,
  Target,
  BookOpen,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: number;
  type: 'listening' | 'reading' | 'writing' | 'speaking' | 'mock' | 'break';
  completed: boolean;
}

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
  studyHours: number;
  tasksCompleted: number;
}

const eventTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  listening: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  reading: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  writing: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  speaking: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  mock: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  break: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

// Build events from actual task data
const buildEventsFromTasks = (tasks: { id: string; title: string; type: string; duration: number; completed: boolean; date: string; completedAt: string | null }[]): Record<string, CalendarEvent[]> => {
  const events: Record<string, CalendarEvent[]> = {};
  for (const task of tasks) {
    const taskDate = new Date(task.date);
    const dateKey = `${taskDate.getFullYear()}-${taskDate.getMonth()}-${taskDate.getDate()}`;
    if (!events[dateKey]) events[dateKey] = [];
    events[dateKey].push({
      id: task.id,
      title: task.title,
      time: task.completedAt ? new Date(task.completedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—',
      duration: task.duration,
      type: task.type as CalendarEvent['type'],
      completed: task.completed,
    });
  }
  return events;
};

export function StudyCalendar() {
  const today = new Date();
  const { userData, toggleTask } = useData();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  // Build events from actual task data
  const events = useMemo(() => {
    return buildEventsFromTasks(userData?.tasks || []);
  }, [userData?.tasks]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number): CalendarDay[] => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days: CalendarDay[] = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        month: month - 1,
        year,
        isCurrentMonth: false,
        isToday: false,
        events: [],
        studyHours: 0,
        tasksCompleted: 0,
      });
    }
    
    // Current month days
    for (let date = 1; date <= daysInMonth; date++) {
      const dateKey = `${year}-${month}-${date}`;
      const dayEvents = events[dateKey] || [];
      const isToday = date === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      
      days.push({
        date,
        month,
        year,
        isCurrentMonth: true,
        isToday,
        events: dayEvents,
        studyHours: dayEvents.reduce((acc, e) => acc + e.duration, 0) / 60,
        tasksCompleted: dayEvents.filter(e => e.completed).length,
      });
    }
    
    // Next month days to fill the grid
    const remainingCells = 42 - days.length;
    for (let date = 1; date <= remainingCells; date++) {
      days.push({
        date,
        month: month + 1,
        year,
        isCurrentMonth: false,
        isToday: false,
        events: [],
        studyHours: 0,
        tasksCompleted: 0,
      });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentYear, currentMonth);

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const toggleEventComplete = async (eventId: string) => {
    await toggleTask(eventId);
  };

  const selectedDateKey = selectedDate 
    ? `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`
    : '';
  const selectedEvents = events[selectedDateKey] || [];

  // Calculate monthly stats
  const monthlyStats = {
    totalHours: days
      .filter(d => d.isCurrentMonth)
      .reduce((acc, d) => acc + d.studyHours, 0),
    totalTasks: days
      .filter(d => d.isCurrentMonth)
      .reduce((acc, d) => acc + d.events.length, 0),
    completedTasks: days
      .filter(d => d.isCurrentMonth)
      .reduce((acc, d) => acc + d.tasksCompleted, 0),
    studyDays: days
      .filter(d => d.isCurrentMonth && d.events.length > 0)
      .length,
  };

  return (
    <div className="space-y-6">
      {/* Monthly Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{monthlyStats.totalHours.toFixed(1)}h</p>
              <p className="text-xs text-muted-foreground">Study Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{monthlyStats.completedTasks}/{monthlyStats.totalTasks}</p>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{monthlyStats.studyDays}</p>
              <p className="text-xs text-muted-foreground">Study Days</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round((monthlyStats.completedTasks / Math.max(monthlyStats.totalTasks, 1)) * 100)}%</p>
              <p className="text-xs text-muted-foreground">Completion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-xl font-bold">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const hasEvents = day.events.length > 0;
                const allCompleted = hasEvents && day.events.every(e => e.completed);
                
                return (
                  <button
                    key={index}
                    onClick={() => day.isCurrentMonth && setSelectedDate(new Date(day.year, day.month, day.date))}
                    className={cn(
                      "aspect-square p-2 rounded-lg text-left transition-all relative",
                      !day.isCurrentMonth && "text-gray-300",
                      day.isCurrentMonth && "hover:bg-gray-50",
                      day.isToday && "bg-indigo-50 ring-2 ring-indigo-500",
                      selectedDate?.getDate() === day.date && 
                        selectedDate?.getMonth() === day.month && 
                        "bg-indigo-100",
                      hasEvents && !allCompleted && "font-medium",
                      allCompleted && "bg-green-50"
                    )}
                  >
                    <span className={cn(
                      "text-sm",
                      day.isToday && "font-bold text-indigo-600"
                    )}>
                      {day.date}
                    </span>
                    
                    {/* Event indicators */}
                    {hasEvents && (
                      <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 justify-center">
                        {day.events.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              event.completed ? "bg-green-500" : "bg-indigo-400"
                            )}
                          />
                        ))}
                        {day.events.length > 3 && (
                          <span className="text-[8px] text-gray-400">+</span>
                        )}
                      </div>
                    )}
                    
                    {/* Study hours indicator */}
                    {day.studyHours > 0 && (
                      <div className="absolute top-1 right-1">
                        <span className="text-[8px] text-gray-400">{day.studyHours.toFixed(1)}h</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Events */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              {selectedDate ? (
                <>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </>
              ) : (
                'Select a date'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No study sessions scheduled</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="w-4 h-4 mr-1" />
                  Schedule Session
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    {selectedEvents.filter(e => e.completed).length}/{selectedEvents.length} completed
                  </span>
                  <Badge variant="outline">
                    {selectedEvents.reduce((acc, e) => acc + e.duration, 0)} min total
                  </Badge>
                </div>
                
                {selectedEvents.map((event) => {
                  const colors = eventTypeColors[event.type];
                  
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all",
                        colors.bg,
                        colors.border,
                        event.completed && "opacity-60"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-xs font-medium uppercase", colors.text)}>
                            {event.type}
                          </span>
                          <span className="text-xs text-gray-500">{event.time}</span>
                        </div>
                        <button
                          onClick={() => toggleEventComplete(event.id)}
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                            event.completed 
                              ? "bg-green-500 text-white" 
                              : "bg-white border-2 border-gray-300 hover:border-indigo-400"
                          )}
                        >
                          {event.completed && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className={cn("font-medium mt-1", event.completed && "line-through")}>
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">{event.duration} minutes</p>
                    </div>
                  );
                })}
                
                <Button className="w-full mt-4 gradient-primary">
                  <Plus className="w-4 h-4 mr-1" />
                  Add More Sessions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
