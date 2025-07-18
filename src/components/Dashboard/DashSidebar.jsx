import {
    ArrowBigLeftDash,
    SquareArrowLeft,
    SquareArrowRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import useAxios from "../../hooks/axios/useAxios";
import { Bounce, toast } from "react-toastify";

const DashSidebar = ({ sidebarActive, user, logoutUser }) => {
    const { axiosSecure } = useAxios();
    const [dbUser, setDbUser] = useState({});
    const navigate = useNavigate();
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
    const role = dbUser?.role || "user";
    return (
        <div className="min-h-screen border-r border-slate-200/15">
            <div className="border-b border-slate-200/15 flex items-center gap-5 p-2">
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
        </div>
    );
};

export default DashSidebar;
