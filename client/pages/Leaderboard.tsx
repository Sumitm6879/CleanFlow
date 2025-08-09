import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export function Leaderboard() {
  const topContributors = [
    { rank: 4, name: 'Liam Patel', score: 850, reports: 32, drives: 8 },
    { rank: 5, name: 'Sophia Kapoor', score: 780, reports: 28, drives: 7 },
    { rank: 6, name: 'Arjun Singh', score: 720, reports: 25, drives: 6 },
    { rank: 7, name: 'Isabella Rodriguez', score: 680, reports: 22, drives: 5 },
    { rank: 8, name: 'Ethan Chen', score: 650, reports: 20, drives: 4 }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Header Section */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4 p-4">
            <div className="min-w-72 space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">Community Leaderboard</h1>
              <p className="text-sm text-gray-600">Celebrating the heroes cleaning Mumbai's waters.</p>
            </div>
            
            {/* Time Range Filter */}
            <div className="min-w-40 flex-1">
              <div className="mb-2">
                <label className="text-base text-gray-900">Time Range</label>
              </div>
              <Select defaultValue="all-time">
                <SelectTrigger className="h-8 rounded-xl border border-gray-300 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Top 3 Contributors */}
          <div className="mb-6">
            <h2 className="mb-4 px-4 text-xl font-bold text-gray-900">Top 3 Contributors</h2>
            
            <div className="mb-4 flex justify-between px-4">
              <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200 text-sm">
                2nd Place
              </Button>
              <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200 text-sm">
                3rd Place
              </Button>
            </div>
          </div>

          {/* 1st Place Highlight */}
          <div className="mb-6 p-4">
            <div className="flex overflow-hidden rounded-xl bg-white shadow-sm border">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2Fad8b132af41e4e72b9e6829e2053c09e?format=webp&width=800"
                alt="Top contributor"
                className="h-64 w-80 object-cover"
              />
              <div className="flex-1 p-4">
                <h3 className="mb-2 text-lg font-bold text-gray-900">1st Place</h3>
                <div className="space-y-1">
                  <p className="text-base text-gray-600">Impact Score: 1250</p>
                  <p className="text-base text-gray-600">Ava Sharma</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="mb-6 p-3">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* Table Header */}
              <div className="flex bg-white">
                <div className="w-44 p-3">
                  <p className="text-sm text-gray-900">Rank</p>
                </div>
                <div className="w-51 p-3">
                  <p className="text-sm text-gray-900">Contributor</p>
                </div>
                <div className="w-46 p-3">
                  <p className="text-sm text-gray-900">Impact Score</p>
                </div>
                <div className="w-47 p-3">
                  <p className="text-sm text-gray-900">Reports</p>
                </div>
                <div className="w-45 p-3">
                  <p className="text-sm text-gray-900">Drives</p>
                </div>
              </div>

              {/* Table Rows */}
              {topContributors.map((contributor, index) => (
                <div key={contributor.rank} className="flex border-t border-gray-200">
                  <div className="w-44 p-2 flex items-center justify-center">
                    <p className="text-sm text-gray-600">{contributor.rank}</p>
                  </div>
                  <div className="w-51 p-2 flex items-center justify-center">
                    <p className="text-sm text-gray-900">{contributor.name}</p>
                  </div>
                  <div className="w-46 p-2 flex items-center justify-center">
                    <p className="text-sm text-gray-600">{contributor.score}</p>
                  </div>
                  <div className="w-47 p-2 flex items-center justify-center">
                    <p className="text-sm text-gray-600">{contributor.reports}</p>
                  </div>
                  <div className="w-45 p-2 flex items-center justify-center">
                    <p className="text-sm text-gray-600">{contributor.drives}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Rank Card */}
          <div className="mb-6 p-4">
            <div className="flex overflow-hidden rounded-xl bg-white shadow-sm border">
              <div className="flex-1 space-y-1 p-4">
                <h3 className="text-base font-bold text-gray-900">Your Rank: 15</h3>
                <p className="text-sm text-gray-600">Impact Score: 450</p>
              </div>
              <img 
                src="https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F0f707673347f45af9e1c50f5d19ffb5b?format=webp&width=800"
                alt="Your profile"
                className="h-40 w-60 object-cover"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="mb-6 px-4 text-center">
            <p className="text-base text-gray-900">
              Want to climb the leaderboard? Submit pollution reports or join cleanup drives today!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap justify-center gap-3 p-4">
            <Button className="bg-blue-400 text-gray-900 hover:bg-blue-500 min-w-52">
              Report Pollution
            </Button>
            <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200 min-w-58">
              Find Cleanup Drives
            </Button>
          </div>

          {/* Note */}
          <div className="px-4 text-center">
            <p className="text-sm text-gray-600">
              Impact Scores are updated daily based on verified activity.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
