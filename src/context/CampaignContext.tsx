import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  addCampaign: (campaign: Omit<Campaign, 'id' | 'raisedAmount' | 'verified' | 'trustScore' | 'daysLeft' | 'createdAt'>) => Campaign;
  getCampaign: (id: string) => Campaign | undefined;
  addDonation: (donation: Omit<Donation, 'id' | 'timestamp'>) => void;
  getCampaignDonations: (campaignId: string) => Donation[];
  getTotalDonatedByUser: (address: string) => number;
}

const CAMPAIGNS_KEY = 'savia_campaigns';
const DONATIONS_KEY = 'savia_donations';

const defaultCampaigns: Campaign[] = [
  {
    id: "1", title: "Transparent Crowdfunding On Stellar",
    description: "Providing Clean Water Access To Remote Villages Through Sustainable Well Construction And Water Purification Systems.",
    beneficiaryName: "GBXR...MPLE", location: "México", category: "Environment",
    goalAmount: 50000, raisedAmount: 32500, medicalCondition: "Acceso a agua limpia",
    hospitalName: "Cruz Roja Mexicana", medicalDocDescription: "",
    walletAddress: "GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR",
    verified: true, trustScore: 85, daysLeft: 22,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2", title: "Tratamiento de Cáncer Infantil",
    description: "Ayuda urgente para el tratamiento de leucemia en niños de bajos recursos. Incluye quimioterapias, medicamentos y cuidados especializados.",
    beneficiaryName: "María González", location: "Ciudad de México", category: "Oncología",
    goalAmount: 25000, raisedAmount: 18750, medicalCondition: "Leucemia linfoblástica aguda",
    hospitalName: "Hospital Infantil de México", medicalDocDescription: "Diagnóstico confirmado",
    walletAddress: "GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR",
    verified: true, trustScore: 92, daysLeft: 15,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&crop=center",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3", title: "Cirugía Cardiovascular Urgente",
    description: "Fondos necesarios para una operación de corazón abierto que salvará la vida de un padre de familia trabajador.",
    beneficiaryName: "Carlos Hernández", location: "Guadalajara", category: "Cardiología",
    goalAmount: 80000, raisedAmount: 45000, medicalCondition: "Estenosis aórtica severa",
    hospitalName: "Hospital Civil de Guadalajara", medicalDocDescription: "Ecocardiograma",
    walletAddress: "GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR",
    verified: true, trustScore: 88, daysLeft: 30,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&crop=center",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4", title: "Rehabilitación Post-Accidente",
    description: "Terapia física especializada y equipo médico para la recuperación completa de un joven deportista.",
    beneficiaryName: "Luis Martínez", location: "Monterrey", category: "Rehabilitación",
    goalAmount: 35000, raisedAmount: 12300, medicalCondition: "Fractura múltiple de fémur",
    hospitalName: "Hospital Universitario de Monterrey", medicalDocDescription: "Radiografías",
    walletAddress: "GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR",
    verified: true, trustScore: 90, daysLeft: 45,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop&crop=center",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5", title: "Tratamiento de Diabetes Tipo 1",
    description: "Insulina, monitores y cuidados médicos continuos para una niña de 8 años diagnosticada recientemente.",
    beneficiaryName: "Sofía Ramírez", location: "Puebla", category: "Endocrinología",
    goalAmount: 15000, raisedAmount: 8500, medicalCondition: "Diabetes mellitus tipo 1",
    hospitalName: "Hospital General de Puebla", medicalDocDescription: "Laboratorio",
    walletAddress: "GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR",
    verified: true, trustScore: 94, daysLeft: 20,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=faces",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6", title: "Cirugía Reconstructiva",
    description: "Operación para corregir malformación facial congénita y devolver la sonrisa a una adolescente.",
    beneficiaryName: "Ana López", location: "Tijuana", category: "Cirugía",
    goalAmount: 60000, raisedAmount: 28000, medicalCondition: "Malformación facial congénita",
    hospitalName: "Hospital General de Tijuana", medicalDocDescription: "Evaluación maxilofacial",
    walletAddress: "GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR",
    verified: true, trustScore: 86, daysLeft: 35,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=faces",
    createdAt: new Date().toISOString(),
  },
];

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const stored = localStorage.getItem(CAMPAIGNS_KEY);
    return stored ? JSON.parse(stored) : defaultCampaigns;
  });

  const [donations, setDonations] = useState<Donation[]>(() => {
    const stored = localStorage.getItem(DONATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
  }, [donations]);

  const addCampaign = useCallback((data: Omit<Campaign, 'id' | 'raisedAmount' | 'verified' | 'trustScore' | 'daysLeft' | 'createdAt'>) => {
    const newCampaign: Campaign = {
      ...data,
      id: `c_${Date.now()}`,
      raisedAmount: 0,
      verified: false,
      trustScore: 0,
      daysLeft: 60,
      createdAt: new Date().toISOString(),
    };
    setCampaigns(prev => [...prev, newCampaign]);
    return newCampaign;
  }, []);

  const getCampaign = useCallback((id: string) => {
    return campaigns.find(c => c.id === id);
  }, [campaigns]);

  const addDonation = useCallback((data: Omit<Donation, 'id' | 'timestamp'>) => {
    const donation: Donation = {
      ...data,
      id: `d_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
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
    <CampaignContext.Provider value={{ campaigns, donations, addCampaign, getCampaign, addDonation, getCampaignDonations, getTotalDonatedByUser }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error('useCampaigns must be used within CampaignProvider');
  return ctx;
}
