import React, { use, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { AuthContext } from "../contexts/Auth/AuthContext";
import Loading from "../shared/Navbar/Loading/Loading";
import DashSidebar from "../components/Dashboard/DashSidebar";
import { SquareArrowLeft, SquareArrowRight } from "lucide-react";
import useDbUser from "../hooks/useDbUser";
import { Bounce, toast } from "react-toastify";

const DashboardLayout = () => {
    const navigate = useNavigate();
    const { user, loading, logoutUser } = use(AuthContext);
    const [sidebarActive, setSidebarActive] = useState(true);
    const handleSidebarToggle = () => {
        setSidebarActive(!sidebarActive);
    };
    const { isLoading, isError, error } = useDbUser();
    useEffect(() => {
        if (isError) {
            toast.error(`${"Something went wrong"}`, {
                position: "bottom-center",
                autoClose: 3000,
                theme: "dark",
                transition: Bounce,
                hideProgressBar: true,
            });
            logoutUser();
            navigate("/auth/login");
        }
    }, [isError, error]);

    return (
        <div className="flex w-full min-h-screen relative">
            {loading || isLoading ? (
                <Loading></Loading>
            ) : (
                <>
                    {/* //? Sidebar Toggle button */}
                    <button
                        onClick={handleSidebarToggle}
                        className="cursor-pointer absolute left-2 sm:left-4 top-4.5 z-50"
                    >
                        {sidebarActive ? (
                            <SquareArrowLeft className="size-5 sm:size-7" />
                        ) : (
                            <SquareArrowRight className="size-5 sm:size-7" />
                        )}
                    </button>

                    {/* <div className={`${sidebarActive?"opacity-0":"opacity-100"} transition-all duration-300 absolute left-10 top-3`}>
                        <Link
                            to="/"
                            className="flex items-center ml-auto gap-1 sec-font"
                        >
                            <img
                                className="w-8 h-8 sm:w-12 sm:h-12"
                                src="/logo.png"
                                alt=""
                            />
                            <h1 className="text-lg sm:text-2xl font-bold">
                                nerdtalks
                            </h1>
                        </Link>
                    </div> */}

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
                        className={`contain transition-all duration-300 pt-3 sm:pt-5 sm:pl-20 overflow-hidden ${
                            sidebarActive ? "" : ""
                        }`}
                    >
                        <Link
                            to="/"
                            className={`mb-3 flex items-center justify-end gap-1 sec-font transition-all duration-300 ${sidebarActive ?"translate-x-full":"translate-0"}`}
                        >
                            <img
                                className="w-8 h-8 sm:w-12 sm:h-12"
                                src="/logo.png"
                                alt=""
                            />
                            <h1 className="text-lg sm:text-2xl font-bold">
                                nerdtalks
                            </h1>
                        </Link>

                        <Outlet></Outlet>
                    </section>
                </>
            )}
        </div>
    );
};

export default DashboardLayout;
