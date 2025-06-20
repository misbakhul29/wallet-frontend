'use client';

import { useState, useEffect } from 'react';
import type { Wallet, Transaction } from '@/types';

interface WalletTransactionsProps {
  walletType: Wallet['type'];
  walletId: Wallet['id'];
}

export default function WalletTransactions({ walletType, walletId }: WalletTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:4000/api/wallet/wallet/${walletType}/${walletId}/transactions`);
        const data: Transaction[] | { error?: string } = await res.json();

        if (res.ok) {
          setTransactions(data as Transaction[]);
        } else {
          setError((data as { error?: string }).error || 'Failed to fetch transactions.');
        }
      } catch (err) {
        setError('An error occurred while fetching transactions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (walletId && walletType) {
      fetchTransactions();
    }
  }, [walletId, walletType]);

  if (!walletId || !walletType) {
    return <div className="bg-white p-6 rounded-lg shadow-md">Select a wallet to view transactions.</div>;
  }

  return (
    <div className="flex flex-1 flex-col h-full bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Transaction History for {walletType.toUpperCase()} Wallet</h3>
      {loading && <p>Loading transactions...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && transactions.length === 0 && (
        <p className="text-gray-600">No transactions found for this wallet.</p>
      )}
      {!loading && !error && transactions.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {transactions.map((tx) => (
            <li key={tx.id} className="py-3 flex justify-between items-center text-gray-700">
              <div>
                <p className="font-medium">
                  {tx.type === 'credit' ? 'Deposit' : 'Transfer'}
                </p>
                <p className="text-sm text-gray-500">{tx.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>
              <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'credit' ? '+' : '-'} ${parseFloat(tx.amount.toString()).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}