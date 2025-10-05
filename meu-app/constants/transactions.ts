export type TransactionCategory = 'Alimentação' | 'Mobilidade' | 'Salário' | 'Lazer' | 'Outros';

export type Transaction = {
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: TransactionCategory;
};

export const transactions: Transaction[] = [
  {
    description: 'Salário',
    amount: 2500,
    date: '20/09/2025',
    type: 'income',
    category: 'Salário',
  },
  {
    description: 'Supermercado',
    amount: 320.45,
    date: '18/09/2025',
    type: 'expense',
    category: 'Alimentação',
  },
  {
    description: 'Freelance',
    amount: 800,
    date: '15/09/2025',
    type: 'income',
    category: 'Outros',
  },
  {
    description: 'Restaurante',
    amount: 120.99,
    date: '12/09/2025',
    type: 'expense',
    category: 'Alimentação',
  },
  {
    description: 'Uber Moto',
    amount: 145.99,
    date: '12/09/2025',
    type: 'expense',
    category: 'Mobilidade',
  },
  {
    description: 'Cinema',
    amount: 24.40,
    date: '12/09/2025',
    type: 'expense',
    category: 'Lazer',
  },
];
