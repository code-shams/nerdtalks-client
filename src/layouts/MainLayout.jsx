import React from "react";
import { Outlet } from "react-router";
import Navbar from "../shared/Navbar/Navbar";
import MobileNav from "../components/MobileNav";

const MainLayout = () => {
    return (
        <div className="pri-font">
            <header className="">
                <Navbar></Navbar>
                <hr className="w-full text-slate-100/20 border-b border-slate-100/15" />
                <section className="block lg:hidden">
                    <MobileNav></MobileNav>
                </section>
            </header>
            <section>
                <Outlet></Outlet>
            </section>
        </div>
    );
};

export default MainLayout;
