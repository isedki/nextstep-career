'use client';

import { RoleBrowser } from '@/components/roles/RoleBrowser';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RolesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Job Role Database</h1>
          <p className="text-muted-foreground mt-2">
            Browse tech industry roles with ATS keywords and salary data
          </p>
        </div>

        <RoleBrowser />
      </div>
    </div>
  );
}
