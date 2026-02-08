import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthState, LoginFormData, RegisterFormData, User } from '@/types';

interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterFormData) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  resetData: () => Promise<void>;
  tryDemo: () => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const USERS_KEY = 'leap_users';
const CURRENT_USER_KEY = 'leap_current_user';

// Helper function to get users from localStorage
function getUsers(): Record<string, User & { password: string }> {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
}

// Helper function to save users to localStorage
function saveUsers(users: Record<string, User & { password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Helper function to create user profile
function createUserProfile(uid: string, name: string, email: string): User {
  const user: User = {
    id: uid,
    name,
    email,
    avatar: name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase(),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  return user;
}

// Helper function to reset user data
function resetUserData(uid: string) {
  try {
    // Clear user data from localStorage
    const dataKeys = Object.keys(localStorage).filter(key => 
      key.startsWith(`leap_data_${uid}`) || key === `leap_userdata_${uid}`
    );
    dataKeys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error resetting user data:', error);
  }
}

// Demo user data
const DEMO_USER: User = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@leapscholar.com',
  avatar: 'DU',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = localStorage.getItem(CURRENT_USER_KEY);
        if (currentUser) {
          const user = JSON.parse(currentUser) as User;
          setState({
            isAuthenticated: true,
            user,
            isLoading: false,
          });
        } else {
          setState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (data: LoginFormData): Promise<{ success: boolean; message: string }> => {
    try {
      const users = getUsers();
      const userEntry = Object.entries(users).find(([_, user]) => user.email === data.email);
      
      if (!userEntry) {
        return { success: false, message: 'Email not registered. Please sign up.' };
      }

      const [uid, user] = userEntry;
      
      if (user.password !== data.password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }

      // Update last login
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      users[uid] = updatedUser;
      saveUsers(users);

      // Set current user
      const { password, ...userWithoutPassword } = updatedUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      setState({
        isAuthenticated: true,
        user: userWithoutPassword,
        isLoading: false,
      });

      return { success: true, message: 'Welcome back!' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred. Please try again.' };
    }
  }, []);

  const register = useCallback(async (data: RegisterFormData): Promise<{ success: boolean; message: string }> => {
    try {
      if (data.password !== data.confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
      }

      const users = getUsers();
      
      // Check if email already exists
      const existingUser = Object.values(users).find(user => user.email === data.email);
      if (existingUser) {
        return { success: false, message: 'Email already registered. Please log in.' };
      }

      // Create new user
      const uid = 'user_' + Date.now();
      const userProfile = createUserProfile(uid, data.name, data.email);
      const newUser = { ...userProfile, password: data.password };
      
      users[uid] = newUser;
      saveUsers(users);

      // Set current user
      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      setState({
        isAuthenticated: true,
        user: userWithoutPassword,
        isLoading: false,
      });

      return { success: true, message: 'Account created successfully!' };
    } catch (error: any) {
      console.error('Register error:', error);
      return { success: false, message: 'An error occurred. Please try again.' };
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    try {
      // Simulate Google sign-in with a mock user
      const users = getUsers();
      const googleEmail = 'google_user_' + Date.now() + '@example.com';
      const uid = 'google_' + Date.now();
      
      const userProfile = createUserProfile(uid, 'Google User', googleEmail);
      const newUser = { ...userProfile, password: 'google_oauth' };
      
      users[uid] = newUser;
      saveUsers(users);

      // Set current user
      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      setState({
        isAuthenticated: true,
        user: userWithoutPassword,
        isLoading: false,
      });

      return { success: true, message: 'Welcome back!' };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return { success: false, message: 'An error occurred. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  const resetData = useCallback(async () => {
    if (state.user) {
      try {
        resetUserData(state.user.id);
      } catch (error) {
        console.error('Error resetting data:', error);
        throw error;
      }
    }
  }, [state.user]);

  const tryDemo = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    try {
      // Set demo user
      const demoUser = { ...DEMO_USER, lastLogin: new Date().toISOString() };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
      
      setState({
        isAuthenticated: true,
        user: demoUser,
        isLoading: false,
      });

      return { success: true, message: 'Welcome to the demo!' };
    } catch (error: any) {
      console.error('Demo error:', error);
      return { success: false, message: 'An error occurred. Please try again.' };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        loginWithGoogle,
        logout,
        resetData,
        tryDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
