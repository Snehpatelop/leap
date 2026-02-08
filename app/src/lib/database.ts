import { v4 as uuidv4 } from 'uuid';
import type { UserData, User, Task, Achievement, WeeklyGoal, Notification } from '@/types';

const DB_KEY = 'leapscholar_db';
const CURRENT_USER_KEY = 'leapscholar_current_user';

// Default data for new users
const getDefaultUserData = (user: User): UserData => ({
  user,
  stats: {
    streak: 0,
    longestStreak: 0,
    totalPoints: 0,
    level: 1,
    pointsToNextLevel: 1000,
    totalStudyHours: 0,
    tasksCompleted: 0,
    mockTestsTaken: 0,
    daysToExam: 30,
    targetBand: 8.0,
    currentBand: 6.0,
    lastStudyDate: null,
  },
  tasks: generateDefaultTasks(),
  achievements: generateDefaultAchievements(),
  weeklyGoals: generateDefaultWeeklyGoals(),
  skillProgress: [
    { name: 'Listening', score: 6.0, progress: 60, color: 'bg-blue-500' },
    { name: 'Reading', score: 6.0, progress: 60, color: 'bg-green-500' },
    { name: 'Writing', score: 5.5, progress: 55, color: 'bg-purple-500' },
    { name: 'Speaking', score: 6.0, progress: 60, color: 'bg-orange-500' },
  ],
  studyPlan: [
    { week: 'Week 1', focus: 'Foundation Building', tasks: 28, completed: 0, color: 'bg-green-500' },
    { week: 'Week 2', focus: 'Skill Enhancement', tasks: 32, completed: 0, color: 'bg-blue-500' },
    { week: 'Week 3', focus: 'Mock Test Practice', tasks: 24, completed: 0, color: 'bg-purple-500' },
    { week: 'Week 4', focus: 'Final Revision', tasks: 20, completed: 0, color: 'bg-orange-500' },
  ],
  leaderboard: [
    { rank: 1, name: 'Sarah M.', points: 2840, avatar: 'SM', change: 'up', isUser: false },
    { rank: 2, name: 'Alex K.', points: 2320, avatar: 'AK', change: 'down', isUser: false },
    { rank: 3, name: 'Priya R.', points: 2180, avatar: 'PR', change: 'up', isUser: false },
    { rank: 4, name: 'James L.', points: 2050, avatar: 'JL', change: 'same', isUser: false },
    { rank: 5, name: 'Emma W.', points: 1890, avatar: 'EW', change: 'up', isUser: false },
  ],
  studyGroups: [
    { id: '1', name: 'IELTS 8.0 Achievers', members: 234, active: true, joined: false },
    { id: '2', name: 'Speaking Practice Circle', members: 156, active: false, joined: false },
    { id: '3', name: 'Writing Feedback Group', members: 89, active: true, joined: false },
    { id: '4', name: 'Daily Vocabulary Challenge', members: 412, active: true, joined: false },
  ],
  notifications: [],
});

export function generateDefaultTasks(): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: uuidv4(),
      title: 'Listening Practice: Academic Lecture',
      type: 'listening',
      duration: 15,
      completed: false,
      points: 20,
      completedAt: null,
      date: today,
    },
    {
      id: uuidv4(),
      title: 'Reading Passage: Science Article',
      type: 'reading',
      duration: 20,
      completed: false,
      points: 25,
      completedAt: null,
      date: today,
    },
    {
      id: uuidv4(),
      title: 'Vocabulary Builder: 10 New Words',
      type: 'writing',
      duration: 10,
      completed: false,
      points: 15,
      completedAt: null,
      date: today,
    },
    {
      id: uuidv4(),
      title: 'Speaking Exercise: Describe a Photo',
      type: 'speaking',
      duration: 12,
      completed: false,
      points: 20,
      completedAt: null,
      date: today,
    },
  ];
}

