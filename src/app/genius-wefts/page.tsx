import ProductPage from "@/components/ProductPage";

export default function GeniusWefts() {
  return (
    <ProductPage 
      title="Genius Wefts"
      desc="Ultra-thin and flexible wefts that lay perfectly flat against your scalp for seamless blending. Our genius wefts provide the ultimate comfort and a completely undetectable finish."
      img="/images/genius_wefts_light.jpg"
      images={[
        "/images/genius_wefts_light.jpg",
        "/images/products/geniusweft.jpg",
        "/images/products/geniusweft2.webp",
        "/images/products/geniusweft3.jpeg",
        "/images/products/geniusweft4.webp",
        "/images/genius_wefts.jpg"
      ]}
      specs={[
        { label: "Material", value: "100% Remy Human Hair" },
        { label: "Weight", value: "50 to 100 Grams Per Pack" },
        { label: "Weft Type", value: "Ultra-Thin Genius Weft" },
        { label: "Installation", value: "Sew-in Method" }
      ]}
    />
  );
}
