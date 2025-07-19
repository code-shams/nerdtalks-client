import React, { use, useState } from "react";
import { Outlet } from "react-router";
import { AuthContext } from "../contexts/Auth/AuthContext";
import Loading from "../shared/Navbar/Loading/Loading";
import DashSidebar from "../components/Dashboard/DashSidebar";
import { SquareArrowLeft, SquareArrowRight } from "lucide-react";
import useDbUser from "../hooks/useDbUser";

const DashboardLayout = () => {
    const { user, loading, logoutUser } = use(AuthContext);
    const [sidebarActive, setSidebarActive] = useState(true);
    const handleSidebarToggle = () => {
        setSidebarActive(!sidebarActive);
    };
    const { isLoading } = useDbUser();

    return (
        <div className="flex w-full min-h-screen relative">
            {loading || isLoading ? (
                <Loading></Loading>
            ) : (
                <>
                    {/* //? Sidebar Toggle button */}
                    <button
                        onClick={handleSidebarToggle}
                        className="cursor-pointer absolute left-4 top-4.5 z-50"
                    >
                        {sidebarActive ? (
                            <SquareArrowLeft className="size-5 sm:size-7" />
                        ) : (
                            <SquareArrowRight className="size-5 sm:size-7" />
                        )}
                    </button>

                    {/* //?Dashboard Sidebar */}
                    <section
                        className={`absolute overflow-hidden transition-all duration-300 z-10 bg-black ${
                            sidebarActive ? "w-50 sm:w-80" : "w-0 sm:w-16"
                        }`}
                    >
                        <DashSidebar
                            handleSidebarToggle={handleSidebarToggle}
                            sidebarActive={sidebarActive}
                            user={user}
                            logoutUser={logoutUser}
                        ></DashSidebar>
                    </section>

                    {/* //?Dashboard Dynamic Section */}
                    <section
                        className={`contain transition-all duration-300 pt-5 pl-5 sm:pl-20 ${
                            sidebarActive ? "" : ""
                        }`}
                    >
                        <Outlet></Outlet>
                    </section>
                </>
            )}
        </div>
    );
};

export default DashboardLayout;
