import { Bell, Gem, Home } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router";

const MobileNav = () => {
    const [notifications, setNotifications] = useState(99);
    return (
        <div className="flex justify-center gap-10 items-center">
            <NavLink
                className="link-hover link-style flex items-center gap-2"
                to="/"
            >
                <Home size={24} />
            </NavLink>
            <NavLink
                className="link-hover link-style flex items-center gap-2"
                to="/membership"
            >
                <Gem size={24} />
            </NavLink>
            <div className="relative">
                <NavLink
                    className="link-hover link-style flex items-center gap-2"
                    to="notifications"
                >
                    <Bell size={24} />
                </NavLink>

                {/* //?Notification Number */}
                {notifications ? (
                    <span className="absolute -top-1 left-2 bg-red-500 text-white text-[12px] font-medium rounded-full px-2 py-0.5 shadow-md">
                        {notifications < 100 ? notifications : "99+"}
                    </span>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

export default MobileNav;
