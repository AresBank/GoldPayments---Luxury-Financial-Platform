
import React, { useState } from 'react';
import type { User, Transaction } from '../types';
import { LoanIcon, CheckCircleIcon, SignatureIcon } from './icons/Icons';

interface LoanProps {
  user: User;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

const Loan: React.FC<LoanProps> = ({ user, addTransaction }) => {
  const [amount, setAmount] = useState(5000);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRequestLoan = () => {
    setIsConfirming(true);
  };
  
  const confirmLoan = () => {
     addTransaction({
            type: 'credit',
            amount: amount,
            description: `Loan Disbursement`,
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
                <h2 className="text-2xl font-bold text-white mb-2">Loan Approved</h2>
                <p className="text-gray-300">{formatCurrency(amount)} has been credited to your account.</p>
            </div>
        );
    }
  
   if (isConfirming) {
        return (
             <div className="bg-gray-800 p-8 rounded-2xl border border-yellow-500/20 animate-fade-in">
                 <h2 className="text-2xl font-bold text-center text-white mb-4">Digital Loan Contract</h2>
                 <div className="h-48 bg-gray-900/50 p-4 rounded-lg overflow-y-auto text-xs text-gray-400 border border-gray-700">
                    <p className="font-bold mb-2 text-gray-200">LOAN AGREEMENT</p>
                    <p>This agreement is made between GoldPayments ("Lender") and {user.name} ("Borrower"). The Lender agrees to lend the Borrower the principal sum of {formatCurrency(amount)} MXN. The Borrower agrees to repay the principal sum, plus an annual interest rate of 25%, within 12 months. This contract is secured by a biometric hash and is legally binding...</p>
                    <p className="mt-4">By signing, you agree to all terms and conditions outlined above.</p>
                 </div>
                 <div className="mt-8 flex space-x-4">
                    <button onClick={() => setIsConfirming(false)} className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors">Cancel</button>
                    <button onClick={confirmLoan} className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2">
                        <SignatureIcon />
                        <span>Agree & Sign</span>
                    </button>
                 </div>
             </div>
        );
    }

  return (
    <div className="bg-gray-800 p-8 rounded-2xl border border-yellow-500/20 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <LoanIcon />
        <h2 className="text-2xl font-bold text-white">Request a Loan</h2>
      </div>

      <div className="text-center">
        <p className="text-gray-400">Loan Amount</p>
        <p className="text-5xl font-bold text-yellow-400 my-2">{formatCurrency(amount)}</p>
        <p className="text-sm text-gray-500">
          Credit Limit: {formatCurrency(user.creditLimit)}
        </p>
      </div>

      <div className="my-8">
        <input
          type="range"
          min="500"
          max={user.creditLimit}
          step="500"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-yellow-400"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
            <span>{formatCurrency(500)}</span>
            <span>{formatCurrency(user.creditLimit)}</span>
        </div>
      </div>
      
      <div className="bg-gray-900/50 p-4 rounded-lg text-sm space-y-2">
          <div className="flex justify-between"><span className="text-gray-400">Interest Rate (Annual):</span> <span className="font-semibold text-white">25%</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Repayment Period:</span> <span className="font-semibold text-white">12 Months</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Monthly Payment:</span> <span className="font-semibold text-white">{formatCurrency((amount * 1.25)/12)}</span></div>
      </div>

      <button
        onClick={handleRequestLoan}
        className="mt-8 w-full bg-yellow-400 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-300 transition-colors"
      >
        Request Loan
      </button>
    </div>
  );
};

export default Loan;
