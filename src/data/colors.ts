// Colors extracted from Spectrum One Hair Slimline Tapes collection
export interface HairColor {
  id: string;
  name: string;
  image: string;
  category: string;
}

export const SPECTRUM_COLORS: HairColor[] = [
  { id: 'frost', name: 'Frost', image: '/images/colors/frost.jpg', category: 'Blondes & Ash' },
  { id: 'arctic_blonde', name: 'Arctic Blonde', image: '/images/colors/arctic_blonde.jpg', category: 'Blondes & Ash' },
  { id: 'hd_ash', name: 'HD Ash', image: '/images/colors/hd_ash.jpg', category: 'Blondes & Ash' },
  { id: 'polar_ash', name: 'Polar Ash', image: '/images/colors/polar_ash.jpg', category: 'Blondes & Ash' },
  { id: 'midnight_kiss', name: 'Midnight Kiss', image: '/images/colors/midnight_kiss.jpg', category: 'Balayage & Rooted' },
  { id: 'rooted_steel', name: 'Rooted Steel', image: '/images/colors/rooted_steel.jpg', category: 'Balayage & Rooted' },
  { id: 'creamed_ash', name: 'Creamed Ash', image: '/images/colors/creamed_ash.jpg', category: 'Balayage & Rooted' },
  { id: 'champagne', name: 'Champagne', image: '/images/colors/champagne.jpg', category: 'Blondes & Ash' },
  { id: 'bora_bora', name: 'Bora Bora', image: '/images/colors/bora_bora.jpg', category: 'Blondes & Ash' },
  { id: 'vanilla', name: 'Vanilla', image: '/images/colors/vanilla.jpg', category: 'Blondes & Ash' },
  { id: 'shadowed_blonde', name: 'Shadowed Blonde', image: '/images/colors/shadowed_blonde.jpg', category: 'Balayage & Rooted' },
  { id: 'dusted_doll', name: 'Dusted Doll', image: '/images/colors/dusted_doll.jpg', category: 'Balayage & Rooted' },
  { id: 'beach_blonde', name: 'Beach Blonde', image: '/images/colors/beach_blonde.jpg', category: 'Blondes & Ash' },
  { id: 'butterscotch', name: 'Butterscotch', image: '/images/colors/butterscotch.jpg', category: 'Blondes & Ash' },
  { id: 'ash_bronde', name: 'Ash Bronde', image: '/images/colors/ash_bronde.jpg', category: 'Balayage & Rooted' },
  { id: 'bondi_blonde', name: 'Bondi Blonde', image: '/images/colors/bondi_blonde.jpg', category: 'Blondes & Ash' },
  { id: 'hazel_vanilla', name: 'Hazel & Vanilla', image: '/images/colors/hazel_vanilla.jpg', category: 'Balayage & Rooted' },
  { id: 'honeycomb', name: 'Honeycomb', image: '/images/colors/honeycomb.jpg', category: 'Balayage & Rooted' },
  { id: 'hazel', name: 'Hazel', image: '/images/colors/hazel.jpg', category: 'Brunettes & Warm' },
  { id: 'sand', name: 'Sand', image: '/images/colors/sand.jpg', category: 'Brunettes & Warm' },
  { id: 'honey_melt', name: 'Honey Melt', image: '/images/colors/honey_melt.jpg', category: 'Balayage & Rooted' },
  { id: 'chocolate_sunset', name: 'Chocolate Sunset', image: '/images/colors/chocolate_sunset.jpg', category: 'Balayage & Rooted' },
  { id: 'brondie', name: 'Brondie', image: '/images/colors/brondie.jpg', category: 'Balayage & Rooted' },
  { id: 'teak', name: 'Teak', image: '/images/colors/teak.jpg', category: 'Brunettes & Warm' },
  { id: 'lady_ash', name: 'Lady Ash', image: '/images/colors/lady_ash.jpg', category: 'Brunettes & Warm' },
  { id: 'natural_beauty', name: 'Natural Beauty', image: '/images/colors/natural_beauty.jpg', category: 'Brunettes & Warm' },
  { id: 'bourbon', name: 'Bourbon', image: '/images/colors/bourbon.jpg', category: 'Brunettes & Warm' },
  { id: 'umber', name: 'Umber', image: '/images/colors/umber.jpg', category: 'Brunettes & Warm' },
  { id: 'havana_dusk', name: 'Havana Dusk', image: '/images/colors/havana_dusk.jpg', category: 'Balayage & Rooted' },
  { id: 'caramel_deluxe', name: 'Caramel Deluxe', image: '/images/colors/caramel_deluxe.jpg', category: 'Balayage & Rooted' },
  { id: 'bronzed_bae', name: 'Bronzed Bae', image: '/images/colors/bronzed_bae.png', category: 'Balayage & Rooted' },
  { id: 'chestnut', name: 'Chestnut', image: '/images/colors/chestnut.jpg', category: 'Brunettes & Warm' },
  { id: 'spiced_brunette', name: 'Spiced Brunette', image: '/images/colors/spiced_brunette.jpg', category: 'Brunettes & Warm' },
  { id: 'brunette', name: 'Brunette', image: '/images/colors/brunette.jpg', category: 'Brunettes & Warm' },
  { id: 'dark_secret', name: 'Dark Secret', image: '/images/colors/dark_secret.jpg', category: 'Dark & Rich' },
  { id: 'espresso', name: 'Espresso', image: '/images/colors/espresso.webp', category: 'Dark & Rich' },
  { id: 'midnight_brown', name: 'Midnight Brown', image: '/images/colors/midnight_brown.jpg', category: 'Dark & Rich' },
  { id: 'eclipse', name: 'Eclipse', image: '/images/colors/eclipse.jpg', category: 'Dark & Rich' },
];

export const COLOR_CATEGORIES = ['All', 'Blondes & Ash', 'Balayage & Rooted', 'Brunettes & Warm', 'Dark & Rich'] as const;
