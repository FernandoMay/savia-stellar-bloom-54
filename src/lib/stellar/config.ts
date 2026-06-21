function envVal(key: string, fallback: string): string {
  return import.meta.env[key] || fallback;
}

export const STELLAR_CONFIG = {
  NETWORK: (import.meta.env.VITE_STELLAR_NETWORK || 'testnet') as 'testnet' | 'public',
  NETWORK_PASSPHRASE: envVal('VITE_STELLAR_NETWORK_PASSPHRASE', envVal('VITE_NETWORK_PASSPHRASE', 'Test SDF Network ; September 2015')),
  HORIZON_URL: envVal('VITE_HORIZON_URL', 'https://horizon-testnet.stellar.org'),
  SOROBAN_RPC_URL: envVal('VITE_SOROBAN_RPC_URL', 'https://soroban-testnet.stellar.org:443'),
  CONTRACT_ID: envVal('VITE_CONTRACT_ID', 'CBXRIIYHKP6VU63KSLGBQ4GJ5FVTSAKTS4ZB3JEJJSQTCO6D3C2JVJIV'),
  APP_NAME: envVal('VITE_APP_NAME', 'Savia'),
  FRIENDBOT_URL: envVal('VITE_FRIENDBOT_URL', 'https://friendbot.stellar.org'),
} as const;

export type StellarNetwork = typeof STELLAR_CONFIG.NETWORK;
