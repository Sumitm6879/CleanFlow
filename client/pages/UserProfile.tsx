import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, createProfile, getUserActivities, getUserReports, getLeaderboard } from '@/lib/database';
import { Profile, Activity, Report } from '@/lib/database.types';
import { User, LogOut, Settings, Eye } from 'lucide-react';

// Mock data for when database is not available
const mockActivities: Activity[] = [
  {
    id: 'mock-1',
    user_id: 'mock',
    type: 'report_submitted',
    title: 'Pollution Report Submitted',
    description: 'Reported plastic waste accumulation at Mithi River',
    points_earned: 15,
    related_report_id: null,
    metadata: { location: 'Mithi River', severity: 'moderate' },
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'mock-2',
    user_id: 'mock',
    type: 'cleanup_joined',
    title: 'Cleanup Drive Completed',
    description: 'Participated in beach cleanup at Juhu Beach',
    points_earned: 25,
    related_report_id: null,
    metadata: { location: 'Juhu Beach', hours: 5 },
    created_at: '2024-01-10T08:00:00Z'
  },
  {
    id: 'mock-3',
    user_id: 'mock',
    type: 'achievement',
    title: 'Eco Hero Achievement',
    description: 'Reached Silver level eco hero status',
    points_earned: 50,
    related_report_id: null,
    metadata: { achievement_type: 'Silver Hero' },
    created_at: '2024-01-05T12:00:00Z'
  }
];

