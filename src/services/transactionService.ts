import { api }from "./api";
import type { CreateTransactionDTO, MonthlyItem, TransactionFilter, TransactionSummary } from "../../types/transactions";
import type { Transaction } from "../../types/transactions";


export const getTransactions = async (
    filter?: Partial<TransactionFilter>,
): Promise<{ transactions:Transaction[]}> => {

    const response = await api.get<{ transactions:Transaction[]}>("/transactions", {
        params: filter,
    });

    return response.data;

};

export const getTransactionsSummary = async (
    month: number,
    year:number,
): Promise<TransactionSummary> => {

    const response = await api.get<TransactionSummary>("/transactions/summary", {
        params: {
            month,
            year,
        },
    });

    return response.data;
}

export const getTransactionsMonthly = async (
    month: number,
    year:number,
    months?:number
): Promise<{historical:MonthlyItem[]}> => {

    const response = await api.get<{historical:MonthlyItem[]}>("/transactions/historical", {
        params: {
            month,
            year,
            months,
        },
    });

    return response.data;
}

export const deleteTransaction = async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
}

export const createTransaction = async (transactionData: CreateTransactionDTO): Promise<Transaction> => {
    const response = await api.post<Transaction>("/transactions", transactionData);


    return response.data
}