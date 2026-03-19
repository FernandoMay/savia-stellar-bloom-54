import { useState, useCallback, useEffect } from 'react';
import {
  connectFreighter,
  isFreighterInstalled,
  fundWithFriendbot,
} from '@/lib/stellar/wallet';
import { getXLMBalance } from '@/lib/stellar/soroban';
import type { WalletInfo } from '@/lib/stellar/types';
import { toast } from '@/components/ui/sonner';

const WALLET_STORAGE_KEY = 'savia_wallet';

export function useStellarWallet() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false);

  // Check Freighter availability on mount
  useEffect(() => {
    const check = async () => {
      // Give extension time to inject
      await new Promise((r) => setTimeout(r, 500));
      const installed = await isFreighterInstalled();
      setIsFreighterAvailable(installed);
    };
    check();
  }, []);

  // Auto-reconnect from storage
  useEffect(() => {
    const stored = localStorage.getItem(WALLET_STORAGE_KEY);
    if (stored) {
      try {
        const info = JSON.parse(stored) as WalletInfo;
        setWallet(info);
        refreshBalance(info.address);
      } catch {
        localStorage.removeItem(WALLET_STORAGE_KEY);
      }
    }
  }, []);

  const refreshBalance = useCallback(async (address: string) => {
    const bal = await getXLMBalance(address);
    setBalance(bal);
    return bal;
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const walletInfo = await connectFreighter();
      setWallet(walletInfo);
      localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(walletInfo));

      // Fetch balance
      const bal = await refreshBalance(walletInfo.address);

      // If zero balance on testnet, fund with friendbot
      if (parseFloat(bal) === 0) {
        toast.info('Financiando cuenta en testnet...');
        const funded = await fundWithFriendbot(walletInfo.address);
        if (funded) {
          await refreshBalance(walletInfo.address);
          toast.success('¡Cuenta financiada con XLM de prueba!');
        }
      }

      toast.success('¡Wallet conectada exitosamente!');
      return walletInfo;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      toast.error(message);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [refreshBalance]);

  const disconnect = useCallback(() => {
    setWallet(null);
    setBalance('0');
    localStorage.removeItem(WALLET_STORAGE_KEY);
    toast.info('Wallet desconectada');
  }, []);

  return {
    wallet,
    balance,
    isConnecting,
    isFreighterAvailable,
    connect,
    disconnect,
    refreshBalance: wallet ? () => refreshBalance(wallet.address) : undefined,
  };
}
