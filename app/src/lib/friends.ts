// Friends management system

export interface Friend {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  points: number;
  streak: number;
  status: 'online' | 'offline' | 'studying';
  lastActive: string;
  isFriend: boolean;
  requestSent?: boolean;
  requestReceived?: boolean;
}

// Mock friends database
const mockFriends: Friend[] = [
  { id: '1', name: 'Sarah Mitchell', email: 'sarah@example.com', avatar: 'SM', level: 5, points: 2840, streak: 45, status: 'online', lastActive: 'now', isFriend: true },
  { id: '2', name: 'Alex Kumar', email: 'alex@example.com', avatar: 'AK', level: 4, points: 2320, streak: 23, status: 'studying', lastActive: '5 min ago', isFriend: true },
  { id: '3', name: 'Priya Sharma', email: 'priya@example.com', avatar: 'PR', level: 4, points: 2180, streak: 18, status: 'offline', lastActive: '2 hours ago', isFriend: true },
  { id: '4', name: 'James Lee', email: 'james@example.com', avatar: 'JL', level: 3, points: 2050, streak: 12, status: 'online', lastActive: 'now', isFriend: false },
  { id: '5', name: 'Emma Wilson', email: 'emma@example.com', avatar: 'EW', level: 3, points: 1890, streak: 8, status: 'offline', lastActive: '1 day ago', isFriend: false },
  { id: '6', name: 'David Chen', email: 'david@example.com', avatar: 'DC', level: 3, points: 1750, streak: 15, status: 'studying', lastActive: '10 min ago', isFriend: false },
  { id: '7', name: 'Lisa Thompson', email: 'lisa@example.com', avatar: 'LT', level: 2, points: 1620, streak: 6, status: 'online', lastActive: 'now', isFriend: false },
  { id: '8', name: 'Mike Roberts', email: 'mike@example.com', avatar: 'MR', level: 2, points: 1580, streak: 9, status: 'offline', lastActive: '3 hours ago', isFriend: false },
];

const FRIENDS_KEY = 'leapscholar_friends';
const FRIEND_REQUESTS_KEY = 'leapscholar_friend_requests';

class FriendsManager {
  private friends: Friend[] = [];
  private requests: { from: string; to: string; status: 'pending' | 'accepted' | 'rejected'; sentAt: string }[] = [];

  constructor() {
    this.load();
  }

  private load() {
    try {
      const storedFriends = localStorage.getItem(FRIENDS_KEY);
      const storedRequests = localStorage.getItem(FRIEND_REQUESTS_KEY);
      
      if (storedFriends) {
        this.friends = JSON.parse(storedFriends);
      } else {
        // Initialize with mock data
        this.friends = mockFriends.map(f => ({ ...f }));
        this.save();
      }
      
      if (storedRequests) {
        this.requests = JSON.parse(storedRequests);
      }
    } catch (error) {
      console.error('Failed to load friends:', error);
      this.friends = mockFriends.map(f => ({ ...f }));
    }
  }

