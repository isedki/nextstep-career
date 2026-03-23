import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Target, 
  Users, 
  Briefcase, 
  CheckSquare, 
  FileText,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Your complete career toolkit
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Career clarity &{" "}
            <span className="gradient-text">job search success</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understand what you really need from work, then optimize your applications 
            to land the right role.
          </p>
        </div>
      </div>

      {/* Two Pillars Section */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          
          {/* Career Assessment Pillar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl transform group-hover:scale-[1.02] transition-transform" />
            <div className="relative p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Career Assessment</h2>
                  <p className="text-sm text-muted-foreground">Psychology-grounded self-discovery</p>
                </div>
              </div>

              <p className="text-muted-foreground">
                Understand what&apos;s actually wrong at your current job and what you need 
                from your next role. Based on validated psychological frameworks.
              </p>

              <div className="space-y-3">
                <Link 
                  href="/assessment"
                  className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-muted transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Take Assessment</div>
                      <div className="text-sm text-muted-foreground">~3 min diagnostic</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                </Link>

                <Link 
                  href="/profile"
                  className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-muted transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">View Profile</div>
                      <div className="text-sm text-muted-foreground">Your career insights</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                </Link>

                <Link 
                  href="/expectations"
                  className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-muted transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Set Expectations</div>
                      <div className="text-sm text-muted-foreground">Define your ideal role</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                </Link>
              </div>

              <div className="pt-4">
                <Link href="/assessment">
                  <Button className="w-full" size="lg">
                    Start Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Job Search Tools Pillar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl transform group-hover:scale-[1.02] transition-transform" />
            <div className="relative p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Job Search Tools</h2>
                  <p className="text-sm text-muted-foreground">Optimize your applications</p>
                </div>
              </div>

              <p className="text-muted-foreground">
                Browse tech roles by department, understand required keywords, and 
                score your resume against ATS systems used by top companies.
              </p>

              <div className="space-y-3">
                <Link 
                  href="/roles"
                  className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-muted transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-medium">Role Browser</div>
                      <div className="text-sm text-muted-foreground">Explore tech roles & keywords</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:text-accent transition-colors" />
                </Link>

                <Link 
                  href="/ats"
                  className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-muted transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-medium">ATS Checker</div>
                      <div className="text-sm text-muted-foreground">Score resume vs job description</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:text-accent transition-colors" />
                </Link>

                <Link 
                  href="/jobs"
                  className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-muted transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-medium">Job Listings</div>
                      <div className="text-sm text-muted-foreground">Browse & match opportunities</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/item:text-accent transition-colors" />
                </Link>
              </div>

              <div className="pt-4">
                <Link href="/roles">
                  <Button variant="secondary" className="w-full" size="lg">
                    Browse Roles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-card border-t py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            Everything you need for your job search
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-background space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Psychology-Based</h3>
              <p className="text-sm text-muted-foreground">
                Grounded in Self-Determination Theory, Maslach Burnout, and Career Anchors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold">ATS Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Score your resume against Workday, Greenhouse, Lever, and more.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Role Database</h3>
              <p className="text-sm text-muted-foreground">
                Tech roles across Executive, Solutions, Sales, CS, Product, and Engineering.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background space-y-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold">Keyword Insights</h3>
              <p className="text-sm text-muted-foreground">
                Critical skills, tools, and metrics for each role with salary ranges.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>NextStep — Career clarity & job search success</div>
          <div className="flex gap-6">
            <Link href="/assessment" className="hover:text-foreground transition-colors">
              Assessment
            </Link>
            <Link href="/roles" className="hover:text-foreground transition-colors">
              Roles
            </Link>
            <Link href="/ats" className="hover:text-foreground transition-colors">
              ATS Checker
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
