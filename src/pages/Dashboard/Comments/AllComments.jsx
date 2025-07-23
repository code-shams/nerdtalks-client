import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { format } from "date-fns";
import {
    MessageCircle,
    User,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Flag,
    Eye,
    X,
} from "lucide-react";
import useDbUser from "../../../hooks/useDbUser";
import useAxios from "../../../hooks/axios/useAxios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import loadImg from "../../../assets/loading.gif";

const AllComments = () => {
    const { postId } = useParams();
    const { dbUser } = useDbUser();
    const { axiosSecure } = useAxios();
    const navigate = useNavigate();

    // State management
    const [reportLoading, setReportLoading] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10;

    // Feedback options
    const feedbackOptions = [
        { value: "", label: "Select feedback reason" },
        { value: "inappropriate", label: "Inappropriate content" },
        { value: "spam", label: "Spam or repetitive content" },
        { value: "harassment", label: "Harassment or offensive language" },
    ];

    //? Fetch comments with server-side pagination
    const {
        data: commentsData,
        isLoading: commentsLoading,
        isError: isCommentsError,
        refetch,
    } = useQuery({
        queryKey: ["postComments", postId, currentPage],
        queryFn: async () => {
            const response = await axiosSecure.get(
                `/comments/post/${postId}?page=${currentPage}&limit=${commentsPerPage}`
            );
            return response.data;
        },
        enabled: !!postId,
        keepPreviousData: true,
    });

    //? Fetch post details for header
    const {
        data: postData,
        isLoading: postsLoading,
        isError: isPostsError,
    } = useQuery({
        queryKey: ["postDetails", postId],
        queryFn: async () => {
            const response = await axiosSecure.get(`/post/${postId}`);
            return response.data;
        },
        enabled: !!postId,
    });

    //? Extract data from API response
    const comments = commentsData?.comments || [];
    const totalComments = commentsData?.totalCount || 0;
    const totalPages = commentsData?.totalPages || 0;
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = Math.min(startIndex + comments.length, totalComments);

    // ? Handling data fetching error from tanstack
    useEffect(() => {
        if (isPostsError || isCommentsError) {
            Swal.fire({
                icon: "error",
                title: "Loading Failed",
                text: "Something went wrong! Please try again!",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#dc2626",
            }).then(() => {
                navigate("/dashboard");
            });
        }
    }, [isPostsError, isCommentsError, navigate]);

    //? Handle feedback selection
    const handleFeedbackChange = (commentId, feedback) => {
        setSelectedFeedback((prev) => ({
            ...prev,
            [commentId]: feedback,
        }));
    };

    // Handle report comment
    const handleReportComment = async (commentId, commentContent) => {
        const feedback = selectedFeedback[commentId];

        const result = await Swal.fire({
            title: "Report Comment?",
            text: `Are you sure you want to report this comment with reason: "${
                feedbackOptions.find((f) => f.value === feedback)?.label
            }"?`,
            icon: "warning",
            background: "#1a1a1a",
            color: "#e5e5e5",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#404040",
            confirmButtonText: "Yes, Report",
            cancelButtonText: "Cancel",
            customClass: {
                popup: "!text-xs sm:!text-base",
                title: "!text-xs sm:!text-xl",
                htmlContainer: "!text-xs sm:!text-base",
                confirmButton:
                    "!text-xs sm:!text-base !px-3 !py-1.5 sm:!px-4 sm:!py-2",
                cancelButton:
                    "!text-xs sm:!text-base !px-3 !py-1.5 sm:!px-4 sm:!py-2",
            },
        });

        if (!result.isConfirmed) return;

        try {
            setReportLoading(commentId);
            // const response = await axiosSecure.post("/reports/comment", {
            //     commentId,
            //     postId,
            //     reportedBy: dbUser._id,
            //     reason: feedback,
            //     commentContent,
            // });

            // if (response?.status === 200 || response?.status === 201) {
            //     Swal.fire({
            //         icon: "success",
            //         title: "Comment Reported",
            //         text: "Thank you for reporting. We'll review this comment.",
            //         background: "#1a1a1a",
            //         color: "#e5e5e5",
            //         confirmButtonColor: "#2563eb",
            //         timer: 2000,
            //         timerProgressBar: true,
            //         customClass: {
            //             popup: "!text-xs sm:!text-base",
            //             title: "!text-xs sm:!text-xl",
            //             htmlContainer: "!text-xs sm:!text-base",
            //             confirmButton:
            //                 "!text-xs sm:!text-base !px-3 !py-1.5 sm:!px-4 sm:!py-2",
            //         },
            //     });
            //     refetch();
            // }
            console.log(object);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Report Failed",
                text: "Unable to report the comment. Please try again.",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#dc2626",
                customClass: {
                    popup: "!text-xs sm:!text-base",
                    title: "!text-xs sm:!text-xl",
                    htmlContainer: "!text-xs sm:!text-base",
                    confirmButton:
                        "!text-xs sm:!text-base !px-3 !py-1.5 sm:!px-4 sm:!py-2",
                },
            });
        } finally {
            setReportLoading(null);
        }
    };

    // Truncate comment text
    const truncateText = (text, maxLength = 20) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength);
    };

    // Show full comment modal
    const showFullComment = (comment) => {
        setSelectedComment(comment);
        setShowModal(true);
    };

    // Pagination handlers
    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(
                totalPages,
                startPage + maxVisiblePages - 1
            );

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    //? Loading state
    if (postsLoading || commentsLoading) {
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
                        <MessageCircle className="size-4 sm:size-6" />
                        <div>
                            <h1 className="text-sm sm:text-xl font-semibold">
                                Post Comments
                            </h1>
                            <p className="text-neutral-400 text-xs sm:text-sm">
                                {postData?.title
                                    ? `"${postData.title}"`
                                    : "View and manage comments on this post"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="bg-neutral-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg w-max">
                            <span className="text-neutral-400">
                                Total Comments:
                            </span>
                            <span className="ml-2 font-semibold text-blue-400">
                                {totalComments}
                            </span>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-neutral-700 hover:bg-neutral-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm w-max"
                        >
                            <ChevronLeft className="size-3 sm:size-4" />
                            Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Content */}
            <div className="bg-[#121212] rounded-2xl border border-neutral-800 overflow-hidden mb-10">
                {totalComments === 0 ? (
                    // Empty State
                    <div className="p-3 sm:p-12 text-center">
                        <div className="w-12 h-12 sm:w-24 sm:h-24 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-6">
                            <MessageCircle className="size-5 sm:size-12 text-neutral-600" />
                        </div>
                        <h3 className="text-sm sm:text-xl font-semibold mb-2">
                            No Comments Yet
                        </h3>
                        <p className="text-neutral-400 mb-4 sm:mb-6 max-w-md mx-auto text-xs sm:text-base">
                            This post doesn't have any comments yet. Be the
                            first to share your thoughts!
                        </p>
                    </div>
                ) : (
                    // Comments Available state
                    <>
                        <div className="overflow-x-auto">
                            {/* Table header */}
                            <div className="bg-neutral-900 px-3 py-2 sm:px-6 sm:py-4 border-b border-neutral-800">
                                <div className="grid grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-neutral-300">
                                    <div className="col-span-4 sm:col-span-2">
                                        Commenter
                                    </div>
                                    <div className="col-span-3 sm:col-span-3">
                                        Comment
                                    </div>
                                    <div className="col-span-3 sm:col-span-2 text-center hidden sm:table-cell">
                                        Date
                                    </div>
                                    <div className="col-span-2 sm:col-span-3">
                                        Feedback
                                    </div>
                                    <div className="col-span-3 sm:col-span-2 text-right">
                                        Actions
                                    </div>
                                </div>
                            </div>

                            {/* Table body */}
                            <div className="divide-y divide-neutral-800">
                                {comments.map((comment) => {
                                    const createdDate = format(
                                        new Date(comment.createdAt),
                                        "MMM dd, yyyy"
                                    );
                                    const isReportDisabled =
                                        !selectedFeedback[comment._id] ||
                                        reportLoading === comment._id;
                                    const needsTruncation =
                                        comment.content.length > 20;

                                    return (
                                        <div
                                            key={comment._id}
                                            className="px-3 py-2 sm:px-6 sm:py-4 hover:bg-neutral-900/50 transition-colors"
                                        >
                                            <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
                                                {/* Commenter Info */}
                                                <div className="col-span-4 sm:col-span-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-neutral-700 flex-shrink-0">
                                                            {comment.authorImage ? (
                                                                <img
                                                                    src={
                                                                        comment.authorImage
                                                                    }
                                                                    alt={
                                                                        comment.authorName
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <User className="size-3 sm:size-4 text-neutral-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-medium text-white text-xs sm:text-sm truncate">
                                                                {
                                                                    comment.authorName
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Comment Content */}
                                                <div className="col-span-3 sm:col-span-3">
                                                    <div className="text-xs sm:text-sm text-neutral-300">
                                                        {needsTruncation ? (
                                                            <div className="flex items-center gap-1 flex-wrap">
                                                                <span>
                                                                    {truncateText(
                                                                        comment.content
                                                                    )}
                                                                    ...
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        showFullComment(
                                                                            comment
                                                                        )
                                                                    }
                                                                    className="text-blue-400 hover:text-blue-300 underline flex-shrink-0"
                                                                >
                                                                    Read More
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            comment.content
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Created Date */}
                                                <div className="hidden sm:table-cell col-span-2 sm:col-span-2 text-center">
                                                    <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-neutral-400">
                                                        <Calendar className="size-2 sm:size-3 hidden sm:block" />
                                                        <span className="hidden sm:inline">
                                                            {createdDate}
                                                        </span>
                                                        <span className="sm:hidden">
                                                            {format(
                                                                new Date(
                                                                    comment.createdAt
                                                                ),
                                                                "MMM dd"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Feedback Dropdown */}
                                                <div className="col-span-2 sm:col-span-3">
                                                    <select
                                                        value={
                                                            selectedFeedback[
                                                                comment._id
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleFeedbackChange(
                                                                comment._id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full text-xs sm:text-sm bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-white focus:border-blue-500 focus:outline-none"
                                                        disabled={
                                                            reportLoading ===
                                                            comment._id
                                                        }
                                                    >
                                                        {feedbackOptions.map(
                                                            (option) => (
                                                                <option
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>

                                                {/* Actions */}
                                                <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1 sm:gap-2">
                                                    {/* Report Button */}
                                                    <button
                                                        onClick={() =>
                                                            handleReportComment(
                                                                comment._id,
                                                                comment.content
                                                            )
                                                        }
                                                        disabled={
                                                            isReportDisabled
                                                        }
                                                        className={`p-1 sm:p-2 rounded-lg transition-colors text-xs sm:text-sm font-medium ${
                                                            isReportDisabled
                                                                ? "text-neutral-500 bg-neutral-800 cursor-not-allowed"
                                                                : "text-white bg-red-600 hover:bg-red-700"
                                                        }`}
                                                        title="Report Comment"
                                                    >
                                                        {reportLoading ===
                                                        comment._id ? (
                                                            <div className="size-3 sm:size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <Flag className="size-3 sm:size-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-neutral-900 px-3 py-4 sm:px-6 border-t border-neutral-800">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    {/* Page Info */}
                                    <div className="text-xs sm:text-sm text-neutral-400">
                                        Showing {startIndex + 1} to {endIndex}{" "}
                                        of {totalComments} comments
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={handlePreviousPage}
                                            disabled={currentPage === 1}
                                            className="p-1 sm:p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-400"
                                            title="Previous page"
                                        >
                                            <ChevronLeft className="size-3 sm:size-4" />
                                        </button>

                                        {/* Page Numbers */}
                                        <div className="flex gap-1">
                                            {getPageNumbers().map(
                                                (pageNumber) => (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() =>
                                                            handlePageClick(
                                                                pageNumber
                                                            )
                                                        }
                                                        className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                                                            currentPage ===
                                                            pageNumber
                                                                ? "bg-blue-600 text-white"
                                                                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                )
                                            )}
                                        </div>

                                        {/* Next Button */}
                                        <button
                                            onClick={handleNextPage}
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="p-1 sm:p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-400"
                                            title="Next page"
                                        >
                                            <ChevronRight className="size-3 sm:size-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Full Comment Modal */}
            {showModal && selectedComment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#121212] border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-neutral-700">
                                    {selectedComment.authorImage ? (
                                        <img
                                            src={selectedComment.authorImage}
                                            alt={selectedComment.authorName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="size-4 sm:size-5 text-neutral-400" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm sm:text-base">
                                        {selectedComment.authorName}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-400">
                                        {format(
                                            new Date(selectedComment.createdAt),
                                            "MMM dd, yyyy 'at' h:mm a"
                                        )}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <X className="size-4 sm:size-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 sm:p-6">
                            <div className="text-sm sm:text-base text-neutral-200 leading-relaxed whitespace-pre-wrap">
                                {selectedComment.content}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllComments;
