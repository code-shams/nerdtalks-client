import { CalendarDays, Pencil, Plus, Share2 } from "lucide-react";
import useAxios from "../../../hooks/axios/useAxios";
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../contexts/Auth/AuthContext";

const UserProfile = () => {
    const {user, loading} = use(AuthContext);

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
    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <img
                            src="https://via.placeholder.com/96"
                            alt="User Avatar"
                            className="w-24 h-24 rounded-full object-cover border border-neutral-700"
                        />
                        <div>
                            <h1 className="text-2xl font-semibold">
                                Maksudur Rahman
                            </h1>
                            <p className="text-sm text-neutral-400">
                                struggle.endure.contend.code
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center gap-2">
                            <Pencil className="w-4 h-4" />
                            Edit
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex items-center text-sm text-neutral-400 gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Member Since Jul, 2025
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* About Me */}
                <div className="bg-[#121212] p-4 rounded-2xl border border-neutral-800">
                    <h2 className="text-sm font-semibold mb-2">About Me</h2>
                    <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
                        <Plus className="w-4 h-4" />
                        Add Bio
                    </button>
                    <p className="mt-2 text-sm text-neutral-500">
                        Your bio is empty. Tell the world who you are by writing
                        a short description about you.
                    </p>
                </div>

                {/* Tech Stack */}
                <div className="bg-[#121212] p-4 rounded-2xl border border-neutral-800">
                    <h2 className="text-sm font-semibold mb-2">
                        My Tech Stack
                    </h2>
                    <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
                        <Plus className="w-4 h-4" />
                        Add your skills
                    </button>
                </div>

                {/* Available For */}
                <div className="bg-[#121212] p-4 rounded-2xl border border-neutral-800">
                    <h2 className="text-sm font-semibold mb-2">
                        I am available for
                    </h2>
                    <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
                        <Plus className="w-4 h-4" />
                        Add Available For
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#121212] p-4 rounded-2xl border border-neutral-800">
                <h2 className="text-sm font-semibold mb-4">Recent Activity</h2>
                <div className="flex items-center text-sm text-neutral-400 gap-2">
                    <span className="text-xs">Jul 14</span> •{" "}
                    <span>Joined Hashnode</span>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
