import { api } from './api-client';
import type { Campaign, Donation } from '@/context/CampaignContext';

const CAMPAIGNS_KEY = 'savia_campaigns';
const DONATIONS_KEY = 'savia_donations';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export interface CampaignInput {
  title: string;
  description: string;
  beneficiaryName: string;
  location: string;
  category: string;
  goalAmount: number;
  medicalCondition: string;
  hospitalName: string;
  medicalDocDescription: string;
  walletAddress: string;
  image?: string;
}

export const CampaignService = {
  async list(): Promise<Campaign[]> {
    if (import.meta.env.VITE_API_URL) {
      const res = await api.get<Campaign[]>('/campaigns');
      if (res.ok && res.data) return res.data;
    }
    return loadFromStorage<Campaign[]>(CAMPAIGNS_KEY, []);
  },

  async get(id: string): Promise<Campaign | null> {
    if (import.meta.env.VITE_API_URL) {
      const res = await api.get<Campaign>(`/campaigns/${id}`);
      if (res.ok && res.data) return res.data;
    }
    const campaigns = loadFromStorage<Campaign[]>(CAMPAIGNS_KEY, []);
    return campaigns.find(c => c.id === id) || null;
  },

  async create(input: CampaignInput): Promise<Campaign> {
    const campaign: Campaign = {
      ...input,
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      raisedAmount: 0,
      verified: false,
      trustScore: 0,
      daysLeft: 60,
      createdAt: new Date().toISOString(),
    };
    if (import.meta.env.VITE_API_URL) {
      const res = await api.post<Campaign>('/campaigns', campaign);
      if (res.ok && res.data) return res.data;
    }
    const campaigns = loadFromStorage<Campaign[]>(CAMPAIGNS_KEY, []);
    campaigns.push(campaign);
    saveToStorage(CAMPAIGNS_KEY, campaigns);
    return campaign;
  },

  async addDonation(donation: Omit<Donation, 'id' | 'timestamp'>): Promise<Donation> {
    const entry: Donation = {
      ...donation,
      id: `d_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
    };
    if (import.meta.env.VITE_API_URL) {
      const res = await api.post<Donation>('/donations', entry);
      if (res.ok && res.data) return res.data;
    }
    const donations = loadFromStorage<Donation[]>(DONATIONS_KEY, []);
    donations.push(entry);
    saveToStorage(DONATIONS_KEY, donations);
    const campaigns = loadFromStorage<Campaign[]>(CAMPAIGNS_KEY, []);
    const idx = campaigns.findIndex(c => c.id === donation.campaignId);
    if (idx !== -1) {
      campaigns[idx] = { ...campaigns[idx], raisedAmount: campaigns[idx].raisedAmount + donation.amountXLM };
      saveToStorage(CAMPAIGNS_KEY, campaigns);
    }
    return entry;
  },

  async getDonations(campaignId: string): Promise<Donation[]> {
    if (import.meta.env.VITE_API_URL) {
      const res = await api.get<Donation[]>(`/campaigns/${campaignId}/donations`);
      if (res.ok && res.data) return res.data;
    }
    const donations = loadFromStorage<Donation[]>(DONATIONS_KEY, []);
    return donations.filter(d => d.campaignId === campaignId);
  },

  async getTotalDonatedByUser(address: string): Promise<number> {
    if (import.meta.env.VITE_API_URL) {
      const res = await api.get<{ totalMXN: number }>(`/donations/user/${address}/total`);
      if (res.ok && res.data) return res.data.totalMXN;
    }
    const donations = loadFromStorage<Donation[]>(DONATIONS_KEY, []);
    return donations.filter(d => d.donor === address).reduce((sum, d) => sum + d.amountMXN, 0);
  },
};
