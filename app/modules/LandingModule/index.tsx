import { Button } from "~/components/ui/button";
import { ArrowRight, BookOpen, Users } from "lucide-react";

export const LandingModule = () => {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-32">
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Transform Your Learning Journey with{" "}
              <span className="text-primary">Udehnih</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Connect with expert teachers, access quality courses, and achieve
              your learning goals. Whether you're a student or an educator,
              Udehnih is your platform for success.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mt-32">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            <div className="flex flex-col items-start">
              <div className="rounded-lg bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">For Students</h3>
              <p className="mt-2 text-muted-foreground">
                Access a wide range of courses, learn at your own pace, and get
                support from expert teachers. Track your progress and achieve
                your learning goals.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">For Teachers</h3>
              <p className="mt-2 text-muted-foreground">
                Create and manage your courses, connect with students, and grow
                your teaching business. Share your expertise and make an impact.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mt-32">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">10K+</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Active Students
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Expert Teachers
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">1000+</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Courses Available
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
