import { Bell, Gem, Home } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router";

const MobileNav = ({ announcements }) => {
    return (
        <div className="flex justify-center sm:gap-10 items-center">
            <NavLink
                className="link-hover link-style flex items-center gap-2"
                to="/"
            >
                <Home className="size-5 sm:size-6" />
            </NavLink>
            <NavLink
                className="link-hover link-style flex items-center gap-2"
                to="/membership"
            >
                <Gem className="size-5 sm:size-6" />
            </NavLink>
            <div className="relative">
                <NavLink
                    className="link-hover link-style flex items-center gap-2"
                    to="announcements"
                >
                    <Bell className="size-5 sm:size-6" />
                </NavLink>

                {/* //?Notification Number */}
                {announcements ? (
                    <span className="absolute -top-1 left-2 bg-red-500 text-white text-[12px] font-medium rounded-full px-2 py-0.5 shadow-md">
                        {announcements < 100 ? announcements : "99+"}
                    </span>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

export default MobileNav;