export function generateDefaultAchievements(): Achievement[] {
  return [
    {
      id: '1',
      title: 'Week Warrior',
      description: 'Study 7 days in a row',
      icon: 'flame',
      unlocked: false,
      unlockedAt: null,
      progress: 0,
      total: 7,
      pointsReward: 100,
    },
    {
      id: '2',
      title: 'Task Master',
      description: 'Complete 50 tasks',
      icon: 'check',
      unlocked: false,
      unlockedAt: null,
      progress: 0,
      total: 50,
      pointsReward: 200,
    },
    {
      id: '3',
      title: 'Perfect Score',
      description: 'Get 8.0+ in mock test',
      icon: 'trophy',
      unlocked: false,
      unlockedAt: null,
      progress: 6,
      total: 8,
      pointsReward: 500,
    },
    {
      id: '4',
      title: 'Early Bird',
      description: 'Study before 8 AM',
      icon: 'zap',
      unlocked: false,
      unlockedAt: null,
      progress: 0,
      total: 5,
      pointsReward: 50,
    },
    {
      id: '5',
      title: 'First Steps',
      description: 'Complete your first task',
      icon: 'star',
      unlocked: false,
      unlockedAt: null,
      progress: 0,
      total: 1,
      pointsReward: 10,
    },
  ];
}

export function generateDefaultWeeklyGoals(): WeeklyGoal[] {
  const today = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + index);
    return {
      day,
      completed: false,
      tasks: 0,
      date: date.toISOString().split('T')[0],
    };
  });
}

// Database class
class Database {
  private data: Record<string, UserData> = {};

  constructor() {
    this.load();
  }

