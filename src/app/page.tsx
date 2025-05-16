
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowRight, Pill } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CategoryCard from "@/components/medicines/CategoryCard";
import MedicineCard from "@/components/medicines/MedicineCard";
import { mockCategories, mockMedicines } from "@/lib/mockData";
import PageTitle from "@/components/shared/PageTitle";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 dark:from-primary/20 dark:via-accent/20 dark:to-secondary/20 rounded-lg p-8 md:p-16 text-center shadow-lg">
        <div className="max-w-3xl mx-auto">
          <Pill className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to the Online Medicine Ordering System
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Your trusted partner for easy and reliable access to medicines and healthcare products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/medicines">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Medicines <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/ai-recommendations">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Get AI Recommendation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="max-w-2xl mx-auto">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search for medicines, symptoms, or categories..."
            className="pl-10 pr-4 py-6 text-base rounded-full shadow-sm focus-visible:ring-primary focus-visible:ring-2"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </section>

      {/* Medicine Categories Section */}
      <section>
        <PageTitle title="Shop by Category" subtitle="Find products based on your needs" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {mockCategories.slice(0,6).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Medicines Section */}
      <section>
        <PageTitle title="Featured Products" subtitle="Popular choices and recommendations" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockMedicines.slice(0, 4).map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      </section>

    </div>
  );
}
