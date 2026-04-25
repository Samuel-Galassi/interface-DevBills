import { AlertCircle, ArrowDown, ArrowUp, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router";
import MonthYearSelect from "../components/MonthYearSelect";
import { useEffect, useState } from "react";
import Input from "../components/Input";
import Card from "../components/Card";
import type { Transaction } from "../../types/transactions";
import { deleteTransaction, getTransactions } from "../services/transactionService";
import Button from "../components/Button";
import { TransactionType } from "../../types/transactions";
import { formatCurrency, formatDate } from "../utils/formatter";
import { toast } from "react-toastify";
import type {ChangeEvent} from "react";
import { getCategories } from "../services/categoryService";
import type { Category } from "../../types/category";

type SortOrder = "asc"|"desc" | null;

const Transactions = () => {
    
    const currentDate = new Date()
    const [year, setYear] = useState<number>(currentDate.getFullYear());
    const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [deletingId, setDeletingId] = useState<string>("");
    const [searchText, setSearchText] = useState<string>("");
    const [amountSort, setAmountSort] = useState<SortOrder>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [showCategoryFilter, setShowCategoryFilter] = useState<boolean>(false);

    

    const sortByAmount = () => {
        let newOrder: SortOrder;

        if(amountSort ==="asc") newOrder = "desc";
        else newOrder = "asc";

        setAmountSort(newOrder);

        const sorted = [...filteredTransactions].sort((a, b) => {
            return newOrder ==="asc" ? a.amount - b.amount : b.amount - a.amount;
        });
        setFilteredTransactions(sorted)
    }
const fetchTransactions =  async (): Promise<void> => {
        try {
            setLoading(true)
            setError("")

            const data = await getTransactions({month, year})
            setTransactions(data.transactions)
            setFilteredTransactions(data.transactions)
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar transações, Tente Novamente!")
        }finally{
            setLoading(false)
        }
        };

        const handleDeleteTransaction = async (id: string): Promise<void> => {
            try {
                setDeletingId(id)

                await deleteTransaction(id);
                toast.success("Transação deletada com sucesso!")
                setTransactions((prev) => prev.filter((t) => t.id !== id));
                setFilteredTransactions((prev) => prev.filter((t) => t.id !== id));
            } catch (err) {
                console.error(err);
                toast.error("Falha ao deletar a Transação, tente novamente!")
            }finally{
                setDeletingId("")
            }
        }
        const confirmDelete = (id: string): void => {
            if(window.confirm("Tem certeza que deseja deletar essa transação?")){
                handleDeleteTransaction(id);
            }
        }

    useEffect(() => {
        fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[month, year])
    
    useEffect(() => {
  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  fetchCategories();
}, []);

const filterByCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);

    if(!categoryId){
        setFilteredTransactions(transactions);
        
    }else{
    const filtered = transactions.filter(t => t.categoryId === categoryId);
    setFilteredTransactions(filtered)
    }
    setShowCategoryFilter(false)
  }

const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")                 // separa letras dos acentos
    .replace(/[\u0300-\u036f]/g, "")  // remove os acentos
    .toUpperCase();                   // padroniza
};

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
  const value = event.target.value;

  setSearchText(value);

  const normalizedSearch = normalizeText(value);

  setFilteredTransactions(
    transactions.filter((transaction) =>
      normalizeText(transaction.description ?? "").includes(normalizedSearch)
    )
  );
};

    return(
        <div className="container-app py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 ">
                <h1 className="text-2xl font-bold mb-4 md:mb-0 ml-2.5">Transações</h1>
                <Link to="/transacoes/nova"
                className="bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all mr-2.5 ml-2.5">
                <Plus className="w-4 h-4 mr-2"/>
                Nova Transação
                </Link>
            </div>
            <Card className="mb-6 mr-2.5 ml-2.5">
                <MonthYearSelect month={month} year={year} onMonthChange={setMonth} onYearChange={setYear}/>
            </Card>
            <Card className="mb-6 mr-2.5 ml-2.5">
                <Input
                    placeholder="Buscar Transações..."
                    icon={<Search  className="w-4 h-4 "/>}
                    fullWidth
                    onChange={handleSearchChange}
                    value={searchText}
                />
            </Card>
            <Card className="overflow-hidden ml-2.5 mr-2.5">
            {loading ? (
                <div className="flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ): error ? (
                <div className="p-8 text-center ">
                <AlertCircle  className="w-12 h-12 text-red-500 mx-auto mb-4"/>
                <p>{error}</p>
                <Button onClick={fetchTransactions} className="mx-auto mt-6">Tentar Novamente</Button>
                </div>
            ): transactions?.length === 0 ?(
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Nenhuma Transação encontrada.</p>

                <Link 
                    to="/transacoes/nova"
                    className="w-fit mx-auto mt-6 bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all"
                >
                  <Plus className="w-4 h-4 mr-2"/>
                 Nova Transação
                </Link>
                </div>
            ): (
                <div className="overflow-x-auto">
                    <table className="divide-y divide-gray-700 min-h-full w-full">
                        <thead >
                          <tr>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                DESCRIÇÃO
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                DATA
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer relative" onClick={() => setShowCategoryFilter(prev => !prev)}>
                            CATEGORIA

                            {showCategoryFilter && (
                                <div className="absolute top-full left-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg p-2 z-10" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                                <select
                                    value={selectedCategory}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => filterByCategory(e.target.value)}
                                    className="bg-gray-800 text-sm rounded-md p-2 w-48"
                                >
                                    <option value="">Todas</option>
                                    {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                    ))}
                                </select>
                                </div>
                            )}
                            </th>
                            <th scope="col" onClick={sortByAmount} className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer select-none">
                            <div className="flex items-center gap-1">
                                VALOR
                                {amountSort === "asc" && <ArrowUp className="w-3 h-3" />}
                                {amountSort === "desc" && <ArrowDown className="w-3 h-3" />}
                            </div>
                            </th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                                AÇÕES
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {Array.isArray(filteredTransactions) && filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-800">
                                    <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="mr-2">
                                                {transaction.type === TransactionType.INCOME ? (
                                                    <ArrowUp className="w-4 h-4 text-primary-500"/>
                                                ): (
                                                    <ArrowDown className="w-4 h-4 text-red-600"/>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-gray-50">
                                                {transaction.description}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-3 py-4 text-sm whitespace-nowrap">
                                        {formatDate(transaction.date)}
                                    </td>

                                    <td className="px-3 py-4 text-sm whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: transaction.category.color}} />
                                        <span className="text-sm text-gray-400">{transaction.category.name}</span>
                                      </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm whitespace-nowrap">
                                        <span className={`${transaction.type === TransactionType.INCOME ? "text-primary-500" : "text-red-600"}`}>
                                            {formatCurrency(transaction.amount)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-400 whitespace-nowrap cursor-pointer">
                                        <button type="button" onClick={() => confirmDelete(transaction.id)} className="text-red-600 hover:text-red-400 rounded-full hover:bg-red-600/2" disabled={deletingId === transaction.id}>
                                            {deletingId === transaction.id ? (
                                                <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                            ): (
                                                <Trash2 className="w-4 h-4"/>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </Card>
        </div>
    )
}

export default Transactions;