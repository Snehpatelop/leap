import { useState } from 'react';
import { MessageCircle, Users, Check, Lock, Unlock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

export function StudyGroups() {
  const { userData, joinStudyGroup } = useData();
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const groups = userData?.studyGroups || [];
  const joinedGroups = groups.filter(g => g.joined);
  const availableGroups = groups.filter(g => !g.joined);

  const handleJoin = async (groupId: string) => {
    setJoiningId(groupId);
    setTimeout(async () => {
      await joinStudyGroup(groupId);
      setJoiningId(null);
    }, 500);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-green-600" />
          </div>
          Study Groups
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Joined groups */}
        {joinedGroups.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Your Groups</p>
            <div className="space-y-2">
              {joinedGroups.map((group) => (
                <div 
                  key={group.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{group.name}</p>
                      <p className="text-xs text-green-600">{group.members} members</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-green-600">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available groups */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Available Groups</p>
          <div className="space-y-2">
            {availableGroups.map((group) => (
              <div 
                key={group.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    group.active ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-400'
                  )}>
                    {group.active ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{group.name}</p>
                      {!group.active && (
                        <Badge variant="secondary" className="text-[10px]">Coming Soon</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {group.members} members
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  disabled={!group.active || joiningId === group.id}
                  onClick={() => handleJoin(group.id)}
                  className={cn(
                    joiningId === group.id && 'opacity-70'
                  )}
                >
                  {joiningId === group.id ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Join'
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
