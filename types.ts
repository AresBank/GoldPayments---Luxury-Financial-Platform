
export interface User {
  name: string;
  curp: string;
  balance: number;
  creditLimit: number;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

export type Page = 'dashboard' | 'transfer' | 'loan';
