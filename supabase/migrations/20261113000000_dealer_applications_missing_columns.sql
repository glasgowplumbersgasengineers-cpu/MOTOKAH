-- NOT APPLIED — prepared locally only, per standing restriction on production
-- database changes without explicit approval. Apply with `supabase db push`
-- (or via the dashboard) only after Owner approves.
--
-- Real bug found 2026-11-13: BecomeDealer.tsx's form collects whatsapp,
-- instagram, dealer_type, description and website, but dealer_applications
-- has no columns for any of them — the insert silently drops all five, so an
-- applicant's WhatsApp/Instagram/website/business-type/description are lost
-- with zero indication, and admins reviewing applications never see them.
-- This migration adds the missing columns so the form's existing fields can
-- actually be saved (frontend insert call still needs updating to send them
-- once this is applied — not done yet, to avoid breaking submissions against
-- the current live schema in the meantime).

alter table public.dealer_applications
  add column if not exists whatsapp text,
  add column if not exists instagram text,
  add column if not exists website text,
  add column if not exists description text,
  add column if not exists dealer_type text;
