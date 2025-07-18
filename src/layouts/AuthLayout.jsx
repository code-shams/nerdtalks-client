import React from "react";
import { Outlet } from "react-router";

const AuthLayout = () => {
    return (
        <div className="prifont">
            <div className="flex items-center gap-1 sec-font justify-center mt-5">
                <img
                    className="w-10 h-10 md:w-14 md:h-14"
                    src="/logo.png"
                    alt=""
                />
                <h1 className="text-2xl md:text-3xl font-bold">nerdtalks</h1>
            </div>
            <Outlet></Outlet>
        </div>
    );
};

export default AuthLayout;
