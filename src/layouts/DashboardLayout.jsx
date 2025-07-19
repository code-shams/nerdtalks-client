import React, { use, useState } from "react";
import { Outlet } from "react-router";
import { AuthContext } from "../contexts/Auth/AuthContext";
import Loading from "../shared/Navbar/Loading/Loading";
import DashSidebar from "../components/Dashboard/DashSidebar";
import { SquareArrowLeft, SquareArrowRight } from "lucide-react";

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
                    <button
                        onClick={handleSidebarToggle}
                        className="cursor-pointer absolute left-2 top-4.5 z-50"
                    >
                        {sidebarActive ? (
                            <SquareArrowLeft className="size-5 sm:size-7" />
                        ) : (
                            <SquareArrowRight className="size-5 sm:size-7" />
                        )}
                    </button>
                    <section
                        className={`overflow-hidden transition-all duration-300 ${
                            sidebarActive ? "w-50 sm:w-70`" : "w-0 sm:w-16"
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
