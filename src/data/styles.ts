export interface HairStyle {
  id: string;
  name: string;
  image: string;
  pattern: string;
  description: string;
  curlType: string;
}

export const HAIR_STYLES: HairStyle[] = [
  {
    id: 'natural_straight',
    name: 'Natural Straight',
    image: '/images/styles/natural_straight.jpg',
    pattern: 'Sleek & Bone Straight',
    description: 'Silky smooth, pin-straight with radiant mirror shine and zero wave pattern.',
    curlType: 'Type 1A - 1B'
  },
  {
    id: 'natural_wave',
    name: 'Natural Wave',
    image: '/images/styles/natural_wave.jpg',
    pattern: 'Soft Loose S-Wave',
    description: 'Relaxed, effortless beachy waves with fluid natural body and soft movement.',
    curlType: 'Type 2A - 2B'
  },
  {
    id: 'body_wave',
    name: 'Body Wave',
    image: '/images/styles/body_wave.jpg',
    pattern: 'Voluminous Bouncy Ripple',
    description: 'Deep, uniform cascading S-curves delivering glamorous red-carpet volume.',
    curlType: 'Type 2B - 2C'
  },
  {
    id: 'deep_wave',
    name: 'Deep Wave',
    image: '/images/styles/deep_wave.jpg',
    pattern: 'Defined Spiral Waves',
    description: 'Tight, sculpted spiral waves with distinct texture ridges and luscious fullness.',
    curlType: 'Type 3A - 3B'
  },
  {
    id: 'kinky_curls',
    name: 'Kinky Curls',
    image: '/images/styles/kinky_curls.jpg',
    pattern: 'Springy Corkscrew Coils',
    description: 'Tight, springy corkscrew ringlets with vibrant bounce and high density.',
    curlType: 'Type 3C - 4A'
  },
  {
    id: 'afro_curls',
    name: 'Afro Curls',
    image: '/images/styles/afro_curls.jpg',
    pattern: 'Dense 4B/4C Micro-Coils',
    description: 'Ultra-dense, tight zig-zag afro coils providing magnificent natural volume.',
    curlType: 'Type 4B - 4C'
  }
];

export const STYLE_NAMES = HAIR_STYLES.map(s => s.name);
