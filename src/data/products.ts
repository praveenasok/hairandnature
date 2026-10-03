export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "hair-bun",
    name: "Premium DIY Hair Bun",
    price: 999,
    description: "Instantly add volume and elegance with our premium DIY Hair Bun. Made with high-quality synthetic fibers that seamlessly blend with Indian hair textures.",
    image: "/images/hair_bun.png",
  },
  {
    id: "hair-highlights",
    name: "Caramel Brown Highlights",
    price: 1299,
    description: "Get that salon-finish highlighted look in seconds without damaging your natural hair. Easy to clip in and style.",
    image: "/images/hair_highlights.png",
  },
  {
    id: "flatclip-ponytail",
    name: "Sleek Flatclip Ponytail",
    price: 1499,
    description: "Achieve a long, sleek, and voluminous ponytail effortlessly. Our secure flatclip design ensures all-day comfort.",
    image: "/images/flatclip_ponytail.png",
  },
  {
    id: "clutch-bun",
    name: "Elegant Clutch Bun",
    price: 899,
    description: "The perfect quick-fix for bad hair days. Just clutch it over your natural bun for an instantly polished look.",
    image: "/images/clutch_bun.png",
  },
  {
    id: "single-clip-patch",
    name: "Volume Boost Cover Patch",
    price: 799,
    description: "Conceal thinning areas and add instant volume at the crown with our lightweight, breathable single clip cover patch.",
    image: "/images/single_clip_patch.png",
  },
];