export function UserProfile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [userRank, setUserRank] = useState<{ rank: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Loading user data for:', user.id);

      // Create a fallback profile first
      const fallbackProfile: Profile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url || null,
        location: 'Mumbai',
        member_since: new Date().toISOString(),
        impact_score: 750, // Mock score
        eco_hero_level: 'Silver',
        reports_submitted: 12,
        cleanup_drives_joined: 5,
        volunteer_hours: 25,
        rank_position: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let userProfile = fallbackProfile;
      let userActivities = mockActivities;
      let reports: Report[] = [];
      let leaderboardRank = { rank: 15, total: 500 };

      // Try to load real data from database
      try {
        const dbProfile = await getProfile(user.id);
        if (dbProfile) {
          console.log('Loaded profile from database');
          userProfile = dbProfile;

          // Load real activities and reports
          const dbActivities = await getUserActivities(user.id, 10);
          if (dbActivities.length > 0) {
            userActivities = dbActivities;
          }

          const dbReports = await getUserReports(user.id);
          reports = dbReports;

          // Calculate real rank
          const leaderboard = await getLeaderboard(500);
          const userIndex = leaderboard.findIndex(p => p.id === user.id);
          if (userIndex !== -1) {
            leaderboardRank = { rank: userIndex + 1, total: leaderboard.length };
          }
        } else {
          console.log('No profile in database, trying to create one');
          const createdProfile = await createProfile(fallbackProfile);
          if (createdProfile) {
            userProfile = createdProfile;
            console.log('Profile created in database');
          }
        }
      } catch (dbError) {
        console.warn('Database error, using mock data:', dbError);
      }

      // Set all data (either real or mock)
      setProfile(userProfile);
      setActivities(userActivities);
      setUserReports(reports);
      setUserRank(leaderboardRank);

      console.log('User data loaded successfully');

    } catch (error) {
      console.error('Error loading user data:', error);
      // Even on error, set mock data so user sees something
      const fallbackProfile: Profile = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url || null,
        location: 'Mumbai',
        member_since: new Date().toISOString(),
        impact_score: 0,
        eco_hero_level: 'Bronze',
        reports_submitted: 0,
        cleanup_drives_joined: 0,
        volunteer_hours: 0,
        rank_position: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProfile(fallbackProfile);
      setActivities([]);
      setUserReports([]);
      setUserRank({ rank: 1, total: 1 });
    } finally {
      setLoading(false);
    }
  };

  const getEcoHeroProgress = (level: string) => {
    const levels = { 'Bronze': 0, 'Silver': 40, 'Gold': 70, 'Platinum': 90 };
    return levels[level as keyof typeof levels] || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActivityStatusColor = (activity: Activity) => {
    switch (activity.type) {
      case 'report_submitted':
        return 'text-blue-600';
      case 'cleanup_joined':
        return 'text-green-600';
      case 'volunteer_hours':
        return 'text-purple-600';
      case 'achievement':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActivityIcon = (activity: Activity) => {
    switch (activity.type) {
      case 'report_submitted':
        return '📝';
      case 'cleanup_joined':
        return '🧹';
      case 'volunteer_hours':
        return '⏰';
      case 'achievement':
        return '🏆';
      default:
        return '📍';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-[#121717] mb-4">Please Log In</h1>
          <p className="text-[#61808A] mb-6">You need to be logged in to view your profile.</p>
          <Button asChild className="bg-[#12B5ED] hover:bg-[#0ea5e1] text-white">
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#12B5ED] mx-auto mb-4"></div>
            <p className="text-[#61808A]">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full border-b border-[#E5E8EB]">
        <div className="flex justify-between items-center px-10 py-3">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-4 h-4 bg-[#121717]" style={{
              clipPath: "polygon(50% 0%, 100% 29%, 100% 71%, 50% 100%, 0% 71%, 0% 29%)"
            }} />
            <h1 className="text-lg font-bold text-[#121717]">CleanFlow Mumbai</h1>
          </Link>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 bg-[#F0F2F5] rounded-xl px-3 py-2">
              <svg className="w-5 h-5 text-[#121717]" fill="currentColor" viewBox="0 0 16 18">
                <path fillRule="evenodd" d="M15.3281 12.7453C14.8945 11.9984 14.25 9.88516 14.25 7.125C14.25 3.67322 11.4518 0.875 8 0.875C4.54822 0.875 1.75 3.67322 1.75 7.125C1.75 9.88594 1.10469 11.9984 0.671094 12.7453C0.445722 13.1318 0.444082 13.6092 0.666796 13.9973C0.889509 14.3853 1.30261 14.6247 1.75 14.625H4.93828C5.23556 16.0796 6.51529 17.1243 8 17.1243C9.48471 17.1243 10.7644 16.0796 11.0617 14.625H14.25C14.6972 14.6244 15.1101 14.3849 15.3326 13.9969C15.5551 13.609 15.5534 13.1317 15.3281 12.7453ZM8 15.875C7.20562 15.8748 6.49761 15.3739 6.23281 14.625H9.76719C9.50239 15.3739 8.79438 15.8748 8 15.875ZM1.75 13.375C2.35156 12.3406 3 9.94375 3 7.125C3 4.36358 5.23858 2.125 8 2.125C10.7614 2.125 13 4.36358 13 7.125C13 9.94141 13.6469 12.3383 14.25 13.375H1.75Z" fill="#121717"/>
              </svg>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-[#12B5ED] flex items-center justify-center text-white font-bold">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-start px-4 py-5">
        <div className="w-full max-w-4xl">
          
          {/* Profile Header */}
          <div className="flex justify-between items-center p-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#12B5ED] to-[#0ea5e1] flex items-center justify-center text-white text-4xl font-bold">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.full_name || 'Profile'} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()
                )}
              </div>
              
              <div className="h-32 flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-[#121717] mb-1">
                  {profile?.full_name || user.email?.split('@')[0] || 'User'}
                </h1>
                <p className="text-[#61808A] text-base">
                  Member since {formatDate(profile?.member_since || new Date().toISOString())} | Location: {profile?.location || 'Mumbai'}
                </p>
              </div>
            </div>
            
            <Button 
              asChild
              className="bg-[#F0F2F5] hover:bg-gray-200 text-[#121717] text-sm font-bold px-4 h-10 rounded-xl"
            >
              <Link to="/edit-profile">Edit Profile</Link>
            </Button>
          </div>

          {/* Impact Score */}
          <div className="flex justify-center mb-4">
            <div className="flex min-w-28 flex-col items-center gap-2 rounded-lg border border-[#DBE3E5] p-6">
              <h2 className="text-2xl font-bold text-[#121717]">{profile?.impact_score || 0}</h2>
              <p className="text-center text-sm text-[#61808A]">Impact Score</p>
            </div>
          </div>

          <div className="text-center py-1 px-4 mb-6">
            <p className="text-sm text-[#61808A]">
              Earn points by reporting pollution and joining cleanup drives.
            </p>
          </div>

          {/* Eco Hero Progress */}
          <div className="p-4 mb-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base font-medium text-[#121717]">Eco Hero</h3>
            </div>
            <div className="h-2 rounded-full bg-[#DBE3E5] mb-3">
              <div 
                className="h-2 rounded-full bg-[#121717]" 
                style={{ width: `${getEcoHeroProgress(profile?.eco_hero_level || 'Bronze')}%` }}
              ></div>
            </div>
            <p className="text-sm text-[#61808A]">{profile?.eco_hero_level || 'Bronze'}</p>
          </div>

          {/* Activity Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#121717] mb-3 px-4">Activity Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
              <div className="p-6 rounded-xl border border-[#DBE3E5]">
                <h3 className="text-base text-[#121717] mb-2">Reports Submitted</h3>
                <p className="text-2xl font-bold text-[#121717]">{profile?.reports_submitted || 0}</p>
              </div>
              <div className="p-6 rounded-xl border border-[#DBE3E5]">
                <h3 className="text-base text-[#121717] mb-2">Cleanup Drives Joined</h3>
                <p className="text-2xl font-bold text-[#121717]">{profile?.cleanup_drives_joined || 0}</p>
              </div>
              <div className="p-6 rounded-xl border border-[#DBE3E5]">
                <h3 className="text-base text-[#121717] mb-2">Total Volunteer Hours</h3>
                <p className="text-2xl font-bold text-[#121717]">{profile?.volunteer_hours || 0}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#121717] mb-3 px-4">Recent Activity</h2>
            
            <div className="space-y-4 px-4">
              {activities.length === 0 ? (
                <div className="p-8 text-center text-[#61808A] bg-[#F0F2F5] rounded-xl">
                  <p>No recent activity</p>
                  <p className="text-sm mt-1">Start by <Link to="/report" className="text-[#12B5ED] hover:underline">reporting pollution</Link> or joining cleanup drives!</p>
                </div>
              ) : (
                activities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex overflow-hidden rounded-xl bg-white shadow-sm border p-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getActivityIcon(activity)}</span>
                        <p className={`text-sm font-medium ${getActivityStatusColor(activity)}`}>
                          {activity.type === 'report_submitted' ? 'Approved' : 
                           activity.type === 'cleanup_joined' ? 'Completed' : 
                           activity.type === 'volunteer_hours' ? 'Logged' : 'Achievement'}
                        </p>
                      </div>
                      <h3 className="text-base font-bold text-[#121717]">{activity.title}</h3>
                      <p className="text-sm text-[#61808A]">
                        {formatDate(activity.created_at)} 
                        {activity.metadata?.location && ` | ${activity.metadata.location}`}
                      </p>
                      <p className="text-sm text-[#61808A]">{activity.description}</p>
                      {activity.points_earned > 0 && (
                        <p className="text-sm font-medium text-green-600">+{activity.points_earned} points</p>
                      )}
                    </div>
                    
                    {/* Placeholder for activity image */}
                    <div className="w-32 h-24 bg-gradient-to-br from-[#12B5ED]/20 to-[#0ea5e1]/20 rounded-lg flex items-center justify-center ml-4">
                      <span className="text-2xl">{getActivityIcon(activity)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#121717] mb-3 px-4">Leaderboard</h2>
            
            <div className="flex overflow-hidden rounded-xl bg-white shadow-sm border p-4 mx-4">
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#121717]">
                    Your Rank: {userRank ? `${userRank.rank}${userRank.rank === 1 ? 'st' : userRank.rank === 2 ? 'nd' : userRank.rank === 3 ? 'rd' : 'th'}` : 'Unranked'}
                  </h3>
                  <p className="text-sm text-[#61808A]">
                    Out of {userRank?.total || 0} users in Mumbai
                  </p>
                </div>
                <Button 
                  asChild
                  className="bg-[#F0F2F5] text-[#121717] hover:bg-gray-200 text-sm h-8"
                >
                  <Link to="/leaderboard">View Full Leaderboard</Link>
                </Button>
              </div>
              
              {/* Leaderboard illustration */}
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-xl flex items-center justify-center ml-4">
                <span className="text-4xl">🏆</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
            <Button 
              asChild
              className="bg-[#F0F2F5] text-[#121717] hover:bg-gray-200 font-bold"
            >
              <Link to="/privacy">
                <Settings className="w-4 h-4 mr-2" />
                Privacy Settings
              </Link>
            </Button>
            
            <Button 
              onClick={signOut}
              className="bg-[#F0F2F5] text-[#121717] hover:bg-gray-200 font-bold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="border-t bg-gray-50 py-3">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-sm text-[#61808A]">
            Small acts, when multiplied by millions, can change the world.
          </p>
        </div>
      </div>
    </div>
  );
}
