import { PlaceHolderImages } from './placeholder-images';
import type { Product, User, Order } from './types';

const descriptions = {
  Tech: 'Experience the future with our latest tech gadgets. Featuring stunning displays, powerful new chips, and pro-level features.',
  Fashion: 'Upgrade your style with our new collection. Trendy and timeless pieces for every occasion.',
  Sports: 'Achieve your fitness goals with our top-quality sports gear. Performance and durability guaranteed.',
  'Home Goods': 'Transform your living space with our beautiful and functional home goods. Quality meets design.',
  Books: 'Get lost in a new story. A wide selection of books for every reader.',
};

const productNames = {
  Tech: ['Gaming Laptop', 'Office Laptop', 'Smartphone', 'Flagship Phone', 'Wireless Headphones', 'Noise-Cancelling Headphones', 'Smart Watch', 'Fitness Tracker', 'Gaming Console', 'VR Headset', 'Camera Drone', '4K Monitor', 'Bluetooth Speaker', 'Digital Camera', 'E-Reader Tablet', 'Mechanical Keyboard', 'Wireless Mouse', 'Graphics Card', 'External SSD', 'Webcam'],
  Fashion: ['Leather Jacket', 'Winter Boots', 'Graphic T-Shirt', 'Running Sneakers', 'Summer Dress', 'Aviator Sunglasses', 'Designer Handbag', 'Wool Scarf', 'Business Suit', 'Slim-fit Chinos', 'Trench Coat', 'Knit Beanie', 'Silk Blouse', 'One-Piece Swimsuit', 'Yoga Leggings', 'Cotton Hoodie', 'Beach Sandals', 'Silver Necklace', 'Leather Belt', 'Ankle Socks'],
  Sports: ['Professional Basketball', 'Premium Yoga Mat', 'Adjustable Dumbbells', 'Official Soccer Ball', 'Graphite Tennis Racket', 'Mountain Bike', 'Trail Running Shoes', 'Pro Golf Clubs', 'Training Boxing Gloves', 'Cruiser Skateboard', 'Carbon Fiber Fishing Rod', 'Inflatable Kayak', '4-Person Camping Tent', 'Hiking Backpack', 'Insulated Water Bottle', 'Swimming Goggles', 'Wooden Baseball Bat', 'Cycling Helmet', 'Team Jersey', 'Speed Jump Rope'],
  'Home Goods': ['Velvet Sofa', 'Modern Coffee Table', 'Upholstered Bed Frame', 'Extendable Dining Table', 'Ergonomic Office Chair', 'Industrial Bookshelf', 'Arc Floor Lamp', 'Shag Area Rug', 'Abstract Wall Art', 'Decorative Throw Pillows', 'Stand Mixer', 'Drip Coffee Maker', 'High-Speed Blender', 'Non-stick Cookware Set', 'Chef\'s Knife Set', 'Digital Air Fryer', 'Luxury Towel Set', 'Wicker Laundry Basket', 'Stackable Storage Bins', 'Ceramic Plant Pot'],
  Books: ['Epic Fantasy Novel', 'Historical Biography', 'Psychological Thriller', 'Gourmet Cookbook', 'World History Encyclopedia', 'Space Opera Sci-Fi Novel', 'Mindfulness Self-Help Book', 'Illustrated Children\'s Book', 'Contemporary Poetry Collection', 'Adventure Travel Guide', 'Superhero Graphic Novel', 'Startup Business Book', 'Historical Romance Novel', 'Modern Art Book', 'Introduction to Philosophy', 'Python Programming Guide', 'Organic Gardening Book', 'Celebrity Memoir', 'Classic Dystopian Novel', 'Investigative True Crime'],
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
