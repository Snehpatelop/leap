import { useState, useEffect } from 'react';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';

export function PointsCard() {
  const { userData } = useData();
  const [animatePoints, setAnimatePoints] = useState(false);
  
  const stats = userData?.stats;
  const points = stats?.totalPoints || 0;
  const level = stats?.level || 1;
  const pointsToNextLevel = stats?.pointsToNextLevel || 1000;
  const progress = ((points % 1000) / 1000) * 100;

  useEffect(() => {
    setAnimatePoints(true);
    const timer = setTimeout(() => setAnimatePoints(false), 500);
    return () => clearTimeout(timer);
  }, [points]);

  // Calculate level benefits
  const benefits = [
    { level: 1, benefit: 'Basic access' },
    { level: 2, benefit: 'Unlock streak freeze' },
    { level: 3, benefit: '2x points on weekends' },
    { level: 5, benefit: 'Exclusive study groups' },
    { level: 10, benefit: 'Personalized AI tutor' },
  ];

  const nextBenefit = benefits.find(b => b.level > level);

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }} />
      </div>

      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-indigo-200" />
              <p className="text-indigo-100 text-sm font-medium">Total Points</p>
            </div>
            <div className={`flex items-baseline gap-2 transition-transform ${animatePoints ? 'scale-110' : ''}`}>
              <span className="text-4xl font-bold">{points.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                <Trophy className="w-3 h-3 mr-1" />
                Level {level}
              </Badge>
              {level >= 3 && (
                <Badge className="bg-amber-400/30 text-amber-100 border-0 backdrop-blur-sm">
                  <Zap className="w-3 h-3 mr-1" />
                  2x Points
                </Badge>
              )}
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Level progress */}
        <div className="mt-5">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-indigo-100">Level {level}</span>
            <span className="text-indigo-100">Level {level + 1}</span>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-3 bg-white/20" />
            <div 
              className="absolute top-0 h-3 w-3 bg-white rounded-full shadow-lg transition-all"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>
          <p className="text-xs text-indigo-100 mt-2 text-center">
            {(pointsToNextLevel - (points % 1000)).toLocaleString()} points to next level
          </p>
        </div>

        {/* Next benefit */}
        {nextBenefit && (
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-200" />
              <span className="text-xs text-indigo-100">
                Unlock at Level {nextBenefit.level}: {nextBenefit.benefit}
              </span>
            </div>
          </div>
        )}

        {/* Quick stats */}
        <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-lg font-bold">{stats?.tasksCompleted || 0}</p>
            <p className="text-xs text-indigo-200">Tasks Done</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{stats?.totalStudyHours?.toFixed(1) || 0}h</p>
            <p className="text-xs text-indigo-200">Study Time</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{stats?.mockTestsTaken || 0}</p>
            <p className="text-xs text-indigo-200">Mock Tests</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
