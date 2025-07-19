import React, { use, useEffect } from "react";
import useDbUser from "../../../hooks/useDbUser";
import { useNavigate } from "react-router";
import { Bounce, toast } from "react-toastify";
import UserProfile from "./UserProfile";
import AdminProfile from "./AdminProfile";
import { AuthContext } from "../../../contexts/Auth/AuthContext";

const Profile = () => {
    const { dbUser, isError, error } = useDbUser();
    const { logoutUser } = use(AuthContext);
    const navigate = useNavigate();
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
    const role = dbUser?.role;
    return (
        <div>
            {role === "user" && <UserProfile></UserProfile>}
            {role === "admin" && <AdminProfile></AdminProfile>}
        </div>
    );
};

export default Profile;
