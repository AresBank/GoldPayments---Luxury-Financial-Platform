
import React from 'react';
import type { User, Page } from '../types';
import { GoldIcon, TransferIcon, LoanIcon } from './icons/Icons';

interface HeaderProps {
  user: User;
  setCurrentPage: (page: Page) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ user, setCurrentPage, currentPage }) => {
  const NavButton: React.FC<{ page: Page; label: string; children: React.ReactNode }> = ({ page, label, children }) => {
    const isActive = currentPage === page;
    return (
      <button
        onClick={() => setCurrentPage(page)}
        className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-300 ${isActive ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'}`}
        aria-label={label}
      >
        {children}
        <span className="text-xs font-medium">{label}</span>
      </button>
    );
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-yellow-500/20">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
        <GoldIcon />
        <span className="text-xl font-bold text-yellow-400 tracking-wider">GoldPayments</span>
      </div>
      
      <div className="hidden sm:flex items-center space-x-8">
        <NavButton page="dashboard" label="Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        </NavButton>
        <NavButton page="transfer" label="Transfer">
          <TransferIcon />
        </NavButton>
        <NavButton page="loan" label="Loan">
          <LoanIcon />
        </NavButton>
      </div>

      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{user.name}</p>
          <p className="text-xs text-gray-400">Welcome</p>
        </div>
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Header;
