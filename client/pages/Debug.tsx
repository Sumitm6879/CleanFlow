import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { checkDatabaseHealth, getUserDriveParticipation, getDrives, isUserJoinedDrive } from '@/lib/database';
import { Textarea } from '@/components/ui/textarea';

export function Debug() {
  const { user, profile } = useAuth();
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const log = (message: string) => {
    setOutput(prev => prev + '\n' + message);
    console.log(message);
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setOutput('=== DRIVE REGISTRATION DIAGNOSTICS ===\n');
    
    try {
      // Check if user is logged in
      log(`User logged in: ${!!user}`);
      if (user) {
        log(`User ID: ${user.id}`);
        log(`User email: ${user.email}`);
      }
      
      log(`Profile loaded: ${!!profile}`);
      if (profile) {
        log(`Profile drives joined: ${profile.cleanup_drives_joined}`);
      }

      // Check database connectivity
      log('\n--- Database Health Check ---');
      const dbHealthy = await checkDatabaseHealth();
      log(`Database connected: ${dbHealthy}`);

      if (user) {
        // Check user's drive participation
        log('\n--- User Drive Participation ---');
        const userDrives = await getUserDriveParticipation(user.id);
        log(`Found ${userDrives.length} drive registrations`);
        
        userDrives.forEach((participation, index) => {
          log(`Drive ${index + 1}:`);
          log(`  - ID: ${participation.id}`);
          log(`  - Drive ID: ${participation.drive_id}`);
          log(`  - Status: ${participation.status}`);
          log(`  - Joined at: ${participation.joined_at}`);
          
          if ((participation as any).drives) {
            const drive = (participation as any).drives;
            log(`  - Drive title: ${drive.title}`);
            log(`  - Drive date: ${drive.date}`);
          }
        });

        // Check available drives
        log('\n--- Available Drives ---');
        const allDrives = await getDrives();
        log(`Found ${allDrives.length} total drives`);
        
        for (const drive of allDrives.slice(0, 3)) {
          log(`Drive: ${drive.title} (ID: ${drive.id})`);
          const isJoined = await isUserJoinedDrive(drive.id, user.id);
          log(`  - User joined: ${isJoined}`);
        }
      }

      log('\n=== DIAGNOSTICS COMPLETE ===');
      
    } catch (error) {
      log(`ERROR: ${error.message}`);
      console.error('Diagnostics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Drive Registration Debug Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={runDiagnostics}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Running Diagnostics...' : 'Run Drive Registration Diagnostics'}
              </Button>
              <Button 
                onClick={clearOutput}
                variant="outline"
              >
                Clear Output
              </Button>
            </div>

            {!user && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  <strong>Note:</strong> You need to be logged in to see your drive registrations. 
                  Please <a href="/login" className="underline">log in</a> first.
                </p>
              </div>
            )}
            
            <Textarea
              value={output}
              placeholder="Diagnostic output will appear here..."
              rows={20}
              className="font-mono text-sm"
              readOnly
            />

            <div className="text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Make sure you're logged in</li>
                <li>Click "Run Drive Registration Diagnostics"</li>
                <li>Check the output above to see if your drive registrations are found</li>
                <li>If no drives are found, try registering for a drive first</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
