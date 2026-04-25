import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from "react";
import { TransactionType, type CreateTransactionDTO } from "../../types/transactions";
import { getCategories } from "../services/categoryService";
import type { Category } from "../../types/category";
import Card from "../components/Card";
import TransactionTypeSelector from "../components/TransactionTypeSelector";
import Input from "../components/Input";
import { AlertCircle, Calendar, DollarSign, Save, Tag } from "lucide-react";
import Select from "../components/Select";
import Button from "../components/Button";
import {useNavigate} from "react-router"
import { createTransaction } from "../services/transactionService";
import { toast } from "react-toastify";
interface formData {
    description: string;
    amount: number;
    date: string;
    categoryId: string;
    type: TransactionType;
}

type FormError = {
    description?: string;
    amount?: string;
    date?: string;
    categoryId?: string;
}

 
const initialFormData = {
    description: "",
    amount: 0,
    date: "",
    categoryId: "",
    type: TransactionType.EXPENSE,
}

const TransactionsForm = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<formData>(initialFormData);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<FormError>({});
    const [loading, setLoading] = useState<boolean>(false);
    const formId = useId()  
    const navigate = useNavigate();

    useEffect(() => {

    const fetchCategories = async (): Promise<void> => {
      const response =  await getCategories()
      setCategories(response);
    }
    fetchCategories();
},[]);

const filteredCategories =categories.filter((category) => category.type === formData.type)



const validateForm = ():boolean => {
    const newErrors: FormError = {};
    if(!formData.description.trim()) {
        newErrors.description = "Descrição Obrigatória";
    }
    
    if(!formData.amount || formData.amount <= 0) {
        newErrors.amount = "Informe um valor Válido";
    }

    if(!formData.date) {
        newErrors.date = "Data Obrigatória";
    }

    if(!formData.categoryId) {
        newErrors.categoryId = "Categoria Obrigatória";
    }
    
    setFormError(newErrors);
    
    if(Object.keys(newErrors).length > 0) {
        setError("Preencha todos os campos");
        return false;
    }
    setError(null);
    return true
}

const handleTransactionType = (itemType: TransactionType): void => {
    setFormData( (prev) => ({...prev, type: itemType}))
}

const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
   const { name, value } = event.target;
   setFormData( (prev) => (({...prev, [name]: value})))

   setFormError( (prev) => ({...prev, [name]: undefined}))
   setError(null)
}

const handleCancel = () => {
    navigate("/transacoes")
}
const handleSubmit = async (event: FormEvent):Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError(null)
    try {
       if(!validateForm()){
           return;
       }
            const transactionData:CreateTransactionDTO = {
            description:formData.description,
            amount: formData.amount,
            date: `${formData.date}T12:00:00.000Z`,
            categoryId: formData.categoryId,
            type: formData.type
           }

           await createTransaction(transactionData);
           toast.success("Transação adicionada com sucesso!")
           navigate("/transacoes")
       
    } catch (err) {
        toast.error("Falha ao adicionar a transação, tente novamente!")
        console.error(err)
    }finally{
        setLoading(false);
    }
    
}
    
    return(
        <div className="container-app py-8">
           <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nova Transação</h1>
            <Card>

                {error && (
                    <div className="flex items-center bg-red-300 border-red-700 rounded-xl p-4 mb-6 gap-2">
                        <AlertCircle className="2-5 h-5 text-red-700"/>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex gap-2 flex-col">
                        <label htmlFor={formId}>Tipo de Transação</label>
                        <TransactionTypeSelector id={formId} value={formData.type} onChange={handleTransactionType}/>
                    </div>

                    <Input 
                    label="Descrição"
                    name="description"
                    value={formData.description}
                    error={formError.description}
                    onChange={handleChange}
                    placeholder="Ex: Supermercado, Salário, etc..."
                    />

                    <Input 
                    label="Valor"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    error={formError.amount}
                    onChange={handleChange}
                    placeholder="R$ 0,00"
                    icon={<DollarSign  className="w-4 h-4 "/>}
                    />

                    <Input 
                    label="Data"
                    name="date"
                    type="date"
                    value={formData.date}
                    error={formError.date}
                    onChange={handleChange}
                    icon={<Calendar  className="w-4 h-4 "/>}
                    />
                    <Select 
                    label="Categoria"
                    name="categoryId"
                    value={formData.categoryId}
                    error={formError.categoryId}
                    onChange={handleChange}
                    icon={<Tag  className="w-4 h-4 "/>}
                    options={[
                        {value:"", label:"Selecione uma Categoria"},
                        ...filteredCategories.map( (category) => ({
                            value:category.id,
                            label:category.name
                        }))
                    ]}
                    />

                    <div className="flex justify-end space-x-3 mt-2">
                        <Button variant="outline" onClick={handleCancel} type="button" disabled={loading}>Cancelar</Button>
                        <Button type="submit" variant={formData.type === TransactionType.EXPENSE ? "danger" : "success"} disabled={loading}
                        >
                        {loading ? (
                            <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-4 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ):(
                        <Save className="w-4 h-4 mr-2"/>
                        )}
                        Salvar
                        </Button>
                    </div>

                </form>
            </Card>
           </div>
        </div>
    )
}

export default TransactionsForm;