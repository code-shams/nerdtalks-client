import { useState, useEffect, use } from "react";
import { Link, useNavigate } from "react-router";
import {
    FileText,
    MessageCircle,
    Trash2,
    TrendingUp,
    TrendingDown,
    Eye,
    Calendar,
} from "lucide-react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../contexts/Auth/AuthContext";
import useDbUser from "../../../../hooks/useDbUser";
import { useQuery } from "@tanstack/react-query";
import loadImg from "../../../../assets/loading.gif";
import useAxios from "../../../../hooks/axios/useAxios";

const MyPosts = () => {
    const { user } = use(AuthContext);
    const { dbUser } = useDbUser();
    const { axiosSecure } = useAxios();
    const navigate = useNavigate();
    const [deleteLoading, setDeleteLoading] = useState(null);

    // ?Fetch user post length
    const {
        data: posts,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["userPosts", dbUser._id],
        queryFn: async () => {
            const response = await axiosSecure.get(`/posts/user/${dbUser._id}`);
            return response.data;
        },
        enabled: !!dbUser._id, // ensures query runs only if authorId exists
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

    //? Calculate vote score
    const getVoteScore = (post) => {
        return (post.upvote || 0) - (post.downvote || 0);
    };

    //? Get vote score color
    const getVoteColor = (score) => {
        if (score > 0) return "text-green-500";
        if (score < 0) return "text-red-500";
        return "text-neutral-400";
    };

    //? Delete post handler
    const handleDeletePost = async (postId, postTitle) => {
        const result = await Swal.fire({
            title: "Delete Post?",
            text: `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`,
            icon: "warning",
            background: "#1a1a1a",
            color: "#e5e5e5",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#404040",
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            setDeleteLoading(postId);
            const response = await axiosSecure.delete(`/posts/${postId}`);
            console.log(response);
        } catch (err) {
            console.log(err);
        }
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
        <div className="space-y-6 pri-font">
            {/* Header */}
            <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <FileText className="size-4 sm:size-6" />
                        <div>
                            <h1 className="text-sm sm:text-xl font-semibold">
                                My Posts
                            </h1>
                            <p className="text-neutral-400 text-xs sm:text-sm">
                                Manage and view all your published posts
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="bg-neutral-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg w-max">
                            <span className="text-neutral-400">
                                Total Posts:
                            </span>
                            <span className="ml-2 font-semibold text-blue-400">
                                {posts.length}
                            </span>
                        </div>
                        <Link
                            to="/dashboard/add-post"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm w-max"
                        >
                            <FileText className="size-3 sm:size-4" />
                            New Post
                        </Link>
                    </div>
                </div>
            </div>

            {/* Posts Content */}
            <div className="bg-[#121212] rounded-2xl border border-neutral-800 overflow-hidden mb-10">
                {posts.length === 0 ? (
                    /*//* Empty State */
                    <div className="p-3 sm:p-12 text-center">
                        <div className="w-12 h-12 sm:w-24 sm:h-24 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-6">
                            <FileText className="size-5 sm:size-12 text-neutral-600" />
                        </div>
                        <h3 className="text-sm sm:text-xl font-semibold mb-2">
                            No Posts Yet
                        </h3>
                        <p className="text-neutral-400 mb-4 sm:mb-6 max-w-md mx-auto text-xs sm:text-base">
                            You haven't created any posts yet. Start sharing
                            your thoughts with the community!
                        </p>
                        <Link
                            to="/dashboard/add-post"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-colors inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-base"
                        >
                            <FileText className="size-4 sm:size-5" />
                            Create Your First Post
                        </Link>
                    </div>
                ) : (
                    /*//*Post Available state */
                    <div className="overflow-x-auto">
                        {/* //?Table header */}
                        <div className="bg-neutral-900 px-3 py-2 sm:px-6 sm:py-4 border-b border-neutral-800">
                            <div className="grid grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-neutral-300">
                                <div className="col-span-5 sm:col-span-6">
                                    Post
                                </div>
                                <div className="col-span-2 sm:col-span-2 text-center">
                                    Votes
                                </div>
                                <div className="col-span-2 sm:col-span-2 text-center">
                                    Date
                                </div>
                                <div className="col-span-3 sm:col-span-2 text-right">
                                    Actions
                                </div>
                            </div>
                        </div>

                        {/* //?Table body */}
                        <div className="divide-y divide-neutral-800">
                            {posts.map((post) => {
                                const voteScore = getVoteScore(post);
                                const createdDate = format(
                                    new Date(post.createdAt),
                                    "MMM dd, yyyy"
                                );

                                return (
                                    <div
                                        key={post._id}
                                        className="px-3 py-2 sm:px-6 sm:py-4 hover:bg-neutral-900/50 transition-colors"
                                    >
                                        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
                                            {/* Post Title & Tag */}
                                            <div className="col-span-5 sm:col-span-6">
                                                <div className="space-y-1">
                                                    <h3 className="font-medium text-white line-clamp-1 hover:text-blue-400 transition-colors text-xs sm:text-base">
                                                        {post.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center p-1 sm:px-2 sm:py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md">
                                                            {post.tag}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/*//? Vote Score */}
                                            <div className="col-span-2 sm:col-span-2 text-center">
                                                <div
                                                    className={`flex items-center justify-center gap-1 font-medium ${getVoteColor(
                                                        voteScore
                                                    )} text-xs sm:text-sm`}
                                                >
                                                    {voteScore > 0 ? (
                                                        <TrendingUp className="size-3 sm:size-4" />
                                                    ) : voteScore < 0 ? (
                                                        <TrendingDown className="size-3 sm:size-4" />
                                                    ) : (
                                                        <div className="size-3 sm:size-4" />
                                                    )}
                                                    <span>{voteScore}</span>
                                                </div>
                                            </div>

                                            {/* //? Created Date */}
                                            <div className="col-span-2 sm:col-span-2 text-center">
                                                <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-neutral-400">
                                                    <Calendar className="size-2 sm:size-3 hidden sm:block " />
                                                    <span className="hidden sm:inline">
                                                        {createdDate}
                                                    </span>
                                                    <span className="sm:hidden">
                                                        {format(
                                                            new Date(
                                                                post.createdAt
                                                            ),
                                                            "MMM dd"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* //? Actions */}
                                            <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1 sm:gap-2">
                                                {/* Comments Button */}
                                                <Link
                                                    // to={`/comments/${post._id}`}
                                                    className="p-1 sm:p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    title="View Comments"
                                                >
                                                    <MessageCircle className="size-3 sm:size-4" />
                                                </Link>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() =>
                                                        handleDeletePost(
                                                            post._id,
                                                            post.title
                                                        )
                                                    }
                                                    disabled={
                                                        deleteLoading ===
                                                        post._id
                                                    }
                                                    className="p-1 sm:p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete Post"
                                                >
                                                    {deleteLoading ===
                                                    post._id ? (
                                                        <div className="size-3 sm:size-4 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin" />
                                                    ) : (
                                                        <Trash2 className="size-3 sm:size-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPosts;
