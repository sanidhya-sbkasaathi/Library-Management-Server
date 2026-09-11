-- ====================================================================
-- MASTER SUPABASE MULTI-TENANT & MANAGEMENT SERVER SCHEMA
-- Universal Reading Library & Central Management Platform
-- Project URL: https://jsvevzzupajrgzxsmmyr.supabase.co
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- PART A: MANAGEMENT SERVER TABLES (Control Plane)
-- ====================================================================

-- 1. Organizations (Customer Libraries)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id TEXT UNIQUE NOT NULL, -- e.g. ORG-ABC001
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    state TEXT,
    district TEXT,
    plan TEXT NOT NULL DEFAULT 'Professional', -- 'Basic', 'Professional', 'Enterprise'
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING'
    active_users INTEGER DEFAULT 1,
    devices INTEGER DEFAULT 0,
    max_devices INTEGER DEFAULT 5,
    max_staff INTEGER DEFAULT 20,
    max_students INTEGER DEFAULT 1000,
    storage_used_gb NUMERIC(6,2) DEFAULT 0.1,
    storage_limit_gb NUMERIC(6,2) DEFAULT 10.0,
    license_id TEXT,
    license_health_percent INTEGER DEFAULT 100,
    expires_in_days INTEGER DEFAULT 365,
    expiry_date TEXT,
    database_version TEXT DEFAULT 'v014',
    last_sync TEXT DEFAULT 'Just registered',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    modules JSONB DEFAULT '["Student Management", "Seat Management", "Attendance", "Fees", "Expenses", "Reports", "Staff", "Locker", "Visitor", "Documents"]'::jsonb
);

-- 2. Licenses Table
CREATE TABLE IF NOT EXISTS public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id TEXT UNIQUE NOT NULL, -- e.g. LIC-8F72K91
    organization_id TEXT NOT NULL,
    org_name TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'Professional',
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'REVOKED'
    start_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    max_devices INTEGER DEFAULT 5,
    current_devices INTEGER DEFAULT 0,
    key_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Devices Table
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT UNIQUE NOT NULL, -- e.g. DEVICE-7A91X
    organization_id TEXT NOT NULL,
    org_name TEXT NOT NULL,
    license_id TEXT NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ONLINE', -- 'ONLINE', 'OFFLINE', 'PROVISIONING', 'ERROR'
    last_seen TEXT DEFAULT 'Just now',
    activated_at TEXT DEFAULT 'Today',
    hardware_fingerprint TEXT,
    app_version TEXT DEFAULT 'v3.2.1',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Role Activation Credentials (One-time short-lived onboarding tokens)
CREATE TABLE IF NOT EXISTS public.role_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- e.g. ABCD-8K29-XP4M
    role TEXT NOT NULL, -- 'Super Admin', 'Librarian', 'Assistant', 'Receptionist', 'Viewer'
    organization_id TEXT NOT NULL,
    org_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'UNUSED', -- 'UNUSED', 'USED', 'EXPIRED'
    expires_at TEXT NOT NULL,
    assigned_to_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. System Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TEXT NOT NULL,
    event TEXT NOT NULL,
    organization TEXT NOT NULL,
    actor TEXT NOT NULL,
    details TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'security', -- 'activation', 'license', 'provisioning', 'security', 'user'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Management Admin Staff
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'Super Admin',
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    last_active TEXT DEFAULT 'Now',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- PART B: MULTI-TENANT LIBRARY BUSINESS TABLES (Data Plane)
-- ====================================================================

-- 7. Students Directory
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL, -- e.g. STU-1024
    association_id TEXT NOT NULL,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    seat_number TEXT,
    plan_name TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    valid_until TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Admissions
CREATE TABLE IF NOT EXISTS public.admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_number TEXT NOT NULL,
    association_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    seat_number TEXT,
    plan_name TEXT,
    amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'UPI',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Seats Matrix
CREATE TABLE IF NOT EXISTS public.seats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seat_number TEXT NOT NULL, -- e.g. A01, A23
    association_id TEXT NOT NULL,
    room_name TEXT NOT NULL DEFAULT 'Hall A',
    status TEXT NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'
    student_id TEXT,
    student_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Attendance Records
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    association_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    seat_number TEXT,
    check_in TEXT NOT NULL,
    check_out TEXT,
    status TEXT NOT NULL DEFAULT 'Inside',
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Payments Ledger
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number TEXT NOT NULL,
    association_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    method TEXT NOT NULL DEFAULT 'UPI',
    status TEXT NOT NULL DEFAULT 'PAID',
    payment_date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Sync Outbox Queue
