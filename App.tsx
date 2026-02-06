
import React, { useState, useEffect } from 'react';
import type { Page, User, Transaction } from './types';
import { initialTransactions, initialUser } from './constants';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Transfer from './components/Transfer';
import Loan from './components/Loan';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  useEffect(() => {
    // Simulate checking if user is logged in
    // In a real app, this would be an API call
    const loggedInUser = localStorage.getItem('goldpayments_user');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      // Simulate fetching transactions
      const storedTransactions = localStorage.getItem('goldpayments_transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        setTransactions(initialTransactions);
        localStorage.setItem('goldpayments_transactions', JSON.stringify(initialTransactions));
      }
    }
  }, []);

  const handleOnboardingComplete = () => {
    const newUser: User = { ...initialUser, balance: 1000.00 };
    const welcomeBonus: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'credit',
      amount: 1000.00,
      description: 'Onboarding Welcome Bonus',
      date: new Date().toISOString(),
    };
    const updatedTransactions = [welcomeBonus, ...initialTransactions];
    
    setUser(newUser);
    setTransactions(updatedTransactions);

    localStorage.setItem('goldpayments_user', JSON.stringify(newUser));
    localStorage.setItem('goldpayments_transactions', JSON.stringify(updatedTransactions));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
        ...transaction,
        id: `tx_${Date.now()}`,
        date: new Date().toISOString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    if(user){
      const newBalance = user.balance + (newTransaction.type === 'credit' ? newTransaction.amount : -newTransaction.amount);
      const updatedUser = {...user, balance: newBalance};
      setUser(updatedUser);
      localStorage.setItem('goldpayments_user', JSON.stringify(updatedUser));
    }
    localStorage.setItem('goldpayments_transactions', JSON.stringify([newTransaction, ...transactions]));
  };

  const renderContent = () => {
    if (!user) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} transactions={transactions} />;
      case 'transfer':
        return <Transfer currentUserBalance={user.balance} addTransaction={addTransaction} />;
      case 'loan':
        return <Loan user={user} addTransaction={addTransaction} />;
      default:
        return <Dashboard user={user} transactions={transactions} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto p-4 max-w-4xl">
        {user && <Header user={user} setCurrentPage={setCurrentPage} currentPage={currentPage} />}
        <main className="mt-8">
          {renderContent()}
        </main>
        {user && <Chatbot transactions={transactions}/>}
      </div>
    </div>
  );
};

export default App;
