import React, { use } from "react";
import { Outlet } from "react-router";
import Navbar from "../shared/Navbar/Navbar";
import { AuthContext } from "../contexts/Auth/AuthContext";
import Loading from "../shared/Navbar/Loading/Loading";

const MainLayout = () => {
    const { user, loading } = use(AuthContext);
    return (
        <>
            {loading ? (
                <Loading></Loading>
            ) : (
                <div className="min-h-screen w-full relative">
                    {/* Orchid Depths Glow */}
                    <div
                        className="fixed inset-0 z-0"
                        style={{
                            background:
                                "radial-gradient(125% 125% at 50% 100%, #000000 40%, #350136 100%)",
                        }}
                    />
                    <header className="z-50 sticky top-0 w-full bg-black/30 backdrop-blur-xl">
                        <Navbar></Navbar>
                        <hr className="w-full text-slate-100/20 border-b border-slate-100/15" />
                    </header>
                    <section>
                        <Outlet></Outlet>
                    </section>
                </div>
            )}
        </>
    );
};

export default MainLayout;
