-- Applied live 2026-11-14. The secret was created separately with
-- vault.create_secret(<random>, 'internal_push_secret') and set as the INTERNAL_PUSH_SECRET
-- edge function secret; it is intentionally not in this file.
create extension if not exists pg_net;
create extension if not exists pg_cron;

select cron.schedule('run-push-campaigns', '*/15 * * * *', $$
  select net.http_post(
    url := 'https://dimywnbmmliluounwqfb.supabase.co/functions/v1/run-push-campaigns',
    headers := jsonb_build_object('x-internal-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'internal_push_secret'), 'Content-Type', 'application/json'),
    body := '{}'::jsonb
  );
$$);