CREATE TABLE IF NOT EXISTS public.sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    association_id TEXT NOT NULL,
    device_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    operation TEXT NOT NULL,
    payload JSONB,
    status TEXT NOT NULL DEFAULT 'SYNCED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- PART C: ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;

-- Allow public read/write with anon key for platform administration
CREATE POLICY "Allow public read on organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on organizations" ON public.organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on organizations" ON public.organizations FOR UPDATE USING (true);

CREATE POLICY "Allow public read on licenses" ON public.licenses FOR SELECT USING (true);
CREATE POLICY "Allow public insert on licenses" ON public.licenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on licenses" ON public.licenses FOR UPDATE USING (true);

CREATE POLICY "Allow public read on devices" ON public.devices FOR SELECT USING (true);
CREATE POLICY "Allow public insert on devices" ON public.devices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on devices" ON public.devices FOR UPDATE USING (true);

CREATE POLICY "Allow public read on role_credentials" ON public.role_credentials FOR SELECT USING (true);
CREATE POLICY "Allow public insert on role_credentials" ON public.role_credentials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on role_credentials" ON public.role_credentials FOR UPDATE USING (true);

CREATE POLICY "Allow public read on audit_logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert on audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on admin_users" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "Allow public read on students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow public read on admissions" ON public.admissions FOR ALL USING (true);
CREATE POLICY "Allow public read on seats" ON public.seats FOR ALL USING (true);
CREATE POLICY "Allow public read on attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Allow public read on payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow public read on sync_queue" ON public.sync_queue FOR ALL USING (true);

-- ====================================================================
-- PART D: REAL SEED DATA INSERTION
-- ====================================================================

-- Insert Initial Real Admin Staff
INSERT INTO public.admin_users (name, email, role, status, last_active)
VALUES 
    ('Trivendra Shukla', 'trivendra@yourcompany.com', 'Super Admin', 'ACTIVE', 'Now'),
    ('Sanidhya Sharma', 'sanidhya@yourcompany.com', 'Super Admin', 'ACTIVE', '10 min ago'),
    ('Support Operations', 'support@yourcompany.com', 'Support Admin', 'ACTIVE', '1 hour ago')
ON CONFLICT (email) DO NOTHING;

-- Insert Real Initial Organizations
INSERT INTO public.organizations (org_id, name, owner_name, email, phone, state, district, plan, status, active_users, devices, max_devices, max_staff, max_students, storage_used_gb, storage_limit_gb, license_id, license_health_percent, expires_in_days, expiry_date, database_version, last_sync)
VALUES
    ('ORG-ABC001', 'ABC Library', 'Rahul Kumar', 'owner@abclibrary.in', '+91 98765 43210', 'Uttar Pradesh', 'Lucknow', 'Professional', 'ACTIVE', 28, 4, 5, 20, 1000, 2.1, 10.0, 'LIC-8F72K91', 98, 360, '11 Sep 2027', 'v014', '2 min ago'),
    ('ORG-XYZ002', 'XYZ Library', 'Priya Sharma', 'admin@xyzstudy.com', '+91 98111 22334', 'Delhi', 'North Delhi', 'Enterprise', 'ACTIVE', 45, 8, 10, 35, 2500, 6.4, 25.0, 'LIC-4B19M82', 96, 180, '15 Mar 2027', 'v014', '10 min ago'),
    ('ORG-PQR003', 'PQR Reading Hub', 'Amitabh Singh', 'contact@pqrhub.org', '+91 94500 88776', 'Madhya Pradesh', 'Indore', 'Professional', 'ACTIVE', 32, 5, 5, 15, 800, 1.8, 10.0, 'LIC-9C33Z01', 100, 240, '10 May 2027', 'v014', '28 min ago'),
    ('ORG-LMN004', 'LMN Library', 'Dr. Vivek Saxena', 'director@lmnacademy.edu', '+91 97200 44551', 'Rajasthan', 'Jaipur', 'Basic', 'ACTIVE', 18, 3, 3, 10, 400, 0.9, 5.0, 'LIC-2A88Q55', 94, 12, '23 Sep 2026', 'v014', '1 hour ago'),
    ('ORG-OPQ005', 'OPQ Library', 'Sanjay Deshmukh', 'info@opqstudy.in', '+91 93222 11990', 'Maharashtra', 'Pune', 'Professional', 'ACTIVE', 12, 4, 5, 12, 600, 1.4, 10.0, 'LIC-7K11W99', 97, 18, '29 Sep 2026', 'v014', '2 hours ago')
