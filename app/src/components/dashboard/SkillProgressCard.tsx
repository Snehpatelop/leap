import { TrendingUp, Headphones, BookOpen, PenTool, Mic, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

const skillIcons = {
  Listening: Headphones,
  Reading: BookOpen,
  Writing: PenTool,
  Speaking: Mic,
};

export function SkillProgressCard() {
  const { userData } = useData();
  
  const skills = userData?.skillProgress || [];
  const stats = userData?.stats;
  const currentBand = stats?.currentBand || 6.0;
  const targetBand = stats?.targetBand || 8.0;
  const progressToTarget = ((currentBand - 5) / (targetBand - 5)) * 100;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              Skill Progress
            </CardTitle>
            <CardDescription>Track your IELTS band score improvement</CardDescription>
          </div>
          <Badge variant="outline" className="text-indigo-600 border-indigo-200">
            <Target className="w-3 h-3 mr-1" />
            Target: {targetBand}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {skills.map((skill) => {
            const Icon = skillIcons[skill.name];
            return (
              <div key={skill.name} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110",
                      skill.color
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-medium text-sm">{skill.name}</span>
                      <div className="flex items-center gap-1">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          skill.score >= 7 ? 'bg-green-500' : 
                          skill.score >= 6 ? 'bg-amber-500' : 'bg-red-500'
                        )} />
                        <span className="text-xs text-muted-foreground">
                          {skill.score >= 7 ? 'Good' : skill.score >= 6 ? 'Average' : 'Needs Work'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{skill.score.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">band</span>
                  </div>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out",
                      skill.color
                    )}
                    style={{ width: `${skill.progress}%` }}
                  />
                  {/* Target marker */}
                  <div 
                    className="absolute inset-y-0 w-0.5 bg-gray-400"
                    style={{ left: `${(targetBand / 9) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0</span>
                  <span>Target: {targetBand}</span>
                  <span>9</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall score */}
        <div className="mt-6 p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Overall Band Score</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Progress value={progressToTarget} className="w-24 h-1.5" />
                  <span className="text-xs text-muted-foreground">{Math.round(progressToTarget)}% to target</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {currentBand.toFixed(1)}
              </p>
              <Badge className="bg-green-100 text-green-700 border-0 text-xs mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +0.5 this month
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
