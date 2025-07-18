import React, { use } from "react";

import { Navigate } from "react-router";
import { AuthContext } from "../contexts/AuthProvider";
import Loader from "../components/Loader/Loader";

const PrivateRoute = ({ children }) => {
    const { loading, user } = use(AuthContext);
    if (loading) return <p>Loading.....</p>;
    if (user?.email) return children;
    return <Navigate to="/sign-in"></Navigate>;
};

export default PrivateRoute;
