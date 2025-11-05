import { PlaceHolderImages } from './placeholder-images';
import type { Product, User, Order } from './types';

const descriptions = {
  Tech: 'Discover the latest in technology. High-performance gadgets to keep you ahead.',
  Fashion: 'Upgrade your style with our new collection. Trendy and timeless pieces for every occasion.',
  Sports: 'Achieve your fitness goals with our top-quality sports gear. Performance and durability guaranteed.',
  'Home Goods': 'Transform your living space with our beautiful and functional home goods. Quality meets design.',
  Books: 'Get lost in a new story. A wide selection of books for every reader.',
};

const productNames = {
  Tech: ['Laptop', 'Smartphone', 'Headphones', 'Smart Watch', 'Gaming Console', 'VR Headset', 'Drone', 'Speaker', 'Camera', 'E-Reader', 'Keyboard', 'Monitor', 'GPU', 'Hard Drive', 'Webcam', 'Microphone', 'Projector', 'Fitness Tracker', 'Robot Vacuum', 'Smart Lights'],
  Fashion: ['Jacket', 'Boots', 'T-Shirt', 'Sneakers', 'Dress', 'Sunglasses', 'Handbag', 'Scarf', 'Suit', 'Chinos', 'Coat', 'Beanie', 'Blouse', 'Swimsuit', 'Leggings', 'Hoodie', 'Sandals', 'Necklace', 'Belt', 'Socks'],
  Sports: ['Basketball', 'Yoga Mat', 'Dumbbells', 'Soccer Ball', 'Tennis Racket', 'Bicycle', 'Running Shoes', 'Golf Clubs', 'Boxing Gloves', 'Skateboard', 'Fishing Rod', 'Kayak', 'Camping Tent', 'Backpack', 'Water Bottle', 'Goggles', 'Baseball Bat', 'Helmet', 'Jersey', 'Jump Rope'],
  'Home Goods': ['Sofa', 'Coffee Table', 'Bed Frame', 'Dining Table', 'Office Chair', 'Bookshelf', 'Floor Lamp', 'Area Rug', 'Wall Art', 'Pillows', 'Kitchen Mixer', 'Coffee Maker', 'Blender', 'Cookware Set', 'Knife Set', 'Air Fryer', 'Towel Set', 'Laundry Basket', 'Storage Bins', 'Plant Pot'],
  Books: ['Fantasy Novel', 'Biography', 'Mystery Thriller', 'Cookbook', 'History Book', 'Sci-Fi Novel', 'Self-Help Book', 'Children\'s Book', 'Poetry', 'Travel Guide', 'Graphic Novel', 'Business Book', 'Romance Novel', 'Art Book', 'Philosophy', 'Programming Book', 'Gardening Book', 'Memoir', 'Dystopian Novel', 'True Crime'],
};

const adjectives = ['Premium', 'Sleek', 'Durable', 'Elegant', 'High-Performance', 'Comfortable', 'Next-Gen', 'Classic', 'Modern', 'Eco-Friendly'];

export const products: Product[] = Array.from({ length: 100 }, (_, i) => {
  const productIndex = i + 1;
  const categoryIndex = Math.floor(i / 20);
  const category = Object.keys(productNames)[categoryIndex] as keyof typeof productNames;
  const nameIndex = i % 20;
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const name = `${adjective} ${productNames[category][nameIndex]}`;
  const price = Math.floor(Math.random() * (category === 'Tech' ? 50000 : category === 'Fashion' ? 5000 : category === 'Sports' ? 8000 : category === 'Home Goods' ? 15000 : 1000)) + (category === 'Books' ? 300 : 500);

  return {
    id: `product-${productIndex}`,
    name: name,
    description: descriptions[category],
    price: price,
    category: category,
    image: PlaceHolderImages.find(p => p.id === `product-${productIndex}`)!,
  };
});

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Alex Doe',
    email: 'alex@example.com',
    interests: ['Tech', 'Sports'],
  },
];

export const orders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-1',
    productId: 'product-1',
    status: 'Delivered',
    orderDate: '2023-10-15',
  },
  {
    id: 'order-2',
    userId: 'user-1',
    productId: 'product-41',
    status: 'Pending',
    orderDate: '2024-03-20',
  },
];
