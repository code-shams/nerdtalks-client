import {
    Award,
    CalendarDays,
    FileText,
    MessageCircle,
    Pencil,
    Share2,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import bronze from "../../../assets/icons/bronze.png";
import gold from "../../../assets/icons/gold.png";
import useDbUser from "../../../hooks/useDbUser";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/axios/useAxios";
import { useEffect } from "react";
import Swal from "sweetalert2";
import loadImg from "../../../assets/loading.gif";
import { Link, useNavigate } from "react-router";

const UserProfile = () => {
    const { dbUser } = useDbUser();
    const isoDate = dbUser?.joinedAt;
    const joinedAt = format(new Date(isoDate), "MMMM yyyy");
    const navigate = useNavigate();
    const { axiosSecure } = useAxios();

    const {
        data: postsData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["userPosts", dbUser._id],
        queryFn: async () => {
            const response = await axiosSecure.get(
                `/posts/user/${dbUser._id}?limit=3`
            );
            return response.data;
        },
        enabled: !!dbUser._id,
    });

    // ? Handling data fetching error from tanstack
    useEffect(() => {
        if (isError) {
            Swal.fire({
                icon: "error",
                title: "Loading Failed",
                text: "Unable to load your posts. Please try again.",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#dc2626",
            }).then(() => {
                navigate("/dashboard");
            });
        }
    }, [isError, navigate]);

    // Calculate vote score
    const getVoteScore = (post) => {
        return (post.upvote.length || 0) - (post.downvote.length || 0);
    };

    // Get vote score color
    const getVoteColor = (score) => {
        if (score > 0) return "text-green-500";
        if (score < 0) return "text-red-500";
        return "text-neutral-400";
    };

    // ?if data is being loader using tanstack
    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center mt-20">
                <img src={loadImg} className="w-24 h-24" alt="" />
                <h2 className="sec-font">Loading</h2>
            </div>
        );
    }

    return (
        <div className="space-y-6 pri-font mb-10">
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
                                <div key={index}>
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
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#121212] p-2 sm:p-4 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2">
                        <FileText className="size-4 sm:size-5 text-blue-500" />
                        Recent Posts
                    </h2>
                    {postsData?.posts?.length > 0 && (
                        <Link
                            to="/dashboard/my-posts"
                            className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            View All
                        </Link>
                    )}
                </div>

                {postsData.posts?.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-6 sm:py-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText className="size-6 sm:size-8 text-neutral-600" />
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-400 mb-3">
                            No posts yet
                        </p>
                        <Link
                            to="/dashboard/add-post"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors inline-flex items-center gap-1 sm:gap-2"
                        >
                            <Pencil className="size-3 sm:size-4" />
                            Create Post
                        </Link>
                    </div>
                ) : (
                    /* Posts List */
                    <div className="space-y-3">
                        {postsData.posts?.map((post) => {
                            const voteScore = getVoteScore(post);
                            const postDate = format(
                                new Date(post.createdAt),
                                "MMM dd, yyyy"
                            );
                            return (
                                <div
                                    key={post._id}
                                    className="bg-neutral-900 p-2 sm:p-3 rounded-xl hover:bg-neutral-800/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="inline-flex items-center px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-md">
                                                    {post.tag}
                                                </span>
                                                <span className="text-xs text-neutral-500">
                                                    {postDate}
                                                </span>
                                            </div>
                                            <h3 className="font-medium text-white text-xs sm:text-sm line-clamp-1 hover:text-blue-400 transition-colors cursor-pointer">
                                                {post.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 sm:gap-3 text-xs">
                                        {/* Vote Score */}
                                        <div
                                            className={`flex items-center gap-1 ${getVoteColor(
                                                voteScore
                                            )}`}
                                        >
                                            {voteScore > 0 ? (
                                                <TrendingUp className="size-3" />
                                            ) : voteScore < 0 ? (
                                                <TrendingDown className="size-3" />
                                            ) : null}
                                            <span className="font-medium">
                                                {voteScore}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1">
                                            <Link
                                                to={`/dashboard/comments/${post._id}`}
                                                className="p-1 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                                title="View Comments"
                                            >
                                                <MessageCircle className="size-3 sm:size-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
