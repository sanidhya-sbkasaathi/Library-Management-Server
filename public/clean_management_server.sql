-- ====================================================================
-- SQL SCRIPT: PURGE / RESET ALL DATA IN MAIN MANAGEMENT SERVER (SUPABASE)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ====================================================================

-- 1. Disable triggers and foreign keys temporarily for clean wipe
SET session_replication_role = 'replica';

-- 2. Truncate / Delete all data from Management Server Tables
TRUNCATE TABLE IF EXISTS public.organizations CASCADE;
TRUNCATE TABLE IF EXISTS public.licenses CASCADE;
TRUNCATE TABLE IF EXISTS public.devices CASCADE;
TRUNCATE TABLE IF EXISTS public.role_credentials CASCADE;
TRUNCATE TABLE IF EXISTS public.audit_logs CASCADE;
TRUNCATE TABLE IF EXISTS public.admin_users CASCADE;

-- 3. Truncate / Delete all data from Business Tables (if present in central DB)
TRUNCATE TABLE IF EXISTS public.students CASCADE;
TRUNCATE TABLE IF EXISTS public.admissions CASCADE;
TRUNCATE TABLE IF EXISTS public.seats CASCADE;
TRUNCATE TABLE IF EXISTS public.attendance CASCADE;
TRUNCATE TABLE IF EXISTS public.payments CASCADE;
TRUNCATE TABLE IF EXISTS public.staff CASCADE;
TRUNCATE TABLE IF EXISTS public.notices CASCADE;
TRUNCATE TABLE IF EXISTS public.expenses CASCADE;
TRUNCATE TABLE IF EXISTS public.visitors CASCADE;
TRUNCATE TABLE IF EXISTS public.complaints CASCADE;
TRUNCATE TABLE IF EXISTS public.lockers CASCADE;
TRUNCATE TABLE IF EXISTS public.membership_plans CASCADE;
TRUNCATE TABLE IF EXISTS public.sync_queue CASCADE;
TRUNCATE TABLE IF EXISTS public.sync_outbox CASCADE;

-- 4. Re-enable triggers and foreign keys
SET session_replication_role = 'origin';

-- 5. Seed Super Admin User in public.admin_users
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

-- ====================================================================
-- OPTIONAL: Clean auth.users (If you wish to reset Supabase Auth accounts)
-- ====================================================================
-- DELETE FROM auth.users WHERE email != 'sbkasaathilibrary@gmail.com';
-- ====================================================================
