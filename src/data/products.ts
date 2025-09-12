export interface Product {
    id: string;
    title: string;
    category: 'Flowers' | 'Keychains' | 'Designs' | 'Personal Accessories';
    price: number;
    availability: 'In Stock' | 'Made to Order' | 'Limited Edition';
    shortDescription: string;
    leadTime: string;
    sku: string;
    imageUrl: string;
  }
  
  export const products: Product[] = [
    {
      id: "P001",
      title: "Pastel Rose Keychain",
      category: "Keychains",
      price: 199,
      availability: "Made to Order",
      shortDescription: "Handmade pastel rose keychain with tassel.",
      leadTime: "7-10 days",
      sku: "NC-KC-001",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: "P002",
      title: "Mini Daisy Brooch",
      category: "Flowers",
      price: 249,
      availability: "In Stock",
      shortDescription: "Cute daisy brooch for bags and jackets.",
      leadTime: "In Stock",
      sku: "NC-FL-002",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: "P003",
      title: "Crochet Heart Keychain",
      category: "Keychains",
      price: 149,
      availability: "Made to Order",
      shortDescription: "Tiny heart keychain, perfect for gifts.",
      leadTime: "7-10 days",
      sku: "NC-KC-003",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: "P004",
      title: "Baby Booties - Pink",
      category: "Personal Accessories",
      price: 499,
      availability: "Made to Order",
      shortDescription: "Soft baby booties, hand-crocheted in acrylic yarn.",
      leadTime: "7-10 days",
      sku: "NC-PA-004",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: "P005",
      title: "Floral Coaster Set (4)",
      category: "Designs",
      price: 399,
      availability: "In Stock",
      shortDescription: "Set of 4 floral crochet coasters.",
      leadTime: "In Stock",
      sku: "NC-DS-005",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: "P006",
      title: "Amigurumi Cat",
      category: "Designs",
      price: 599,
      availability: "Made to Order",
      shortDescription: "Adorable amigurumi cat plush (approx 15cm).",
      leadTime: "7-10 days",
      sku: "NC-DS-006",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: "P007",
      title: "Sunflower Keychain",
      category: "Keychains",
      price: 199,
      availability: "In Stock",
      shortDescription: "Bright sunflower keychain with ring.",
      leadTime: "In Stock",
      sku: "NC-KC-007",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: "P008",
      title: "Leaf Bookmark",
      category: "Designs",
      price: 129,
      availability: "In Stock",
      shortDescription: "Flat crochet leaf bookmark for books.",
      leadTime: "In Stock",
      sku: "NC-DS-008",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: "P009",
      title: "Boho Bag Charm",
      category: "Personal Accessories",
      price: 349,
      availability: "Made to Order",
      shortDescription: "Boho-style bag charm with wooden bead.",
      leadTime: "7-10 days",
      sku: "NC-PA-009",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: "P010",
      title: "Mini Rose Bouquet",
      category: "Flowers",
      price: 799,
      availability: "Limited Edition",
      shortDescription: "Handtied mini bouquet (3 roses) — limited.",
      leadTime: "In Stock",
      sku: "NC-FL-010",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: "P011",
      title: "Crochet Bracelet",
      category: "Personal Accessories",
      price: 249,
      availability: "In Stock",
      shortDescription: "Adjustable crochet bracelet with button.",
      leadTime: "In Stock",
      sku: "NC-PA-011",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    {
      id: "P012",
      title: "Keyring Tassel Combo",
      category: "Keychains",
      price: 299,
      availability: "Made to Order",
      shortDescription: "Tassel + charm keyring combo.",
      leadTime: "7-10 days",
      sku: "NC-KC-012",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    }
  ];
  
  export const categories = ['Flowers', 'Keychains', 'Designs', 'Personal Accessories'] as const;