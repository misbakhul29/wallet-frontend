'use client';

import { useState } from 'react';
import type { Wallet } from '@/types';

interface WalletActionsProps {
  walletType: Wallet['type'];
  walletId: Wallet['id'];
  currentBalance: number;
  onUpdateBalance: (newBalance: number) => void;
}

export default function WalletActions({ walletType, walletId, currentBalance, onUpdateBalance }: WalletActionsProps) {
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [receiverWalletType, setReceiverWalletType] = useState<Wallet['type']>('dodi');
  const [receiverWalletId, setReceiverWalletId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDepositing, setIsDepositing] = useState<boolean>(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const amount = parseFloat(depositAmount);
    if (amount <= 0 || isNaN(amount)) {
      setError('Deposit amount must be greater than 0.');
      return;
    }

    setIsDepositing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await fetch(`https://wallet-express-pg.vercel.app/api/wallet/wallet/${walletType}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId, amount }),
      });

      const data: { error?: string; newBalance?: number } = await res.json();
      if (res.ok) {
        setMessage(`Deposit of $${amount.toFixed(2)} successful!`);
        if (data.newBalance !== undefined) {
          onUpdateBalance(data.newBalance);
        }
        setDepositAmount('');
      } else {
        setError(data.error || 'Failed to deposit.');
      }
    } catch (err) {
      setError('An error occurred during deposit.');
      console.error(err);
    } finally {
      setIsDepositing(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const amount = parseFloat(transferAmount);
    if (amount <= 0 || isNaN(amount)) {
      setError('Transfer amount must be greater than 0.');
      return;
    }
    if (walletId === receiverWalletId && walletType === receiverWalletType) {
      setError('Cannot transfer to the same wallet.');
      return;
    }

    try {
      const res = await fetch('https://wallet-express-pg.vercel.app/api/wallet/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderWalletType: walletType,
          senderWalletId: walletId,
          receiverWalletType,
          receiverWalletId,
          amount,
        }),
      });

      const data: { error?: string; message?: string } = await res.json();
      if (res.ok) {
        setMessage('Transfer successful!');
        onUpdateBalance(currentBalance - amount);
        setTransferAmount('');
        setReceiverWalletId('');
      } else {
        setError(data.error || 'Failed to transfer.');
      }
    } catch (err) {
      setError('An error occurred during transfer.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Actions for {walletType.toUpperCase()} Wallet</h3>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">id: {walletId}</h3>
      <p className="text-lg text-gray-700 mb-4">Current Balance: ${currentBalance.toFixed(2)}</p>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleDeposit} className="mb-6 border-b pb-4">
        <h4 className="text-lg font-medium mb-3 text-gray-700">Deposit Funds</h4>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            className="border p-2 rounded w-40"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            required
            disabled={isDepositing}
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isDepositing}
          >
            {isDepositing ? 'Depositing...' : 'Deposit'}
          </button>
        </div>
      </form>

      <form onSubmit={handleTransfer}>
        <h4 className="text-lg font-medium mb-3 text-gray-700">Transfer Funds</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Transfer Amount:
            </label>
            <input
              type="number"
              step="0.01"
              min="0" 
              placeholder="Amount"
              className="border p-2 rounded w-full"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Receiver Wallet Type:
            </label>
            <select
              className="border p-2 rounded w-full bg-white"
              value={receiverWalletType}
              onChange={(e) => setReceiverWalletType(e.target.value as Wallet['type'])}
            >
              <option value="dodi">Dodi</option>
              <option value="dudi">Dudi</option>
              <option value="codi">Codi</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Receiver Wallet ID:
            </label>
            <input
              type="text"
              placeholder="e.g., UUID of receiver wallet"
              className="border p-2 rounded w-full"
              value={receiverWalletId}
              onChange={(e) => setReceiverWalletId(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isDepositing}
        >
          {isDepositing ? 'Transferring...' : 'Transfer'}
        </button>
      </form>
    </div>
  );
}