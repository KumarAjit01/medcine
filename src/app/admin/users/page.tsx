
'use client';

import PageTitle from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Construction } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="User Management" subtitle="View and manage user accounts." icon={Users} />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>This section is under construction.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Construction className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            User Management Features Coming Soon!
          </h3>
          <p className="text-muted-foreground mb-6">
            We are working on features to allow you to view, edit, and manage user accounts.
          </p>
          <Link href="/admin">
            <Button variant="outline">Back to Admin Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
