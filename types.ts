
export type Domain = 'Music' | 'Arts' | 'Humor' | 'Poetry' | 'Literature' | 'Business' | 'Tech' | 'Politics' | 'Diplomacy' | 'Military' | 'Academics' | 'History';

export type Language = 'en' | 'fr' | 'ar';

export interface Relation {
  personId: number;
  type: string; // e.g., 'Spouse', 'Child', 'Mentor'
}

export interface Media {
  type: 'image' | 'video';
  url: string;
  caption: string;
}

export interface Personality {
  id: number;
  name: { [key in Language]: string };
  domain: Domain;
  bio: { [key in Language]: string };
  birthYear: number;
  deathYear?: number;
  birthPlace: { [key in Language]: string };
  gender: 'male' | 'female';
  mainImageUrl: string;
  rating: number;
  ratingVotes?: number;
  mediaGallery: Media[];
  relations: Relation[];
  notableWorks: { title: { [key in Language]: string }, year: number }[];
  awards: string[];
  externalLinks: { name: string, url:string }[];
}
