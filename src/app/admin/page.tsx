
import Link from 'next/link';
import PageTitle from '@/components/shared/PageTitle';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ShoppingCart, Users, Package, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const adminFeatures = [
    {
      title: 'Manage Orders',
      description: 'View and manage customer orders.',
      link: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts (Placeholder).',
      link: '#',
      icon: Users,
      disabled: true,
    },
    {
      title: 'Product Catalog',
      description: 'Manage medicines and other products (Placeholder).',
      link: '#',
      icon: Package,
      disabled: true,
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle title="Admin Dashboard" subtitle="Manage your PillPal application." icon={LayoutDashboard} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminFeatures.map((feature) => (
          <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
              <div className="bg-primary/10 p-3 rounded-md">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={feature.link} passHref>
                <Button 
                  variant={feature.disabled ? "outline" : "default"} 
                  className="w-full mt-2"
                  disabled={feature.disabled}
                >
                  {feature.disabled ? "Coming Soon" : "Go to Section"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
