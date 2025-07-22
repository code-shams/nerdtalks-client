import React, { use, useState } from "react";
import {
    Home,
    Gem,
    Bell,
    LogIn,
    LogOut,
    LayoutDashboard,
    UserCircle,
} from "lucide-react";
import { Link, NavLink } from "react-router";
import "./navbar.css";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import MobileNav from "../../components/MobileNav";
import Announcements from "../../pages/Home/Announcements/Announcement";

const Navbar = ({ announcements }) => {
    // ?Dropdown Logics
    const [dropdownActive, setDropdownActive] = useState(false);
    const handleDropdown = () => {
        setDropdownActive(!dropdownActive);
    };

    const handleSignOut = () => {
        logoutUser();
    };

    const { user, logoutUser } = use(AuthContext);
    return (
        <nav className="contain sec-font flex items-center justify-between py-3">
            <Link to="/" className="flex items-center gap-1">
                <img
                    className="w-9 h-9 sm:w-12 sm:h-12"
                    src="/logo.png"
                    alt=""
                />
                <h1 className="text-2xl font-bold hidden sm:block">
                    nerdtalks
                </h1>
            </Link>
            <div className="hidden lg:flex md:items-center text-base gap-5 text-slate-200">
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
                    {announcements ? (
                        <span className="absolute top-0 left-2 bg-red-500 text-white text-xs font-medium rounded-full px-2 py-0.5 shadow-md">
                            {announcements < 9 ? announcements : "9+"}
                        </span>
                    ) : (
                        ""
                    )}
                </div>
            </div>

            <section className="block lg:hidden">
                <MobileNav announcements={announcements}></MobileNav>
            </section>

            {/* //?Dynamic Login according to user state */}
            {user?.email ? (
                <div className="group relative">
                    <img
                        onClick={handleDropdown}
                        src={user?.photoURL}
                        className="rounded-full w-10 h-10 sm:w-14 sm:h-14 cursor-pointer"
                        alt=""
                    />
                    {dropdownActive ? ( //?Dropdown Section
                        <div className="absolute z-50 right-0 sm:-right-5 top-12 sm:top-18 rounded w-max flex flex-col gap-3 bg-[#2D2E30] py-2 px-2 sm:px-5 text-xs sm:text-base">
                            <span className="flex items-center gap-2">
                                <UserCircle className="size-4 sm:size-5"></UserCircle>
                                {user?.displayName}
                            </span>
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2"
                            >
                                <LayoutDashboard className="size-4 sm:size-5"></LayoutDashboard>
                                Dashboard
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <LogOut className="size-4 sm:size-5"></LogOut>
                                Log Out
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            ) : (
                <NavLink
                    className="text-xs sm:text-lg text-slate-200 link-hover link-style flex items-center gap-1 sm:gap-2"
                    to="/auth/login"
                >
                    <LogIn className="size-4 sm:size-5" />
                    <span className="hidden sm:block">Join Us</span>
                </NavLink>
            )}
        </nav>
    );
};

export default Navbar;
