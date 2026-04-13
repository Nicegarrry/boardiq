-- BoardIQ — Storage Buckets
-- Creates Supabase Storage buckets for document management.

INSERT INTO storage.buckets (id, name, public) VALUES
  ('documents', 'documents', false),
  ('organisation-assets', 'organisation-assets', true),
  ('exports', 'exports', false),
  ('avatars', 'avatars', true);
