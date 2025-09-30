'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

// Simple Dashboard component without Autumn
function SimpleDashboard({ session }: { session: any }) {
  const [credits, setCredits] = useState<number | null>(null);
  const [totalUsed, setTotalUsed] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch('/api/credits');
        if (response.ok) {
          const data = await response.json();
          setCredits(data.credits);
          setTotalUsed(data.totalUsed);
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCredits();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{session.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                Free Plan (100 credits)
              </p>
            </div>
          </div>
        </div>

        {/* Credits Usage */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Credits Usage</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Credits Used</span>
                  <span>{totalUsed} / 100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((totalUsed / 100) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Available Credits</p>
                  <p className="text-2xl font-bold text-green-600">{credits}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Used</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsed}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/chat"
              className="p-4 border rounded-lg hover:border-orange-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold mb-2">AI Chat</h3>
              <p className="text-sm text-gray-600">Start a conversation with AI</p>
            </Link>
            <Link
              href="/brand-monitor"
              className="p-4 border rounded-lg hover:border-orange-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold mb-2">Brand Monitor</h3>
              <p className="text-sm text-gray-600">Track your brand visibility</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <SimpleDashboard session={session} />;
}
