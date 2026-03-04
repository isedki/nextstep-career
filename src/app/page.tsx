import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8 stagger-children">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Psychology-grounded career assessment
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Know what&apos;s{" "}
            <span className="gradient-text">actually wrong</span>
            <br />
            at your job
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Most people don&apos;t job search for their dream—they search to escape pain. 
            We help you understand exactly what&apos;s broken, why it affects you, 
            and what to look for next.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/assessment">
              <Button size="lg" className="text-lg px-8 py-6 rounded-xl">
                Start Assessment
                <span className="ml-2 text-sm opacity-75">~3 min</span>
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No account required
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Your data stays private
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Based on real psychology
            </div>
          </div>
        </div>
      </div>

      {/* What you'll learn section */}
      <div className="bg-card border-t py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            What you&apos;ll discover
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="space-y-4 p-6 rounded-2xl bg-background card-hover">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold">Your Story</h3>
              <p className="text-muted-foreground">
                A personalized narrative of what&apos;s happening in your career,
                with psychology-backed diagnoses and evidence.
              </p>
            </div>

            {/* Card 2 */}
            <div className="space-y-4 p-6 rounded-2xl bg-background card-hover">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold">Ideal Company & Role</h3>
              <p className="text-muted-foreground">
                Get specific recommendations for company stage, culture, 
                management style, and job titles that fit your profile.
              </p>
            </div>

            {/* Card 3 */}
            <div className="space-y-4 p-6 rounded-2xl bg-background card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold">Job Matches</h3>
              <p className="text-muted-foreground">
                Browse jobs scored against your profile. See green flags, 
                red flags, and culture fit for each opportunity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Psychology frameworks */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-4">Grounded in validated frameworks</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Self-Determination Theory",
              "Job Demands-Resources",
              "Career Anchors",
              "Holland RIASEC",
              "Maslach Burnout",
              "Big Five",
              "Flow Theory"
            ].map((framework) => (
              <span 
                key={framework}
                className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm"
              >
                {framework}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>NextStep — Career clarity through psychology</div>
          <div className="flex gap-6">
            <Link href="/assessment" className="hover:text-foreground transition-colors">
              Start Assessment
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
