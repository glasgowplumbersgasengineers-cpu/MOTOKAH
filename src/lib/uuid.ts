// Scraped listings (Instagram/Jiji) carry synthetic string ids like
// "ig-al_husnainmotors-DXhjHf5CMBq" or "dealer-al_husnainmotors" instead of
// real database UUIDs. Several uuid-typed columns (conversations.participant2_id,
// reports.listing_id) reject these outright — use this check before attempting
// an insert that assumes a real UUID exists. Found live 2026-11-12.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isRealUuid(value: string | null | undefined): boolean {
  return !!value && UUID_RE.test(value);
}
