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

export interface Order {
  id: string;
  customerName: string;
  orderDate: string; // ISO date string e.g. "2023-10-26"
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  itemCount: number;
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

export const mockOrders: Order[] = [
  { id: 'ORD001', customerName: 'Alice Smith', orderDate: '2024-07-15T10:30:00Z', status: 'Delivered', totalAmount: 45.98, itemCount: 3 },
  { id: 'ORD002', customerName: 'Bob Johnson', orderDate: '2024-07-16T14:00:00Z', status: 'Shipped', totalAmount: 25.50, itemCount: 1 },
  { id: 'ORD003', customerName: 'Carol Williams', orderDate: '2024-07-17T09:15:00Z', status: 'Processing', totalAmount: 120.00, itemCount: 5 },
  { id: 'ORD004', customerName: 'David Brown', orderDate: '2024-07-17T11:00:00Z', status: 'Pending', totalAmount: 15.99, itemCount: 1 },
  { id: 'ORD005', customerName: 'Eve Davis', orderDate: '2024-07-14T16:45:00Z', status: 'Cancelled', totalAmount: 33.75, itemCount: 2 },
  { id: 'ORD006', customerName: 'Frank Miller', orderDate: '2024-07-18T08:20:00Z', status: 'Pending', totalAmount: 75.20, itemCount: 4 },
  { id: 'ORD007', customerName: 'Grace Wilson', orderDate: '2024-07-18T10:55:00Z', status: 'Processing', totalAmount: 50.00, itemCount: 2 },
];
