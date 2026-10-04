import ProductPage from "@/components/ProductPage";

export default function SeamlessClipOn() {
  return (
    <ProductPage 
      title="ClipOn Extensions"
      desc="Instantly add length and volume with our easy-to-use, damage-free clip-on extensions. Made from 100% Remy human hair, these extensions are perfect for a quick transformation."
      img="/images/seamless_clipon.jpg"
      images={[
        "/images/seamless_clipon.jpg",
        "/images/products/clipon.webp",
        "/images/products/clipon2.jpeg",
        "/images/products/clipon3.jpeg"
      ]}
      specs={[
        { label: "Material", value: "100% Remy Human Hair" },
        { label: "Weight", value: "100 to 120 Grams Per Set" },
        { label: "Pieces", value: "7-Piece Set" },
        { label: "Clips", value: "Silicone-Lined Seamless Clips" }
      ]}
    />
  );
}
