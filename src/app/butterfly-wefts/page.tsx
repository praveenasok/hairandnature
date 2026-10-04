import ProductPage from "@/components/ProductPage";

export default function ButterflyWefts() {
  return (
    <ProductPage 
      title="Butterfly Wefts"
      desc="Innovative weft design providing maximum volume with incredible comfort and durability. Experience luxurious fullness that moves beautifully with your natural hair."
      img="/images/butterfly_wefts.jpg"
      images={[
        "/images/butterfly_wefts.jpg",
        "/images/products/butterflyweft.jpg",
        "/images/products/butterflyweft2.jpg",
        "/images/products/butterflyweft3.webp"
      ]}
      specs={[
        { label: "Material", value: "100% Remy Human Hair" },
        { label: "Weight", value: "100 Grams Per Bundle" },
        { label: "Weft Type", value: "Double Drawn Butterfly Weft" },
        { label: "Installation", value: "Sew-in or Beaded Method" }
      ]}
    />
  );
}
