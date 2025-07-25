import { useEffect } from "react";
import { Link } from "react-router";
import {
    TrendingUp,
    TrendingDown,
    MessageCircle,
    Clock,
    ArrowUpDown,
    ThumbsUp,
} from "lucide-react";
import { format } from "date-fns";
const AllPosts = ({ allPostsProps }) => {
    const {
        postsData,
        setSortByPopularity,
        sortByPopularity,
        setCurrentPage,
        searchTerm,
    } = allPostsProps;

    // Calculate vote score
    const getVoteScore = (post) => {
        return (post?.upvote.length || 0) - (post?.downvote.length || 0);
    };

    // Get vote score color
    const getVoteColor = (score) => {
        if (score > 0) return "text-green-500";
        if (score < 0) return "text-red-500";
        return "text-neutral-400";
    };

    // Format time ago
    const formatTimeAgo = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return format(postDate, "MMM dd, yyyy");
    };

    // Handle sort toggle
    const handleSortToggle = () => {
        setSortByPopularity(!sortByPopularity);
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    let { posts = [], total = 0, totalPages = 0 } = postsData || {};

    useEffect(() => {
        if (searchTerm) {
            total = posts.length;
            totalPages = Math.ceil(total / 5);
        }
    }, [searchTerm]);

    return (
        <div className="space-y-3 md:space-y-6 pri-font pb-3">
            {/* Header with Sort Button */}
            <div className="">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        All Posts
                    </h1>
                    <p className="text-neutral-400 text-sm sm:text-base">
                        Discover and discuss various topics with the community
                    </p>
                </div>

                <div className="flex items-center gap-4 mt-2">
                    <div className="text-sm text-neutral-400">
                        <span className="font-medium text-blue-400">
                            {searchTerm ? `${posts.length}` : `${total}`}
                        </span>{" "}
                        posts
                    </div>

                    <button
                        onClick={handleSortToggle}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                            sortByPopularity
                                ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                                : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                        }`}
                    >
                        <ArrowUpDown className="size-4" />
                        {sortByPopularity ? "Most Popular" : "Latest"}
                    </button>
                </div>
            </div>

            {/* Posts Grid */}
            {posts.length === 0 ? (
                <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-12 text-center">
                    <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageCircle className="size-12 text-neutral-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                        No Posts Found
                    </h3>
                    <p className="text-neutral-400 max-w-md mx-auto">
                        There are no posts to display at the moment. Check back
                        later or be the first to create a post!
                    </p>
                </div>
            ) : (
                <div className="space-y-3 md:space-y-5">
                    {posts.map((post) => {
                        const voteScore = getVoteScore(post);
                        const timeAgo = formatTimeAgo(post.createdAt);

                        return (
                            <div
                                key={post._id}
                                className="bg-[#121212] rounded-2xl border border-neutral-800 p-4 sm:p-6 hover:border-neutral-700 transition-colors group"
                            >
                                {/* Author Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    <img
                                        src={post.authorImage}
                                        alt={post.authorName}
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-neutral-700"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-white text-sm sm:text-base truncate">
                                            {post.authorName}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
                                            <Clock className="size-3" />
                                            <span>{timeAgo}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="mb-4">
                                    <Link
                                        to={`/post/${post._id}`}
                                        className="block"
                                    >
                                        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <p className="text-neutral-300 text-sm sm:text-base line-clamp-3 mb-4">
                                        {post.content}
                                    </p>

                                    {/* Tag */}
                                    <div className="mb-4">
                                        <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 text-xs sm:text-sm rounded-full border border-blue-500/30">
                                            {post.tag}
                                        </span>
                                    </div>
                                </div>

                                {/* Post Stats */}
                                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                        {/* Vote Score */}
                                        <div
                                            className={`flex items-center gap-1 ${getVoteColor(
                                                voteScore
                                            )} text-sm font-medium`}
                                        >
                                            {voteScore > 0 ? (
                                                <TrendingUp className="size-4" />
                                            ) : voteScore < 0 ? (
                                                <TrendingDown className="size-4" />
                                            ) : (
                                                <ThumbsUp className="size-4" />
                                            )}
                                            <span>{voteScore} votes</span>
                                        </div>

                                        {/* Comments Count */}
                                        <div className="flex items-center gap-1 text-neutral-400 text-sm">
                                            <MessageCircle className="size-4" />
                                            <span>
                                                {post?.commentsCount || 0}{" "}
                                                comments
                                            </span>
                                        </div>

                                        {/* Read More Link */}
                                        <Link
                                            to={`/post/${post._id}`}
                                            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                        >
                                            Read more →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllPosts;
