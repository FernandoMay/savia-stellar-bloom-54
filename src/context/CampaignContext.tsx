import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CampaignService, type CampaignInput } from '@/services/campaign-service';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  beneficiaryName: string;
  location: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  medicalCondition: string;
  hospitalName: string;
  medicalDocDescription: string;
  walletAddress: string;
  verified: boolean;
  trustScore: number;
  daysLeft: number;
  image?: string;
  createdAt: string;
}

export interface Donation {
  id: string;
  campaignId: string;
  donor: string;
  amountXLM: number;
  amountMXN: number;
  transactionHash: string;
  timestamp: string;
  anonymous: boolean;
}

interface CampaignContextType {
  campaigns: Campaign[];
  donations: Donation[];
  loading: boolean;
  addCampaign: (data: CampaignInput) => Promise<Campaign>;
  getCampaign: (id: string) => Campaign | undefined;
  addDonation: (data: Omit<Donation, 'id' | 'timestamp'>) => Promise<void>;
  getCampaignDonations: (campaignId: string) => Donation[];
  getTotalDonatedByUser: (address: string) => number;
  refreshCampaigns: () => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCampaigns = useCallback(async () => {
    try {
      const list = await CampaignService.list();
      setCampaigns(list);
    } catch {
      console.error('Error loading campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCampaigns();
  }, [refreshCampaigns]);

  const addCampaign = useCallback(async (data: CampaignInput) => {
    const campaign = await CampaignService.create(data);
    setCampaigns(prev => [...prev, campaign]);
    return campaign;
  }, []);

  const getCampaign = useCallback((id: string) => {
    return campaigns.find(c => c.id === id);
  }, [campaigns]);

  const addDonation = useCallback(async (data: Omit<Donation, 'id' | 'timestamp'>) => {
    const donation = await CampaignService.addDonation(data);
    setDonations(prev => [...prev, donation]);
    setCampaigns(prev => prev.map(c =>
      c.id === data.campaignId
        ? { ...c, raisedAmount: c.raisedAmount + data.amountXLM }
        : c
    ));
  }, []);

  const getCampaignDonations = useCallback((campaignId: string) => {
    return donations.filter(d => d.campaignId === campaignId);
  }, [donations]);

  const getTotalDonatedByUser = useCallback((address: string) => {
    return donations.filter(d => d.donor === address).reduce((sum, d) => sum + d.amountMXN, 0);
  }, [donations]);

  return (
    <CampaignContext.Provider value={{
      campaigns, donations, loading,
      addCampaign, getCampaign, addDonation,
      getCampaignDonations, getTotalDonatedByUser, refreshCampaigns,
    }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error('useCampaigns must be used within CampaignProvider');
  return ctx;
}
