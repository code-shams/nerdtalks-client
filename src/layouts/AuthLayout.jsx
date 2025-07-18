import React from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
    return (
        <div className="prifont">
            <Outlet></Outlet>
        </div>
    );
};

export default AuthLayout;
