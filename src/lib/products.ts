export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  details: string[];
  sizes: string[];
  colors: string[];
  images: string[];
  badge?: string;
  featured?: boolean;
  soldOut?: boolean;
};

export const products: Product[] = [
  {
    id: "og-hoodie-black",
    name: "OG Heavyweight Hoodie",
    price: 128,
    originalPrice: 160,
    category: "Hoodies",
    description:
      "The hoodie that started it all. 500GSM heavyweight fleece, oversized silhouette, embroidered chain-stitch logo on chest. This is the real one.",
    details: [
      "500GSM heavyweight fleece",
      "Oversized unisex fit",
      "Chain-stitch embroidered logo",
      "Kangaroo pocket with hidden zip",
      "Ribbed cuffs and hem",
      "100% ring-spun cotton",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Charcoal"],
    images: ["/images/products/hoodie-black-1.jpg", "/images/products/hoodie-black-2.jpg"],
    badge: "Sale",
    featured: true,
  },
  {
    id: "platinum-tee",
    name: "Platinum Edition Tee",
    price: 68,
    category: "T-Shirts",
    description:
      "Drop-shoulder heavyweight tee with gold foil graphic. Limited run. When it's gone, it's gone.",
    details: [
      "320GSM heavyweight jersey",
      "Drop-shoulder fit",
      "Gold foil screen print",
      "Pre-washed for softness",
      "Double-stitched seams",
      "100% combed cotton",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Off-White"],
    images: ["/images/products/tee-platinum-1.jpg"],
    badge: "New",
    featured: true,
  },
  {
    id: "street-joggers",
    name: "Street King Joggers",
    price: 98,
    category: "Bottoms",
    description:
      "Premium heavyweight fleece joggers. Tapered fit with gold zipper accents on ankles. Built for the block and the boardroom.",
    details: [
      "400GSM French terry",
      "Tapered fit",
      "Elastic waistband with drawstring",
      "Gold-tone zipper ankle cuffs",
      "Two side pockets + one back zip pocket",
      "80% cotton, 20% polyester",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    images: ["/images/products/joggers-1.jpg"],
    featured: true,
  },
  {
    id: "era-snapback",
    name: "Era Snapback Cap",
    price: 48,
    category: "Accessories",
    description:
      "Structured 6-panel snapback with embroidered script logo. The finishing touch on any fit.",
    details: [
      "6-panel structured crown",
      "Flat brim",
      "Embroidered script logo",
      "Snapback closure",
      "One size fits most",
      "100% wool blend",
    ],
    sizes: ["One Size"],
    colors: ["Black/Gold"],
    images: ["/images/products/snapback-1.jpg"],
    badge: "Bestseller",
    featured: true,
  },
  {
    id: "velour-tracksuit",
    name: "Velour Tracksuit Set",
    price: 218,
    category: "Sets",
    description:
      "Full velour two-piece. Zip-up jacket and tapered pants. The ultimate early 2000s power move.",
    details: [
      "Premium velour fabric",
      "Full-zip jacket",
      "Tapered jogger pants",
      "Embroidered side stripe with logo",
      "Matching set sold together",
      "80% cotton velour, 20% polyester",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Deep Navy"],
    images: ["/images/products/velour-1.jpg"],
    badge: "Limited",
  },
  {
    id: "bomber-jacket",
    name: "Gold Label Bomber",
    price: 248,
    category: "Outerwear",
    description:
      "Satin bomber with chenille embroidery on back. The statement piece your wardrobe needs.",
    details: [
      "Premium satin shell",
      "Chenille embroidery on back panel",
      "Gold-tone zipper",
      "Ribbed collar, cuffs and hem",
      "Quilted interior lining",
      "100% polyester satin",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black"],
    images: ["/images/products/bomber-1.jpg"],
  },
  {
    id: "chain-tee-white",
    name: "Chain Logo Tee — White",
    price: 58,
    category: "T-Shirts",
    description:
      "The white tee, elevated. Oversized with a thick chain graphic and dropped shoulders.",
    details: [
      "300GSM heavyweight jersey",
      "Oversized fit",
      "Printed chain logo",
      "Dropped shoulders",
      "Pre-shrunk",
      "100% combed ring-spun cotton",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Cream"],
    images: ["/images/products/tee-chain-1.jpg"],
  },
  {
    id: "cargo-pants",
    name: "Utility Cargo Pants",
    price: 118,
    category: "Bottoms",
    description:
      "Heavyweight cargo pants with gold hardware on all pockets. The real street uniform.",
    details: [
      "Heavy canvas fabric",
      "6 utility pockets",
      "Gold-tone hardware",
      "Adjustable ankle straps",
      "Straight-leg fit",
      "100% cotton canvas",
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Black", "Olive"],
    images: ["/images/products/cargo-1.jpg"],
    soldOut: false,
  },
];

export const categories = ["All", "Hoodies", "T-Shirts", "Bottoms", "Outerwear", "Sets", "Accessories"];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter((p) => p.category === category);
}
