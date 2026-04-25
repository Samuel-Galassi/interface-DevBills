import type { Category, CategorySummary } from "./category";


export const TransactionType = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export interface Transaction {
    id: string;
    userId:string;
    description: string;
    amount: number;
    date: Date | string;
    type: TransactionType;
    categoryId:string;
    category: Category;
    createdAt: Date | string;
    updatedAt: Date | string;
    
}

export interface CreateTransactionDTO {
    description: string;
    amount: number;
    date: Date | string,
    categoryId: string;
    type: TransactionType;
}

export interface TransactionFilter {
    month:number;
    year:number;
    categoryId?:string;
    type?:  TransactionType;
}



export interface TransactionSummary {
    totalIncomes: number;
    totalExpenses: number;
    balance: number;
    expensesByCategory: CategorySummary[];
}

export interface MonthlyItem{
    name: string;
    expenses: number;
    income: number;
}