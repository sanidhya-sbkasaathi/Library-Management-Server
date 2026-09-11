import { createClient } from '../utils/supabase/client';
import {
  Organization,
  LicenseRecord,
  DeviceRecord,
  MigrationStep,
  RoleCredential,
  AuditEvent,
  AdminUser,
  PlanTier,
} from '../types/serverTypes';

class ManagementStore {
  private static instance: ManagementStore;
  private subscribers: Array<() => void> = [];
  public supabase = createClient();

  public organizations: Organization[] = [];
  public licenses: LicenseRecord[] = [];
  public devices: DeviceRecord[] = [];
  public credentials: RoleCredential[] = [];
  public auditLogs: AuditEvent[] = [];
  public adminUsers: AdminUser[] = [];
  public migrations: MigrationStep[] = [
    { version: '001', name: '001_extensions.sql', description: 'Enable uuid-ossp, pgcrypto, and citext extensions', status: 'COMPLETED', completedAt: '11 Sep 2026 14:10', executionTimeMs: 142 },
    { version: '002', name: '002_organizations.sql', description: 'Create multi-tenant organizations & isolation schema', status: 'COMPLETED', completedAt: '11 Sep 2026 14:10', executionTimeMs: 210 },
    { version: '003', name: '003_users.sql', description: 'Create organization_members linked to auth.users', status: 'COMPLETED', completedAt: '11 Sep 2026 14:11', executionTimeMs: 195 },
    { version: '004', name: '004_roles.sql', description: 'Seed system roles: Super Admin, Librarian, Assistant, Receptionist, Viewer', status: 'COMPLETED', completedAt: '11 Sep 2026 14:11', executionTimeMs: 165 },
    { version: '005', name: '005_students.sql', description: 'Create students directory, contacts, and KYC metadata', status: 'COMPLETED', completedAt: '11 Sep 2026 14:12', executionTimeMs: 340 },
    { version: '006', name: '006_memberships.sql', description: 'Create membership plans and renewals table', status: 'COMPLETED', completedAt: '11 Sep 2026 14:12', executionTimeMs: 280 },
    { version: '007', name: '007_rooms.sql', description: 'Create study halls, AC zones, and silent study chambers', status: 'COMPLETED', completedAt: '11 Sep 2026 14:13', executionTimeMs: 175 },
    { version: '008', name: '008_seats.sql', description: 'Create physical seat coordinate matrix & transfer logs', status: 'COMPLETED', completedAt: '11 Sep 2026 14:13', executionTimeMs: 410 },
    { version: '009', name: '009_attendance.sql', description: 'Create turnstile, QR check-in, and biometric logs', status: 'COMPLETED', completedAt: '11 Sep 2026 14:14', executionTimeMs: 360 },
    { version: '010', name: '010_finance.sql', description: 'Create append-only payment transactions & GST receipt ledger', status: 'COMPLETED', completedAt: '11 Sep 2026 14:14', executionTimeMs: 450 },
    { version: '011', name: '011_documents.sql', description: 'Create student KYC documents & cloud S3 metadata table', status: 'COMPLETED', completedAt: '11 Sep 2026 14:14', executionTimeMs: 190 },
    { version: '012', name: '012_sync.sql', description: 'Create sync_queue, event log, and incremental cursor offsets', status: 'COMPLETED', completedAt: '11 Sep 2026 14:15', executionTimeMs: 310 },
    { version: '013', name: '013_audit.sql', description: 'Create immutable tamper-evident system audit trail', status: 'COMPLETED', completedAt: '11 Sep 2026 14:15', executionTimeMs: 240 },
    { version: '014', name: '014_rls.sql', description: 'Enable Row-Level Security (RLS) on all tenant tables', status: 'COMPLETED', completedAt: '11 Sep 2026 14:15', executionTimeMs: 520 },
  ];

  public activeTab: string = 'dashboard';
  public selectedOrgId: string | null = null;
  public isThemeDark: boolean = false;
  public searchQuery: string = '';

  public isLoading: boolean = false;
  public isConnected: boolean = false;
  public isSchemaProvisioned: boolean = true;
  public dbError: string | null = null;

  private constructor() {
    this.fetchFromSupabase();
  }

  public static getInstance(): ManagementStore {
    if (!ManagementStore.instance) {
      ManagementStore.instance = new ManagementStore();
    }
    return ManagementStore.instance;
  }

