export interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: string;
    type: "income" | "expense";
    category: string; 
} 