
import React from 'react';
import type { User, Transaction } from '../types';
import VirtualCard from './VirtualCard';
import { CreditIcon, DebitIcon } from './icons/Icons';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

const Dashboard: React.FC<DashboardProps> = ({ user, transactions }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Balance and Card Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-2xl border border-yellow-500/20 flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Balance</p>
            <p className="text-4xl font-bold text-white tracking-tight">
              {formatCurrency(user.balance)}
            </p>
          </div>
          <p className="text-yellow-400/80 text-xs mt-4">
            Updated just now
          </p>
        </div>
        <VirtualCard userName={user.name} />
      </div>

      {/* Transactions Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="bg-gray-800 rounded-2xl p-4 border border-yellow-500/20">
          <ul className="divide-y divide-gray-700">
            {transactions.slice(0, 5).map((tx) => (
              <li key={tx.id} className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {tx.type === 'credit' ? <CreditIcon /> : <DebitIcon />}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{tx.description}</p>
                    <p className="text-sm text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'credit' ? '+' : '-'} {formatCurrency(tx.amount)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
