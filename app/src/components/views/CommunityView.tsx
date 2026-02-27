import { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  MessageCircle, 
  UserPlus, 
  Share2, 
  Search,
  Filter,
  Star,
  Flame,
  Check,
  X,
  Mail,
  UserMinus,
  BarChart3,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { friendsManager, type Friend } from '@/lib/friends';
import { StudyGroups } from '@/components/dashboard/StudyGroups';
import { cn } from '@/lib/utils';

const getStatusColor = (status: string) => {
  if (status === 'online') return 'bg-green-500';
  if (status === 'studying') return 'bg-amber-500';
  return 'bg-gray-400';
};

export function CommunityView() {
  const { userData } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [discoverUsers, setDiscoverUsers] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [friendActivity, setFriendActivity] = useState<{ friend: Friend; action: string; time: string }[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const userPoints = userData?.stats?.totalPoints || 0;
  const userRank = 2;

  useEffect(() => {
    refreshFriends();
  }, [searchQuery]);

  const refreshFriends = () => {
    setFriends(friendsManager.getFriends(searchQuery));
    setDiscoverUsers(friendsManager.getAllUsers(searchQuery));
    setPendingRequests(friendsManager.getPendingRequests());
    setFriendActivity(friendsManager.getFriendActivity());
  };

  const handleSendRequest = (userId: string) => {
    friendsManager.sendRequest(userId);
    refreshFriends();
  };

  const handleAcceptRequest = (userId: string) => {
    friendsManager.acceptRequest(userId);
    refreshFriends();
  };

  const handleRejectRequest = (userId: string) => {
    friendsManager.rejectRequest(userId);
    refreshFriends();
  };

  const handleRemoveFriend = (userId: string) => {
    friendsManager.removeFriend(userId);
    refreshFriends();
  };

  const handleInvite = () => {
    const result = friendsManager.inviteByEmail(inviteEmail);
    setInviteMessage({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) {
      setInviteEmail('');
      setTimeout(() => setInviteMessage(null), 3000);
    }
  };

  const compareWithFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowComparison(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Community
          </h2>
          <p className="text-gray-500 mt-1">
            Connect with fellow IELTS learners and stay motivated
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowInviteModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Friends
          </Button>
          <Button className="gradient-primary text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share Progress
          </Button>
        </div>
      </div>

      {/* User's Rank Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <p className="text-indigo-100 text-sm">Your Ranking</p>
                <p className="text-3xl font-bold">#{userRank}</p>
                <p className="text-indigo-100 text-sm">of {friends.length + discoverUsers.length + 1} learners</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{userPoints.toLocaleString()}</p>
              <p className="text-indigo-100 text-sm">Total Points</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{userData?.stats?.streak || 0}</p>
              <p className="text-xs text-indigo-100">Day Streak</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-2xl font-bold">{userData?.stats?.level || 1}</p>
              <p className="text-xs text-indigo-100">Current Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{friends.length}</p>
              <p className="text-xs text-indigo-100">Friends</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="friends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="friends">
            <Users className="w-4 h-4 mr-2" />
            Friends
            {friends.length > 0 && (
              <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 px-1.5 rounded-full">
                {friends.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="discover">
            <Search className="w-4 h-4 mr-2" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="requests">
            <Mail className="w-4 h-4 mr-2" />
            Requests
            {pendingRequests.length > 0 && (
              <span className="ml-1 text-xs bg-red-100 text-red-700 px-1.5 rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="groups">
            <MessageCircle className="w-4 h-4 mr-2" />
            Groups
          </TabsTrigger>
        </TabsList>

        {/* Friends Tab */}
        <TabsContent value="friends" className="space-y-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {friends.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700">No friends yet</h3>
                <p className="text-gray-500 mt-1">Discover and connect with other learners</p>
                <Button className="mt-4 gradient-primary" onClick={() => {
                  const discoverTab = document.querySelector('[value="discover"]') as HTMLElement;
                  discoverTab?.click();
                }}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Find Friends
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map((friend) => (
                <Card key={friend.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="w-14 h-14">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-lg">
                            {friend.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className={cn(
                          "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white",
                          getStatusColor(friend.status)
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{friend.name}</h4>
                            <p className="text-xs text-gray-500">{friend.status} • {friend.lastActive}</p>
                          </div>
                          <Badge variant="secondary">Level {friend.level}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-amber-500" />
                            {friend.points.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Flame className="w-4 h-4 text-orange-500" />
                            {friend.streak}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" onClick={() => compareWithFriend(friend)}>
                            <BarChart3 className="w-4 h-4 mr-1" />
                            Compare
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleRemoveFriend(friend.id)}>
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discoverUsers.map((user) => (
              <Card key={user.id} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white text-lg">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Badge variant="secondary">Level {user.level}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-amber-500" />
                          {user.points.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Flame className="w-4 h-4 text-orange-500" />
                          {user.streak}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="mt-3 w-full gradient-primary"
                        onClick={() => handleSendRequest(user.id)}
                        disabled={user.requestSent}
                      >
                        {user.requestSent ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-1" />
                            Add Friend
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          {pendingRequests.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700">No pending requests</h3>
                <p className="text-gray-500 mt-1">Friend requests will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-lg">
                          {request.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{request.name}</h4>
                        <p className="text-xs text-gray-500">Wants to be your friend</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-amber-500" />
                            {request.points.toLocaleString()} pts
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Flame className="w-4 h-4 text-orange-500" />
                            {request.streak} day streak
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="gradient-primary" onClick={() => handleAcceptRequest(request.id)}>
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectRequest(request.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups">
          <StudyGroups />
        </TabsContent>
      </Tabs>

      {/* Friend Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Friend Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {friendActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm">
                    {activity.friend.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.friend.name}</span>{' '}
                    <span className="text-gray-500">{activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Invite Friends</CardTitle>
              <CardDescription>Earn 100 bonus points for each friend who joins!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter email address" 
                  className="flex-1"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Button className="gradient-primary" onClick={handleInvite}>Send</Button>
              </div>
              {inviteMessage && (
                <div className={cn(
                  "p-3 rounded-lg text-sm",
                  inviteMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                )}>
                  {inviteMessage.text}
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Or share your invite link:</p>
                <div className="flex gap-2">
                  <Input value={`${window.location.origin}/invite/${user?.id || 'guest'}`} readOnly />
                  <Button variant="outline" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/invite/${user?.id || 'guest'}`);
                    setInviteMessage({ type: 'success', text: 'Link copied to clipboard!' });
                    setTimeout(() => setInviteMessage(null), 3000);
                  }}>Copy</Button>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setShowInviteModal(false)}>
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && selectedFriend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Progress Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xl">
                      {user?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">You</p>
                </div>
                <div className="text-2xl font-bold text-gray-300">VS</div>
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white text-xl">
                      {selectedFriend.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{selectedFriend.name}</p>
                </div>
              </div>

              {[
                { label: 'Points', user: userData?.stats?.totalPoints || 0, friend: selectedFriend.points },
                { label: 'Level', user: userData?.stats?.level || 1, friend: selectedFriend.level },
                { label: 'Streak', user: userData?.stats?.streak || 0, friend: selectedFriend.streak },
                { label: 'Tasks', user: userData?.stats?.tasksCompleted || 0, friend: 28 },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{stat.label}</span>
                    <span className={stat.user > stat.friend ? 'text-green-600' : stat.user < stat.friend ? 'text-red-500' : ''}>
                      {stat.user > stat.friend ? 'You lead!' : stat.user < stat.friend ? 'Friend leads' : 'Tied'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-2 bg-indigo-500 rounded-full" style={{ width: `${(stat.user / Math.max(stat.user, stat.friend)) * 100}%` }} />
                    </div>
                    <div className="w-12 text-right font-medium">{stat.user}</div>
                    <div className="w-12 text-right font-medium">{stat.friend}</div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-300 rounded-full" style={{ width: `${(stat.friend / Math.max(stat.user, stat.friend)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}

              <Button className="w-full" onClick={() => setShowComparison(false)}>
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
