import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Heart, MessageCircle, Share2, MapPin, Calendar, Users, Search, Filter } from 'lucide-react';

interface DrivePhoto {
  id: string;
  driveTitle: string;
  location: string;
  date: string;
  organizer: string;
  organizerAvatar: string;
  images: string[];
  description: string;
  likes: number;
  comments: number;
  volunteers: number;
  wasteCollected: string;
  tags: string[];
  isLiked: boolean;
}

// Mock data for demonstration
const mockPhotos: DrivePhoto[] = [
  {
    id: '1',
    driveTitle: 'Versova Beach Mega Cleanup',
    location: 'Versova Beach, Mumbai',
    date: '2024-01-20',
    organizer: 'Ocean Guardians NGO',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
    ],
    description: 'Amazing turnout today! 200+ volunteers came together to clean Versova Beach. We collected over 500kg of plastic waste and marine debris. The beach looks incredible now! 🌊🧹 #CleanMumbai #BeachCleanup',
    likes: 324,
    comments: 45,
    volunteers: 200,
    wasteCollected: '500kg',
    tags: ['Beach Cleanup', 'Plastic Waste', 'Marine Conservation'],
    isLiked: false,
  },
  {
    id: '2',
    driveTitle: 'Mithi River Restoration',
    location: 'Mithi River, Kurla',
    date: '2024-01-18',
    organizer: 'Clean Mumbai Initiative',
    organizerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b002?w=100&h=100&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1558618047-b2c4ea1f5c33?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&h=600&fit=crop',
    ],
    description: 'Mithi River cleanup was a huge success! Local communities joined hands with volunteers to remove debris and plant native vegetation along the banks. Together we can restore our rivers! 🌱💚',
    likes: 189,
    comments: 28,
    volunteers: 100,
    wasteCollected: '300kg',
    tags: ['River Cleanup', 'Plantation', 'Community'],
    isLiked: true,
  },
  {
    id: '3',
    driveTitle: 'Powai Lake Cleanup Marathon',
    location: 'Powai Lake, Mumbai',
    date: '2024-01-15',
    organizer: 'EcoWarriors Mumbai',
    organizerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611222625683-3fd7b4b67765?w=800&h=200&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502138330085-dead8a18d8e1?w=800&h=600&fit=crop',
    ],
    description: '6-hour cleanup marathon at Powai Lake! Removed floating debris, cleaned the walking paths, and educated visitors about lake conservation. The before & after photos speak for themselves! 🏞️✨',
    likes: 267,
    comments: 33,
    volunteers: 150,
    wasteCollected: '400kg',
    tags: ['Lake Cleanup', 'Education', 'Marathon'],
    isLiked: false,
  },
  {
    id: '4',
    driveTitle: 'Bandra Bandstand Coastal Care',
    location: 'Bandstand, Bandra',
    date: '2024-01-12',
    organizer: 'Coastal Care Collective',
    organizerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    ],
    description: 'Evening cleanup at the iconic Bandstand! Beautiful sunset and even more beautiful teamwork. Our monthly initiative continues to keep this popular spot pristine. 🌅🧹',
    likes: 156,
    comments: 19,
    volunteers: 80,
    wasteCollected: '150kg',
    tags: ['Coastal Cleanup', 'Evening Drive', 'Monthly'],
    isLiked: true,
  },
];

export default function DrivePhotos() {
  const [photos, setPhotos] = useState<DrivePhoto[]>(mockPhotos);
  const [filteredPhotos, setFilteredPhotos] = useState<DrivePhoto[]>(mockPhotos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedSort, photos]);

  const applyFilters = () => {
    let filtered = [...photos];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(photo =>
        photo.driveTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort filter
    switch (selectedSort) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'volunteers':
        filtered.sort((a, b) => b.volunteers - a.volunteers);
        break;
      case 'impact':
        filtered.sort((a, b) => parseFloat(b.wasteCollected) - parseFloat(a.wasteCollected));
        break;
    }

    setFilteredPhotos(filtered);
  };

  const toggleLike = (photoId: string) => {
    setPhotos(prev => prev.map(photo =>
      photo.id === photoId
        ? {
            ...photo,
            isLiked: !photo.isLiked,
            likes: photo.isLiked ? photo.likes - 1 : photo.likes + 1
          }
        : photo
    ));
  };

  const nextImage = (photoId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [photoId]: ((prev[photoId] || 0) + 1) % totalImages
    }));
  };

  const previousImage = (photoId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [photoId]: ((prev[photoId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="text-2xl">📸</span>
              <span className="text-sm font-medium text-gray-600">Community Stories</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Drive Photos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Celebrate the amazing work of our cleanup drives through photos and stories shared by organizers and volunteers.
            </p>
          </div>

          {/* Search and Sort */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search drives, locations, organizers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-2 border-gray-200 rounded-xl focus:border-blue-400"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Select value={selectedSort} onValueChange={setSelectedSort}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">🕒 Most Recent</SelectItem>
                      <SelectItem value="popular">❤️ Most Popular</SelectItem>
                      <SelectItem value="volunteers">👥 Most Volunteers</SelectItem>
                      <SelectItem value="impact">🌟 Highest Impact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {filteredPhotos.length} drive stories found
              </div>
            </div>
          </div>

          {/* Photo Feed */}
          <div className="space-y-8">
            {filteredPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={photo.organizerAvatar}
                        alt={photo.organizer}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-800">{photo.organizer}</h3>
                        <p className="text-sm text-gray-600">{photo.driveTitle}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                  </div>
                </div>

                {/* Image Carousel */}
                <div className="relative">
                  <img
                    src={photo.images[currentImageIndex[photo.id] || 0]}
                    alt={photo.driveTitle}
                    className="w-full h-96 object-cover"
                  />
                  
                  {photo.images.length > 1 && (
                    <>
                      <button
                        onClick={() => previousImage(photo.id, photo.images.length)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => nextImage(photo.id, photo.images.length)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                      >
                        →
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {photo.images.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === (currentImageIndex[photo.id] || 0)
                                ? 'bg-white'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="p-6 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => toggleLike(photo.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          photo.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-6 h-6 ${photo.isLiked ? 'fill-current' : ''}`} />
                        <span>{photo.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-6 h-6" />
                        <span>{photo.comments}</span>
                      </button>
                      <button className="text-gray-600 hover:text-green-500 transition-colors">
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-blue-600">
                        <Users className="w-4 h-4" />
                        <span className="font-bold">{photo.volunteers}</span>
                      </div>
                      <p className="text-xs text-gray-600">Volunteers</p>
                    </div>
                    <div className="text-center">
                      <div className="text-green-600 font-bold">{photo.wasteCollected}</div>
                      <p className="text-xs text-gray-600">Waste Collected</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-purple-600">
                        <MapPin className="w-4 h-4" />
                        <span className="font-bold text-sm">{photo.location.split(',')[0]}</span>
                      </div>
                      <p className="text-xs text-gray-600">Location</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <p className="text-gray-800">{photo.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {photo.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(photo.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{photo.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredPhotos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No drive photos found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or check back later for new stories!
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/organize">Join a Cleanup Drive</Link>
              </Button>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Share Your Drive Story! 📸</h2>
            <p className="text-lg mb-6 opacity-90">
              Organized a cleanup drive? Share your photos and inspire others to take action!
            </p>
            <Button 
              asChild
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Link to="/organize-drive">Organize Your Drive</Link>
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
