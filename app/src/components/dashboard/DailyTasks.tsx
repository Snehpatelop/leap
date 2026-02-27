import { useState } from 'react';
import { 
  Target, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  Clock, 
  Play, 
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Trophy,
  Plus,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskPlayer } from '@/components/tasks/TaskPlayer';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

const taskTypeConfig = {
  listening: { icon: Headphones, color: 'bg-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', label: 'Listening' },
  reading: { icon: BookOpen, color: 'bg-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200', label: 'Reading' },
  writing: { icon: PenTool, color: 'bg-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', label: 'Writing' },
  speaking: { icon: Mic, color: 'bg-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', label: 'Speaking' },
};

const EMPTY_FORM = {
  title: '',
  type: 'listening' as Task['type'],
  duration: 15,
  points: 10,
  difficulty: 'medium' as NonNullable<Task['difficulty']>,
  category: '',
  dueDate: '',
};

export function DailyTasks() {
  const { userData, toggleTask, generateNewTasks, createTask, deleteTask } = useData();
  const [animatingTask, setAnimatingTask] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isCreating, setIsCreating] = useState(false);

  const tasks = userData?.tasks || [];
  const completedCount = tasks.filter(t => t.completed).length;
  const totalPoints = tasks.filter(t => t.completed).reduce((acc, t) => acc + t.points, 0);
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const allCompleted = completedCount === tasks.length && tasks.length > 0;

  const handleToggleTask = async (taskId: string) => {
    setAnimatingTask(taskId);
    const result = await toggleTask(taskId);
    
    if (result.success && result.pointsEarned) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    
    setTimeout(() => setAnimatingTask(null), 300);
  };

  const handleGenerateNewTasks = async () => {
    await generateNewTasks();
  };

  const handleDeleteTask = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    await deleteTask(taskId);
  };

  const handleCreateTask = async () => {
    if (!form.title.trim()) return;
    setIsCreating(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await createTask({
        title: form.title.trim(),
        type: form.type,
        duration: form.duration,
        points: form.points,
        difficulty: form.difficulty,
        category: form.category || undefined,
        dueDate: form.dueDate || null,
        date: today,
      });
      setForm(EMPTY_FORM);
      setShowCreateDialog(false);
    } finally {
      setIsCreating(false);
    }
  };

  const activeTaskData = tasks.find(t => t.id === activeTask);

  return (
    <>
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-indigo-600" />
                </div>
                Today's Micro-Learning
              </CardTitle>
              <CardDescription>Complete tasks to earn points and maintain streak</CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-indigo-600">{completedCount}/{tasks.length}</p>
                {allCompleted && (
                  <Trophy className="w-6 h-6 text-amber-500 animate-bounce" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{totalPoints} pts earned</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Daily Progress</span>
              <span className="font-medium text-indigo-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          {/* Celebration overlay */}
          {showCelebration && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-xl animate-bounce">
                <span className="flex items-center gap-2 font-bold">
                  <Sparkles className="w-5 h-5" />
                  +Points Earned!
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No tasks for today</p>
                <Button onClick={handleGenerateNewTasks}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Generate Tasks
                </Button>
              </div>
            ) : (
              tasks.map((task) => {
                const config = taskTypeConfig[task.type];
                const Icon = config.icon;
                const isAnimating = animatingTask === task.id;

                return (
                  <div
                    key={task.id}
                    className={cn(
                      "group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                      task.completed 
                        ? `${config.bgColor} border-2 ${config.borderColor}` 
                        : 'bg-gray-50 hover:bg-white border-2 border-transparent hover:border-indigo-200 hover:shadow-md'
                    )}
                  >
                    {/* Task icon */}
                    <div 
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer",
                        task.completed 
                          ? `${config.color} text-white shadow-lg` 
                          : 'bg-white text-gray-400 group-hover:text-indigo-500 shadow-sm hover:shadow-md'
                      )}
                      onClick={() => !task.completed && setActiveTask(task.id)}
                    >
                      {task.completed ? (
                        <CheckCircle2 className={cn("w-6 h-6", isAnimating && "animate-bounce")} />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    {/* Task info */}
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => !task.completed && setActiveTask(task.id)}
                    >
                      <p className={cn(
                        "font-medium transition-all",
                        task.completed ? 'text-gray-700 line-through' : 'text-gray-900'
                      )}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-xs text-muted-foreground flex items-center gap-1 bg-white/50 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          {task.duration} min
                        </span>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-xs",
                            task.completed ? 'bg-white/70 text-gray-600' : 'bg-indigo-100 text-indigo-700'
                          )}
                        >
                          +{task.points} pts
                        </Badge>
                        <span className={cn(
                          "text-[10px] uppercase font-medium px-2 py-0.5 rounded-full",
                          task.type === 'listening' && 'bg-blue-100 text-blue-700',
                          task.type === 'reading' && 'bg-green-100 text-green-700',
                          task.type === 'writing' && 'bg-purple-100 text-purple-700',
                          task.type === 'speaking' && 'bg-orange-100 text-orange-700',
                        )}>
                          {config.label}
                        </span>
                        {task.difficulty && (
                          <span className={cn(
                            "text-[10px] uppercase font-medium px-2 py-0.5 rounded-full",
                            task.difficulty === 'easy' && 'bg-green-100 text-green-700',
                            task.difficulty === 'medium' && 'bg-amber-100 text-amber-700',
                            task.difficulty === 'hard' && 'bg-red-100 text-red-700',
                          )}>
                            {task.difficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {/* Delete button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleDeleteTask(e, task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {!task.completed ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => setActiveTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleTask(task.id);
                            }}
                            className="w-7 h-7 rounded-full border-2 border-gray-300 hover:border-indigo-400 flex items-center justify-center cursor-pointer transition-colors bg-white"
                          >
                            <CheckCircle2 className="w-4 h-4 text-gray-300 hover:text-indigo-500" />
                          </div>
                        </>
                      ) : (
                        <div className={`w-7 h-7 rounded-full ${config.color} flex items-center justify-center`}>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-5 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(true)}
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
            <Button 
              className="flex-1 gradient-primary text-white hover:opacity-90 shadow-lg shadow-indigo-200"
              disabled={allCompleted}
              onClick={() => {
                const nextTask = tasks.find(t => !t.completed);
                if (nextTask) setActiveTask(nextTask.id);
              }}
            >
              <Play className="w-4 h-4 mr-2" />
              {allCompleted ? 'All Tasks Complete!' : 'Start Next Task'}
            </Button>
            
            {allCompleted && (
              <Button 
                variant="outline" 
                onClick={handleGenerateNewTasks}
                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Tasks
              </Button>
            )}
          </div>

          {/* Motivational message */}
          {allCompleted && (
            <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-900">Amazing work today!</p>
                  <p className="text-sm text-amber-700">
                    You've completed all tasks and earned {totalPoints} points!
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Player Modal */}
      {activeTaskData && (
        <TaskPlayer
          task={activeTaskData}
          isOpen={!!activeTask}
          onClose={() => setActiveTask(null)}
          onComplete={() => handleToggleTask(activeTaskData.id)}
        />
      )}

      {/* Create Task Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Create New Task
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="task-title">Title *</Label>
              <Input
                id="task-title"
                placeholder="e.g. Reading comprehension practice"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Task['type'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="listening">Listening</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select
                  value={form.difficulty}
                  onValueChange={(v) => setForm({ ...form, difficulty: v as NonNullable<Task['difficulty']> })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="task-duration">Duration (min)</Label>
                <Input
                  id="task-duration"
                  type="number"
                  min={1}
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="task-points">Points</Label>
                <Input
                  id="task-points"
                  type="number"
                  min={1}
                  value={form.points}
                  onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-category">Category (optional)</Label>
              <Input
                id="task-category"
                placeholder="e.g. Vocabulary, Grammar"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due Date (optional)</Label>
              <Input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={!form.title.trim() || isCreating}
              className="gradient-primary text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
