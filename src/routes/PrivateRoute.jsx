import React, { use } from "react";

import { Navigate } from "react-router";
import Loading from "../shared/Navbar/Loading/Loading";
import { AuthContext } from "../contexts/Auth/AuthContext";

const PrivateRoute = ({ children }) => {
    const { loading, user } = use(AuthContext);
    if (loading) return <Loading></Loading>;
    if (user?.email) return children;
    return <Navigate to="/sign-in"></Navigate>;
};

export default PrivateRoute;
