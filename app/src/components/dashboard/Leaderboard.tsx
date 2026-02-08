import { useState } from 'react';
import { Users, TrendingUp, TrendingDown, Minus, Trophy, Medal, Award, UserPlus, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

export function Leaderboard() {
  const { userData } = useData();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const leaderboard = userData?.leaderboard || [];
  const userRank = leaderboard.find(e => e.isUser)?.rank || 0;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
    return null;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (rank === 2) return 'bg-gray-100 text-gray-700 border-gray-200';
    if (rank === 3) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-gray-50 text-gray-600 border-gray-100';
  };

  const getChangeIcon = (change: string) => {
    if (change === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              Study Buddies
            </CardTitle>
            <CardDescription>Compete with friends and stay motivated</CardDescription>
          </div>
          {userRank > 0 && (
            <Badge className="bg-indigo-100 text-indigo-700 border-0">
              Your Rank: #{userRank}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all",
                entry.isUser 
                  ? 'bg-indigo-50 border-2 border-indigo-200 shadow-sm' 
                  : 'bg-gray-50 hover:bg-gray-100'
              )}
            >
              {/* Rank */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2",
                getRankStyle(entry.rank)
              )}>
                {getRankIcon(entry.rank) || entry.rank}
              </div>

              {/* Avatar */}
              <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                <AvatarFallback className={cn(
                  "text-sm font-medium",
                  entry.isUser 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' 
                    : 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                )}>
                  {entry.avatar}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium text-sm truncate",
                  entry.isUser ? 'text-indigo-900' : 'text-gray-900'
                )}>
                  {entry.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.points.toLocaleString()} pts
                </p>
              </div>

              {/* Change indicator */}
              <div className="flex items-center gap-1">
                {getChangeIcon(entry.change)}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            onClick={() => setShowInviteModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Friends
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Progress
          </Button>
        </div>

        {/* Invite modal placeholder */}
        {showInviteModal && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <p className="text-sm font-medium text-indigo-900 mb-2">Invite friends to study together!</p>
            <p className="text-xs text-indigo-700 mb-3">
              Earn 100 bonus points for each friend who joins.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email address"
                className="flex-1 px-3 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button size="sm" className="gradient-primary text-white">
                Send
              </Button>
            </div>
            <button 
              onClick={() => setShowInviteModal(false)}
              className="text-xs text-indigo-500 mt-2 hover:text-indigo-700"
            >
              Cancel
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
