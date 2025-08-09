import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Calendar, MapPin, Users, Info, Loader2, Map, Upload, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createDrive, uploadDriveImages } from '@/lib/database';

interface FormData {
  title: string;
  description: string;
  fullDescription: string;
  organizerName: string;
  organizerType: 'NGO' | 'Community' | 'Individual' | '';
  contactEmail: string;
  contactPhone: string;
  location: string;
  area: string;
  latitude: number | null;
  longitude: number | null;
  date: string;
  time: string;
  duration: string;
  maxVolunteers: string;
  tags: string;
  requirements: string;
  safetyMeasures: string;
  expectedImpact: string;
  isVerified: boolean;
  agreeToTerms: boolean;
}



const initialFormData: FormData = {
  title: '',
  description: '',
  fullDescription: '',
  organizerName: '',
  organizerType: '',
  contactEmail: '',
  contactPhone: '',
  location: '',
  area: '',
  latitude: null,
  longitude: null,
  date: '',
  time: '',
  duration: '',
  maxVolunteers: '',
  tags: '',
  requirements: '',
  safetyMeasures: '',
  expectedImpact: '',
  isVerified: false,
  agreeToTerms: false,
};



const areas = [
  'Andheri', 'Bandra', 'Borivali', 'Dadar', 'Ghatkopar', 'Juhu', 'Kurla', 
  'Mahim', 'Malad', 'Marine Drive', 'Mulund', 'Powai', 'Santa Cruz', 
  'Thane', 'Versova', 'Vikhroli', 'Worli', 'Other'
];

const commonTags = [
  'Beach Cleanup', 'River Cleanup', 'Lake Cleanup', 'Park Cleanup',
  'Plastic Waste', 'Marine Conservation', 'Water Conservation',
  'Community Event', 'Educational', 'Tree Plantation', 'Awareness Campaign'
];

