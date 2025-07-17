import React from "react";
import { Outlet } from "react-router";
import Navbar from "../shared/Navbar/Navbar";

const MainLayout = () => {
    return (
        <div>
            <header className="py-3 border-b-1 border-b-slate-100/20">
                <Navbar></Navbar>
            </header>
            <section>
                <Outlet></Outlet>
            </section>
        </div>
    );
};

export default MainLayout;
