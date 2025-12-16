/**
 * Shared types for homepage components
 */

export interface CircleEvent {
  id: string;
  name: string;
  starts_at: string;
  url: string;
  location_type: string;
  host?: string;
  member_name?: string;
  cover_image_url?: string;
  space?: {
    slug: string;
  };
}

export type UpdateType = 'news' | 'page' | 'event' | 'donate';

export interface Update {
  id: string;
  type: UpdateType;
  title: string;
  description: string;
  date: string;
  link: string;
  linkText: string;
  eventDate?: string;
  eventTime?: string;
  image?: string;
  published?: boolean;
  cta?: string;
}

export interface Newsletter {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail_url?: string;
  web_url: string;
  publish_date: number;
}

export interface Testimonial {
  name: string;
  quote: string;
  avatar: string | null;
  initials: string;
  color: string;
}