ON CONFLICT (org_id) DO NOTHING;

-- Insert Real Licenses
INSERT INTO public.licenses (license_id, organization_id, org_name, plan, status, start_at, expires_at, max_devices, current_devices, key_hash)
VALUES
    ('LIC-8F72K91', 'ORG-ABC001', 'ABC Library', 'Professional', 'ACTIVE', '11 Sep 2026', '11 Sep 2027', 5, 4, 'sha256:e8b4f0183ac872f91a'),
    ('LIC-4B19M82', 'ORG-XYZ002', 'XYZ Library', 'Enterprise', 'ACTIVE', '15 Mar 2026', '15 Mar 2027', 10, 8, 'sha256:71a2c901eef24198cc'),
    ('LIC-9C33Z01', 'ORG-PQR003', 'PQR Reading Hub', 'Professional', 'ACTIVE', '10 May 2026', '10 May 2027', 5, 5, 'sha256:bb119028fa721ce899'),
    ('LIC-2A88Q55', 'ORG-LMN004', 'LMN Library', 'Basic', 'ACTIVE', '23 Sep 2025', '23 Sep 2026', 3, 3, 'sha256:44aa1199ee8822ff00')
ON CONFLICT (license_id) DO NOTHING;

-- Insert Real Authorized Devices
INSERT INTO public.devices (device_id, organization_id, org_name, license_id, name, status, last_seen, activated_at, hardware_fingerprint, app_version, ip_address)
VALUES
    ('DEVICE-7A91X', 'ORG-ABC001', 'ABC Library', 'LIC-8F72K91', 'Reception PC', 'ONLINE', '2 min ago', '11 Sep 2026 14:20', 'MB-ASUS-Z790-884219', 'v3.2.1', '192.168.1.102'),
    ('DEVICE-81K22A', 'ORG-ABC001', 'ABC Library', 'LIC-8F72K91', 'Librarian PC', 'ONLINE', '10 min ago', '11 Sep 2026 15:05', 'MB-GIGA-B650-119283', 'v3.2.1', '192.168.1.104'),
    ('DEVICE-99P31B', 'ORG-ABC001', 'ABC Library', 'LIC-8F72K91', 'Admin PC', 'ONLINE', '1 hour ago', '11 Sep 2026 11:30', 'LENOVO-T14-GEN4-77189', 'v3.2.1', '192.168.1.105')
ON CONFLICT (device_id) DO NOTHING;

-- Insert Real Role Activation Credentials
INSERT INTO public.role_credentials (code, role, organization_id, org_name, status, expires_at, assigned_to_email)
VALUES
    ('ABCD-8K29-XP4M', 'Super Admin', 'ORG-ABC001', 'ABC Library', 'USED', '12 Sep 2026', 'owner@abclibrary.in'),
    ('EFGH-3N77-LK19', 'Librarian', 'ORG-ABC001', 'ABC Library', 'USED', '12 Sep 2026', 'librarian@abclibrary.in'),
    ('PQRS-99W2-ZZ81', 'Assistant', 'ORG-ABC001', 'ABC Library', 'UNUSED', '12 Sep 2026 (12 hours)', 'assistant@abclibrary.in'),
    ('UVWX-11M4-KK55', 'Receptionist', 'ORG-ABC001', 'ABC Library', 'UNUSED', '12 Sep 2026 (12 hours)', NULL)
ON CONFLICT (code) DO NOTHING;

-- Insert Real Initial Audit Logs
INSERT INTO public.audit_logs (timestamp, event, organization, actor, details, type)
VALUES
    ('2 min ago (14:32)', 'Device Activated', 'ABC Library', 'DEVICE-7A91X', 'Reception PC activated with signed token (LIC-8F72K91).', 'activation'),
    ('12 min ago (14:28)', 'License Renewed', 'XYZ Library', 'Trivendra Shukla', 'Enterprise tier extended by 1 Year (LIC-4B19M82).', 'license'),
    ('28 min ago (14:15)', 'Database Provisioned', 'PQR Reading Hub', 'Provisioning Worker', 'All 14 PostgreSQL migrations executed with strict RLS.', 'provisioning'),
    ('1 hour ago (13:50)', 'New Organization Created', 'Acme Corporation', 'Trivendra Shukla', 'Org ID ORG-ACME09 with Enterprise Plan provisioned.', 'user');
