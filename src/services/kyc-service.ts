import { api } from './api-client';

export interface KYCSubmission {
  curp: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  walletAddress: string;
}

export interface MedicalKYCSubmission {
  medicalLicense: string;
  institution: string;
  walletAddress: string;
}

export type KYCLevel = 'unverified' | 'basic' | 'medical' | 'full';

export interface KYCStatus {
  level: KYCLevel;
  curp: string;
  phone: string;
  email: string;
  medicalLicense?: string;
  institution?: string;
  verified: boolean;
  expires: string;
}

const KYC_LOCAL_KEY = 'savia_kyc';

export async function submitBasicKYC(data: KYCSubmission): Promise<boolean> {
  if (import.meta.env.VITE_API_URL) {
    const res = await api.post<{ success: boolean }>('/kyc/basic', data);
    if (!res.ok) throw new Error(res.error || 'Error al enviar KYC');
    return true;
  }
  localStorage.setItem(KYC_LOCAL_KEY, JSON.stringify({ ...data, verified: true, level: 'basic', expires: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0] }));
  return true;
}

export async function submitMedicalKYC(data: MedicalKYCSubmission): Promise<boolean> {
  if (import.meta.env.VITE_API_URL) {
    const res = await api.post<{ success: boolean }>('/kyc/medical', data);
    if (!res.ok) throw new Error(res.error || 'Error al enviar KYC médico');
    return true;
  }
  const raw = localStorage.getItem(KYC_LOCAL_KEY);
  if (raw) {
    const existing = JSON.parse(raw);
    localStorage.setItem(KYC_LOCAL_KEY, JSON.stringify({ ...existing, medicalLicense: data.medicalLicense, institution: data.institution, level: 'medical' }));
  }
  return true;
}

export function getKYCStatus(): KYCStatus | null {
  const raw = localStorage.getItem(KYC_LOCAL_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as KYCStatus;
  } catch {
    return null;
  }
}
