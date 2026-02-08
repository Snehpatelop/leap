import { useState } from 'react';
import { Award, Flame, CheckCircle2, Trophy, Zap, Star, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  flame: Flame,
  check: CheckCircle2,
  trophy: Trophy,
  zap: Zap,
  star: Star,
};

export function Achievements() {
  const { userData } = useData();
  const [expanded, setExpanded] = useState(false);

  const achievements = userData?.achievements || [];
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((acc, a) => acc + a.pointsReward, 0);

  const displayedAchievements = expanded ? achievements : achievements.slice(0, 4);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              Achievements
            </CardTitle>
            <CardDescription>Unlock badges by reaching milestones</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-600">{unlockedCount}/{achievements.length}</p>
            <p className="text-xs text-muted-foreground">{totalPoints} pts earned</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {displayedAchievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Star;
            
            return (
              <div
                key={achievement.id}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-300",
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-md' 
                    : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                    achievement.unlocked 
                      ? 'bg-amber-500 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-400'
                  )}>
                    {achievement.unlocked ? (
                      <Icon className="w-5 h-5" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">
                      +{achievement.pointsReward}
                    </Badge>
                  )}
                </div>
                
                <p className={cn(
                  "font-medium text-sm",
                  achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                )}>
                  {achievement.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {achievement.description}
                </p>

                {!achievement.unlocked && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-indigo-600 font-medium">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {achievement.unlocked && achievement.unlockedAt && (
                  <p className="text-[10px] text-amber-600 mt-2">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {achievements.length > 4 && (
          <Button
            variant="ghost"
            className="w-full mt-4 text-gray-500 hover:text-gray-700"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show All {achievements.length} Achievements
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