export default function OrganizeDrive() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleInputChange = (field: keyof FormData, value: string | boolean | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCoordinateInput = (field: 'latitude' | 'longitude', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData(prev => ({ ...prev, [field]: numValue }));
    } else if (value === '') {
      setFormData(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.fullDescription.trim()) newErrors.fullDescription = 'Full description is required';
    if (!formData.organizerName.trim()) newErrors.organizerName = 'Organizer name is required';
    if (!formData.organizerType) newErrors.organizerType = 'Organizer type is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.area) newErrors.area = 'Area is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.maxVolunteers.trim()) newErrors.maxVolunteers = 'Max volunteers is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';

    // Email validation
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.contactPhone && !/^[\d\s\-\+\(\)]+$/.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }

    // Date validation (must be in the future)
    if (formData.date && new Date(formData.date) <= new Date()) {
      newErrors.date = 'Event date must be in the future';
    }

    // Max volunteers validation
    if (formData.maxVolunteers && (isNaN(Number(formData.maxVolunteers)) || Number(formData.maxVolunteers) < 1)) {
      newErrors.maxVolunteers = 'Max volunteers must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user) {
      alert('Please log in to organize a drive');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse tags and requirements
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const requirementsArray = formData.requirements.split('\n').map(req => req.trim()).filter(Boolean);
      const safetyMeasuresArray = formData.safetyMeasures.split('\n').map(measure => measure.trim()).filter(Boolean);

      // Parse expected impact
      let expectedImpact = {};
      try {
        if (formData.expectedImpact.trim()) {
          expectedImpact = JSON.parse(formData.expectedImpact);
        }
      } catch {
        // If not valid JSON, create a simple object
        expectedImpact = { description: formData.expectedImpact };
      }

      // Create drive object for database
      const driveData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        full_description: formData.fullDescription.trim(),
        organizer_id: user.id,
        organizer_name: formData.organizerName.trim(),
        organizer_type: formData.organizerType as 'NGO' | 'Community' | 'Individual',
        organizer_avatar: profile?.avatar_url || null,
        organizer_bio: `Contact: ${formData.contactEmail}` + (formData.contactPhone ? ` | ${formData.contactPhone}` : ''),
        contact_email: formData.contactEmail.trim(),
        contact_phone: formData.contactPhone.trim() || null,
        location: formData.location.trim(),
        area: formData.area,
        latitude: formData.latitude,
        longitude: formData.longitude,
        date: formData.date,
        time: formData.time,
        duration: formData.duration.trim(),
        max_volunteers: parseInt(formData.maxVolunteers, 10),
        tags: tagsArray,
        images: [], // Will be updated after image upload
        requirements: requirementsArray,
        safety_measures: safetyMeasuresArray,
        expected_impact: expectedImpact,
      };

      console.log('Creating drive:', driveData);

      // Upload images first if any selected
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        console.log('Uploading', selectedImages.length, 'images...');
        imageUrls = await uploadDriveImages(selectedImages);
        console.log('Uploaded images:', imageUrls);
      }

      // Update drive data with uploaded image URLs
      const finalDriveData = {
        ...driveData,
        images: imageUrls
      };

      // Submit to Supabase
      const createdDrive = await createDrive(finalDriveData);

      if (createdDrive) {
        alert('Cleanup drive created successfully! It is now visible to volunteers.');
        navigate('/organize');
      } else {
        alert('Failed to create drive. Please try again.');
      }

    } catch (error) {
      console.error('Error submitting drive:', error);
      alert('An error occurred while creating the drive. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />
      
      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-20 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/organize')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Drives</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Organize a Cleanup Drive</h1>
              <p className="text-gray-600">Create a new cleanup drive and rally volunteers for environmental action</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Information */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Versova Beach Mega Cleanup"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Short Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description for the drive listing (1-2 sentences)"
                      rows={2}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="fullDescription">Full Description *</Label>
                    <Textarea
                      id="fullDescription"
                      value={formData.fullDescription}
                      onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                      placeholder="Detailed description including goals, activities, importance, and what volunteers can expect..."
                      rows={6}
                      className={errors.fullDescription ? 'border-red-500' : ''}
                    />
                    {errors.fullDescription && <p className="text-red-500 text-sm mt-1">{errors.fullDescription}</p>}
                  </div>

                  <div>
                    <Label htmlFor="organizerName">Organizer Name *</Label>
                    <Input
                      id="organizerName"
                      value={formData.organizerName}
                      onChange={(e) => handleInputChange('organizerName', e.target.value)}
                      placeholder="Your name or organization name"
                      className={errors.organizerName ? 'border-red-500' : ''}
                    />
                    {errors.organizerName && <p className="text-red-500 text-sm mt-1">{errors.organizerName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="organizerType">Organizer Type *</Label>
                    <Select value={formData.organizerType} onValueChange={(value) => handleInputChange('organizerType', value)}>
                      <SelectTrigger className={errors.organizerType ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select organizer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGO">�� NGO/Organization</SelectItem>
                        <SelectItem value="Community">👥 Community Group</SelectItem>
                        <SelectItem value="Individual">👤 Individual</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.organizerType && <p className="text-red-500 text-sm mt-1">{errors.organizerType}</p>}
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="contact@example.com"
                      className={errors.contactEmail ? 'border-red-500' : ''}
                    />
                    {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="+91 9876543210"
                      className={errors.contactPhone ? 'border-red-500' : ''}
                    />
                    {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Time */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location & Timing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="location">Specific Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Versova Beach, near fishing village"
                      className={errors.location ? 'border-red-500' : ''}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <Label htmlFor="area">Area/District *</Label>
                    <Select value={formData.area} onValueChange={(value) => handleInputChange('area', value)}>
                      <SelectTrigger className={errors.area ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map(area => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                  </div>

                  {/* GPS Coordinates Section */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label>GPS Coordinates (Optional)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMap(!showMap)}
                        className="flex items-center space-x-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{showMap ? 'Hide Coordinates' : 'Add Coordinates'}</span>
                      </Button>
                    </div>

                    {showMap && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <div>
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="any"
                            value={formData.latitude || ''}
                            onChange={(e) => handleCoordinateInput('latitude', e.target.value)}
                            placeholder="e.g., 19.1136"
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">Mumbai range: 18.8 to 19.3</p>
                        </div>
                        <div>
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="any"
                            value={formData.longitude || ''}
                            onChange={(e) => handleCoordinateInput('longitude', e.target.value)}
                            placeholder="e.g., 72.7973"
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">Mumbai range: 72.7 to 73.0</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-blue-600">
                            💡 Tip: You can find coordinates by searching your location on Google Maps and right-clicking on the exact spot.
                          </p>
                        </div>
                      </div>
                    )}

                    {formData.latitude && formData.longitude && (
                      <p className="text-sm text-gray-600 mt-2">
                        📍 Coordinates set: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="date">Event Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={errors.date ? 'border-red-500' : ''}
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                  </div>

                  <div>
                    <Label htmlFor="time">Start Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className={errors.time ? 'border-red-500' : ''}
                    />
                    {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="e.g., 3 hours"
                      className={errors.duration ? 'border-red-500' : ''}
                    />
                    {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Event Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="maxVolunteers">Maximum Volunteers *</Label>
                    <Input
                      id="maxVolunteers"
                      type="number"
                      value={formData.maxVolunteers}
                      onChange={(e) => handleInputChange('maxVolunteers', e.target.value)}
                      placeholder="e.g., 100"
                      min="1"
                      className={errors.maxVolunteers ? 'border-red-500' : ''}
                    />
                    {errors.maxVolunteers && <p className="text-red-500 text-sm mt-1">{errors.maxVolunteers}</p>}
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="e.g., Beach Cleanup, Plastic Waste, Marine Conservation"
                    />
                    <div className="mt-2 flex flex-wrap gap-1">
                      {commonTags.slice(0, 6).map(tag => (
                        <Button
                          key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            const currentTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
                            if (!currentTags.includes(tag)) {
                              handleInputChange('tags', [...currentTags, tag].join(', '));
                            }
                          }}
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="requirements">Requirements for Volunteers</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                      placeholder="What should volunteers bring? Any age restrictions? Physical requirements?"
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="safetyMeasures">Safety Measures</Label>
                    <Textarea
                      id="safetyMeasures"
                      value={formData.safetyMeasures}
                      onChange={(e) => handleInputChange('safetyMeasures', e.target.value)}
                      placeholder="What safety measures will be in place? First aid, protective equipment, etc."
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="expectedImpact">Expected Impact</Label>
                    <Textarea
                      id="expectedImpact"
                      value={formData.expectedImpact}
                      onChange={(e) => handleInputChange('expectedImpact', e.target.value)}
                      placeholder='Expected waste collection, area coverage, beneficiaries (e.g., {"wasteTarget": "500kg", "areaSize": "2km", "beneficiaries": 10000})'
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional: You can provide a JSON object or simple text description</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Drive Images (Optional)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload up to 5 images (JPG, PNG, WebP). These will help attract more volunteers.</p>
                </div>

                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Verification & Terms */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isVerified"
                    checked={formData.isVerified}
                    onCheckedChange={(checked) => handleInputChange('isVerified', !!checked)}
                  />
                  <Label htmlFor="isVerified" className="text-sm">
                    I am a verified NGO/Organization (will be verified by CleanFlow Mumbai)
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
                    className={errors.agreeToTerms ? 'border-red-500' : ''}
                  />
                  <div>
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the terms and conditions and take responsibility for organizing this cleanup drive safely and effectively. *
                    </Label>
                    {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold px-12 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit for Review'
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Your cleanup drive will be reviewed and published within 24-48 hours.</p>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
