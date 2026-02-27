import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, User, Palette, BookOpen, Database, LogOut, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

interface UserPrefs {
  dailyGoalHours: number;
  notificationsEnabled: boolean;
  studyReminders: boolean;
}

const DEFAULT_PREFS: UserPrefs = {
  dailyGoalHours: 2,
  notificationsEnabled: true,
  studyReminders: true,
};

export function SettingsView() {
  const { user, logout, resetData } = useAuth();
  const { userData, updateUser } = useData();
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState(user?.name || '');
  const [prefs, setPrefs] = useState<UserPrefs>(DEFAULT_PREFS);

  const prefsKey = user ? `leap_prefs_${user.id}` : null;

  useEffect(() => {
    if (prefsKey) {
      const stored = localStorage.getItem(prefsKey);
      if (stored) {
        try {
          setPrefs(JSON.parse(stored) as UserPrefs);
        } catch {
          // ignore
        }
      }
    }
  }, [prefsKey]);

  useEffect(() => {
    setDisplayName(userData?.user.name || user?.name || '');
  }, [userData?.user.name, user?.name]);

  const savePrefs = (updated: UserPrefs) => {
    setPrefs(updated);
    if (prefsKey) localStorage.setItem(prefsKey, JSON.stringify(updated));
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }
    const initials = displayName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    await updateUser({ name: displayName.trim(), avatar: initials });
    // Also update the current user in localStorage so auth context reflects it
    const currentUserKey = 'leap_current_user';
    const stored = localStorage.getItem(currentUserKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        localStorage.setItem(currentUserKey, JSON.stringify({ ...parsed, name: displayName.trim(), avatar: initials }));
      } catch {
        // ignore
      }
    }
    toast.success('Profile updated!');
  };

  const handleExportData = () => {
    if (!userData) return;
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leap-data-${user?.id || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported!');
  };

  const handleResetProgress = async () => {
    await resetData();
    toast.success('Progress reset. Please refresh the page.');
  };

  const handleSignOut = async () => {
    await logout();
  };

  const avatarText = userData?.user.avatar || user?.avatar || 'U';
  const nameText = userData?.user.name || user?.name || '';

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account, preferences, and data</p>
      </div>

      {/* Profile */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Profile
          </CardTitle>
          <CardDescription>Update your display name and avatar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-indigo-100">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-lg font-medium">
                {avatarText}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{nameText}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <Button onClick={handleSaveProfile} className="gradient-primary text-white">
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600" />
            Appearance
          </CardTitle>
          <CardDescription>Choose your preferred color theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {[
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'system', label: 'System', icon: Monitor },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  theme === value
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                    : 'border-border hover:border-indigo-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${theme === value ? 'text-indigo-600' : 'text-muted-foreground'}`} />
                <span className={`text-sm font-medium ${theme === value ? 'text-indigo-600' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Preferences */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Study Preferences
          </CardTitle>
          <CardDescription>Configure your daily study goals and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="dailyGoal">Daily Study Goal (hours)</Label>
            <Select
              value={String(prefs.dailyGoalHours)}
              onValueChange={(v) => savePrefs({ ...prefs, dailyGoalHours: Number(v) })}
            >
              <SelectTrigger id="dailyGoal" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <SelectItem key={h} value={String(h)}>
                    {h} {h === 1 ? 'hour' : 'hours'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Enable Notifications</p>
              <p className="text-xs text-muted-foreground">Receive achievement and progress alerts</p>
            </div>
            <Switch
              checked={prefs.notificationsEnabled}
              onCheckedChange={(v) => savePrefs({ ...prefs, notificationsEnabled: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Study Reminders</p>
              <p className="text-xs text-muted-foreground">Get reminded to study each day</p>
            </div>
            <Switch
              checked={prefs.studyReminders}
              onCheckedChange={(v) => savePrefs({ ...prefs, studyReminders: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Data Management
          </CardTitle>
          <CardDescription>Export or reset your study data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleExportData}>
            <Download className="w-4 h-4" />
            Export Data as JSON
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"
              >
                <Trash2 className="w-4 h-4" />
                Reset Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all your points, tasks, streaks, and achievements. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handleResetProgress}
                >
                  Reset Progress
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
