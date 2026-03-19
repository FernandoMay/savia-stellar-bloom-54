// Stellar Network Configuration
export const STELLAR_CONFIG = {
  NETWORK: 'testnet' as const,
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  SOROBAN_RPC_URL: 'https://soroban-testnet.stellar.org:443',
  CONTRACT_ID: 'CBXRIIYHKP6VU63KSLGBQ4GJ5FVTSAKTS4ZB3JEJJSQTCO6D3C2JVJIV',
  APP_NAME: 'Savia',
  FRIENDBOT_URL: 'https://friendbot.stellar.org',
} as const;

export type StellarNetwork = typeof STELLAR_CONFIG.NETWORK;
