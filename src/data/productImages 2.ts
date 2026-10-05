// Physical hair extension product pack/bundle image mappings
// Used across ProductPage, GlobalEnquiryDrawer, and EnquiryContext
// to ensure product images are shown instead of model headshots.

export const PRODUCT_PHYSICAL_IMAGES: Record<string, string> = {
  // Tape Extensions
  "tape extensions": "/images/products/tapeextensions.webp",
  "tape-extensions": "/images/products/tapeextensions.webp",
  "/tape-extensions": "/images/products/tapeextensions.webp",

  // K Tips
  "k tips": "/images/products/KTip2.png",
  "k-tips": "/images/products/KTip2.png",
  "k tips extensions": "/images/products/KTip2.png",
  "/k-tips": "/images/products/KTip2.png",

  // Genius Wefts
  "genius wefts": "/images/products/geniusweft.jpg",
  "genius-wefts": "/images/products/geniusweft.jpg",
  "genius weft extensions": "/images/products/geniusweft.jpg",
  "/genius-wefts": "/images/products/geniusweft.jpg",

  // Butterfly Wefts
  "butterfly wefts": "/images/products/butterflyweft.jpg",
  "butterfly-wefts": "/images/products/butterflyweft.jpg",
  "butterfly weft extensions": "/images/products/butterflyweft.jpg",
  "/butterfly-wefts": "/images/products/butterflyweft.jpg",

  // ClipOn Extensions
  "clipon extensions": "/images/products/clipon.webp",
  "clip-on extensions": "/images/products/clipon.webp",
  "clip on extensions": "/images/products/clipon.webp",
  "seamless clip-on": "/images/products/clipon.webp",
  "seamless-clipon-extensions": "/images/products/clipon.webp",
  "/seamless-clipon-extensions": "/images/products/clipon.webp",

  // Retail products (data/products.ts)
  "premium diy hair bun": "/images/hair_bun.png",
  "hair-bun": "/images/hair_bun.png",
  "caramel brown highlights": "/images/hair_highlights.png",
  "hair-highlights": "/images/hair_highlights.png",
  "sleek flatclip ponytail": "/images/flatclip_ponytail.png",
  "flatclip-ponytail": "/images/flatclip_ponytail.png",
  "elegant clutch bun": "/images/clutch_bun.png",
  "clutch-bun": "/images/clutch_bun.png",
  "volume boost cover patch": "/images/single_clip_patch.png",
  "single-clip-patch": "/images/single_clip_patch.png",
};

// Maps model headshots / hero photos to the respective physical product images
export const MODEL_IMAGE_REPLACEMENTS: Record<string, string> = {
  "/images/tape_extensions.jpg": "/images/products/tapeextensions.webp",
  "/images/k_tips_light.jpg": "/images/products/KTip2.png",
  "/images/k_tips.jpg": "/images/products/KTip2.png",
  "/images/genius_wefts_light.jpg": "/images/products/geniusweft.jpg",
  "/images/genius_wefts.jpg": "/images/products/geniusweft.jpg",
  "/images/butterfly_wefts.jpg": "/images/products/butterflyweft.jpg",
  "/images/seamless_clipon.jpg": "/images/products/clipon.webp",
  "/images/caucasian_models_hair.jpg": "/images/products/tapeextensions.webp",
  "/images/hero_general_1.jpg": "/images/products/tapeextensions.webp",
  "/images/hero_general_2.jpg": "/images/products/tapeextensions.webp",
};

// Thumbnail display adjustments for square preview boxes (such as 64x64 drawer cards)
export const DRAWER_IMAGE_STYLE_CONFIG: Record<string, { position: string; transform?: string }> = {
  "/images/products/tapeextensions.webp": { position: "center 56%", transform: "scale(1.08)" },
  "/images/products/tapeextensions2.webp": { position: "18% 45%", transform: "scale(1.08)" },
  "/images/products/KTip2.png": { position: "center 22%", transform: "scale(1.06)" },
  "/images/products/KTip.jpg": { position: "22% 50%", transform: "scale(1.12)" },
  "/images/products/geniusweft.jpg": { position: "center 42%", transform: "scale(1.05)" },
  "/images/products/geniusweft2.webp": { position: "center 40%" },
  "/images/products/butterflyweft.jpg": { position: "58% 36%", transform: "scale(1.12)" },
  "/images/products/butterflyweft2.jpg": { position: "30% 65%" },
  "/images/products/clipon.webp": { position: "center 22%", transform: "scale(1.06)" },
};

/**
 * Returns the physical hair extension product image given title, current image, or productId.
 * Guarantees that model headshot images are replaced by the authentic hair extension product photo.
 */
export function getProductThumbnail(title?: string, image?: string, productId?: string): string {
  // 1. If the provided image is a known model photo, substitute it immediately
  if (image && MODEL_IMAGE_REPLACEMENTS[image]) {
    return MODEL_IMAGE_REPLACEMENTS[image];
  }

  // 2. Lookup by normalized title
  if (title) {
    const key = title.trim().toLowerCase();
    if (PRODUCT_PHYSICAL_IMAGES[key]) {
      return PRODUCT_PHYSICAL_IMAGES[key];
    }
    // Partial title matching
    for (const [k, v] of Object.entries(PRODUCT_PHYSICAL_IMAGES)) {
      if (key.includes(k) || k.includes(key)) {
        return v;
      }
    }
  }

  // 3. Lookup by productId
  if (productId) {
    const key = productId.trim().toLowerCase();
    if (PRODUCT_PHYSICAL_IMAGES[key]) {
      return PRODUCT_PHYSICAL_IMAGES[key];
    }
  }

  // 4. If the image is already a physical product photo, keep it
  if (image && (
    image.startsWith('/images/products/') ||
    image.startsWith('/images/hair_') ||
    image.startsWith('/images/new_hair_') ||
    image.startsWith('/images/flatclip_') ||
    image.startsWith('/images/new_flatclip_') ||
    image.startsWith('/images/clutch_') ||
    image.startsWith('/images/single_clip_')
  )) {
    return image;
  }

  // 5. If image exists and is not a model image
  if (image && !image.includes('model') && !image.includes('caucasian') && !MODEL_IMAGE_REPLACEMENTS[image]) {
    return image;
  }

  // Fallback to Tape Extensions product pack
  return "/images/products/tapeextensions.webp";
}
