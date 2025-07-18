import React, { use, useState } from "react";
import { Outlet } from "react-router";
import { AuthContext } from "../contexts/Auth/AuthContext";
import Loading from "../shared/Navbar/Loading/Loading";
import DashSidebar from "../components/Dashboard/DashSidebar";

const DashboardLayout = () => {
    const { user, loading, logoutUser } = use(AuthContext);
    const [sidebarActive, setSidebarActive] = useState(false);
    const handleSidebarToggle = () => {
        setSidebarActive(!sidebarActive);
    };
    return (
        <div className="flex w-full min-h-screen relative">
            {loading ? (
                <Loading></Loading>
            ) : (
                <>
                    <section
                        className={`absolute overflow-hidden transition-all duration-300 ${
                            sidebarActive ? "w-50 sm:w-80" : "w-16"
                        }`}
                    >
                        <DashSidebar
                            handleSidebarToggle={handleSidebarToggle}
                            sidebarActive={sidebarActive}
                            user={user}
                            logoutUser={logoutUser}
                        ></DashSidebar>
                    </section>
                    <section>
                        <Outlet></Outlet>
                    </section>
                </>
            )}
        </div>
    );
};

export default DashboardLayout;
