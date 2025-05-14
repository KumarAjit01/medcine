export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  dataAiHint?: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  dataAiHint?: string;
  description?: string;
}

export const mockCategories: Category[] = [
  { id: 'pain-relief', name: 'Pain Relief', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'pills painkiller', description: 'Relieve various types of pain effectively.' },
  { id: 'cold-flu', name: 'Cold & Flu', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'tissue sickness', description: 'Combat cold and flu symptoms quickly.' },
  { id: 'vitamins-supplements', name: 'Vitamins & Supplements', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'vitamins bottle', description: 'Boost your health with essential nutrients.' },
  { id: 'digestive-health', name: 'Digestive Health', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'stomach health', description: 'Support your digestive system.' },
  { id: 'skincare', name: 'Skincare', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cream lotion', description: 'Nourish and protect your skin.' },
  { id: 'first-aid', name: 'First Aid', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'bandages kit', description: 'Essential supplies for minor injuries.' },
];

export const mockMedicines: Medicine[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', price: 5.99, description: 'Effective relief from pain and fever. Suitable for headaches, migraines, and body aches.', imageUrl: 'https://placehold.co/400x300.png', stock: 100, dataAiHint: 'tablet painkiller' },
  { id: '2', name: 'Ibuprofen 200mg', category: 'Pain Relief', price: 7.49, description: 'Reduces inflammation and pain. Helps with arthritis, menstrual cramps, and muscle soreness.', imageUrl: 'https://placehold.co/400x300.png', stock: 75, dataAiHint: 'capsule medicine' },
  { id: '3', name: 'Vitamin C 1000mg', category: 'Vitamins & Supplements', price: 12.99, description: 'Boosts immune system and provides antioxidant support. Effervescent tablets for easy consumption.', imageUrl: 'https://placehold.co/400x300.png', stock: 120, dataAiHint: 'orange vitamin' },
  { id: '4', name: 'Antacid Tablets', category: 'Digestive Health', price: 8.99, description: 'Quick relief from heartburn, acid indigestion, and upset stomach. Chewable mint flavor.', imageUrl: 'https://placehold.co/400x300.png', stock: 90, dataAiHint: 'antacid stomach' },
  { id: '5', name: 'Cold & Flu Syrup', category: 'Cold & Flu', price: 9.99, description: 'Soothes cough, relieves nasal congestion, and reduces fever. Non-drowsy formula.', imageUrl: 'https://placehold.co/400x300.png', stock: 60, dataAiHint: 'syrup bottle' },
  { id: '6', name: 'Moisturizing Cream', category: 'Skincare', price: 15.00, description: 'Hydrates and protects dry and sensitive skin. Fragrance-free and dermatologically tested.', imageUrl: 'https://placehold.co/400x300.png', stock: 50, dataAiHint: 'skin cream' },
  { id: '7', name: 'Aspirin 300mg', category: 'Pain Relief', price: 6.50, description: 'Relief from mild to moderate pain, fever, and inflammation. Enteric-coated tablets.', imageUrl: 'https://placehold.co/400x300.png', stock: 80, dataAiHint: 'aspirin pills' },
  { id: '8', name: 'Multivitamin Gummies', category: 'Vitamins & Supplements', price: 18.99, description: 'Tasty and convenient way to get essential daily vitamins and minerals for adults.', imageUrl: 'https://placehold.co/400x300.png', stock: 110, dataAiHint: 'gummy vitamins' },
  { id: '9', name: 'Probiotic Capsules', category: 'Digestive Health', price: 22.50, description: 'Supports a healthy gut microbiome and improves digestion. Contains 10 billion CFUs.', imageUrl: 'https://placehold.co/400x300.png', stock: 70, dataAiHint: 'probiotic pill' },
  { id: '10', name: 'Sunscreen SPF 50', category: 'Skincare', price: 12.75, description: 'Broad-spectrum protection against UVA and UVB rays. Water-resistant formula.', imageUrl: 'https://placehold.co/400x300.png', stock: 85, dataAiHint: 'sunscreen bottle' },
];
