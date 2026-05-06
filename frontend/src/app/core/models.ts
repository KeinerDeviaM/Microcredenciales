export interface AuthResponse {
  token: string;
  tokenType: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  expiresAt: string;
}

export interface AuthenticatedUser {
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  expiresAt: string;
}

export interface MicroCredential {
  id: number;
  title: string;
  businessArea: string;
  level: string;
  description: string;
  durationHours: number;
  issuer: string;
  skillTags: string[];
  active: boolean;
  createdAt: string;
}

export interface CredentialPayload {
  title: string;
  businessArea: string;
  level: string;
  description: string;
  durationHours: number;
  issuer: string;
  skillTags: string[];
  active: boolean;
}

export interface Enrollment {
  id: number;
  credential: MicroCredential;
  status: 'IN_PROGRESS' | 'ISSUED' | 'EXPIRED';
  enrolledAt: string;
  issuedAt: string | null;
  expiresAt: string | null;
  verificationCode: string | null;
}

export interface DashboardSummary {
  totalCredentials: number;
  totalEnrollments: number;
  issuedCredentials: number;
  activeCredentials: number;
}
