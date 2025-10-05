export interface ProductPrice {
  regular: number;
  sale?: number;
}

export interface ProductInventory {
  availability?: string;
  quantity?: number;
  lead_time?: string;
}

export interface ProductDescription {
  short?: string;
  full?: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  _id?: string;
  title: string;
  category?: string;
  price: ProductPrice;
  availability?: string;
  shortDescription?: string;
  description?: ProductDescription;
  leadTime?: string;
  sku?: string;
  imageUrl?: string;
  images?: ProductImage[];
  inventory?: ProductInventory;
  tags?: string[];
  featured?: boolean;
  isActive?: boolean;
}
