export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: string;
  images: string[];
  specs: Record<string, string>;
  inStock: boolean;
  isFeatured: boolean;
  isRecommended: boolean;
  colors: string[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: {
    product: Product;
    quantity: number;
    price: number;
    selectedColor?: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  trackingNo: string;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
}
