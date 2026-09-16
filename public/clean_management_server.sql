-- ====================================================================
-- SQL SCRIPT: PURGE / RESET ALL DATA IN MAIN MANAGEMENT SERVER (SUPABASE)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ====================================================================

-- 1. Disable triggers and foreign keys temporarily for clean wipe
SET session_replication_role = 'replica';

-- 2. Clean wipe all existing tables in public schema safely via PL/pgSQL block
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Loop through all base tables in public schema and truncate them
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' CASCADE;';
    END LOOP;
END $$;

-- 3. Re-enable triggers and foreign keys
SET session_replication_role = 'origin';

-- 4. Seed Root Super Admin in public.admin_users (if table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_users'
    ) THEN
        INSERT INTO public.admin_users (id, name, email, role, status, last_active, created_at)
        VALUES (
            gen_random_uuid(),
            'Super Admin',
            'sbkasaathilibrary@gmail.com',
            'Super Admin',
            'ACTIVE',
            'Just now',
            NOW()
        ) ON CONFLICT (email) DO UPDATE SET
            role = 'Super Admin',
            status = 'ACTIVE',
            last_active = 'Just now';
    END IF;
END $$;

-- ====================================================================
-- DONE: All data purged and Super Admin re-initialized.
-- ====================================================================
