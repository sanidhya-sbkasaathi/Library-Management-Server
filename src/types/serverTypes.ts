export type OrganizationStatus = 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'PENDING';
export type LicenseStatus = 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'REVOKED';
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'PROVISIONING' | 'ERROR';
export type PlanTier = 'Basic' | 'Professional' | 'Enterprise';

export interface Organization {
  id: string;
  orgId: string; // e.g. ORG-ABC001
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  plan: PlanTier;
  status: OrganizationStatus;
  activeUsers: number;
  devices: number;
  maxDevices: number;
  maxStaff: number;
  maxStudents: number;
  storageUsedGb: number;
  storageLimitGb: number;
  licenseId: string;
  licenseHealthPercent: number;
  expiresInDays: number;
  expiryDate: string;
  databaseVersion: string;
  lastSync: string;
  createdAt: string;
  modules: string[];
}

export interface LicenseRecord {
  id: string;
  licenseId: string; // LIC-8F72K91
  organizationId: string;
  orgName: string;
  plan: PlanTier;
  status: LicenseStatus;
  startAt: string;
  expiresAt: string;
  maxDevices: number;
  currentDevices: number;
  keyHash: string;
}

export interface DeviceRecord {
  id: string;
  deviceId: string; // DEVICE-7A91X
  organizationId: string;
  orgName: string;
  licenseId: string;
  name: string; // e.g. "Reception PC"
  status: DeviceStatus;
  lastSeen: string;
  activatedAt: string;
  hardwareFingerprint: string;
  appVersion: string;
  ipAddress: string;
}

export interface MigrationStep {
  version: string;
  name: string;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'RUNNING' | 'FAILED';
  completedAt: string;
  executionTimeMs: number;
}

export interface RoleCredential {
  id: string;
  code: string; // XXXX-XXXX-XXXX
  role: string;
  organizationId: string;
  orgName: string;
  status: 'UNUSED' | 'USED' | 'EXPIRED';
  expiresAt: string;
  createdAt: string;
  assignedToEmail?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  event: string;
  organization: string;
  actor: string;
  details: string;
  type: 'activation' | 'license' | 'provisioning' | 'security' | 'user';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Support Admin' | 'Operations Admin' | 'Finance Admin';
  status: 'ACTIVE' | 'INACTIVE';
  lastActive: string;
}
