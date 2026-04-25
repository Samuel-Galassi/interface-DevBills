import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";


const PrivateRoutes = () => {
    const { authState } = useAuth();

    if(!authState.user) return <Navigate to="/login" replace/>

    return <Outlet />
}

export default PrivateRoutes;