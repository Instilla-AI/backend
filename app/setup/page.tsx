'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, AlertCircle, Rocket, Database, Palette, Key } from 'lucide-react';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: any;
}

const steps: SetupStep[] = [
  { id: 'welcome', title: 'Welcome', description: 'Welcome to your SaaS setup', icon: Rocket },
  { id: 'database', title: 'Database', description: 'Configure your database connection', icon: Database },
  { id: 'auth', title: 'Authentication', description: 'Setup authentication secrets', icon: Key },
  { id: 'branding', title: 'Branding', description: 'Customize your SaaS appearance', icon: Palette },
  { id: 'complete', title: 'Complete', description: 'Finalize your setup', icon: CheckCircle2 }
];

export default function SetupWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);

  // Form data
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [authSecret, setAuthSecret] = useState('');
  const [appName, setAppName] = useState('My SaaS');
  const [primaryColor, setPrimaryColor] = useState('#ea580c');
  const [logoUrl, setLogoUrl] = useState('');

  // Check if setup is already complete
  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('/api/setup/status');
      const data = await response.json();
      if (data.isComplete) {
        setSetupComplete(true);
      }
    } catch (error) {
      console.error('Error checking setup status:', error);
    }
  };

  const generateAuthSecret = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const secret = btoa(String.fromCharCode(...array));
    setAuthSecret(secret);
  };

  const testDatabaseConnection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/setup/test-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseUrl })
      });
      
      if (!response.ok) {
        throw new Error('Database connection failed');
      }
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    setError(null);

    // Validate current step
    if (currentStep === 1) { // Database step
      if (!databaseUrl) {
        setError('Please enter a database URL');
        return;
      }
      const isValid = await testDatabaseConnection();
      if (!isValid) return;
    }

    if (currentStep === 2) { // Auth step
      if (!authSecret) {
        setError('Please generate an authentication secret');
        return;
      }
    }

    if (currentStep === 3) { // Branding step
      if (!appName) {
        setError('Please enter an app name');
        return;
      }
    }

    if (currentStep === steps.length - 2) {
      // Last step before complete - save configuration
      await saveConfiguration();
    }

    setCurrentStep(currentStep + 1);
  };

  const saveConfiguration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/setup/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          databaseUrl,
          authSecret,
          appName,
          primaryColor,
          logoUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      // Initialize database
      await fetch('/api/setup/init-db', { method: 'POST' });

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    router.push('/auth/signup');
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              Setup Already Complete
            </CardTitle>
            <CardDescription>
              Your SaaS is already configured and ready to use.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')} className="w-full btn-firecrawl-orange">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-1 mx-2 ${
                    index < currentStep ? 'bg-orange-500' : 'bg-gray-200'
                  }`} style={{ minWidth: '60px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <StepIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Welcome Step */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Rocket className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Welcome to Your SaaS Setup!</h2>
                  <p className="text-gray-600 mb-6">
                    This wizard will help you configure your SaaS application in just a few steps.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <h3 className="font-semibold text-blue-900 mb-2">What we'll configure:</h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Database connection (Railway PostgreSQL)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Authentication system
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Branding and appearance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Database schema initialization
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Database Step */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Railway PostgreSQL</h3>
                  <p className="text-sm text-yellow-800">
                    Copy your DATABASE_URL from Railway's PostgreSQL service variables.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="databaseUrl">Database URL</Label>
                  <Input
                    id="databaseUrl"
                    type="text"
                    placeholder="postgresql://user:password@host:port/database"
                    value={databaseUrl}
                    onChange={(e) => setDatabaseUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Format: postgresql://username:password@host:port/database
                  </p>
                </div>
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testing connection...
                  </div>
                )}
              </div>
            )}

            {/* Auth Step */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Authentication Secret</h3>
                  <p className="text-sm text-blue-800">
                    Generate a secure secret for Better Auth. This will be used to sign JWT tokens.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authSecret">Authentication Secret</Label>
                  <div className="flex gap-2">
                    <Input
                      id="authSecret"
                      type="text"
                      value={authSecret}
                      onChange={(e) => setAuthSecret(e.target.value)}
                      placeholder="Click generate to create a secure secret"
                      readOnly
                    />
                    <Button onClick={generateAuthSecret} variant="outline">
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Keep this secret safe! Never share it publicly.
                  </p>
                </div>
              </div>
            )}

            {/* Branding Step */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">Application Name</Label>
                  <Input
                    id="appName"
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="My Awesome SaaS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#ea580c"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL (optional)</Label>
                  <Input
                    id="logoUrl"
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-gray-500">
                    Leave empty to use the app name as text logo
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Preview</h4>
                  <div className="bg-white p-4 rounded border" style={{ borderColor: primaryColor }}>
                    <div className="flex items-center gap-2">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="h-8" />
                      ) : (
                        <span className="text-xl font-bold" style={{ color: primaryColor }}>
                          {appName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Complete Step */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Setup Complete!</h2>
                  <p className="text-gray-600 mb-6">
                    Your SaaS is now configured and ready to use.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                    <h3 className="font-semibold text-green-900 mb-2">What's been configured:</h3>
                    <ul className="space-y-2 text-sm text-green-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Database connected and schema initialized
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Authentication system configured
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Branding applied: {appName}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Ready for user registration
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 0 || isLoading}
              >
                Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="btn-firecrawl-orange"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Next'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="btn-firecrawl-orange"
                >
                  Create First Account
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
