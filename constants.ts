
import type { User, Transaction } from './types';

export const initialUser: User = {
  name: 'A. Stark',
  curp: 'AAAA000000HAAAAA00',
  balance: 50000.00,
  creditLimit: 50000.00,
};

export const initialTransactions: Transaction[] = [
  { id: 'tx_1', type: 'debit', amount: 149.00, description: 'Netflix Subscription', date: '2023-10-26T10:00:00Z' },
  { id: 'tx_2', type: 'debit', amount: 299.00, description: 'Amazon Purchase', date: '2023-10-25T14:30:00Z' },
  { id: 'tx_3', type: 'credit', amount: 15000.00, description: 'Payroll Deposit', date: '2023-10-24T09:00:00Z' },
  { id: 'tx_4', type: 'debit', amount: 85.50, description: 'Starbucks', date: '2023-10-23T08:15:00Z' },
];
