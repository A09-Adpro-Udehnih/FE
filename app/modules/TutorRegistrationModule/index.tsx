import React, { useEffect } from 'react';
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
    
  // Monitor fetcher state for debugging
  useEffect(() => {
    console.log("Fetcher state:", fetcher.state);
    console.log("Fetcher data:", fetcher.data);
    
    // If submission was successful and we got an ACCEPTED status, redirect to tutors page
    if (fetcher.data?.success && fetcher.data?.data?.status === 'ACCEPTED') {
      navigate('/tutors');
    }
    
    // If submission was successful, reload the page after a delay to show updated status
    if (fetcher.data?.success && !fetcher.data?.data?.status) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [fetcher.state, fetcher.data, navigate]);

  const handleSubmitApplication = () => {
    console.log("Submitting tutor application...");
    // Creating a FormData object for better compatibility
    const formData = new FormData();
    formData.append('intent', 'apply');
    
    fetcher.submit(
      formData,
      { method: 'post', action: '/tutorRegistration' }
    );
  };

  const handleCancelApplication = () => {
    console.log("Cancelling tutor application...");
    // Creating a FormData object for better compatibility
    const formData = new FormData();
    formData.append('intent', 'cancel');
    
    fetcher.submit(
      formData,
      { method: 'post', action: '/tutorRegistration' }
    );
  };

  const navigateToTutorsModule = () => {
    navigate('/tutors');
  };

  // Display appropriate UI based on application status
  const renderContent = () => {
    // Handle error state
    if (!response.success) {
      return (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Error Loading Status
            </CardTitle>
            <CardDescription>
              We couldn't load your tutor application status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error {response.code}</AlertTitle>
              <AlertDescription>
                {response.message}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmitApplication}>
              Apply to be a Tutor
            </Button>
          </CardFooter>
        </Card>
      );
    }
    
    // Get status from data
    const status = response.data?.status;
    
    // If we have a pending application
    if (status === 'PENDING') {
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
    if (status === 'ACCEPTED') {
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
    if (status === 'DENIED') {
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
          
          {fetcher.data && (
            <Alert className={`mt-4 ${fetcher.data.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <AlertTitle>{fetcher.data.success ? 'Success!' : 'Error'}</AlertTitle>
              <AlertDescription>{fetcher.data.message}</AlertDescription>
            </Alert>
          )}
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
