import { useQuery } from "@tanstack/react-query";
import React, { use, useEffect, useState } from "react";
import Loading from "../../../shared/Navbar/Loading/Loading";
import useAxios from "../../../hooks/axios/useAxios";
import { useParams } from "react-router";
import {
    TrendingUp,
    TrendingDown,
    MessageCircle,
    Clock,
    Share2,
    Send,
    User,
    ThumbsUp,
    ThumbsDown,
    Calendar,
    Tag as TagIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
    FacebookShareButton,
    WhatsappShareButton,
    FacebookIcon,
    WhatsappIcon,
} from "react-share";
import { AuthContext } from "../../../contexts/Auth/AuthContext";
import useDbUser from "../../../hooks/useDbUser";
import { Bounce, toast } from "react-toastify";

const PostDetails = () => {
    const { user, loading } = use(AuthContext); //?getting user from auth context

    const {
        dbUser,
        isLoading: userLoading,
        isError: isUserError,
        error: userError,
        refetch: userRefetch,
    } = useDbUser(); //? Getting user from db

    const { id } = useParams();
    const { axiosDef, axiosSecure } = useAxios();

    const [newComment, setNewComment] = useState(""); //? comment box value

    const [showShareMenu, setShowShareMenu] = useState(false); //?Share menu visibility state

    const [isSubmittingComment, setIsSubmittingComment] = useState(false); //?comment form submitting state

    // ?Fetch user post
    const {
        data: post = [],
        isLoading: postLoading,
        isError: postError,
        error: errPost,
        refetch: postRefetch,
    } = useQuery({
        queryKey: ["post", id],
        queryFn: async () => {
            const response = await axiosDef.get(`/post/${id}`);
            return response.data;
        },
    });
    const postData = post[0];

    // ?Fetch user post length
    const {
        data: comments = [],
        isLoading: commentsLoading,
        isError: isCommentsError,
        error: errcomments,
        refetch: commentsRefetch,
    } = useQuery({
        queryKey: ["comments", id],
        queryFn: async () => {
            const response = await axiosDef.get(`/comments/${id}`);
            return response.data;
        },
    });

    // ? Handling data fetching error from tanstack
    useEffect(() => {
        if (postError || isUserError || isCommentsError) {
            Swal.fire({
                icon: "error",
                title: "Loading Failed",
                text: "Something went wrong! Please try again!",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#dc2626",
            }).then(() => {
                console.log(errPost || userError || errcomments);
            });
        }
    }, [postError, isUserError, isCommentsError]);

    // ?Handling loading state
    if (postLoading || loading || userLoading || commentsLoading) {
        return <Loading></Loading>;
    }

    //? Share URL for react-share
    const shareUrl = `${window.location.origin}/post/${id}`;

    //? Calculate vote score
    const getVoteScore = (post) => {
        return (post?.upvote || 0) - (post?.downvote || 0);
    };

    //? Get vote score color
    const getVoteColor = (score) => {
        if (score > 0) return "text-green-500";
        if (score < 0) return "text-red-500";
        return "text-neutral-400";
    };

    //? Format time ago
    const formatTimeAgo = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return format(postDate, "MMM dd, yyyy");
    };

    if (!postData) {
        return (
            <div className="bg-neutral-900 p-4 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-12 text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Post Not Found
                        </h2>
                        <p className="text-neutral-400">
                            The post you're looking for doesn't exist or has
                            been removed.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const voteScore = getVoteScore(postData);
    const timeAgo = formatTimeAgo(postData.createdAt);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingComment(true);

        const postId = postData?._id;
        const authorId = postData?.authorId;
        const authorName = postData?.authorName;
        const authorEmail = postData?.authorEmail;
        const authorImage = postData?.authorImage;
        const content = newComment;
        const commentData = {
            //? Request body for the api
            postId,
            authorId,
            authorName,
            authorEmail,
            authorImage,
            content,
        };

        try {
            const response = await axiosSecure.post("/comments", commentData);
            if (response.status === 201) {
                setNewComment("");
                toast.success(`Comment added`, {
                    position: "bottom-center",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Bounce,
                    hideProgressBar: true,
                });
                commentsRefetch();
            } else {
                toast.error(`Something went wrong`, {
                    position: "bottom-center",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Bounce,
                    hideProgressBar: true,
                });
            }
        } catch (error) {
            toast.error(`${error}`, {
                position: "bottom-center",
                autoClose: 3000,
                theme: "dark",
                transition: Bounce,
                hideProgressBar: true,
            });
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 p-4 sm:p-6 pri-font">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Post Details */}
                <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-6 sm:p-8">
                    {/* Author Info */}
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={postData.authorImage}
                            alt={postData.authorName}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-neutral-700"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-lg sm:text-xl">
                                {postData.authorName}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-neutral-400 flex-wrap">
                                <div className="flex items-center gap-1">
                                    <User className="size-3" />
                                    <span className="truncate">
                                        {postData.authorEmail}
                                    </span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Clock className="size-3" />
                                    <span>{timeAgo}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
                                <Calendar className="size-3" />
                                <span>
                                    {format(
                                        new Date(postData.createdAt),
                                        "PPP 'at' p"
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                            {postData.title}
                        </h1>

                        <div className="prose prose-neutral prose-invert max-w-none mb-6">
                            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                                {postData.content}
                            </p>
                        </div>

                        {/* Tag */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2">
                                <TagIcon className="size-4 text-blue-400" />
                                <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                                    {postData.tag}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Post Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-neutral-800">
                        {/* Vote Section */}
                        <div className="flex items-center gap-4">
                            <div
                                className={`flex items-center gap-2 ${getVoteColor(
                                    voteScore
                                )} text-sm font-medium`}
                            >
                                {voteScore > 0 ? (
                                    <TrendingUp className="size-5" />
                                ) : voteScore < 0 ? (
                                    <TrendingDown className="size-5" />
                                ) : (
                                    <ThumbsUp className="size-5" />
                                )}
                                <span className="text-base">
                                    {voteScore} votes
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    // onClick={() => handleVote("upvote")}
                                    disabled={!user}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                                        user
                                            ? "hover:bg-green-500/20 text-neutral-400 hover:text-green-400 border border-neutral-700 hover:border-green-500/50"
                                            : "opacity-50 cursor-not-allowed text-neutral-500 border border-neutral-800"
                                    }`}
                                >
                                    <ThumbsUp className="size-4" />
                                    <span className="text-sm">
                                        {postData.upvote || 0}
                                    </span>
                                </button>

                                <button
                                    // onClick={() => handleVote("downvote")}
                                    disabled={!user}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                                        user
                                            ? "hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-neutral-700 hover:border-red-500/50"
                                            : "opacity-50 cursor-not-allowed text-neutral-500 border border-neutral-800"
                                    }`}
                                >
                                    <ThumbsDown className="size-4" />
                                    <span className="text-sm">
                                        {postData.downvote || 0}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Comments and Share */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-neutral-400 text-sm">
                                <MessageCircle className="size-4" />
                                <span>{comments?.length || 0} comments</span>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowShareMenu(!showShareMenu)
                                    }
                                    disabled={!user}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                                        user
                                            ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                                            : "opacity-50 cursor-not-allowed border-neutral-800 text-neutral-500"
                                    }`}
                                >
                                    <Share2 className="size-4" />
                                    <span className="text-sm">Share</span>
                                </button>
                                {/* Share Menu */}
                                {showShareMenu && user && (
                                    <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-neutral-700 rounded-lg p-3 z-10 shadow-xl">
                                        <div className="flex items-center gap-2">
                                            <FacebookShareButton
                                                url={shareUrl}
                                                quote={postData.title}
                                            >
                                                <FacebookIcon size={32} round />
                                            </FacebookShareButton>

                                            <WhatsappShareButton
                                                url={shareUrl}
                                                title={postData.title}
                                            >
                                                <WhatsappIcon size={32} round />
                                            </WhatsappShareButton>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comment Section */}
                <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <MessageCircle className="size-6" />
                        Comments ({comments?.length || 0})
                    </h2>

                    {/* Add Comment Form */}
                    {user ? (
                        <form onSubmit={handleCommentSubmit} className="mb-8">
                            <div className="flex gap-4">
                                <img
                                    src={user.photoURL || "/default-avatar.png"}
                                    alt={user.displayName}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-neutral-700 flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) =>
                                            setNewComment(e.target.value)
                                        }
                                        placeholder="Write a comment..."
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        rows="3"
                                    />
                                    <div className="flex justify-end mt-3">
                                        <button
                                            type="submit"
                                            disabled={
                                                isSubmittingComment ||
                                                !newComment.trim()
                                            }
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send className="size-4" />
                                            {isSubmittingComment
                                                ? "Posting..."
                                                : "Comment"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-8 p-6 bg-neutral-900 rounded-lg border border-neutral-800 text-center">
                            <p className="text-neutral-400 mb-4">
                                Please log in to join the conversation
                            </p>
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Log In
                            </button>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments && comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment._id} className="flex gap-4">
                                    <img
                                        src={comment.authorImage}
                                        alt={comment.authorName}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-neutral-700 flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="bg-neutral-900 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-medium text-white text-sm">
                                                    {comment.authorName}
                                                </h4>
                                                <span className="text-xs text-neutral-500">
                                                    {formatTimeAgo(
                                                        comment.createdAt
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-neutral-300 text-sm leading-relaxed">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <MessageCircle className="size-12 text-neutral-600 mx-auto mb-4" />
                                <p className="text-neutral-400">
                                    No comments yet. Be the first to comment!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetails;
