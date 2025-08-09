import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getProfile, updateProfile, uploadPhoto, createProfile } from '@/lib/database';
import { Profile } from '@/lib/database.types';
import { Upload, X, User, Save, ArrowLeft } from 'lucide-react';

export function EditProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    location: 'Mumbai',
    avatar_url: ''
  });
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      let userProfile = await getProfile(user.id);
      
      // If profile doesn't exist, create one
      if (!userProfile) {
        userProfile = await createProfile({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          location: 'Mumbai'
        });
      }
      
      if (userProfile) {
        setProfile(userProfile);
        setFormData({
          full_name: userProfile.full_name || '',
          location: userProfile.location || 'Mumbai',
          avatar_url: userProfile.avatar_url || ''
        });
        setAvatarPreview(userProfile.avatar_url || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error Loading Profile",
        description: "Unable to load your profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setNewAvatar(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const removeAvatar = () => {
    setNewAvatar(null);
    setAvatarPreview('');
    setFormData(prev => ({ ...prev, avatar_url: '' }));
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "User data not available.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.full_name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      let avatarUrl = formData.avatar_url;

      // Upload new avatar if selected
      if (newAvatar) {
        setUploadingAvatar(true);
        const uploadedUrl = await uploadPhoto(newAvatar, 'avatars', `avatar-${user.id}`);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          throw new Error('Failed to upload avatar');
        }
        setUploadingAvatar(false);
      }

      // Update profile
      const updatedProfile = await updateProfile(user.id, {
        full_name: formData.full_name.trim(),
        location: formData.location,
        avatar_url: avatarUrl || null
      });

      if (updatedProfile) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        navigate('/profile');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
      setUploadingAvatar(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-[#121717] mb-4">Please Log In</h1>
          <p className="text-[#61808A] mb-6">You need to be logged in to edit your profile.</p>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#12B5ED]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            asChild 
            variant="ghost" 
            size="sm"
            className="p-2"
          >
            <Link to="/profile">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-[#121717]">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-[#121717] mb-4">Profile Picture</h2>
            
            <div className="flex items-center gap-6">
              {/* Avatar Display */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#12B5ED] to-[#0ea5e1] flex items-center justify-center">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="w-full justify-start"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingAvatar ? 'Uploading...' : 'Choose Photo'}
                  </Button>
                  
                  <p className="text-sm text-[#61808A]">
                    Upload a profile picture (JPG, PNG, WebP - Max 5MB)
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-[#121717] mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-[#121717]">
                  Email Address
                </Label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full h-12 px-4 bg-gray-100 rounded-xl border-0 outline-none text-[#61808A] cursor-not-allowed"
                  />
                  <p className="text-xs text-[#61808A] mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="full_name" className="text-sm font-medium text-[#121717]">
                  Full Name *
                </Label>
                <div className="mt-1">
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full h-12 px-4 bg-[#F0F2F5] rounded-xl border-0 outline-none text-[#121717] placeholder-[#638087] focus:ring-2 focus:ring-[#12B5ED]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium text-[#121717]">
                  Location
                </Label>
                <div className="mt-1">
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-[#F0F2F5] rounded-xl border-0 outline-none text-[#121717] focus:ring-2 focus:ring-[#12B5ED]"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Navi Mumbai">Navi Mumbai</option>
                    <option value="Thane">Thane</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Account Statistics (Read-only) */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold text-[#121717] mb-4">Account Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-[#F0F2F5] rounded-lg">
                <div className="text-xl font-bold text-[#121717]">{profile?.impact_score || 0}</div>
                <div className="text-sm text-[#61808A]">Impact Score</div>
              </div>
              <div className="text-center p-4 bg-[#F0F2F5] rounded-lg">
                <div className="text-xl font-bold text-[#121717]">{profile?.reports_submitted || 0}</div>
                <div className="text-sm text-[#61808A]">Reports</div>
              </div>
              <div className="text-center p-4 bg-[#F0F2F5] rounded-lg">
                <div className="text-xl font-bold text-[#121717]">{profile?.cleanup_drives_joined || 0}</div>
                <div className="text-sm text-[#61808A]">Cleanups</div>
              </div>
              <div className="text-center p-4 bg-[#F0F2F5] rounded-lg">
                <div className="text-xl font-bold text-[#121717]">{profile?.volunteer_hours || 0}</div>
                <div className="text-sm text-[#61808A]">Hours</div>
              </div>
            </div>
            
            <p className="text-sm text-[#61808A] mt-4 text-center">
              These statistics are automatically updated based on your activities.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              type="button"
              variant="secondary"
              onClick={() => navigate('/profile')}
              className="bg-[#F0F2F5] hover:bg-gray-200 text-[#121717] font-bold px-6"
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              disabled={saving || uploadingAvatar}
              className="bg-[#12B5ED] hover:bg-[#0ea5e1] text-white font-bold px-6 min-w-28"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
