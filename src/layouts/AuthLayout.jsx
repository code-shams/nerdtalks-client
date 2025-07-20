import React from "react";
import { Link, Outlet } from "react-router";

const AuthLayout = () => {
    return (
        <div className="min-h-screen w-full relative pri-font">
            {/* Dark Horizon Glow */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
                }}
            />
            <Link
                to="/"
                className="flex items-center gap-1 sec-font justify-center pt-5 relative"
            >
                <img
                    className="w-10 h-10 md:w-14 md:h-14"
                    src="/logo.png"
                    alt=""
                />
                <h1 className="text-2xl md:text-3xl font-bold">nerdtalks</h1>
            </Link>
            <Outlet></Outlet>
        </div>
    );
};

export default AuthLayout;
