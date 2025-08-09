import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/database.types';

interface LeaderboardEntry extends Profile {
  position: number;
  badge: string;
  level: number;
  nextLevelPoints: number;
  streak: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export function Leaderboard() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all-time');
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    fetchLeaderboardData();
    loadAchievements();
  }, [selectedTimeRange]);

  const loadAchievements = () => {
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Report',
        description: 'Submit your first pollution report',
        icon: '📋',
        unlocked: true,
      },
      {
        id: '2',
        title: 'Cleanup Champion',
        description: 'Join 5 cleanup drives',
        icon: '🧹',
        unlocked: false,
        progress: 3,
        maxProgress: 5,
      },
      {
        id: '3',
        title: 'Environmental Hero',
        description: 'Reach 1000 impact score',
        icon: '🦸‍♂️',
        unlocked: false,
        progress: 750,
        maxProgress: 1000,
      },
      {
        id: '4',
        title: 'Team Player',
        description: 'Collaborate with 10 NGOs',
        icon: '🤝',
        unlocked: true,
      },
    ];
    setAchievements(mockAchievements);
  };

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);

      const { data: topContributors, error: topError } = await supabase
        .from('profiles')
        .select('*')
        .order('impact_score', { ascending: false })
        .limit(20);

      if (topError) {
        console.error('Error fetching leaderboard:', topError);
        return;
      }

      const rankedData: LeaderboardEntry[] = (topContributors || []).map((profile, index) => ({
        ...profile,
        position: index + 1,
        badge: getBadge(index + 1),
        level: Math.floor(profile.impact_score / 100) + 1,
        nextLevelPoints: ((Math.floor(profile.impact_score / 100) + 1) * 100) - profile.impact_score,
        streak: Math.floor(Math.random() * 30) + 1, // Mock streak data
      }));

      setLeaderboardData(rankedData);

      if (user) {
        const userEntry = rankedData.find(entry => entry.id === user.id);
        if (userEntry) {
          setUserRank(userEntry);
        } else {
          const { data: userProfile, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!userError && userProfile) {
            const { count, error: countError } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .gt('impact_score', userProfile.impact_score);

            if (!countError) {
              setUserRank({
                ...userProfile,
                position: (count || 0) + 1,
                badge: getBadge((count || 0) + 1),
                level: Math.floor(userProfile.impact_score / 100) + 1,
                nextLevelPoints: ((Math.floor(userProfile.impact_score / 100) + 1) * 100) - userProfile.impact_score,
                streak: Math.floor(Math.random() * 30) + 1,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchLeaderboardData:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadge = (position: number): string => {
    if (position === 1) return '👑';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    if (position <= 10) return '⭐';
    if (position <= 50) return '🌟';
    return '💫';
  };

  const getRankColor = (position: number): string => {
    if (position === 1) return 'from-yellow-400 to-yellow-600';
    if (position === 2) return 'from-gray-300 to-gray-500';
    if (position === 3) return 'from-orange-400 to-orange-600';
    if (position <= 10) return 'from-blue-400 to-blue-600';
    return 'from-gray-100 to-gray-300';
  };

  const getProgressColor = (level: number): string => {
    if (level >= 20) return 'bg-purple-500';
    if (level >= 15) return 'bg-red-500';
    if (level >= 10) return 'bg-orange-500';
    if (level >= 5) return 'bg-blue-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-600 font-medium">Loading leaderboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />

      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 py-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">🏆</span>
              <span className="text-sm font-medium text-gray-600">Community Champions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-blue-600 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Compete with eco-warriors across Mumbai and climb the ranks by making a real impact!
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Time Period:</span>
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-40 h-10 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">🕰️ All Time</SelectItem>
                    <SelectItem value="this-month">📅 This Month</SelectItem>
                    <SelectItem value="this-week">⚡ This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* User Stats Dashboard */}
          {userRank && (
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <div className="flex items-center space-x-2 justify-center md:justify-start mb-2">
                    <span className="text-3xl">{userRank.badge}</span>
                    <div>
                      <h3 className="text-xl font-bold">Your Rank: #{userRank.position}</h3>
                      <p className="text-blue-100">Level {userRank.level} Champion</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>💯 {userRank.impact_score} points</span>
                    <span>🔥 {userRank.streak} day streak</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-blue-100 mb-2">Progress to Level {userRank.level + 1}</p>
                  <div className="w-48 bg-white/20 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((100 - userRank.nextLevelPoints) / 100) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-100 mt-1">{userRank.nextLevelPoints} points to next level</p>
                </div>
              </div>
            </div>
          )}


          {/* Achievements Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">🏅</span>
              Your Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${achievement.unlocked
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-300 shadow-green-200 shadow-lg'
                    : 'bg-gray-50 border-gray-200'
                    }`}
                >
                  <div className="text-center space-y-2">
                    <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <h3 className={`font-bold text-sm ${achievement.unlocked ? 'text-green-800' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-xs ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div className="space-y-1">
                        <Progress
                          value={(achievement.progress! / achievement.maxProgress!) * 100}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500">
                          {achievement.progress}/{achievement.maxProgress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              🏆 Champions Podium
            </h2>
            <div className="flex items-end justify-center space-x-4 md:space-x-8">
              {/* 2nd Place */}
              {leaderboardData[1] && (
                <div className="text-center">
                  <div className="bg-gradient-to-t from-gray-300 to-gray-100 rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      2
                    </div>
                    <h3 className="font-bold text-gray-800">{leaderboardData[1].full_name || 'Anonymous'}</h3>
                    <p className="text-gray-600 text-sm">Level {leaderboardData[1].level}</p>
                    <p className="text-lg font-bold text-gray-700">{leaderboardData[1].impact_score}</p>
                  </div>
                  <div className="mt-4 text-4xl">🥈</div>
                </div>
              )}

              {/* 1st Place */}
              {leaderboardData[0] && (
                <div className="text-center">
                  <div className="bg-gradient-to-t from-yellow-300 to-yellow-100 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                      1
                    </div>
                    <h3 className="font-bold text-yellow-800 text-lg">{leaderboardData[0].full_name || 'Anonymous'}</h3>
                    <p className="text-yellow-700">Level {leaderboardData[0].level} Legend</p>
                    <p className="text-2xl font-bold text-yellow-700">{leaderboardData[0].impact_score}</p>
                  </div>
                  <div className="mt-4 text-5xl animate-bounce">👑</div>
                </div>
              )}

              {/* 3rd Place */}
              {leaderboardData[2] && (
                <div className="text-center">
                  <div className="bg-gradient-to-t from-orange-300 to-orange-100 rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      3
                    </div>
                    <h3 className="font-bold text-orange-800">{leaderboardData[2].full_name || 'Anonymous'}</h3>
                    <p className="text-orange-600 text-sm">Level {leaderboardData[2].level}</p>
                    <p className="text-lg font-bold text-orange-700">{leaderboardData[2].impact_score}</p>
                  </div>
                  <div className="mt-4 text-4xl">🥉</div>
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Full Rankings
            </h2>
            <div className="space-y-3">
              {leaderboardData.slice(0).map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getRankColor(user.position)} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                      #{user.position}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{user.full_name || 'Anonymous User'}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span>Level {user.level}</span>
                        <span>•</span>
                        <span>🔥 {user.streak}d streak</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{user.impact_score}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📋 {user.reports_submitted}</span>
                      <span>🧹 {user.cleanup_drives_joined}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">🚀 Ready to Climb Higher?</h2>
            <p className="text-lg mb-6 opacity-90">
              Take action today and boost your impact score! Every report and cleanup drive counts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/report">📋 Report Pollution</Link>
              </Button>
              <Button
                asChild
                className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold px-8 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/organize">🧹 Join Cleanup Drive</Link>
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              ✨ Impact scores update daily based on verified activities
            </p>
          </div>


        </div>
      </main>

      <Footer />
    </div>
  );
}
