export interface CartItem {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  price: number; // numeric unit price for calculations
  quantity: number;
}