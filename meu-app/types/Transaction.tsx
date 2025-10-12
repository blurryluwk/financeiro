export type Transaction = {
  id: number;
  category: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  description: string;
};
