import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';

export function CleanupDriveOrganization() {
  const [isPublished, setIsPublished] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    organizerName: '',
    organizerType: '',
    eventTitle: '',
    location: '',
    date: '',
    time: '',
    description: '',
    maxVolunteers: '',
    contactPhone: '',
    contactEmail: '',
    isNGOVerified: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.organizerName.trim()) {
      newErrors.organizerName = 'Organizer name is required';
    }

    if (!formData.organizerType) {
      newErrors.organizerType = 'Please select an organizer type';
    }

    if (!formData.eventTitle.trim()) {
      newErrors.eventTitle = 'Event title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Event time is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.maxVolunteers || isNaN(Number(formData.maxVolunteers)) || Number(formData.maxVolunteers) <= 0) {
      newErrors.maxVolunteers = 'Please enter a valid number of volunteers';
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = () => {
    if (validateForm()) {
      setIsPublished(true);
    }
  };

  if (isPublished) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-8">
            {/* Hero Section */}
            <div className="mb-8">
              <div 
                className="relative h-64 rounded-xl bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.00) 25%), url('https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2Fad8b132af41e4e72b9e6829e2053c09e?format=webp&width=800')`
                }}
              >
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h1 className="text-3xl font-bold text-white">Organize a Cleanup Drive</h1>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-600">Bring people together to make Mumbai's waters cleaner.</p>
              </div>
            </div>

            {/* Post-Publish Confirmation */}
            <div className="text-center">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Post-Publish Confirmation</h2>
              
              <div className="mx-auto max-w-md">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-green-100">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500">
                      <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">Your cleanup drive is now live!</h3>
                  <p className="text-sm text-gray-600">Share the event with your network or view it on the map.</p>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200">
                    Share on Social Media
                  </Button>
                  <Button className="w-full bg-gray-100 text-gray-900 hover:bg-gray-200">
                    View on Map
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Hero Section */}
          <div className="mb-8">
            <div 
              className="relative h-64 rounded-xl bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.00) 25%), url('https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2Fad8b132af41e4e72b9e6829e2053c09e?format=webp&width=800')`
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-3xl font-bold text-white">Organize a Cleanup Drive</h1>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600">Bring people together to make Mumbai's waters cleaner.</p>
            </div>
          </div>

          {/* Event Details Card */}
          <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm border">
            <div className="flex">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F2ef85699dd914e8da0cb93d98e8152f6?format=webp&width=800"
                alt="Event"
                className="h-64 w-80 object-cover"
              />
              <div className="flex-1 p-6">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Event Details</h2>
                <div className="flex justify-end">
                  <Button className="bg-teal-400 text-gray-900 hover:bg-teal-500">
                    Fill the form below
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Organizer Name */}
            <div>
              <Label htmlFor="organizerName" className="text-base font-medium text-gray-900">
                Organizer Name
              </Label>
              <Input
                id="organizerName"
                placeholder="Enter your name"
                value={formData.organizerName}
                onChange={(e) => handleInputChange('organizerName', e.target.value)}
                className={`mt-2 h-14 rounded-xl bg-gray-50 ${errors.organizerName ? 'border-red-500' : ''}`}
              />
              {errors.organizerName && (
                <p className="mt-1 text-sm text-red-500">{errors.organizerName}</p>
              )}
            </div>

            {/* Organizer Type */}
            <div>
              <Label htmlFor="organizerType" className="text-base font-medium text-gray-900">
                Organizer Type
              </Label>
              <Select value={formData.organizerType} onValueChange={(value) => handleInputChange('organizerType', value)}>
                <SelectTrigger className="mt-2 h-14 rounded-xl bg-gray-50">
                  <SelectValue placeholder="Select Organizer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="ngo">NGO</SelectItem>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Event Title */}
            <div>
              <Label htmlFor="eventTitle" className="text-base font-medium text-gray-900">
                Event Title
              </Label>
              <Input
                id="eventTitle"
                placeholder="e.g., Mithi River Cleanup - Bandra"
                value={formData.eventTitle}
                onChange={(e) => handleInputChange('eventTitle', e.target.value)}
                className={`mt-2 h-14 rounded-xl bg-gray-50 ${errors.eventTitle ? 'border-red-500' : ''}`}
              />
              {errors.eventTitle && (
                <p className="mt-1 text-sm text-red-500">{errors.eventTitle}</p>
              )}
            </div>

            {/* Location Section */}
            <div>
              <h3 className="mb-6 text-xl font-bold text-gray-900">Location</h3>
              
              {/* Map placeholder */}
              <div className="mb-6 h-80 rounded-xl bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-2 text-4xl text-gray-400">🗺️</div>
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">Mumbai Location Selector</p>
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-base font-medium text-gray-900">
                  Search Location (Optional)
                </Label>
                <Input
                  id="location"
                  placeholder="Search for a location in Mumbai"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="mt-2 h-14 rounded-xl bg-gray-50"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="date" className="text-base font-medium text-gray-900">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="mt-2 h-14 rounded-xl bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-base font-medium text-gray-900">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="mt-2 h-14 rounded-xl bg-gray-50"
                />
              </div>
            </div>

            {/* Event Description */}
            <div>
              <Label htmlFor="description" className="text-base font-medium text-gray-900">
                Event Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your cleanup drive..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-2 min-h-32 rounded-xl bg-gray-50"
              />
            </div>

            {/* Upload Banner Image */}
            <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <h3 className="mb-2 text-lg font-bold text-gray-900">Upload Banner Image</h3>
              <p className="mb-6 text-sm text-gray-600">Drag & drop or click to upload</p>
              <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                Browse Files
              </Button>
            </div>

            {/* Max Volunteers */}
            <div>
              <Label htmlFor="maxVolunteers" className="text-base font-medium text-gray-900">
                Max Volunteers Allowed
              </Label>
              <Input
                id="maxVolunteers"
                placeholder="Enter maximum number of volunteers"
                value={formData.maxVolunteers}
                onChange={(e) => handleInputChange('maxVolunteers', e.target.value)}
                className="mt-2 h-14 rounded-xl bg-gray-50"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="contactPhone" className="text-base font-medium text-gray-900">
                  Contact Phone
                </Label>
                <Input
                  id="contactPhone"
                  placeholder="Enter phone number"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="mt-2 h-14 rounded-xl bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail" className="text-base font-medium text-gray-900">
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className={`mt-2 h-14 rounded-xl bg-gray-50 ${errors.contactEmail ? 'border-red-500' : ''}`}
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-500">{errors.contactEmail}</p>
                )}
              </div>
            </div>

            {/* NGO Verification Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="ngoVerified"
                checked={formData.isNGOVerified}
                onCheckedChange={(checked) => handleInputChange('isNGOVerified', checked.toString())}
                className="mt-1"
              />
              <Label htmlFor="ngoVerified" className="text-base text-gray-900">
                Mark this drive as organized by a verified NGO
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button variant="outline" className="px-6">
                Cancel
              </Button>
              <Button onClick={handlePublish} className="bg-teal-400 text-gray-900 hover:bg-teal-500 px-6">
                Publish Drive
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
