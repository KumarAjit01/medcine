
import MedicineCard from '@/components/medicines/MedicineCard';
import PageTitle from '@/components/shared/PageTitle';
import { mockMedicines, mockCategories } from '@/lib/mockData';
import { ListTree, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const ALL_CATEGORIES_VALUE = "_all_"; // Define a constant for clarity

export default function MedicinesPage({
  searchParams,
}: {
  searchParams?: { category?: string; search?: string };
}) {
  const selectedCategory = searchParams?.category;
  const searchTerm = searchParams?.search?.toLowerCase() || '';

  const filteredMedicines = mockMedicines.filter(medicine => {
    const categoryMatch = 
      !selectedCategory || selectedCategory === ALL_CATEGORIES_VALUE
        ? true
        : medicine.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
    
    const searchMatch = searchTerm 
      ? medicine.name.toLowerCase().includes(searchTerm) || 
        medicine.description.toLowerCase().includes(searchTerm) || 
        medicine.category.toLowerCase().includes(searchTerm) 
      : true;
      
    return categoryMatch && searchMatch;
  });
  
  const currentCategory = 
    selectedCategory && selectedCategory !== ALL_CATEGORIES_VALUE 
      ? mockCategories.find(cat => cat.id === selectedCategory) 
      : undefined;
      
  const pageSubtitle = currentCategory 
    ? `Showing medicines in ${currentCategory.name}` 
    : "Browse our extensive selection";

  return (
    <div className="space-y-8">
      <PageTitle title="Medicine Catalog" subtitle={pageSubtitle} icon={ListTree} />

      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-md">
        <form method="GET" action="/medicines" className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">Search Medicines</label>
            <Input 
              type="search" 
              name="search" 
              id="search" 
              placeholder="Search by name, description..." 
              defaultValue={searchTerm}
              className="py-3"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">Filter by Category</label>
            {/* Use selectedCategory || ALL_CATEGORIES_VALUE for defaultValue to ensure "All Categories" is selected if no category is in URL */}
            <Select name="category" defaultValue={selectedCategory || ALL_CATEGORIES_VALUE}>
              <SelectTrigger id="category" className="py-3">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES_VALUE}>All Categories</SelectItem>
                {mockCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="sm:col-span-3 w-full sm:w-auto sm:justify-self-end">
            <Filter className="mr-2 h-4 w-4" /> Apply Filters
          </Button>
        </form>
      </div>

      {filteredMedicines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No medicines found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
