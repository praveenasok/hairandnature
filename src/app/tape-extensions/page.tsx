import ProductPage from "@/components/ProductPage";

export default function TapeExtensions() {
  return (
    <ProductPage 
      title="Tape Extensions"
      desc="Lightweight and discreet tape-ins that provide a natural, full-bodied look with long-lasting hold. Effortless to install and maintain, ensuring a flawlessly blended appearance."
      img="/images/tape_extensions.jpg"
      specs={[
        { label: "Material", value: "100% Remy Human Hair" },
        { label: "Weight Per Pack", value: "50 to 100 Grams" },
        { label: "Tabs Quantity", value: "20 or 40 Tape Tabs per pack" },
        { label: "Adhesive Type", value: "Medical-Grade Hypoallergenic Adhesive" }
      ]}
    />
  );
}