  private save() {
    try {
      localStorage.setItem(FRIENDS_KEY, JSON.stringify(this.friends));
      localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(this.requests));
    } catch (error) {
      console.error('Failed to save friends:', error);
    }
  }

  // Get all users (for discovery)
  getAllUsers(searchQuery: string = ''): Friend[] {
    let users = this.friends.filter(f => !f.isFriend);
    
    if (searchQuery) {
      users = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return users.map(u => ({
      ...u,
      requestSent: this.requests.some(r => r.to === u.id && r.status === 'pending'),
      requestReceived: this.requests.some(r => r.from === u.id && r.status === 'pending'),
    }));
  }

  // Get friends list
  getFriends(searchQuery: string = ''): Friend[] {
    let friends = this.friends.filter(f => f.isFriend);
    
    if (searchQuery) {
      friends = friends.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return friends.sort((a, b) => {
      // Sort by status: online > studying > offline
      const statusOrder = { online: 0, studying: 1, offline: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return b.points - a.points;
    });
  }

  // Get pending requests
  getPendingRequests(): Friend[] {
    const requestIds = this.requests
      .filter(r => r.status === 'pending')
      .map(r => r.from);
    
    return this.friends.filter(f => requestIds.includes(f.id));
  }

  // Send friend request
  sendRequest(userId: string): boolean {
    const existingRequest = this.requests.find(
      r => (r.from === userId || r.to === userId) && r.status === 'pending'
    );
    
    if (existingRequest) return false;
    
    this.requests.push({
      from: 'current_user', // In real app, this would be the logged-in user's ID
      to: userId,
      status: 'pending',
      sentAt: new Date().toISOString(),
    });
    
    this.save();
    return true;
  }

  // Accept friend request
  acceptRequest(userId: string): boolean {
    const request = this.requests.find(
      r => r.from === userId && r.to === 'current_user' && r.status === 'pending'
    );
    
    if (!request) return false;
    
    request.status = 'accepted';
    
    const friend = this.friends.find(f => f.id === userId);
    if (friend) {
      friend.isFriend = true;
    }
    
    this.save();
    return true;
  }

  // Reject friend request
  rejectRequest(userId: string): boolean {
    const request = this.requests.find(
      r => r.from === userId && r.to === 'current_user' && r.status === 'pending'
    );
    
    if (!request) return false;
    
    request.status = 'rejected';
    this.save();
    return true;
  }

  // Remove friend
  removeFriend(userId: string): boolean {
    const friend = this.friends.find(f => f.id === userId);
    if (!friend || !friend.isFriend) return false;
    
    friend.isFriend = false;
    
    // Remove related requests
    this.requests = this.requests.filter(
      r => !(r.from === userId || r.to === userId)
    );
    
    this.save();
    return true;
  }

  // Invite by email — opens the user's mail client with a pre-filled invitation
  inviteByEmail(email: string, senderName: string = 'A friend'): { success: boolean; message: string } {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    // Check if already a friend
    const existingFriend = this.friends.find(f => f.email === email);
    if (existingFriend?.isFriend) {
      return { success: false, message: 'This user is already your friend' };
    }
    
    // Check if already invited
    const existingRequest = this.requests.find(
      r => r.to === email && r.status === 'pending'
    );
    if (existingRequest) {
      return { success: false, message: 'Invitation already sent' };
    }

    // Record the invite locally
    this.requests.push({
      from: 'current_user',
      to: email,
      status: 'pending',
      sentAt: new Date().toISOString(),
    });
    this.save();

    // Open the user's default mail client with a pre-filled invite
    const subject = encodeURIComponent(`${senderName} invited you to join Leap Scholar!`);
    const body = encodeURIComponent(
      `Hi there!\n\n${senderName} thinks you'd love Leap Scholar — a fun, gamified IELTS prep platform.\n\nJoin now and start your learning journey: ${window.location.origin}\n\nSee you there! 🎯`
    );
    window.open(`mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`, '_self');

    return { success: true, message: `Invitation email opened for ${email}!` };
  }

  // Get friend activity
  getFriendActivity(): { friend: Friend; action: string; time: string }[] {
    const friends = this.getFriends();
    const activities = [
      { action: 'completed a mock test', time: '2 min ago' },
      { action: 'started a 15-day streak', time: '5 min ago' },
      { action: 'earned "Task Master" badge', time: '12 min ago' },
      { action: 'joined Speaking Practice Circle', time: '18 min ago' },
      { action: 'completed 50 tasks', time: '25 min ago' },
      { action: 'reached Level 5', time: '30 min ago' },
      { action: 'finished Listening Practice', time: '45 min ago' },
      { action: 'started a new study plan', time: '1 hour ago' },
    ];
    
    return friends.slice(0, 5).map((friend, index) => ({
      friend,
      ...activities[index % activities.length],
    }));
  }

  // Compare progress with friend
  compareWithFriend(friendId: string): {
    user: { points: number; tasks: number; streak: number; level: number };
    friend: { points: number; tasks: number; streak: number; level: number };
  } | null {
    const friend = this.friends.find(f => f.id === friendId && f.isFriend);
    if (!friend) return null;
    
    return {
      user: { points: 2450, tasks: 32, streak: 12, level: 3 },
      friend: { points: friend.points, tasks: 28, streak: friend.streak, level: friend.level },
    };
  }
}

export const friendsManager = new FriendsManager();