  public subscribe(cb: () => void) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== cb);
    };
  }

  private notify() {
    this.subscribers.forEach(cb => cb());
  }

  public toggleTheme() {
    this.isThemeDark = !this.isThemeDark;
    if (typeof document !== 'undefined') {
      if (this.isThemeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    this.notify();
  }

  public setTab(tab: string, orgId?: string) {
    this.activeTab = tab;
    if (orgId) this.selectedOrgId = orgId;
    this.notify();
  }

  // --- Real Fetch from Supabase PostgreSQL Database ---
  public async fetchFromSupabase() {
    this.isLoading = true;
    this.dbError = null;
    this.notify();

    try {
      // 1. Fetch Organizations
      const { data: orgRows, error: orgErr } = await this.supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (orgErr) {
        // Table does not exist yet in Supabase schema
        this.isSchemaProvisioned = false;
        this.dbError = orgErr.message;
        this.isConnected = true;
        this.isLoading = false;
        this.notify();
        return;
      }

      this.isSchemaProvisioned = true;
      this.isConnected = true;

      if (orgRows) {
        this.organizations = orgRows.map((r: any) => ({
          id: r.id,
          orgId: r.org_id,
          name: r.name,
          ownerName: r.owner_name,
          email: r.email,
          phone: r.phone || '',
          state: r.state || '',
          district: r.district || '',
          plan: r.plan as PlanTier,
          status: r.status,
          activeUsers: r.active_users || 0,
          devices: r.devices || 0,
          maxDevices: r.max_devices || 5,
          maxStaff: r.max_staff || 20,
          maxStudents: r.max_students || 1000,
          storageUsedGb: Number(r.storage_used_gb) || 0,
          storageLimitGb: Number(r.storage_limit_gb) || 10,
          licenseId: r.license_id || '',
          licenseHealthPercent: r.license_health_percent || 100,
          expiresInDays: r.expires_in_days || 365,
          expiryDate: r.expiry_date || '',
          databaseVersion: r.database_version || 'v014',
          lastSync: r.last_sync || 'Active',
          createdAt: r.created_at,
          modules: r.modules || [],
        }));
      }

      // 2. Fetch Licenses
      const { data: licRows } = await this.supabase
        .from('licenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (licRows) {
        this.licenses = licRows.map((r: any) => ({
          id: r.id,
          licenseId: r.license_id,
          organizationId: r.organization_id,
          orgName: r.org_name,
          plan: r.plan as PlanTier,
          status: r.status,
          startAt: r.start_at,
          expiresAt: r.expires_at,
          maxDevices: r.max_devices || 5,
          currentDevices: r.current_devices || 0,
          keyHash: r.key_hash,
        }));
      }

      // 3. Fetch Devices
      const { data: devRows } = await this.supabase
        .from('devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (devRows) {
        this.devices = devRows.map((r: any) => ({
          id: r.id,
          deviceId: r.device_id,
          organizationId: r.organization_id,
          orgName: r.org_name,
          licenseId: r.license_id,
          name: r.name,
          status: r.status,
          lastSeen: r.last_seen || 'Just now',
          activatedAt: r.activated_at || 'Today',
          hardwareFingerprint: r.hardware_fingerprint || '',
          appVersion: r.app_version || 'v3.2.1',
          ipAddress: r.ip_address || '',
        }));
      }

      // 4. Fetch Role Credentials
      const { data: credRows } = await this.supabase
        .from('role_credentials')
        .select('*')
        .order('created_at', { ascending: false });

      if (credRows) {
        this.credentials = credRows.map((r: any) => ({
          id: r.id,
          code: r.code,
          role: r.role,
          organizationId: r.organization_id,
          orgName: r.org_name,
          status: r.status,
          expiresAt: r.expires_at,
          createdAt: r.created_at,
          assignedToEmail: r.assigned_to_email,
        }));
      }

      // 5. Fetch Audit Logs
      const { data: audRows } = await this.supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (audRows) {
        this.auditLogs = audRows.map((r: any) => ({
          id: r.id,
          timestamp: r.timestamp,
          event: r.event,
          organization: r.organization,
          actor: r.actor,
          details: r.details,
          type: r.type,
        }));
      }

      // 6. Fetch Admin Users
      const { data: admRows } = await this.supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (admRows) {
        this.adminUsers = admRows.map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          role: r.role,
          status: r.status,
          lastActive: r.last_active,
        }));
      }
    } catch (e: any) {
      console.error('Error querying Supabase database:', e);
      this.dbError = e.message || 'Failed to connect to Supabase';
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  // --- Real Insert into Supabase Organizations & Licenses ---
  public async createOrganization(params: {
    name: string;
    ownerName: string;
    email: string;
    phone: string;
    state: string;
    district: string;
    plan: PlanTier;
    durationYears: number;
    maxDevices: number;
    maxStaff: number;
    maxStudents: number;
    storageLimitGb: number;
    modules: string[];
  }): Promise<{ success: boolean; org?: Organization; license?: LicenseRecord; initialCredential?: RoleCredential; error?: string }> {
    const nextIndex = this.organizations.length + 1;
    const orgCode = `ORG-${params.name.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'LIB'}${String(nextIndex).padStart(3, '0')}`;
    const licCode = `LIC-${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const expiryStr = new Date(Date.now() + params.durationYears * 365 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const startStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const credCode = `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 1. Insert into organizations
    const { data: orgData, error: orgErr } = await this.supabase
      .from('organizations')
      .insert({
        org_id: orgCode,
        name: params.name,
        owner_name: params.ownerName,
        email: params.email,
        phone: params.phone,
        state: params.state,
        district: params.district,
        plan: params.plan,
        status: 'ACTIVE',
        active_users: 1,
        devices: 0,
        max_devices: params.maxDevices,
        max_staff: params.maxStaff,
        max_students: params.maxStudents,
        storage_used_gb: 0.1,
        storage_limit_gb: params.storageLimitGb,
        license_id: licCode,
        license_health_percent: 100,
        expires_in_days: params.durationYears * 365,
        expiry_date: expiryStr,
        database_version: 'v014',
        last_sync: 'Just registered',
        modules: params.modules,
      })
      .select()
      .single();

    if (orgErr) {
      return { success: false, error: orgErr.message };
    }

    // 2. Insert into licenses
    await this.supabase.from('licenses').insert({
      license_id: licCode,
      organization_id: orgCode,
      org_name: params.name,
      plan: params.plan,
      status: 'ACTIVE',
      start_at: startStr,
      expires_at: expiryStr,
      max_devices: params.maxDevices,
      current_devices: 0,
      key_hash: `sha256:${Math.random().toString(16).substring(2, 18)}`,
    });

    // 3. Insert into role_credentials
    await this.supabase.from('role_credentials').insert({
      code: credCode,
      role: 'Super Admin',
      organization_id: orgCode,
      org_name: params.name,
      status: 'UNUSED',
      expires_at: '24 hours',
      assigned_to_email: params.email,
    });

    // 4. Insert into audit_logs
    await this.supabase.from('audit_logs').insert({
      timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      event: 'New Organization Created',
      organization: params.name,
      actor: 'Trivendra Shukla',
      details: `Created ${params.name} (${orgCode}) under ${params.plan} plan.`,
      type: 'user',
    });

    // Refresh store from database
    await this.fetchFromSupabase();

    const createdOrg: Organization = {
      id: orgData.id,
      orgId: orgCode,
      name: params.name,
      ownerName: params.ownerName,
      email: params.email,
      phone: params.phone,
      state: params.state,
      district: params.district,
      plan: params.plan,
      status: 'ACTIVE',
      activeUsers: 1,
      devices: 0,
      maxDevices: params.maxDevices,
      maxStaff: params.maxStaff,
      maxStudents: params.maxStudents,
      storageUsedGb: 0.1,
      storageLimitGb: params.storageLimitGb,
      licenseId: licCode,
      licenseHealthPercent: 100,
      expiresInDays: params.durationYears * 365,
      expiryDate: expiryStr,
      databaseVersion: 'v014',
      lastSync: 'Just registered',
      createdAt: 'Today',
      modules: params.modules,
    };

    const createdLic: LicenseRecord = {
      id: `lic-${Date.now()}`,
      licenseId: licCode,
      organizationId: orgCode,
      orgName: params.name,
      plan: params.plan,
      status: 'ACTIVE',
      startAt: startStr,
      expiresAt: expiryStr,
      maxDevices: params.maxDevices,
      currentDevices: 0,
      keyHash: `sha256:${Math.random().toString(16).substring(2, 18)}`,
    };

    const createdCred: RoleCredential = {
      id: `inv-${Date.now()}`,
      code: credCode,
      role: 'Super Admin',
      organizationId: orgCode,
      orgName: params.name,
      status: 'UNUSED',
      expiresAt: '24 hours',
      createdAt: 'Today',
      assignedToEmail: params.email,
    };

    return { success: true, org: createdOrg, license: createdLic, initialCredential: createdCred };
  }

  // --- Real License Actions ---
  public async renewLicense(licenseId: string, durationYears: number = 1) {
    const newExpiry = new Date(Date.now() + durationYears * 365 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    await this.supabase
      .from('licenses')
      .update({ status: 'ACTIVE', expires_at: newExpiry })
      .eq('license_id', licenseId);

    await this.supabase
      .from('organizations')
      .update({ status: 'ACTIVE', expiry_date: newExpiry, expires_in_days: durationYears * 365 })
      .eq('license_id', licenseId);

    await this.supabase.from('audit_logs').insert({
      timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      event: 'License Renewed',
      organization: licenseId,
      actor: 'Trivendra Shukla',
      details: `Renewed license ${licenseId} for ${durationYears} year(s).`,
      type: 'license',
    });

    await this.fetchFromSupabase();
  }

  public async suspendLicense(licenseId: string) {
    await this.supabase
      .from('licenses')
      .update({ status: 'SUSPENDED' })
      .eq('license_id', licenseId);

    await this.supabase
      .from('organizations')
      .update({ status: 'SUSPENDED' })
      .eq('license_id', licenseId);

    await this.supabase.from('audit_logs').insert({
      timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      event: 'License Suspended',
      organization: licenseId,
      actor: 'Trivendra Shukla',
      details: `Suspended license ${licenseId}.`,
      type: 'license',
    });

    await this.fetchFromSupabase();
  }

  // --- Real Device Actions ---
  public async deactivateDevice(deviceId: string) {
    await this.supabase
      .from('devices')
      .update({ status: 'OFFLINE' })
      .eq('device_id', deviceId);

    await this.supabase.from('audit_logs').insert({
      timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      event: 'Device Deactivated',
      organization: 'DEVICE',
      actor: 'Trivendra Shukla',
      details: `Revoked access for device ${deviceId}.`,
      type: 'activation',
    });

    await this.fetchFromSupabase();
  }

  public async registerDevice(orgCode: string, name: string) {
    const devCode = `DEVICE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const org = this.organizations.find(o => o.orgId === orgCode || o.id === orgCode);

    await this.supabase.from('devices').insert({
      device_id: devCode,
      organization_id: orgCode,
      org_name: org ? org.name : orgCode,
      license_id: org ? org.licenseId : 'LIC-NEW',
      name,
      status: 'ONLINE',
      last_seen: 'Just now',
      activated_at: 'Today',
      hardware_fingerprint: `HW-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      app_version: 'v3.2.1',
      ip_address: '192.168.1.120',
    });

    await this.supabase.from('audit_logs').insert({
      timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      event: 'Device Activated',
      organization: org ? org.name : orgCode,
      actor: devCode,
      details: `Authorized PC: ${name} (${devCode}).`,
      type: 'activation',
    });

    await this.fetchFromSupabase();
  }

  // --- Real Role Credential Generator ---
  public async generateRoleCredential(orgCode: string, role: string, email?: string) {
    const code = `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const org = this.organizations.find(o => o.orgId === orgCode || o.id === orgCode);

    await this.supabase.from('role_credentials').insert({
      code,
      role,
      organization_id: orgCode,
      org_name: org ? org.name : orgCode,
      status: 'UNUSED',
      expires_at: '12 hours',
      assigned_to_email: email,
    });

    await this.supabase.from('audit_logs').insert({
      timestamp: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      event: 'Role Credential Created',
      organization: org ? org.name : orgCode,
      actor: 'Trivendra Shukla',
      details: `Generated one-time credential for ${role}: ${code}.`,
      type: 'security',
    });

    await this.fetchFromSupabase();
    return { code };
  }

  // --- Health Check ---
  public async runHealthCheck(): Promise<boolean> {
    await this.fetchFromSupabase();
    return this.isSchemaProvisioned;
  }
}

export const serverStore = ManagementStore.getInstance();
