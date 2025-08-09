import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { getDriveById, joinCleanupDrive, leaveCleanupDrive, isUserJoinedDrive } from '@/lib/database';
import { Drive } from '@/lib/database.types';
import { 
  MapPin, Calendar, Clock, Users, CheckCircle, Star, 
  Share2, Heart, MessageCircle, ArrowLeft, Shield,
  Target, Award, TreePine, Droplets, Loader2
} from 'lucide-react';

// Mock data for when database doesn't have the specific drive
const getMockDriveData = (id: string): Drive => {
  const drives = [
    {
      id: '1',
      title: 'Versova Beach Mega Cleanup',
      description: 'Join us for a large-scale beach cleanup initiative to remove plastic waste and restore the natural beauty of Versova Beach.',
      full_description: `The Versova Beach Mega Cleanup is a comprehensive environmental initiative aimed at transforming one of Mumbai's most beloved beaches. Over the years, Versova Beach has accumulated significant amounts of plastic waste, marine debris, and other pollutants that threaten marine life and the coastal ecosystem.

Our cleanup drive will focus on:
• Removing plastic bottles, bags, and microplastics from the shoreline
• Collecting fishing nets and marine debris washed ashore
• Sorting waste for proper recycling and disposal
• Educating beachgoers about marine conservation
• Planting native coastal vegetation to prevent erosion

This initiative is part of our ongoing commitment to restore Mumbai's coastline and create a sustainable environment for future generations. Join us in making a real difference!`,
      organizer_id: 'org1',
      organizer_name: 'Ocean Guardians NGO',
      organizer_type: 'NGO' as const,
      organizer_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      organizer_bio: 'Ocean Guardians NGO has been working towards marine conservation in Mumbai for over 8 years. We have successfully organized 150+ cleanup drives and removed over 50 tons of waste from Mumbai\'s beaches.',
      contact_email: 'contact@oceanguardians.org',
      contact_phone: '+91 98765 43210',
      location: 'Versova Beach, Andheri West',
      area: 'Andheri',
      date: '2024-02-15',
      time: '07:00',
      duration: '4 hours',
      max_volunteers: 200,
      registered_volunteers: 156,
      status: 'upcoming' as const,
      tags: ['Beach Cleanup', 'Plastic Waste', 'Marine Conservation', 'Education'],
      images: [
        'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=500&fit=crop',
      ],
      verified: true,
      requirements: [
        'Wear comfortable clothes and closed-toe shoes',
        'Bring a water bottle and hat for sun protection',
        'Minimum age: 12 years (minors must be accompanied by adults)',
        'Bring gloves if you have them (we will provide if needed)',
        'Come with enthusiasm and positive energy!',
      ],
      safety_measures: [
        'First aid station will be available on-site',
        'Safety briefing before starting the cleanup',
        'Protective gloves and tools will be provided',
        'Trained volunteers will supervise each area',
        'Emergency contact numbers will be shared',
      ],
      expected_impact: {
        wasteTarget: '500kg',
        areaSize: '2km coastline',
        beneficiaries: 10000,
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Mithi River Restoration Drive',
      description: 'Community-driven initiative to clean the Mithi River banks and plant native vegetation.',
      full_description: `The Mithi River Restoration Drive is a community-led initiative to restore the health of one of Mumbai's most important waterways. The Mithi River, which flows through the heart of Mumbai, has been severely affected by urbanization and pollution.

Our restoration efforts include:
• Removing plastic waste and debris from river banks
• Cleaning accumulated silt and garbage from the water
• Planting native vegetation to stabilize riverbanks
• Installing waste collection points for communities
• Educating local communities about river conservation

This drive is particularly important as the Mithi River plays a crucial role in Mumbai's monsoon drainage system. By restoring its health, we help prevent flooding and create a better environment for local communities.`,
      organizer_id: 'org2',
      organizer_name: 'Clean Mumbai Initiative',
      organizer_type: 'Community' as const,
      organizer_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b002?w=100&h=100&fit=crop&crop=face',
      organizer_bio: 'Clean Mumbai Initiative is a grassroots community organization dedicated to environmental restoration across Mumbai. We focus on water body conservation and community engagement.',
      contact_email: 'info@cleanmumbai.org',
      contact_phone: '+91 98765 43211',
      location: 'Mithi River, Kurla',
      area: 'Kurla',
      date: '2024-02-18',
      time: '08:30',
      duration: '3 hours',
      max_volunteers: 100,
      registered_volunteers: 67,
      status: 'upcoming' as const,
      tags: ['River Cleanup', 'Plantation', 'Water Conservation', 'Community'],
      images: [
        'https://images.unsplash.com/photo-1558618047-b2c4ea1f5c33?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&h=500&fit=crop',
      ],
      verified: true,
      requirements: [
        'Wear old clothes that can get dirty',
        'Bring work gloves and water bottle',
        'Suitable for ages 15 and above',
        'Closed footwear mandatory',
        'Enthusiasm for environmental work',
      ],
      safety_measures: [
        'Safety orientation before starting work',
        'First aid kit and trained personnel on-site',
        'Proper tools and safety equipment provided',
        'Clear safety guidelines for river work',
        'Emergency evacuation plan in place',
      ],
      expected_impact: {
        wasteTarget: '300kg',
        areaSize: '1km riverbank',
        beneficiaries: 5000,
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      title: 'Powai Lake Cleanup Marathon',
      description: 'Weekend cleanup marathon focusing on removing floating debris and educating visitors about lake conservation.',
      full_description: `The Powai Lake Cleanup Marathon is an intensive 6-hour environmental initiative designed to restore the beauty and ecological health of Powai Lake. This popular recreational spot has been affected by visitor waste and urban runoff, threatening its aquatic ecosystem.

Our marathon cleanup includes:
• Removing floating debris and plastic waste from the lake
• Cleaning the walking paths and recreational areas
• Installing educational signage about lake conservation
• Organizing awareness sessions for visitors
• Creating a waste management plan for long-term maintenance

Powai Lake is home to various bird species and aquatic life. By participating in this marathon, volunteers directly contribute to preserving this urban oasis and ensuring it remains a healthy environment for both wildlife and the community.`,
      organizer_id: 'org3',
      organizer_name: 'EcoWarriors Mumbai',
      organizer_type: 'NGO' as const,
      organizer_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      organizer_bio: 'EcoWarriors Mumbai is dedicated to urban lake and water body conservation. We specialize in large-scale cleanup operations and environmental education programs.',
      contact_email: 'contact@ecowarriorsmumbai.org',
      contact_phone: '+91 98765 43212',
      location: 'Powai Lake, Powai',
      area: 'Powai',
      date: '2024-02-20',
      time: '06:00',
      duration: '6 hours',
      max_volunteers: 150,
      registered_volunteers: 89,
      status: 'upcoming' as const,
      tags: ['Lake Cleanup', 'Education', 'Marathon', 'Awareness'],
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1611222625683-3fd7b4b67765?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop',
      ],
      verified: true,
      requirements: [
        'High energy levels for 6-hour marathon',
        'Comfortable outdoor clothing',
        'Personal water bottles and snacks',
        'Sun protection (hat, sunscreen)',
        'Minimum age: 16 years',
      ],
      safety_measures: [
        'Regular breaks and hydration reminders',
        'Medical team on standby',
        'Safety briefing every 2 hours',
        'Life jackets for water-edge work',
        'Emergency communication system',
      ],
      expected_impact: {
        wasteTarget: '400kg',
        areaSize: '3km lake perimeter',
        beneficiaries: 15000,
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  return drives.find(drive => drive.id === id) || drives[0];
};

export function DetailedDrive() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [driveDetails, setDriveDetails] = useState<Drive | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b002?w=50&h=50&fit=crop&crop=face',
      text: 'Super excited for this cleanup! Been waiting for a drive in this area. Count me in! 🌊',
      date: '2024-02-10',
      likes: 12,
    },
    {
      id: '2',
      author: 'Rahul Mehta',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      text: 'Great initiative! I participated in a cleanup last month and it was amazing. Looking forward to this one too.',
      date: '2024-02-09',
      likes: 8,
    },
  ]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadDriveDetails();
    }
  }, [id]);

  const loadDriveDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      // Try to get drive from database first
      let drive = await getDriveById(id);
      
      // If not found in database, use mock data
      if (!drive) {
        console.log('Drive not found in database, using mock data for ID:', id);
        drive = getMockDriveData(id);
      }

      setDriveDetails(drive);

      // Check if user has joined this drive
      if (user && drive) {
        const joined = await isUserJoinedDrive(drive.id, user.id);
        setIsJoined(joined);
      }

    } catch (error) {
      console.error('Error loading drive details:', error);
      // Fallback to mock data
      const mockDrive = getMockDriveData(id);
      setDriveDetails(mockDrive);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinDrive = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!driveDetails) return;

    setActionLoading(true);
    try {
      const success = await joinCleanupDrive(driveDetails.id, user.id);
      
      if (success) {
        setIsJoined(true);
        setDriveDetails(prev => prev ? ({
          ...prev,
          registered_volunteers: prev.registered_volunteers + 1
        }) : null);
        
        // Show success message
        alert('Successfully joined the cleanup drive! Check your profile for details.');
      } else {
        alert('Failed to join the drive. Please try again.');
      }
      
    } catch (error) {
      console.error('Error joining drive:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveDrive = async () => {
    if (!user || !driveDetails) return;

    setActionLoading(true);
    try {
      const success = await leaveCleanupDrive(driveDetails.id, user.id);
      
      if (success) {
        setIsJoined(false);
        setDriveDetails(prev => prev ? ({
          ...prev,
          registered_volunteers: Math.max(0, prev.registered_volunteers - 1)
        }) : null);
        
        alert('You have left the cleanup drive.');
      } else {
        alert('Failed to leave the drive. Please try again.');
      }
      
    } catch (error) {
      console.error('Error leaving drive:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      author: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You',
      avatar: user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
      text: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };
    
    setComments(prev => [newComment, ...prev]);
    setComment('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
            <p className="text-gray-600 font-medium">Loading drive details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!driveDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Drive Not Found</h2>
            <p className="text-gray-600">The cleanup drive you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/organize')} className="bg-blue-600 hover:bg-blue-700">
              Browse All Drives
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progressPercentage = (driveDetails.registered_volunteers / driveDetails.max_volunteers) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      
      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={() => navigate('/organize')}
            className="flex items-center space-x-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Drives</span>
          </Button>

          {/* Hero Section with Image Carousel */}
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative h-96">
              <img 
                src={driveDetails.images[currentImageIndex] || driveDetails.images[0] || 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=500&fit=crop'}
                alt={driveDetails.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Navigation Arrows */}
              {driveDetails.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? driveDetails.images.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white rounded-full p-3 hover:bg-white/30 transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === driveDetails.images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white rounded-full p-3 hover:bg-white/30 transition-colors"
                  >
                    →
                  </button>
                </>
              )}

              {/* Status Badge */}
              <div className="absolute top-6 left-6">
                <Badge className={`${
                  driveDetails.status === 'upcoming' ? 'bg-blue-500' :
                  driveDetails.status === 'ongoing' ? 'bg-green-500' : 'bg-gray-500'
                } text-white px-4 py-2 text-sm font-bold`}>
                  {driveDetails.status.charAt(0).toUpperCase() + driveDetails.status.slice(1)}
                </Badge>
              </div>

              {/* Verification Badge */}
              {driveDetails.verified && (
                <div className="absolute top-6 right-6">
                  <Badge className="bg-green-500 text-white px-4 py-2 text-sm font-bold flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Verified</span>
                  </Badge>
                </div>
              )}

              {/* Title Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h1 className="text-4xl font-bold mb-2">{driveDetails.title}</h1>
                <p className="text-lg opacity-90">{driveDetails.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Event Details */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Event Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-800">{driveDetails.location}</p>
                        <p className="text-sm text-gray-600">{driveDetails.area} Area</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-800">
                          {new Date(driveDetails.date).toLocaleDateString('en-US', { 
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{driveDetails.time} - {driveDetails.duration}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Registration Progress</span>
                      <span className="text-sm text-gray-600">
                        {driveDetails.registered_volunteers} / {driveDetails.max_volunteers} volunteers
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <p className="text-xs text-gray-500">
                      {driveDetails.max_volunteers - driveDetails.registered_volunteers} spots remaining
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {driveDetails.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* About This Drive */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle>About This Drive</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    {driveDetails.full_description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Expected Impact */}
              <Card className="bg-gradient-to-r from-green-100 to-blue-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Expected Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {driveDetails.expected_impact?.wasteTarget || 'TBD'}
                      </div>
                      <p className="text-sm text-gray-600">Waste Target</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {driveDetails.expected_impact?.areaSize || 'TBD'}
                      </div>
                      <p className="text-sm text-gray-600">Area Coverage</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {driveDetails.expected_impact?.beneficiaries?.toLocaleString() || 'TBD'}+
                      </div>
                      <p className="text-sm text-gray-600">People Benefited</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements & Safety */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">What to Bring</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {driveDetails.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Safety Measures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {driveDetails.safety_measures.map((measure, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{measure}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Comments Section */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Community Discussion</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Comment */}
                  {user && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Share your thoughts or ask questions about this drive..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                      />
                      <Button 
                        onClick={handleAddComment}
                        disabled={!comment.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Post Comment
                      </Button>
                    </div>
                  )}

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                        <img 
                          src={comment.avatar} 
                          alt={comment.author}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-800">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.date}</span>
                          </div>
                          <p className="text-gray-700 mb-2">{comment.text}</p>
                          <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500">
                            <Heart className="w-3 h-3" />
                            <span>{comment.likes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Join/Leave Button */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-24">
                <CardContent className="pt-6">
                  {isJoined ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <h3 className="font-bold text-green-800">You're Registered!</h3>
                        <p className="text-sm text-gray-600">Check your email for details</p>
                      </div>
                      <Button 
                        onClick={handleLeaveDrive}
                        disabled={actionLoading}
                        variant="outline"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      >
                        {actionLoading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                        ) : (
                          'Leave Drive'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button 
                        onClick={handleJoinDrive}
                        disabled={actionLoading || driveDetails.registered_volunteers >= driveDetails.max_volunteers}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        {actionLoading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Joining...</>
                        ) : (
                          'Join This Drive'
                        )}
                      </Button>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Free to join</span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{driveDetails.registered_volunteers} joined</span>
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Organizer Info */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Organizer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={driveDetails.organizer_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'} 
                      alt={driveDetails.organizer_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">{driveDetails.organizer_name}</h4>
                      <p className="text-sm text-gray-600">{driveDetails.organizer_type}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{driveDetails.organizer_bio}</p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Contact Organizer
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Share */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
                <CardContent className="pt-6">
                  <Button variant="outline" className="w-full flex items-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share This Drive</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
