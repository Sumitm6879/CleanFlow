import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, MapPin, Users, Clock, Search, Filter, Plus, Loader2 } from 'lucide-react';
import { getDrives } from '@/lib/database';
import { Drive } from '@/lib/database.types';

// Interface for display drives that includes computed image field
interface CleanupDriveDisplay extends Drive {
  image: string; // Computed from images array
}

// Mock data for demonstration - using proper type
interface CleanupDrive {
  id: string;
  title: string;
  description: string;
  organizer_name: string;
  organizer_type: string;
  location: string;
  area: string;
  date: string;
  time: string;
  duration: string;
  max_volunteers: number;
  registered_volunteers: number;
  status: string;
  tags: string[];
  image: string;
  verified: boolean;
}

const mockDrives: CleanupDrive[] = [
  {
    id: '1',
    title: 'Versova Beach Mega Cleanup',
    description: 'Join us for a large-scale beach cleanup initiative to remove plastic waste and restore the natural beauty of Versova Beach.',
    organizer_name: 'Ocean Guardians NGO',
    organizer_type: 'NGO',
    location: 'Versova Beach, Andheri West',
    area: 'Andheri',
    date: '2024-02-15',
    time: '07:00',
    duration: '4 hours',
    max_volunteers: 200,
    registered_volunteers: 156,
    status: 'upcoming',
    tags: ['Beach Cleanup', 'Plastic Waste', 'Marine Conservation'],
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop',
    verified: true,
  },
  {
    id: '2',
    title: 'Mithi River Restoration Drive',
    description: 'Community-driven initiative to clean the Mithi River banks and plant native vegetation.',
    organizer_name: 'Clean Mumbai Initiative',
    organizer_type: 'Community',
    location: 'Mithi River, Kurla',
    area: 'Kurla',
    date: '2024-02-18',
    time: '08:30',
    duration: '3 hours',
    max_volunteers: 100,
    registered_volunteers: 67,
    status: 'upcoming',
    tags: ['River Cleanup', 'Plantation', 'Water Conservation'],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
    verified: true,
  },
  {
    id: '3',
    title: 'Powai Lake Cleanup Marathon',
    description: 'Weekend cleanup marathon focusing on removing floating debris and educating visitors about lake conservation.',
    organizer_name: 'EcoWarriors Mumbai',
    organizer_type: 'NGO',
    location: 'Powai Lake, Powai',
    area: 'Powai',
    date: '2024-02-20',
    time: '06:00',
    duration: '6 hours',
    max_volunteers: 150,
    registered_volunteers: 89,
    status: 'upcoming',
    tags: ['Lake Cleanup', 'Education', 'Awareness'],
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
    verified: true,
  },
  {
    id: '4',
    title: 'Bandra Bandstand Coastal Care',
    description: 'Regular monthly cleanup of the popular Bandstand promenade and surrounding coastal area.',
    organizer_name: 'Coastal Care Collective',
    organizer_type: 'Community',
    location: 'Bandstand Promenade, Bandra',
    area: 'Bandra',
    date: '2024-02-22',
    time: '17:00',
    duration: '2 hours',
    max_volunteers: 80,
    registered_volunteers: 43,
    status: 'upcoming',
    tags: ['Coastal Cleanup', 'Evening Drive', 'Regular'],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
    verified: false,
  },
  {
    id: '5',
    title: 'Mahim Creek Revival Project',
    description: 'Intensive cleanup and revival project for Mahim Creek with focus on removing industrial waste.',
    organizer_name: 'Mumbai Environmental Society',
    organizer_type: 'NGO',
    location: 'Mahim Creek, Mahim',
    area: 'Mahim',
    date: '2024-02-25',
    time: '09:00',
    duration: '5 hours',
    max_volunteers: 120,
    registered_volunteers: 95,
    status: 'upcoming',
    tags: ['Creek Cleanup', 'Industrial Waste', 'Revival'],
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=400&fit=crop',
    verified: true,
  },
];

