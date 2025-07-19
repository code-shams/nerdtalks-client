import { Award, CalendarDays, Pencil, Share2 } from "lucide-react";
import bronze from "../../../assets/icons/bronze.png";
import gold from "../../../assets/icons/gold.png";
import useDbUser from "../../../hooks/useDbUser";
import { format } from "date-fns";

const UserProfile = () => {
    const { dbUser } = useDbUser();
    const isoDate = dbUser?.joinedAt;
    const joinedAt = format(new Date(isoDate), "MMMM yyyy");
    return (
        <div className="space-y-6 pri-font">
            {/* Profile Header */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <img
                            src={dbUser.avatar}
                            alt="User Avatar"
                            className="w-24 h-24 rounded-full object-cover border border-neutral-700"
                        />
                        <div>
                            <h1 className="text-lg sm:text-2xl font-semibold">
                                {dbUser.name}
                            </h1>
                            <p className="text-xs sm:text-sm text-neutral-400">
                                {dbUser.email}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center text-sm text-neutral-400 gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Joined Since {joinedAt}
                </div>

                <div className="mt-4 flex flex-col text-sm text-neutral-400 gap-2">
                    <span className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        Achievements
                    </span>
                    <div className="flex gap-5 items-center">
                        {dbUser?.badges?.map((badge, index) => {
                            return (
                                <>
                                    {badge === "bronze" && (
                                        <div className="flex flex-col items-center gap-2">
                                            <img
                                                src={bronze}
                                                className="w-20 h-20 sm:w-24 sm:h-24"
                                                alt=""
                                            />
                                            <span className="text-center text-xs sm:text-base w-max">
                                                Joined nerdtalks
                                            </span>
                                        </div>
                                    )}
                                    {badge === "gold" && (
                                        <div className="flex flex-col items-center gap-2">
                                            <img
                                                src={gold}
                                                className="w-20 h-20 sm:w-24 sm:h-24"
                                                alt=""
                                            />
                                            <span className="text-center text-xs sm:text-base w-max">
                                                Premium Member
                                            </span>
                                        </div>
                                    )}
                                </>
                            );
                        })}
                    </div>
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
