import React, { use } from "react";
import { AuthContext } from "../contexts/Auth/AuthContext";
import Loading from "../shared/Navbar/Loading/Loading";
import { Navigate } from "react-router";
import useDbUser from "../hooks/useDbUser";

const AdminRoutes = ({ children }) => {
    const { dbUser } = useDbUser();
    const { loading, user, logoutUser } = use(AuthContext);
    if (loading) return <Loading></Loading>;
    if (user?.email && dbUser?.role === "admin") {
        return children;
    }
    logoutUser();
    return <Navigate to="/auth/login"></Navigate>;
};

export default AdminRoutes;
