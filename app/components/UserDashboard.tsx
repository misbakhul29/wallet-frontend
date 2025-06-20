'use client';

import { useState, useEffect, useCallback } from 'react';
import WalletActions from './WalletActions';
import type { Wallet } from '@/types';
import WalletTransactions from './WalletTransactions';

interface UserDashboardProps {
  username: string;
}

export default function UserDashboard({ username }: UserDashboardProps) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://wallet-express-pg.vercel.app/api/wallet/${username}/wallets`);
      const data: Wallet[] | { error?: string } = await res.json();

      if (res.ok) {
        const fetchedWallets = data as Wallet[];
        const processedWallets: Wallet[] = [];

        if (Array.isArray(fetchedWallets)) {
          fetchedWallets.forEach(wallet => {
            processedWallets.push({
              id: wallet.id,
              userId: wallet.userId,
              type: wallet.type,
              balance: parseFloat(wallet.balance.toString())
            });
          });
        }
        setWallets(processedWallets);

        if (processedWallets.length > 0 && !selectedWallet) {
          setSelectedWallet(processedWallets[0]);
        } else if (selectedWallet) {
          const updatedSelected = processedWallets.find(w => w.id === selectedWallet.id && w.type === selectedWallet.type);
          if (updatedSelected) {
            setSelectedWallet(updatedSelected);
          } else {
            setSelectedWallet(processedWallets[0] || null);
          }
        }

        console.log(selectedWallet)
      } else {
        setError((data as { error?: string }).error || 'Failed to fetch wallets.');
      }
    } catch (err) {
      setError('An error occurred while fetching wallets. Make sure your backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const handleUpdateBalance = () => {
    fetchWallets();
  };

  if (loading) {
    return <div className="text-center py-8">Loading wallets...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  if (wallets.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No wallets found for {username}. Please create one from your backend.</p>
        <p className="mt-4 text-sm text-gray-500">
          (e.g., POST to `/api/wallet/{username}/create-dodi-wallet` via Postman)
        </p>
      </div>
    );
  }

  return (
    <div className='flex gap-4'>
      <div className="flex flex-col mb-8">
        <div className="flex flex-wrap flex-col gap-4">
          {wallets.map((wallet) => (
            <button
              key={`${wallet.type}-${wallet.id}`}
              onClick={() => setSelectedWallet(wallet)}
              className={`p-4 rounded-lg shadow-md transition duration-200
                ${selectedWallet?.id === wallet.id && selectedWallet?.type === wallet.type
                  ? 'bg-blue-600 text-white transform scale-105'
                  : 'bg-white text-blue-700 hover:bg-gray-50'
                }`}
            >
              <p className="font-semibold">{wallet.type.toUpperCase()} Wallet</p>
              <p className="text-sm">${wallet.balance.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      <div className='flex flex-1 gap-6'>
        {selectedWallet && (
          <>
            <WalletActions
              walletType={selectedWallet.type}
              walletId={selectedWallet.id}
              currentBalance={selectedWallet.balance}
              onUpdateBalance={handleUpdateBalance}
            />
            <WalletTransactions
              walletType={selectedWallet.type}
              walletId={selectedWallet.id}
              key={`${selectedWallet.type}-${selectedWallet.id}-transactions`}
            />
          </>
        )}
      </div>

    </div>
  );
}