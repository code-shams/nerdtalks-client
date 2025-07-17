import React, { use, useState } from "react";
import logo from "../../../public/logo2.png";
import { Home, Gem, Bell, LogIn } from "lucide-react";
import { Link, NavLink } from "react-router";
import "./navbar.css";
import { AuthContext } from "../../contexts/Auth/AuthContext";
const Navbar = () => {
    const [notifications, setNotifications] = useState(0);
    const { user } = use(AuthContext);
    return (
        <nav className="contain sec-font flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1">
                <img className="w-8 h-8 md:w-12 md:h-12" src={logo} alt="" />
                <h1 className="text-xl md:text-2xl font-bold">nerdtalks</h1>
            </Link>
            <div className="hidden lg:flex lg:items-center text-lg gap-5 text-slate-200">
                <NavLink
                    className="link-hover link-style flex items-center gap-2"
                    to="/"
                >
                    <Home size={24} />
                    Home
                </NavLink>
                <NavLink
                    className="link-hover link-style flex items-center gap-2"
                    to="/membership"
                >
                    <Gem size={24} />
                    Membership
                </NavLink>
                <div className="relative">
                    <NavLink
                        className="link-hover link-style flex items-center gap-2"
                        to="notifications"
                    >
                        <Bell size={24} />
                        Notifications
                    </NavLink>

                    {/* //?Notification Number */}
                    {notifications ? (
                        <span className="absolute top-0 left-2 bg-red-500 text-white text-xs font-medium rounded-full px-2 py-0.5 shadow-md">
                            {notifications < 9 ? notifications : "9+"}
                        </span>
                    ) : (
                        ""
                    )}
                </div>
            </div>

            {/* //?Dynamic Login according to user state */}
            {user?.email? "" : ""}
            <NavLink
                className="text-lg text-slate-200 link-hover link-style flex items-center gap-2"
                to="/login"
            >
                <LogIn size={24} />
                Join Us
            </NavLink>
        </nav>
    );
};

export default Navbar;
