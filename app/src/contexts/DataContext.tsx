import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserData, Notification } from '@/types';
import { useAuth } from './AuthContext';
import { generateDefaultTasks, generateDefaultAchievements, generateDefaultWeeklyGoals } from '@/lib/database';

interface DataContextType {
  userData: UserData | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  toggleTask: (taskId: string) => Promise<{ success: boolean; pointsEarned?: number; message?: string }>;
  joinStudyGroup: (groupId: string) => Promise<boolean>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  generateNewTasks: () => Promise<void>;
  addNotification: (title: string, message: string, type?: Notification['type']) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initialize default user data
function getDefaultUserData(userId: string): UserData {
  return {
    user: {
      id: userId,
      name: '',
      email: '',
      avatar: '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
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
  };
}

// Storage key helper
const getUserDataKey = (userId: string) => `leap_userdata_${userId}`;

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    if (!user) {
      setUserData(null);
      setIsLoading(false);
      return;
    }

    try {
      // Try to get data from localStorage
      const storedData = localStorage.getItem(getUserDataKey(user.id));
      
      if (storedData) {
        setUserData(JSON.parse(storedData) as UserData);
      } else {
        // Create default user data
        const defaultData = getDefaultUserData(user.id);
        defaultData.user = user; // Use actual user from auth
        localStorage.setItem(getUserDataKey(user.id), JSON.stringify(defaultData));
        setUserData(defaultData);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Fall back to default data if localStorage fails
      const defaultData = getDefaultUserData(user.id);
      defaultData.user = user;
      setUserData(defaultData);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshData();
    } else {
      setUserData(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, user, refreshData]);

  const toggleTask = useCallback(
    async (taskId: string): Promise<{ success: boolean; pointsEarned?: number; message?: string }> => {
      if (!user || !userData) return { success: false, message: 'Not authenticated' };

      try {
        const task = userData.tasks.find((t) => t.id === taskId);
        if (!task) return { success: false, message: 'Task not found' };

        const wasCompleted = task.completed;
        const updatedTasks = userData.tasks.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : null,
            };
          }
          return t;
        });

        const pointsDelta = wasCompleted ? -task.points : task.points;
        const tasksDelta = wasCompleted ? -1 : 1;

        const updatedStats = {
          ...userData.stats,
          totalPoints: Math.max(0, userData.stats.totalPoints + pointsDelta),
          tasksCompleted: Math.max(0, userData.stats.tasksCompleted + tasksDelta),
        };

        // Update level based on points
        const newLevel = Math.floor(updatedStats.totalPoints / 1000) + 1;
        updatedStats.level = newLevel;
        updatedStats.pointsToNextLevel = newLevel * 1000 - updatedStats.totalPoints;

        // Update streak when completing a task
        if (!wasCompleted) {
          const today = new Date().toDateString();
          const lastStudyDate = updatedStats.lastStudyDate;
          if (lastStudyDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastStudyDate === yesterday.toDateString()) {
              updatedStats.streak += 1;
            } else {
              updatedStats.streak = 1;
            }
            updatedStats.lastStudyDate = today;
            updatedStats.longestStreak = Math.max(updatedStats.longestStreak, updatedStats.streak);
          }
        }

        const updatedData = {
          ...userData,
          tasks: updatedTasks,
          stats: updatedStats,
        };

        localStorage.setItem(getUserDataKey(user.id), JSON.stringify(updatedData));
        setUserData(updatedData);

        const completedTask = updatedTasks.find((t) => t.id === taskId);
        return {
          success: true,
          pointsEarned: completedTask?.completed ? task.points : 0,
          message: completedTask?.completed ? `Task completed! +${task.points} points` : 'Task uncompleted',
        };
      } catch (error) {
        console.error('Error toggling task:', error);
        return { success: false, message: 'Failed to update task' };
      }
    },
    [user, userData]
  );

  const joinStudyGroup = useCallback(
    async (groupId: string): Promise<boolean> => {
      if (!user || !userData) return false;

      try {
        const updatedGroups = userData.studyGroups.map((group) => {
          if (group.id === groupId) {
            return { ...group, joined: !group.joined, members: group.joined ? group.members - 1 : group.members + 1 };
          }
          return group;
        });

        const updatedData = {
          ...userData,
          studyGroups: updatedGroups,
        };

        localStorage.setItem(getUserDataKey(user.id), JSON.stringify(updatedData));
        setUserData(updatedData);
        return true;
      } catch (error) {
        console.error('Error joining study group:', error);
        return false;
      }
    },
    [user, userData]
  );

  const markNotificationRead = useCallback(
    async (notificationId: string): Promise<void> => {
      if (!user || !userData) return;

      try {
        const updatedNotifications = userData.notifications.map((notif) => {
          if (notif.id === notificationId) {
            return { ...notif, read: true };
          }
          return notif;
        });

        const updatedData = {
          ...userData,
          notifications: updatedNotifications,
        };

        localStorage.setItem(getUserDataKey(user.id), JSON.stringify(updatedData));
        setUserData(updatedData);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    [user, userData]
  );

  const generateNewTasks = useCallback(async (): Promise<void> => {
    if (!user || !userData) return;

    try {
      const newTasks = generateDefaultTasks();
      const updatedData = {
        ...userData,
        tasks: newTasks,
      };

      localStorage.setItem(getUserDataKey(user.id), JSON.stringify(updatedData));
      setUserData(updatedData);
    } catch (error) {
      console.error('Error generating new tasks:', error);
    }
  }, [user, userData]);

  const addNotification = useCallback(
    async (title: string, message: string, type: Notification['type'] = 'info'): Promise<void> => {
      if (!user || !userData) return;

      try {
        const notification: Notification = {
          id: Date.now().toString(),
          title,
          message,
          type,
          createdAt: new Date().toISOString(),
          read: false,
        };

        const updatedData = {
          ...userData,
          notifications: [notification, ...userData.notifications],
        };

        localStorage.setItem(getUserDataKey(user.id), JSON.stringify(updatedData));
        setUserData(updatedData);
      } catch (error) {
        console.error('Error adding notification:', error);
      }
    },
    [user, userData]
  );

  return (
    <DataContext.Provider
      value={{
        userData,
        isLoading,
        refreshData,
        toggleTask,
        joinStudyGroup,
        markNotificationRead,
        generateNewTasks,
        addNotification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
