import React from "react";
import { Outlet } from "react-router";

const MainLayout = () => {
    return (
        <div>
            <section>
                <Outlet></Outlet>
            </section>
        </div>
    );
};

export default MainLayout;
