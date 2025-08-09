import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function DetailedDrive() {
  const [comment, setComment] = useState('');
  const [submittedComments, setSubmittedComments] = useState<any[]>([]);

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        author: 'You',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        text: comment.trim(),
        avatar: 'https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F0f707673347f45af9e1c50f5d19ffb5b?format=webp&width=800'
      };
      setSubmittedComments(prev => [...prev, newComment]);
      setComment('');
    }
  };

  const volunteerAvatars = [
    'https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2Fad8b132af41e4e72b9e6829e2053c09e?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F2ef85699dd914e8da0cb93d98e8152f6?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F0f707673347f45af9e1c50f5d19ffb5b?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F693a7eb64f1647928e53bae7e9c5a87d?format=webp&width=800',
    'https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F7fdb8361dd104b20b46e0891a2c1066c?format=webp&width=800'
  ];

  const relatedDrives = [
    {
      title: 'Powai Lake Cleanup',
      date: 'August 5, 2024',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2Fad8b132af41e4e72b9e6829e2053c09e?format=webp&width=800'
    },
    {
      title: 'Juhu Beach Cleanup',
      date: 'August 12, 2024',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F2ef85699dd914e8da0cb93d98e8152f6?format=webp&width=800'
    },
    {
      title: 'Bandra Lake Cleanup',
      date: 'August 19, 2024',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F0f707673347f45af9e1c50f5d19ffb5b?format=webp&width=800'
    }
  ];

  const comments = [
    {
      author: 'Priya Sharma',
      date: 'July 21, 2024',
      text: 'Great initiative! The river looks much cleaner now. Thanks to everyone who participated.',
      avatar: 'https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F0f707673347f45af9e1c50f5d19ffb5b?format=webp&width=800'
    },
    {
      author: 'Rahul Verma',
      date: 'July 22, 2024',
      text: 'It was a rewarding experience. Looking forward to more such drives.',
      avatar: 'https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2Fad8b132af41e4e72b9e6829e2053c09e?format=webp&width=800'
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Header Section */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4 p-4">
            <div className="min-w-72 space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">Meethi River Cleanup - Bandra</h1>
              <p className="text-sm text-gray-600">Date: July 20, 2024 | Time: 9 AM - 12 PM | Location: Bandra West, Mumbai</p>
            </div>
            <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200">
              Join Drive
            </Button>
          </div>

          {/* Hero Image */}
          <div className="mb-8 p-3">
            <img 
              src="https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F7fdb8361dd104b20b46e0891a2c1066c?format=webp&width=800"
              alt="Meethi River Cleanup"
              className="h-80 w-full rounded-xl object-cover"
            />
          </div>

          {/* Overview */}
          <div className="mb-8">
            <h2 className="mb-4 px-4 text-xl font-bold text-gray-900">Overview</h2>
            <div className="px-4">
              <p className="text-base text-gray-900">
                Join us for a crucial cleanup drive at the Meethi River in Bandra. Our goal is to remove debris and pollutants, 
                enhancing the river's health and the surrounding environment. Please wear sturdy shoes, gloves, and bring your own 
                water bottle. Safety instructions will be provided at the start.
              </p>
            </div>
          </div>

          {/* Organizer Details */}
          <div className="mb-8">
            <h2 className="mb-4 px-4 text-xl font-bold text-gray-900">Organizer Details</h2>
            <div className="flex flex-col gap-4 p-4 lg:flex-row lg:justify-between">
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900">EcoWarriors Mumbai</h3>
                  <p className="text-sm text-gray-600">NGO</p>
                </div>
                <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                  View Organizer Profile
                </Button>
              </div>
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F693a7eb64f1647928e53bae7e9c5a87d?format=webp&width=800"
                alt="EcoWarriors Mumbai"
                className="h-44 flex-1 rounded-xl object-cover lg:max-w-80"
              />
            </div>
          </div>

          {/* Participation Stats */}
          <div className="mb-8">
            <h2 className="mb-4 px-4 text-xl font-bold text-gray-900">Participation Stats</h2>
            
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 p-6">
                <h3 className="text-base text-gray-900">Volunteers Joined</h3>
                <p className="text-2xl font-bold text-gray-900">75</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-6">
                <h3 className="text-base text-gray-900">Volunteer Hours Logged</h3>
                <p className="text-2xl font-bold text-gray-900">225</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-6">
                <h3 className="text-base text-gray-900">Waste Collected (kg)</h3>
                <p className="text-2xl font-bold text-gray-900">150</p>
              </div>
            </div>
          </div>

          {/* Volunteer List */}
          <div className="mb-8">
            <h2 className="mb-4 px-4 text-xl font-bold text-gray-900">Volunteer List</h2>
            <div className="flex items-center gap-0 p-3">
              {volunteerAvatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Volunteer ${index + 1}`}
                  className="h-11 w-11 rounded-full border-4 border-white object-cover -ml-2 first:ml-0"
                />
              ))}
            </div>
          </div>

          {/* Comments & Feedback */}
          <div className="mb-8">
            <h2 className="mb-4 px-4 text-xl font-bold text-gray-900">Comments & Feedback</h2>
            
            <div className="space-y-4 p-4">
              {[...comments, ...submittedComments].map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <img 
                    src={comment.avatar}
                    alt={comment.author}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex gap-3">
                      <h4 className="text-sm font-bold text-gray-900">{comment.author}</h4>
                      <p className="text-sm text-gray-600">{comment.date}</p>
                    </div>
                    <p className="text-sm text-gray-900">{comment.text}</p>
                  </div>
                </div>
              ))}

              {/* Add Comment */}
              <div className="flex gap-3">
                <img 
                  src="https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F0f707673347f45af9e1c50f5d19ffb5b?format=webp&width=800"
                  alt="Your avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex flex-1 gap-0">
                  <Input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 h-12 rounded-r-none bg-gray-100 border-r-0"
                  />
                  <Button
                    onClick={handleCommentSubmit}
                    className="rounded-l-none bg-blue-400 text-gray-900 hover:bg-blue-500 px-6"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Drives */}
          <div className="mb-8">
            <h2 className="mb-4 px-4 text-xl font-bold text-gray-900">Related Drives</h2>
            
            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
              {relatedDrives.map((drive, index) => (
                <div key={index} className="space-y-4 rounded-lg">
                  <img 
                    src={drive.image}
                    alt={drive.title}
                    className="h-24 w-full rounded-xl object-cover"
                  />
                  <div className="space-y-1">
                    <h3 className="text-base text-gray-900">{drive.title}</h3>
                    <p className="text-sm text-gray-600">{drive.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Note */}
          <div className="px-4 text-center">
            <p className="text-sm text-gray-600">
              Cleanup drives are verified and moderated for community safety.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
