import { useState } from 'react';
import { BookOpen, Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { login, register, loginWithGoogle, tryDemo } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const result = await login({ email: formData.email, password: formData.password });
        if (!result.success) {
          setMessage({ type: 'error', text: result.message });
        }
      } else {
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
        if (!result.success) {
          setMessage({ type: 'error', text: result.message });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Google sign-in failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryDemo = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await tryDemo();
      if (!result.success) {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Demo mode failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-200 mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Leap Scholar
          </h1>
          <p className="text-gray-500 mt-2">Master IELTS with personalized learning</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? 'Welcome back!' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Fill in your details to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {message && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                className="w-full gradient-primary text-white hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 border-gray-300 hover:bg-gray-50"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-3 border-indigo-300 hover:bg-indigo-50 text-indigo-600"
                onClick={handleTryDemo}
                disabled={isLoading}
              >
                <Play className="w-4 h-4 mr-2" />
                Try Demo
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage(null);
                    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                  }}
                  className="ml-1 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-white/50 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Gamified Learning</p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Track Progress</p>
          </div>
          <div className="p-4 rounded-xl bg-white/50 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center mx-auto mb-2">
              <ArrowRight className="w-5 h-5 text-pink-600" />
            </div>
            <p className="text-xs text-gray-600 font-medium">Study Groups</p>
          </div>
        </div>
      </div>
    </div>
  );
}
