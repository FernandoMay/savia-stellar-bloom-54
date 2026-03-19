export interface WalletInfo {
  address: string;
  type: 'freighter';
  network: string;
  connected: boolean;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  ipfs_hash: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    category: string;
    collection: string;
    network: string;
    contract: string;
  };
}

export interface NFTRecord {
  tokenId: string;
  owner: string;
  stage: number;
  metadata: NFTMetadata;
  transactionHash: string;
  mintedAt: string;
  donationAmount: number;
}

export interface DonationRecord {
  id: string;
  donor: string;
  amount: number;
  timestamp: string;
  transactionHash: string;
}

export interface NFTStage {
  id: number;
  name: string;
  threshold: number;
  ipfsHash: string;
  imageUrl: string;
  description: string;
  color: string;
  attributes: {
    growth: string;
    rarity: string;
  };
}
