import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export function ParticipationTracking() {
  const volunteers = [
    { 
      selected: true, 
      name: 'Priya Sharma', 
      email: 'priya.sharma@email.com', 
      points: 100, 
      status: 'Confirmed' 
    },
    { 
      selected: false, 
      name: 'Arjun Patel', 
      email: 'arjun.patel@email.com', 
      points: 80, 
      status: 'Pending' 
    },
    { 
      selected: true, 
      name: 'Sneha Kapoor', 
      email: 'sneha.kapoor@email.com', 
      points: 120, 
      status: 'Awarded' 
    },
    { 
      selected: true, 
      name: 'Vikram Singh', 
      email: 'vikram.singh@email.com', 
      points: 90, 
      status: 'Confirmed' 
    },
    { 
      selected: false, 
      name: 'Anjali Verma', 
      email: 'anjali.verma@email.com', 
      points: 70, 
      status: 'Pending' 
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Participation & Points</h1>
              <p className="text-sm text-gray-600">Track volunteer involvement and reward their contributions.</p>
            </div>
            
            {/* Drive Selection */}
            <div className="min-w-40 flex-1">
              <Select defaultValue="cleanup-drive">
                <SelectTrigger className="h-14 rounded-xl border border-gray-300 bg-white">
                  <SelectValue placeholder="Select Cleanup Drive" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cleanup-drive">Mithi River Cleanup - Bandra</SelectItem>
                  <SelectItem value="beach-cleanup">Juhu Beach Cleanup</SelectItem>
                  <SelectItem value="lake-cleanup">Powai Lake Cleanup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Volunteers Table */}
          <div className="mb-6 p-3">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              {/* Table Header */}
              <div className="flex bg-white">
                <div className="w-16 p-3">
                  {/* Empty header for checkbox column */}
                </div>
                <div className="w-53 p-3">
                  <p className="text-sm font-medium text-gray-900">Volunteer</p>
                </div>
                <div className="w-69 p-3">
                  <p className="text-sm font-medium text-gray-900">Contact</p>
                </div>
                <div className="w-50 p-3">
                  <p className="text-sm font-medium text-gray-900">Points Earned</p>
                </div>
                <div className="w-44 p-3">
                  <p className="text-sm font-medium text-gray-900">Status</p>
                </div>
              </div>

              {/* Table Rows */}
              {volunteers.map((volunteer, index) => (
                <div key={index} className="flex border-t border-gray-200">
                  <div className="w-16 p-2 flex items-center justify-center">
                    <p className="text-sm text-black">{volunteer.selected ? 'true' : 'false'}</p>
                  </div>
                  <div className="w-53 p-2 flex items-center justify-center">
                    <p className="text-sm text-gray-900">{volunteer.name}</p>
                  </div>
                  <div className="w-69 p-2 flex items-center justify-center">
                    <p className="text-sm text-gray-600">{volunteer.email}</p>
                  </div>
                  <div className="w-50 p-2 flex items-center justify-center">
                    <p className="text-sm text-gray-600">{volunteer.points}</p>
                  </div>
                  <div className="w-44 p-2 flex items-center justify-center">
                    <Button className="h-8 bg-gray-100 text-gray-900 hover:bg-gray-200 text-sm">
                      {volunteer.status}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assign Points Button */}
          <div className="mb-6 p-3">
            <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200">
              Assign Points
            </Button>
          </div>

          {/* Summary Image Section */}
          <div className="mb-6 p-4">
            <div 
              className="relative h-64 rounded-xl bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.00) 100%), url('https://cdn.builder.io/api/v1/image/assets%2F537510c5429f49869414784ccd333546%2F7fdb8361dd104b20b46e0891a2c1066c?format=webp&width=800')`
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="max-w-lg space-y-1">
                  <h2 className="text-2xl font-bold text-white">Summary</h2>
                  <div className="text-base text-white">
                    <p>Total Volunteers Participated: 30</p>
                    <p>Total Points Awarded: 2500</p>
                    <p>Cumulative Impact Score: 15000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 p-3">
            <Button className="bg-blue-400 text-gray-900 hover:bg-blue-500">
              Save & Notify Volunteers
            </Button>
            <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200">
              Export Participation Report
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
