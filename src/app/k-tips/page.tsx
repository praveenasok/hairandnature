import ProductPage from "@/components/ProductPage";

export default function KTips() {
  return (
    <ProductPage 
      title="K Tips"
      desc="Premium keratin-tipped extensions for individual strand-by-strand application and natural movement. These extensions offer a 360-degree range of motion for endless styling possibilities."
      img="/images/k_tips_light.jpg"
      specs={[
        { label: "Material", value: "100% Remy Human Hair" },
        { label: "Weight", value: "1 Gram Per Strand" },
        { label: "Bond Type", value: "Premium Italian Keratin" },
        { label: "Installation", value: "Hot Fusion Method" }
      ]}
    />
  );
}