export default function CleanupDrives() {
  const [drives, setDrives] = useState<CleanupDriveDisplay[]>([]);
  const [filteredDrives, setFilteredDrives] = useState<CleanupDriveDisplay[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedOrganizerType, setSelectedOrganizerType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('upcoming');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrives();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedArea, selectedOrganizerType, selectedStatus, drives]);

  const loadDrives = async () => {
    try {
      setLoading(true);

      // Get drives from database
      const dbDrives = await getDrives();

      // Convert to display format with fallback mock data
      const driveDisplays: CleanupDriveDisplay[] = dbDrives.length > 0
        ? dbDrives.map(drive => ({
            ...drive,
            image: drive.images?.[0] || getDefaultImage(drive.area),
          }))
        : mockDrives.map(drive => ({
            ...drive,
            verified: drive.verified || false,
            organizer_avatar: null,
            organizer_bio: null,
            contact_email: '',
            contact_phone: null,
            full_description: drive.description,
            organizer_id: '',
            latitude: null,
            longitude: null,
            images: [drive.image],
            requirements: [],
            safety_measures: [],
            expected_impact: {},
            created_at: '',
            updated_at: ''
          } as CleanupDriveDisplay)); // Fallback to mock data if no drives in database

      setDrives(driveDisplays);
      console.log('Loaded drives:', driveDisplays.length);

    } catch (error) {
      console.error('Error loading drives:', error);
      // Fallback to mock data on error
      setDrives(mockDrives);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImage = (area: string): string => {
    const defaultImages: Record<string, string> = {
      'Andheri': 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop',
      'Kurla': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
      'Powai': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      'Bandra': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
      'Mahim': 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=400&fit=crop',
    };
    return defaultImages[area] || 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop';
  };

  const applyFilters = () => {
    let filtered = drives;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(drive =>
        drive.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.organizer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drive.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Area filter
    if (selectedArea !== 'all') {
      filtered = filtered.filter(drive => drive.area === selectedArea);
    }

    // Organizer type filter
    if (selectedOrganizerType !== 'all') {
      filtered = filtered.filter(drive => drive.organizer_type === selectedOrganizerType);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(drive => drive.status === selectedStatus);
    }

    setFilteredDrives(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrganizerTypeIcon = (type: string) => {
    switch (type) {
      case 'NGO': return '🏢';
      case 'Community': return '👥';
      case 'Individual': return '👤';
      default: return '📋';
    }
  };

  const areas = [...new Set(drives.map(drive => drive.area))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
            <p className="text-gray-600 font-medium">Loading cleanup drives...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">🧹</span>
              <span className="text-sm font-medium text-gray-600">Mumbai Cleanup Drives</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Join the Movement
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover cleanup drives happening across Mumbai. Join existing drives or organize your own to make a real impact on our city's environment.
            </p>
            
            {/* Organize Drive Button */}
            <Button 
              asChild
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link to="/organize-drive">
                <Plus className="w-5 h-5 mr-2" />
                Organize a Drive
              </Link>
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search drives by title, organizer, location, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-400"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </Button>
                <span className="text-sm text-gray-600">
                  {filteredDrives.length} drives found
                </span>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Areas</SelectItem>
                        {areas.map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organizer Type</label>
                    <Select value={selectedOrganizerType} onValueChange={setSelectedOrganizerType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="NGO">🏢 NGO</SelectItem>
                        <SelectItem value="Community">👥 Community</SelectItem>
                        <SelectItem value="Individual">👤 Individual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="upcoming">📅 Upcoming</SelectItem>
                        <SelectItem value="ongoing">⏳ Ongoing</SelectItem>
                        <SelectItem value="completed">✅ Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Drives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrives.map((drive) => (
              <Card key={drive.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm">
                <div className="relative">
                  <img 
                    src={drive.image} 
                    alt={drive.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <Badge className={getStatusColor(drive.status)}>
                      {drive.status}
                    </Badge>
                    {drive.verified && (
                      <Badge className="bg-green-100 text-green-800">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="text-2xl">{getOrganizerTypeIcon(drive.organizer_type)}</span>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">
                    {drive.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {drive.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium text-gray-800 mr-2">By:</span>
                      <div className="flex items-center space-x-2">
                        {drive.organizer_avatar ? (
                          <img
                            src={drive.organizer_avatar}
                            alt={drive.organizer_name}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold ${drive.organizer_avatar ? 'hidden' : ''}`}
                        >
                          {drive.organizer_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span>{drive.organizer_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {drive.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(drive.date).toLocaleDateString()} at {drive.time}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {drive.duration}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {drive.registered_volunteers}/{drive.max_volunteers} volunteers
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(drive.registered_volunteers / drive.max_volunteers) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {drive.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {drive.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{drive.tags.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <Button 
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Link to={`/drive/${drive.id}`}>
                      View Details & Register
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredDrives.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No drives found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters, or organize your own drive!
              </p>
              <Button 
                asChild
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Link to="/organize-drive">
                  <Plus className="w-4 h-4 mr-2" />
                  Organize a Drive
                </Link>
              </Button>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-6">Community Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold">75+</div>
                <div className="text-blue-100">Drives Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold">2,500+</div>
                <div className="text-blue-100">Volunteers Engaged</div>
              </div>
              <div>
                <div className="text-3xl font-bold">15,000kg</div>
                <div className="text-blue-100">Waste Collected</div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
