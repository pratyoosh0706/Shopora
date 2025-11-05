
import { PlaceHolderImages } from './placeholder-images';
import type { Product, User, Order, ProductCategory } from './types';

const descriptions = {
  Tech: 'Experience the future with our latest tech gadgets. Featuring stunning displays, powerful new chips, and pro-level features.',
  Fashion: 'Upgrade your style with our new collection. Trendy and timeless pieces for every occasion.',
  Sports: 'Achieve your fitness goals with our top-quality sports gear. Performance and durability guaranteed.',
  'Home Goods': 'Transform your living space with our beautiful and functional home goods. Quality meets design.',
  Books: 'Get lost in a new story. A wide selection of books for every reader.',
};

const productNames: Record<ProductCategory, string[]> = {
  Tech: [
    'Gaming Laptop', 
    'Flagship Phone', 
    'Wireless Headphones', 
    'Smart Watch', 
    'Gaming Console',
    'VR Headset',
    'Camera Drone',
    'Bluetooth Speaker',
    'Digital Camera',
    'E-Reader Tablet',
    'Mechanical Keyboard',
    '4K Monitor',
    'Graphics Card',
    'External SSD',
    'Webcam',
    'Microphone',
    'Projector',
    'Fitness Tracker',
    'Robot Vacuum',
    'Smart Lighting'
  ],
  Fashion: [
    'Denim Jacket', 
    'Leather Boots', 
    'Graphic T-Shirt', 
    'Running Sneakers', 
    'Summer Dress',
    'Aviator Sunglasses',
    'Designer Handbag',
    'Wool Scarf',
    'Business Suit',
    'Slim-fit Chinos',
    'Trench Coat',
    'Knit Beanie',
    'Silk Blouse',
    'One-Piece Swimsuit',
    'Yoga Leggings',
    'Cotton Hoodie',
    'Beach Sandals',
    'Silver Necklace',
    'Leather Belt',
    'Ankle Socks'
  ],
  Sports: [
    'Basketball',
    'Yoga Mat',
    'Dumbbell Set',
    'Soccer Ball',
    'Tennis Racket',
    'Mountain Bike',
    'Trail Running Shoes',
    'Golf Club Set',
    'Boxing Gloves',
    'Skateboard',
    'Fishing Rod',
    'Kayak',
    'Camping Tent',
    'Hiking Backpack',
    'Insulated Water Bottle',
    'Swim Goggles',
    'Baseball Bat',
    'Cycling Helmet',
    'Sports Jersey',
    'Jump Rope'
  ],
  'Home Goods': [
    'Velvet Sofa',
    'Modern Coffee Table',
    'Upholstered Bed Frame',
    'Dining Table',
    'Ergonomic Office Chair',
    'Bookshelf',
    'Arc Floor Lamp',
    'Area Rug',
    'Wall Art',
    'Throw Pillows',
    'Stand Mixer',
    'Coffee Maker',
    'High-Speed Blender',
    'Cookware Set',
    'Knife Set',
    'Air Fryer',
    'Towel Set',
    'Laundry Basket',
    'Storage Bins',
    'Plant Pot'
  ],
  Books: [
    'Fantasy Novel',
    'Biography',
    'Mystery Thriller',
    'Cookbook',
    'History Book',
    'Sci-Fi Novel',
    'Self-Help Book',
    "Children's Book",
    'Poetry Collection',
    'Travel Guide',
    'Graphic Novel',
    'Business Book',
    'Romance Novel',
    'Art Book',
    'Philosophy Book',
    'Programming Guide',
    'Gardening Book',
    'Memoir',
    'Dystopian Novel',
    'True Crime Book'
  ],
};

export const products: Product[] = Array.from({ length: 100 }, (_, i) => {
  const productIndex = i + 1;
  const categoryIndex = Math.floor(i / 20);
  const category = Object.keys(productNames)[categoryIndex] as keyof typeof productNames;
  const nameIndex = i % 20;
  const name = productNames[category][nameIndex];
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
