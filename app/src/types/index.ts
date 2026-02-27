// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  lastLogin: string;
}

export interface UserData {
  user: User;
  stats: UserStats;
  tasks: Task[];
  achievements: Achievement[];
  weeklyGoals: WeeklyGoal[];
  skillProgress: SkillProgress[];
  studyPlan: StudyWeek[];
  leaderboard: LeaderboardEntry[];
  studyGroups: StudyGroup[];
  notifications: Notification[];
}

export interface UserStats {
  streak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
  pointsToNextLevel: number;
  totalStudyHours: number;
  tasksCompleted: number;
  mockTestsTaken: number;
  daysToExam: number;
  targetBand: number;
  currentBand: number;
  lastStudyDate: string | null;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  type: 'listening' | 'reading' | 'writing' | 'speaking';
  duration: number;
  completed: boolean;
  points: number;
  completedAt: string | null;
  date: string;
  description?: string;
  category?: string;
  dueDate?: string | null;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Achievement Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progress: number;
  total: number;
  pointsReward: number;
}

// Weekly Goal Types
export interface WeeklyGoal {
  day: string;
  completed: boolean;
  tasks: number;
  date: string;
}

// Skill Progress Types
export interface SkillProgress {
  name: 'Listening' | 'Reading' | 'Writing' | 'Speaking';
  score: number;
  progress: number;
  color: string;
}

// Study Plan Types
export interface StudyWeek {
  week: string;
  focus: string;
  tasks: number;
  completed: number;
  color: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  change: 'up' | 'down' | 'same';
  isUser: boolean;
}

// Study Group Types
export interface StudyGroup {
  id: string;
  name: string;
  members: number;
  active: boolean;
  joined: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: string;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

// Login/Register Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
