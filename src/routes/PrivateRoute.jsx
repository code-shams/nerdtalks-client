import React, { use } from "react";
import Loading from "../shared/Navbar/Loading/Loading";
import { AuthContext } from "../contexts/Auth/AuthContext";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
    const { loading, user } = use(AuthContext);
    if (loading) return <Loading></Loading>;
    if (user?.email) return children;
    return <Navigate to="/auth/login"></Navigate>;
};

export default PrivateRoute;
