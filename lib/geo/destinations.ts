/*
 * Kerala destinations shown on the "Find Kerala" map.
 * Coordinates are WGS84 (decimal degrees) for the town or site centre.
 * `district` matches a region id in kerala-map.ts.
 * `label` says which side of the marker the name sits on, chosen so names do not
 * collide (the sea is to the west, the hills to the east).
 */

export type DestinationKind = 'hills' | 'backwaters' | 'coast' | 'heritage';

export type Destination = {
  name: string;
  /** The short descriptor shown after the name in lists. */
  tag: string;
  description: string;
  district: string;
  kind: DestinationKind;
  lat: number;
  lon: number;
  label: 'left' | 'right' | 'top';
};

export const DESTINATION_KINDS: Record<DestinationKind, string> = {
  hills: 'Hills and forest',
  backwaters: 'Backwaters',
  coast: 'Coast',
  heritage: 'Heritage towns',
};

export const DESTINATIONS: Destination[] = [
  { name: 'Munnar', tag: 'tea hills', kind: 'hills', district: 'idukki', lat: 10.0889, lon: 77.0595, label: 'right',
    description: 'Tea gardens folded over the Western Ghats, cool mornings and slow walks through the mist.' },
  { name: 'Alleppey', tag: 'backwaters', kind: 'backwaters', district: 'alappuzha', lat: 9.4981, lon: 76.3388, label: 'left',
    description: 'Canals, paddy fields and village life, seen from a houseboat at an unhurried pace.' },
  { name: 'Kumarakom', tag: 'lake and birds', kind: 'backwaters', district: 'kottayam', lat: 9.6175, lon: 76.4301, label: 'top',
    description: 'Quiet villages on Vembanad Lake, with a bird sanctuary that wakes at dawn.' },
  { name: 'Thekkady', tag: 'Periyar forest', kind: 'hills', district: 'idukki', lat: 9.6031, lon: 77.1615, label: 'right',
    description: 'Periyar forest and lake, spice gardens and gentle nature walks with local guides.' },
  { name: 'Wayanad', tag: 'forests and hills', kind: 'hills', district: 'wayanad', lat: 11.6085, lon: 76.083, label: 'right',
    description: 'Green hills, waterfalls and forest homestays on the high plateau of north Kerala.' },
  { name: 'Kovalam', tag: 'beach', kind: 'coast', district: 'thiruvananthapuram', lat: 8.4004, lon: 76.9787, label: 'right',
    description: 'Crescent beaches near the capital, calm in the mornings and known for Ayurveda.' },
  { name: 'Varkala', tag: 'cliff and temple', kind: 'coast', district: 'thiruvananthapuram', lat: 8.7379, lon: 76.7163, label: 'left',
    description: 'Red laterite cliffs above the sea, and the old Janardhana Swamy temple.' },
  { name: 'Kochi', tag: 'heritage and harbour', kind: 'heritage', district: 'ernakulam', lat: 9.9658, lon: 76.2421, label: 'left',
    description: 'A harbour town of Chinese fishing nets, old churches, synagogues and spice markets.' },
  { name: 'Thrissur', tag: 'temples', kind: 'heritage', district: 'thrissur', lat: 10.5276, lon: 76.2144, label: 'left',
    description: 'The cultural heart of Kerala, home to the Vadakkunnathan temple and Thrissur Pooram.' },
  { name: 'Kozhikode', tag: 'Malabar coast', kind: 'heritage', district: 'kozhikode', lat: 11.2588, lon: 75.7804, label: 'left',
    description: 'Long beaches, Malabar food and centuries of trade on the old spice route.' },
];

/** Where the world and India maps place the Kerala pin (central Kerala). */
export const KERALA_PIN = { lat: 10.25, lon: 76.4 };

export const mapsSearchUrl = (name: string) => `https://www.google.com/maps/search/${encodeURIComponent(name + ', Kerala')}`;
