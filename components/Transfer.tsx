
import React, { useState } from 'react';
import type { Transaction } from '../types';
import { TransferIcon, CheckCircleIcon } from './icons/Icons';

interface TransferProps {
    currentUserBalance: number;
    addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

const Transfer: React.FC<TransferProps> = ({ currentUserBalance, addTransaction }) => {
    const [clabe, setClabe] = useState('');
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [error, setError] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [trackingKey, setTrackingKey] = useState('');

    const handleTransfer = () => {
        const numericAmount = parseFloat(amount);
        if (numericAmount > currentUserBalance) {
            setError('Insufficient funds.');
            return;
        }
        if (clabe.length !== 18 || !/^\d+$/.test(clabe)) {
            setError('Invalid CLABE. Must be 18 digits.');
            return;
        }
        if (!recipient) {
            setError('Recipient name is required.');
            return;
        }
        setError('');
        setIsConfirming(true);
    };

    const confirmTransfer = () => {
        const newTrackingKey = `GP${Date.now()}`;
        setTrackingKey(newTrackingKey);

        addTransaction({
            type: 'debit',
            amount: parseFloat(amount),
            description: `SPEI Transfer to ${recipient}`,
        });

        setIsConfirming(false);
        setIsCompleted(true);
    };

    if (isCompleted) {
        return (
            <div className="bg-gray-800 p-8 rounded-2xl border border-yellow-500/20 text-center animate-fade-in">
                <div className="w-16 h-16 mx-auto text-green-400 mb-4">
                    <CheckCircleIcon />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Transfer Successful</h2>
                <p className="text-gray-300">You sent {formatCurrency(parseFloat(amount))} to {recipient}.</p>
                <div className="mt-6 bg-gray-900 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Clave de Rastreo</p>
                    <p className="text-lg font-mono text-yellow-400">{trackingKey}</p>
                </div>
            </div>
        );
    }
    
    if (isConfirming) {
        return (
             <div className="bg-gray-800 p-8 rounded-2xl border border-yellow-500/20 animate-fade-in">
                 <h2 className="text-2xl font-bold text-center text-white mb-4">Confirm Transfer</h2>
                 <div className="space-y-4 text-lg">
                    <div className="flex justify-between"><span className="text-gray-400">Amount:</span> <span className="font-semibold text-white">{formatCurrency(parseFloat(amount))}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">To:</span> <span className="font-semibold text-white">{recipient}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">CLABE:</span> <span className="font-mono text-white">{clabe}</span></div>
                 </div>
                 <div className="mt-8 flex space-x-4">
                    <button onClick={() => setIsConfirming(false)} className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
                    <button onClick={confirmTransfer} className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors">Confirm & Send</button>
                 </div>
             </div>
        );
    }

    return (
        <div className="bg-gray-800 p-8 rounded-2xl border border-yellow-500/20 animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
                <TransferIcon />
                <h2 className="text-2xl font-bold text-white">New SPEI Transfer</h2>
            </div>
            <div className="space-y-4">
                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Recipient Name"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                />
                <input
                    type="text"
                    value={clabe}
                    onChange={(e) => setClabe(e.target.value.replace(/\D/g, ''))}
                    placeholder="18-digit CLABE"
                    maxLength={18}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white font-mono tracking-wider focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                />
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">MXN</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 pl-14 text-white text-right font-mono text-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                    />
                </div>
            </div>
            {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
            <button
                onClick={handleTransfer}
                disabled={!clabe || !amount || !recipient}
                className="mt-6 w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors disabled:bg-gray-600"
            >
                Send Money
            </button>
        </div>
    );
};

export default Transfer;
