-- Motokah uses Supabase REST via supabase-js, not the GraphQL endpoint.
-- Removing pg_graphql prevents public/authenticated table discovery through GraphQL.
drop extension if exists pg_graphql;