  private load() {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load database:', error);
      this.data = {};
    }
  }

  private save() {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save database:', error);
    }
  }

  // User management
  createUser(name: string, email: string, password: string): User {
    const user: User = {
      id: uuidv4(),
      name,
      email,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Store password (in real app, this should be hashed)
    const userData = getDefaultUserData(user);
    this.data[user.id] = userData;
    this.save();

    // Store password separately (simplified for demo)
    localStorage.setItem(`password_${user.id}`, password);

    return user;
  }

  validateUser(email: string, password: string): User | null {
    for (const userId in this.data) {
      const userData = this.data[userId];
      if (userData.user.email === email) {
        const storedPassword = localStorage.getItem(`password_${userId}`);
        if (storedPassword === password) {
          userData.user.lastLogin = new Date().toISOString();
          this.save();
          return userData.user;
        }
      }
    }
    return null;
  }

  userExists(email: string): boolean {
    for (const userId in this.data) {
      if (this.data[userId].user.email === email) {
        return true;
      }
    }
    return false;
  }

  // User data management
  getUserData(userId: string): UserData | null {
    return this.data[userId] || null;
  }

  updateUserData(userId: string, updates: Partial<UserData>) {
    if (this.data[userId]) {
      this.data[userId] = { ...this.data[userId], ...updates };
      this.save();
    }
  }

  // Stats management
  updateStats(userId: string, updates: Partial<UserData['stats']>) {
    if (this.data[userId]) {
      this.data[userId].stats = { ...this.data[userId].stats, ...updates };
      this.save();
    }
  }

  // Task management
  toggleTask(userId: string, taskId: string): boolean {
    const userData = this.data[userId];
    if (!userData) return false;

    const task = userData.tasks.find(t => t.id === taskId);
    if (!task) return false;

    const wasCompleted = task.completed;
    task.completed = !wasCompleted;
    task.completedAt = task.completed ? new Date().toISOString() : null;

    // Update stats
    if (task.completed && !wasCompleted) {
      userData.stats.totalPoints += task.points;
      userData.stats.tasksCompleted += 1;
      userData.stats.totalStudyHours += task.duration / 60;

      // Check level up
      const newLevel = Math.floor(userData.stats.totalPoints / 1000) + 1;
      if (newLevel > userData.stats.level) {
        userData.stats.level = newLevel;
      }
      userData.stats.pointsToNextLevel = newLevel * 1000;

      // Update streak
      const today = new Date().toISOString().split('T')[0];
      const lastStudy = userData.stats.lastStudyDate;
      
      if (lastStudy === today) {
        // Already studied today
      } else if (lastStudy) {
        const lastDate = new Date(lastStudy);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          userData.stats.streak += 1;
          if (userData.stats.streak > userData.stats.longestStreak) {
            userData.stats.longestStreak = userData.stats.streak;
          }
        } else if (diffDays > 1) {
          userData.stats.streak = 1;
        }
      } else {
        userData.stats.streak = 1;
      }
      
      userData.stats.lastStudyDate = today;

      // Update weekly goals
      const todayGoal = userData.weeklyGoals.find(g => g.date === today);
      if (todayGoal) {
        todayGoal.tasks += 1;
        todayGoal.completed = todayGoal.tasks >= 3;
      }

      // Check achievements
      this.checkAchievements(userId);
    }

    this.save();
    return task.completed;
  }

  // Achievement management
  private checkAchievements(userId: string) {
    const userData = this.data[userId];
    if (!userData) return;

    // Week Warrior
    const weekWarrior = userData.achievements.find(a => a.id === '1');
    if (weekWarrior && !weekWarrior.unlocked) {
      weekWarrior.progress = userData.stats.streak;
      if (weekWarrior.progress >= weekWarrior.total) {
        weekWarrior.unlocked = true;
        weekWarrior.unlockedAt = new Date().toISOString();
        userData.stats.totalPoints += weekWarrior.pointsReward;
        this.addNotification(userId, 'Achievement Unlocked!', `You've earned "${weekWarrior.title}"!`, 'success');
      }
    }

    // Task Master
    const taskMaster = userData.achievements.find(a => a.id === '2');
    if (taskMaster && !taskMaster.unlocked) {
      taskMaster.progress = userData.stats.tasksCompleted;
      if (taskMaster.progress >= taskMaster.total) {
        taskMaster.unlocked = true;
        taskMaster.unlockedAt = new Date().toISOString();
        userData.stats.totalPoints += taskMaster.pointsReward;
        this.addNotification(userId, 'Achievement Unlocked!', `You've earned "${taskMaster.title}"!`, 'success');
      }
    }

    // First Steps
    const firstSteps = userData.achievements.find(a => a.id === '5');
    if (firstSteps && !firstSteps.unlocked && userData.stats.tasksCompleted >= 1) {
      firstSteps.unlocked = true;
      firstSteps.unlockedAt = new Date().toISOString();
      firstSteps.progress = 1;
      userData.stats.totalPoints += firstSteps.pointsReward;
      this.addNotification(userId, 'Achievement Unlocked!', `You've earned "${firstSteps.title}"!`, 'success');
    }
  }

  // Notification management
  addNotification(userId: string, title: string, message: string, type: Notification['type'] = 'info') {
    const userData = this.data[userId];
    if (!userData) return;

    const notification: Notification = {
      id: uuidv4(),
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };

    userData.notifications.unshift(notification);
    if (userData.notifications.length > 20) {
      userData.notifications = userData.notifications.slice(0, 20);
    }
    this.save();
  }

  markNotificationRead(userId: string, notificationId: string) {
    const userData = this.data[userId];
    if (!userData) return;

    const notification = userData.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.save();
    }
  }

  // Study group management
  joinStudyGroup(userId: string, groupId: string): boolean {
    const userData = this.data[userId];
    if (!userData) return false;

    const group = userData.studyGroups.find(g => g.id === groupId);
    if (group && !group.joined) {
      group.joined = true;
      group.members += 1;
      this.save();
      return true;
    }
    return false;
  }

  // Reset user data
  resetUserData(userId: string) {
    const userData = this.data[userId];
    if (!userData) return;

    const user = userData.user;
    this.data[userId] = getDefaultUserData(user);
    this.save();
  }

  // Get all users (for demo purposes)
  getAllUsers(): User[] {
    return Object.values(this.data).map(d => d.user);
  }

  // Generate new daily tasks
  generateNewDailyTasks(userId: string) {
    const userData = this.data[userId];
    if (!userData) return;

    const today = new Date().toISOString().split('T')[0];
    const taskTypes: Array<'listening' | 'reading' | 'writing' | 'speaking'> = ['listening', 'reading', 'writing', 'speaking'];
    const taskTitles: Record<string, string[]> = {
      listening: ['Academic Lecture', 'Conversation Practice', 'News Report', 'Podcast Analysis'],
      reading: ['Science Article', 'Academic Passage', 'News Editorial', 'Research Summary'],
      writing: ['Essay Practice', 'Letter Writing', 'Report Writing', 'Vocabulary Builder'],
      speaking: ['Describe a Photo', 'Part 2 Cue Card', 'Part 3 Discussion', 'Pronunciation Drill'],
    };

    userData.tasks = taskTypes.map(type => {
      const titles = taskTitles[type];
      const title = titles[Math.floor(Math.random() * titles.length)];
      return {
        id: uuidv4(),
        title: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${title}`,
        type,
        duration: Math.floor(Math.random() * 15) + 10,
        completed: false,
        points: Math.floor(Math.random() * 15) + 15,
        completedAt: null,
        date: today,
      };
    });

    this.save();
  }
}

// Session management
export const session = {
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
};

// Export singleton instance
export const db = new Database();

// Demo data for quick testing
export function seedDemoData() {
  // Check if demo user exists
  if (!db.userExists('demo@leapscholar.com')) {
    const demoUser = db.createUser('Demo User', 'demo@leapscholar.com', 'demo123');
    const userData = db.getUserData(demoUser.id);
    
    if (userData) {
      // Add some demo progress
      userData.stats.streak = 12;
      userData.stats.longestStreak = 15;
      userData.stats.totalPoints = 2450;
      userData.stats.level = 3;
      userData.stats.tasksCompleted = 32;
      userData.stats.totalStudyHours = 48;
      userData.stats.currentBand = 7.0;
      userData.stats.daysToExam = 24;
      
      // Unlock some achievements
      userData.achievements[0].unlocked = true;
      userData.achievements[0].unlockedAt = new Date().toISOString();
      userData.achievements[0].progress = 7;
      userData.achievements[3].unlocked = true;
      userData.achievements[3].unlockedAt = new Date().toISOString();
      userData.achievements[3].progress = 5;
      
      // Complete some tasks
      userData.tasks[0].completed = true;
      userData.tasks[0].completedAt = new Date().toISOString();
      
      // Update weekly goals
      userData.weeklyGoals[1].completed = true;
      userData.weeklyGoals[1].tasks = 4;
      userData.weeklyGoals[2].completed = true;
      userData.weeklyGoals[2].tasks = 3;
      userData.weeklyGoals[3].completed = true;
      userData.weeklyGoals[3].tasks = 5;
      
      // Update skill progress
      userData.skillProgress[0].score = 7.5;
      userData.skillProgress[0].progress = 75;
      userData.skillProgress[1].score = 7.0;
      userData.skillProgress[1].progress = 70;
      userData.skillProgress[2].score = 6.5;
      userData.skillProgress[2].progress = 65;
      userData.skillProgress[3].score = 7.0;
      userData.skillProgress[3].progress = 70;
      
      // Update study plan
      userData.studyPlan[0].completed = 15;
      
      // Update leaderboard with user
      userData.leaderboard.push({
        rank: 2,
        name: 'You',
        points: 2450,
        avatar: 'YO',
        change: 'same',
        isUser: true,
      });
      userData.leaderboard.sort((a, b) => b.points - a.points);
      userData.leaderboard.forEach((entry, i) => entry.rank = i + 1);
      
      db.updateUserData(demoUser.id, userData);
    }
  }
}
