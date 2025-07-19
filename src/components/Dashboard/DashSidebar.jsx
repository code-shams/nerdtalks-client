import "./dashboard.css";
import {
    ArrowBigLeftDash,
    FilePlus,
    List,
    SquareArrowLeft,
    SquareArrowRight,
    User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import useAxios from "../../hooks/axios/useAxios";
import { Bounce, toast } from "react-toastify";

const DashSidebar = ({ sidebarActive, user, logoutUser }) => {
    // ?axios hook for jwt
    const { axiosSecure } = useAxios();

    // ?state to store user information from database
    const [dbUser, setDbUser] = useState({});

    const navigate = useNavigate();

    // ?Fetching user data from db
    useEffect(() => {
        axiosSecure(`/users/${user.uid}`)
            .then((res) => setDbUser(res.data))
            .catch((err) => {
                toast.error(`${err?.response?.data?.message}`, {
                    position: "bottom-center",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Bounce,
                    hideProgressBar: true,
                });
                logoutUser();
                navigate("/auth/login");
            });
    }, [user]);

    // ?Determining logged in users role
    const role = dbUser?.role;

    // ?User specific routes
    const userLinks = [
        {
            name: "My Profile",
            to: "/dashboard",
            icon: <User className="size-6" />,
        },
        {
            name: "Add Post",
            to: "/dashboard/add-post",
            icon: <FilePlus className="size-6" />,
        },
        {
            name: "My Posts",
            to: "/dashboard/my-posts",
            icon: <List className="size-6" />,
        },
    ];

    return (
        <div className="min-h-screen border-r-2 border-slate-200/20 sec-font relative overflow-hidden">
            {/* //?Dashboard heading on larger screen */}
            <div className="border-b border-slate-200/20 flex items-center gap-5 p-2">
                <div
                    className={`transition-all duration-300 w-full flex flex-col ${
                        sidebarActive
                            ? "translate-0 opacity-100"
                            : "translate-x-full opacity-0"
                    }`}
                >
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
                </div>
            </div>

            {/* //?Dashboard Routes according to user role */}

            {/* //?SidebarActive view */}
            <div
                className={`dashboardRoutes absolute transition-all duration-300 pt-5 p-2 space-y-5 w-full
                    ${sidebarActive ? "translate-0" : "-translate-x-100"}
                `}
            >
                {/* //?User based routes */}
                {role === "user" &&
                    userLinks.map((route, index) => {
                        return (
                            <NavLink
                                key={index}
                                to={route.to}
                                className="flex gap-4 p-2 text-[#9C9A92] hover:bg-slate-200/15 hover:text-white transition-all duration-300 items-center text-lg font-medium"
                            >
                                {route.icon}
                                {route.name}
                            </NavLink>
                        );
                    })}
            </div>

            {/* //?Sidebar collapsed view */}
            <div
                className={`dashboardRoutes absolute p-2 transition-all duration-300 space-y-5 ${
                    sidebarActive ? "-translate-x-100" : "translate-0"
                }`}
            >
                {/* //?User based routes */}
                {role === "user" &&
                    userLinks.map((route, index) => {
                        return (
                            <NavLink
                                key={index}
                                to={route.to}
                                className="flex gap-4 pl-0 p-2 text-[#9C9A92] hover:bg-slate-200/15 hover:text-white transition-all duration-300 items-center text-lg font-medium"
                            >
                                {route.icon}
                            </NavLink>
                        );
                    })}
            </div>
        </div>
    );
};

export default DashSidebar;
