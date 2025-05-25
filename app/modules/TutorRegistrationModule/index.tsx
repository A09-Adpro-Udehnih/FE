import React from 'react';
import { useLoaderData, useFetcher, useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '~/components/ui/card';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Ban,
  Loader2
} from 'lucide-react';
import { 
  Alert,
  AlertTitle, 
  AlertDescription 
} from '~/components/ui/alert';
import type { TutorRegistrationResponse } from './loader';

export const TutorRegistrationModule = () => {
  const response = useLoaderData() as TutorRegistrationResponse;
  const fetcher = useFetcher();
  const navigate = useNavigate();
  
  const isSubmitting = 
    fetcher.state === 'submitting' && 
    fetcher.formData?.get('intent') === 'apply';
  
  const isCancelling = 
    fetcher.state === 'submitting' && 
    fetcher.formData?.get('intent') === 'cancel';

  const handleSubmitApplication = () => {
    fetcher.submit(
      { intent: 'apply' },
      { method: 'post' }
    );
  };

  const handleCancelApplication = () => {
    fetcher.submit(
      { intent: 'cancel' },
      { method: 'post' }
    );
  };

  const navigateToTutorsModule = () => {
    navigate('/tutors');
  };

  // Display appropriate UI based on application status
  const renderContent = () => {
    // If we have a pending application
    if (response.status === 'PENDING') {
      return (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Application Pending
            </CardTitle>
            <CardDescription>
              Your tutor application is currently being reviewed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-yellow-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Please Wait</AlertTitle>
              <AlertDescription>
                Our staff is reviewing your application. You'll be able to create courses once approved.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              variant="destructive" 
              onClick={handleCancelApplication}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Application'
              )}
            </Button>
          </CardFooter>
        </Card>
      );
    }
    
    // If application was accepted, redirect to tutors module
    if (response.status === 'ACCEPTED') {
      return (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Application Approved
            </CardTitle>
            <CardDescription>
              Congratulations! You are now a tutor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-green-50">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                You can now create and manage your courses.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={navigateToTutorsModule}>
              Go to Tutor Dashboard
            </Button>
          </CardFooter>
        </Card>
      );
    }
    
    // If application was denied
    if (response.status === 'DENIED') {
      return (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" />
              Application Denied
            </CardTitle>
            <CardDescription>
              Unfortunately, your application was not approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Not Approved</AlertTitle>
              <AlertDescription>
                You may submit a new application after reviewing our requirements.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply Again'
              )}
            </Button>
          </CardFooter>
        </Card>
      );
    }
    
    // Default: No application yet
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Become a Tutor</CardTitle>
          <CardDescription>
            Share your knowledge by creating courses on our platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            As a tutor, you'll be able to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Create and publish your own courses</li>
            <li>Organize course content into sections and articles</li>
            <li>Set your own pricing</li>
            <li>Track student enrollments and progress</li>
            <li>Receive payments for your courses</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSubmitApplication}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              'Apply to be a Tutor'
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Tutor Registration</h1>
      {renderContent()}
    </main>
  );
};
