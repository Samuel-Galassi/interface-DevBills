import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { AuthProvider} from '../context/AuthProvider';
import Dashboard from "../pages/Dashboard";
import PrivateRoutes from "./PrivateRoutes";
import AppLayout from "../layout/AppLayout";
import Transactions from "../pages/Transactions";
import TransactionsForm from "../pages/TransactionsForm";
import { ToastContainer, type ToastContainerProps } from "react-toastify";
const AppRoutes = () => {
        const toastConfig: ToastContainerProps = {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            newestOnTop: true,
            closeOnClick: true,
            pauseOnFocusLoss: false,
            draggable: true,
            pauseOnHover:true,
            theme: "colored",
        }

    return (
        <BrowserRouter>
        <AuthProvider>
        <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>

        <Route element={<PrivateRoutes />}>
        <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/transacoes" element={<Transactions />}/>
        <Route path="/transacoes/nova" element={<TransactionsForm />}/>
       </Route>
    </Route>


        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="*" element={<h2>404  Page Not Found</h2>}/>
        </Routes>
        <ToastContainer {...toastConfig}/>
        </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRoutes;