export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AdminRole = 'super' | 'editor' | 'enquiry';
export type UserStatus = 'active' | 'invited' | 'suspended';
export type PublishStatus = 'pub' | 'draft' | 'review' | 'unpub';
export type EnquiryStatus = 'new' | 'contacted' | 'progress' | 'completed' | 'archived';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: AdminRole;
          status: UserStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role?: AdminRole;
          status?: UserStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: AdminRole;
          status?: UserStatus;
          updated_at?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          name: string;
          path: string;
          status: PublishStatus;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          id: string;
          name: string;
          path: string;
          status?: PublishStatus;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          name?: string;
          path?: string;
          status?: PublishStatus;
          updated_at?: string;
          updated_by?: string;
        };
      };
      page_sections: {
        Row: {
          id: string;
          page_id: string;
          section_id: string;
          name: string;
          title: string;
          subtitle: string;
          body: string;
          cta: string;
          cta_href: string;
          images: Json;
          is_carousel: boolean;
          is_hidden: boolean;
          order_index: number;
          draft_content: Json | null;
          published_content: Json;
          version: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          section_id: string;
          name: string;
          title?: string;
          subtitle?: string;
          body?: string;
          cta?: string;
          cta_href?: string;
          images?: Json;
          is_carousel?: boolean;
          is_hidden?: boolean;
          order_index?: number;
          draft_content?: Json | null;
          published_content?: Json;
          version?: number;
          updated_at?: string;
        };
        Update: {
          name?: string;
          title?: string;
          subtitle?: string;
          body?: string;
          cta?: string;
          cta_href?: string;
          images?: Json;
          is_carousel?: boolean;
          is_hidden?: boolean;
          order_index?: number;
          draft_content?: Json | null;
          published_content?: Json;
          version?: number;
          updated_at?: string;
        };
      };
      carousel_slides: {
        Row: {
          id: string;
          kicker: string;
          title: string;
          cap: string;
          left_text: string;
          right_text: string;
          cta: string;
          href: string;
          alt: string;
          en: boolean;
          fx: number;
          fy: number;
          file: string;
          order_index: number;
          status: 'pub' | 'draft';
          updated_at: string;
        };
        Insert: {
          id: string;
          kicker?: string;
          title?: string;
          cap?: string;
          left_text?: string;
          right_text?: string;
          cta?: string;
          href?: string;
          alt?: string;
          en?: boolean;
          fx?: number;
          fy?: number;
          file?: string;
          order_index?: number;
          status?: 'pub' | 'draft';
          updated_at?: string;
        };
        Update: {
          kicker?: string;
          title?: string;
          cap?: string;
          left_text?: string;
          right_text?: string;
          cta?: string;
          href?: string;
          alt?: string;
          en?: boolean;
          fx?: number;
          fy?: number;
          file?: string;
          order_index?: number;
          status?: 'pub' | 'draft';
          updated_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          path: string;
          filename: string;
          alt: string;
          credit: string;
          category: string;
          mime_type: string;
          size_bytes: number;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          path: string;
          filename: string;
          alt: string;
          credit: string;
          category?: string;
          mime_type?: string;
          size_bytes?: number;
          created_at?: string;
          created_by?: string;
        };
        Update: {
          alt?: string;
          credit?: string;
          category?: string;
        };
      };
      programmes: {
        Row: {
          id: string;
          name: string;
          tagline: string;
          duration: string;
          hours: string;
          eligibility: string;
          description: string;
          summary: string;
          learning_areas: Json;
          curriculum: Json;
          outcomes: Json;
          projects: Json;
          status: PublishStatus;
          order_index: number;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          tagline?: string;
          duration?: string;
          hours?: string;
          eligibility?: string;
          description?: string;
          summary?: string;
          learning_areas?: Json;
          curriculum?: Json;
          outcomes?: Json;
          projects?: Json;
          status?: PublishStatus;
          order_index?: number;
          updated_at?: string;
        };
        Update: {
          name?: string;
          tagline?: string;
          duration?: string;
          hours?: string;
          eligibility?: string;
          description?: string;
          summary?: string;
          learning_areas?: Json;
          curriculum?: Json;
          outcomes?: Json;
          projects?: Json;
          status?: PublishStatus;
          order_index?: number;
          updated_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          date: string;
          body: string;
          category: string;
          status: 'pub' | 'draft' | 'archived';
          order_index: number;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          date: string;
          body: string;
          category?: string;
          status?: 'pub' | 'draft' | 'archived';
          order_index?: number;
          updated_at?: string;
        };
        Update: {
          title?: string;
          date?: string;
          body?: string;
          category?: string;
          status?: 'pub' | 'draft' | 'archived';
          order_index?: number;
          updated_at?: string;
        };
      };
      enquiries: {
        Row: {
          id: string;
          type: string;
          sub_type: string;
          name: string;
          email: string;
          phone: string;
          district: string;
          message: string;
          status: EnquiryStatus;
          notes: string;
          consent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          sub_type?: string;
          name: string;
          email: string;
          phone?: string;
          district?: string;
          message?: string;
          status?: EnquiryStatus;
          notes?: string;
          consent: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: EnquiryStatus;
          notes?: string;
          updated_at?: string;
        };
      };
      invitations: {
        Row: {
          id: string;
          email: string;
          role: AdminRole;
          token: string;
          invited_by: string;
          expires_at: string;
          created_at: string;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          role: AdminRole;
          token: string;
          invited_by: string;
          expires_at: string;
          created_at?: string;
          accepted_at?: string | null;
        };
        Update: {
          accepted_at?: string | null;
        };
      };
      activity_log: {
        Row: {
          id: string;
          action: string;
          item: string;
          by_user: string;
          role: AdminRole;
          details: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          action: string;
          item: string;
          by_user: string;
          role: AdminRole;
          details?: string;
          created_at?: string;
        };
        Update: never;
      };
    };
  };
}
