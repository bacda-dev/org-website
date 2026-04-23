/**
 * Supabase Database type — public schema.
 *
 * Hand-written to match `supabase/migrations/0001_*.sql` … `0013_*.sql`.
 * When a live Supabase instance is available, regenerate with:
 *
 *   npx supabase gen types typescript --local > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type EventStatus = 'upcoming' | 'past' | 'draft';

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          event_date: string; // date (ISO YYYY-MM-DD)
          end_date: string | null;
          venue_name: string | null;
          venue_address: string | null;
          venue_map_url: string | null;
          poster_url: string | null;
          youtube_id: string | null;
          ticket_url: string | null;
          ticket_cta: string | null;
          status: EventStatus;
          is_featured: boolean;
          year: number; // generated
          collaborators: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          event_date: string;
          end_date?: string | null;
          venue_name?: string | null;
          venue_address?: string | null;
          venue_map_url?: string | null;
          poster_url?: string | null;
          youtube_id?: string | null;
          ticket_url?: string | null;
          ticket_cta?: string | null;
          status: EventStatus;
          is_featured?: boolean;
          collaborators?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      event_photos: {
        Row: {
          id: string;
          event_id: string;
          storage_path: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          storage_path: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['event_photos']['Insert']>;
      };
      event_videos: {
        Row: {
          id: string;
          event_id: string | null;
          youtube_id: string;
          title: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          youtube_id: string;
          title?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['event_videos']['Insert']>;
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          author_name: string;
          author_title: string | null;
          author_photo_url: string | null;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote: string;
          author_name: string;
          author_title?: string | null;
          author_photo_url?: string | null;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>;
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string | null;
          photo_url: string | null;
          credits: string[] | null;
          is_lead: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          bio?: string | null;
          photo_url?: string | null;
          credits?: string[] | null;
          is_lead?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>;
      };
      home_content: {
        Row: {
          id: string;
          singleton_key: string;
          hero_headline: string;
          hero_subheadline: string | null;
          hero_image_url: string | null;
          hero_video_url: string | null;
          featured_event_id: string | null;
          mission_statement: string | null;
          donate_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          singleton_key?: string;
          hero_headline: string;
          hero_subheadline?: string | null;
          hero_image_url?: string | null;
          hero_video_url?: string | null;
          featured_event_id?: string | null;
          mission_statement?: string | null;
          donate_url?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['home_content']['Insert']>;
      };
      gallery_videos: {
        Row: {
          id: string;
          youtube_id: string;
          title: string | null;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          youtube_id: string;
          title?: string | null;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['gallery_videos']['Insert']>;
      };
      instagram_highlights: {
        Row: {
          id: string;
          post_url: string;
          caption: string | null;
          thumbnail_url: string | null;
          author: string | null;
          posted_at: string | null;
          sort_order: number;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_url: string;
          caption?: string | null;
          thumbnail_url?: string | null;
          author?: string | null;
          posted_at?: string | null;
          sort_order?: number;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['instagram_highlights']['Insert']>;
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          website_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['sponsors']['Insert']>;
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      event_status: EventStatus;
    };
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Convenience row-type aliases for application code.
// ─────────────────────────────────────────────────────────────────────────
export type EventRow = Database['public']['Tables']['events']['Row'];
export type EventPhotoRow = Database['public']['Tables']['event_photos']['Row'];
export type EventVideoRow = Database['public']['Tables']['event_videos']['Row'];
export type TestimonialRow = Database['public']['Tables']['testimonials']['Row'];
export type TeamMemberRow = Database['public']['Tables']['team_members']['Row'];
export type HomeContentRow = Database['public']['Tables']['home_content']['Row'];
export type GalleryVideoRow = Database['public']['Tables']['gallery_videos']['Row'];
export type InstagramHighlightRow =
  Database['public']['Tables']['instagram_highlights']['Row'];
export type SponsorRow = Database['public']['Tables']['sponsors']['Row'];
export type ContactSubmissionRow =
  Database['public']['Tables']['contact_submissions']['Row'];
