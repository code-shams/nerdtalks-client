import { useState, useEffect } from "react";
import {
    Flag,
    Eye,
    Trash2,
    Shield,
    MessageCircle,
    User,
    Calendar,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    CheckCircle,
    XCircle,
    FileText,
} from "lucide-react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import loadImg from "../../../assets/loading.gif";
import useAxios from "../../../hooks/axios/useAxios";

const Reports = () => {
    const { axiosSecure } = useAxios();
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 10;

    // Filter state
    const [statusFilter, setStatusFilter] = useState("all"); // all, pending, resolved, dismissed

    // Fetch reports with server-side pagination and filtering
    const {
        data: reportsData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["reports", currentPage, statusFilter],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: reportsPerPage.toString(),
            });

            if (statusFilter !== "all") {
                params.append("status", statusFilter);
            }

            const response = await axiosSecure.get(`/reports?${params}`);
            return response.data;
        },
        keepPreviousData: true,
    });

    // Extract data from API response
    const reports = reportsData?.reports || [];
    const totalReports = reportsData?.totalReports || 0;
    const totalPages = reportsData?.totalPages || 0;
    const startIndex = (currentPage - 1) * reportsPerPage;
    const endIndex = Math.min(startIndex + reports.length, totalReports);

    // Handle data fetching error
    useEffect(() => {
        if (isError) {
            Swal.fire({
                icon: "error",
                title: "Loading Failed",
                text: "Unable to load reports. Please try again.",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#dc2626",
            });
        }
    }, [isError]);

    // Get report status color and icon
    const getReportStatus = (report) => {
        if (report.status === "resolved") {
            return {
                color: "text-green-500",
                bgColor: "bg-green-500/20",
                icon: CheckCircle,
                text: "Resolved",
            };
        } else if (report.status === "dismissed") {
            return {
                color: "text-gray-500",
                bgColor: "bg-gray-500/20",
                icon: XCircle,
                text: "Dismissed",
            };
        }
        return {
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/20",
            icon: AlertTriangle,
            text: "Pending",
        };
    };

    // Get reason color and display text
    const getReasonDisplay = (reason) => {
        const reasonMap = {
            spam: {
                text: "Spam",
                color: "text-red-400",
                bgColor: "bg-red-500/20",
            },
            harassment: {
                text: "Harassment",
                color: "text-red-400",
                bgColor: "bg-red-500/20",
            },
            inappropriate: {
                text: "Inappropriate",
                color: "text-orange-400",
                bgColor: "bg-orange-500/20",
            },
            "hate-speech": {
                text: "Hate Speech",
                color: "text-red-400",
                bgColor: "bg-red-500/20",
            },
            "false-information": {
                text: "False Info",
                color: "text-yellow-400",
                bgColor: "bg-yellow-500/20",
            },
            other: {
                text: "Other",
                color: "text-gray-400",
                bgColor: "bg-gray-500/20",
            },
        };
        return reasonMap[reason] || reasonMap.other;
    };

    // View report details
    const viewReportDetails = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    // Delete comment action
    const handleDeleteComment = async (reportId, commentId) => {
        const result = await Swal.fire({
            title: "Delete Comment?",
            text: "This will permanently delete the reported comment and mark the report as resolved. This action cannot be undone.",
            icon: "warning",
            background: "#1a1a1a",
            color: "#e5e5e5",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#404040",
            confirmButtonText: "Yes, Delete Comment",
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
            setActionLoading(reportId);
            const responseReport = await axiosSecure.patch(
                `/reports/${reportId}/status`,
                {
                    status: "resolved",
                }
            );
            const responseComment = await axiosSecure.delete(
                `/comments/${commentId}`
            );

            if (
                responseReport?.status === 200 &&
                responseComment?.status === 200
            ) {
                Swal.fire({
                    icon: "success",
                    title: "Comment Deleted",
                    text: "The reported comment has been deleted and report marked as resolved.",
                    background: "#1a1a1a",
                    color: "#e5e5e5",
                    confirmButtonColor: "#2563eb",
                    timer: 2000,
                    timerProgressBar: true,
                });
                refetch();
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text: "Unable to delete comment. Please try again.",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#dc2626",
            });
        } finally {
            setActionLoading(null);
        }
    };

    // Dismiss report action
    const handleDismissReport = async (reportId) => {
        const result = await Swal.fire({
            title: "Dismiss Report?",
            text: "This will mark the report as dismissed without taking any action on the comment.",
            icon: "question",
            background: "#1a1a1a",
            color: "#e5e5e5",
            showCancelButton: true,
            confirmButtonColor: "#6b7280",
            cancelButtonColor: "#404040",
            confirmButtonText: "Yes, Dismiss",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {
            setActionLoading(reportId);
            const response = await axiosSecure.patch(
                `/reports/${reportId}/status`,
                {
                    status: "dismissed",
                }
            );

            if (response?.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Report Dismissed",
                    text: "The report has been dismissed.",
                    background: "#1a1a1a",
                    color: "#e5e5e5",
                    confirmButtonColor: "#2563eb",
                    timer: 2000,
                    timerProgressBar: true,
                });
                refetch();
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Action Failed",
                text: "Unable to dismiss report. Please try again.",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#dc2626",
            });
        } finally {
            setActionLoading(null);
        }
    };

    // // Warn user action
    // const handleWarnUser = async (reportId, userId) => {
    //     const { value: warningMessage } = await Swal.fire({
    //         title: "Send Warning",
    //         input: "textarea",
    //         inputLabel: "Warning Message",
    //         inputPlaceholder: "Enter a warning message for the user...",
    //         inputAttributes: {
    //             "aria-label": "Warning message",
    //         },
    //         background: "#1a1a1a",
    //         color: "#e5e5e5",
    //         showCancelButton: true,
    //         confirmButtonColor: "#f59e0b",
    //         cancelButtonColor: "#404040",
    //         confirmButtonText: "Send Warning",
    //         cancelButtonText: "Cancel",
    //         inputValidator: (value) => {
    //             if (!value) {
    //                 return "Please enter a warning message";
    //             }
    //         },
    //     });

    //     if (!warningMessage) return;

    //     try {
    //         setActionLoading(reportId);
    //         const response = await axiosSecure.post(
    //             `/reports/${reportId}/warn-user`,
    //             {
    //                 message: warningMessage,
    //             }
    //         );

    //         if (response?.status === 200) {
    //             Swal.fire({
    //                 icon: "success",
    //                 title: "Warning Sent",
    //                 text: "The user has been warned and report marked as resolved.",
    //                 background: "#1a1a1a",
    //                 color: "#e5e5e5",
    //                 confirmButtonColor: "#2563eb",
    //                 timer: 2000,
    //                 timerProgressBar: true,
    //             });
    //             refetch();
    //         }
    //     } catch (err) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Action Failed",
    //             text: "Unable to send warning. Please try again.",
    //             background: "#1a1a1a",
    //             color: "#e5e5e5",
    //             confirmButtonColor: "#dc2626",
    //         });
    //     } finally {
    //         setActionLoading(null);
    //     }
    // };

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

    // Generate page numbers
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

    // Loading state
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
                        <Flag className="size-4 sm:size-6" />
                        <div>
                            <h1 className="text-sm sm:text-xl font-semibold">
                                Reported Activities
                            </h1>
                            <p className="text-neutral-400 text-xs sm:text-sm">
                                Review and manage community reports
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="bg-neutral-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg w-max">
                            <span className="text-neutral-400">
                                Total Reports:
                            </span>
                            <span className="ml-2 font-semibold text-red-400">
                                {totalReports}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                <div className="flex flex-wrap gap-2">
                    <span className="text-neutral-400 text-xs sm:text-sm mr-2">
                        Filter by status:
                    </span>
                    {["all", "pending", "resolved", "dismissed"].map(
                        (status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    setStatusFilter(status);
                                    setCurrentPage(1);
                                }}
                                className={`px-3 py-1 rounded-lg text-xs sm:text-sm transition-colors ${
                                    statusFilter === status
                                        ? "bg-blue-600 text-white"
                                        : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                                }`}
                            >
                                {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Reports Content */}
            <div className="bg-[#121212] rounded-2xl border border-neutral-800 overflow-hidden mb-10">
                {totalReports === 0 ? (
                    // Empty State
                    <div className="p-3 sm:p-12 text-center">
                        <div className="w-12 h-12 sm:w-24 sm:h-24 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-6">
                            <Flag className="size-5 sm:size-12 text-neutral-600" />
                        </div>
                        <h3 className="text-sm sm:text-xl font-semibold mb-2">
                            No Reports Found
                        </h3>
                        <p className="text-neutral-400 mb-4 sm:mb-6 max-w-md mx-auto text-xs sm:text-base">
                            {statusFilter === "all"
                                ? "No reports have been submitted yet."
                                : `No ${statusFilter} reports found.`}
                        </p>
                    </div>
                ) : (
                    // Reports Available state
                    <>
                        <div className="overflow-x-auto">
                            {/* Table header */}
                            <div className="bg-neutral-900 px-3 py-2 sm:px-6 sm:py-4 border-b border-neutral-800">
                                <div className="grid grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-neutral-300">
                                    <div className="col-span-3 sm:col-span-4">
                                        Report Details
                                    </div>
                                    <div className="col-span-3 sm:col-span-2 text-center">
                                        Reason
                                    </div>
                                    <div className="col-span-3 sm:col-span-2 text-center">
                                        Status
                                    </div>
                                    <div className="col-span-2 sm:col-span-2 text-center hidden sm:table-cell">
                                        Date
                                    </div>
                                    <div className="col-span-3 sm:col-span-2 text-right">
                                        Actions
                                    </div>
                                </div>
                            </div>

                            {/* Table body */}
                            <div className="divide-y divide-neutral-800">
                                {reports.map((report) => {
                                    const statusInfo = getReportStatus(report);
                                    const reasonInfo = getReasonDisplay(
                                        report.reason
                                    );
                                    const reportDate = format(
                                        new Date(report.createdAt),
                                        "MMM dd, yyyy"
                                    );

                                    return (
                                        <div
                                            key={report._id}
                                            className="px-3 py-2 sm:px-6 sm:py-4 hover:bg-neutral-900/50 transition-colors"
                                        >
                                            <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
                                                {/* Report Details */}
                                                <div className="col-span-3 sm:col-span-4">
                                                    <div className="space-y-1">
                                                        <h3 className="font-medium text-white text-xs sm:text-sm">
                                                            Comment Report #
                                                            {report._id.slice(
                                                                -6
                                                            )}
                                                        </h3>
                                                        <p className="text-neutral-400 text-xs line-clamp-2">
                                                            "
                                                            {report.commentContent?.substring(
                                                                0,
                                                                50
                                                            )}
                                                            ..."
                                                        </p>
                                                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                                                            <User className="size-3" />
                                                            <span>
                                                                Reported by:{" "}
                                                                {report
                                                                    .reportedBy
                                                                    ?.name ||
                                                                    "User"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Reason */}
                                                <div className="col-span-3 sm:col-span-2 text-center ">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-1 rounded-md text-[12px] sm:text-xs ${reasonInfo.color} ${reasonInfo.bgColor}`}
                                                    >
                                                        {reasonInfo.text}
                                                    </span>
                                                </div>

                                                {/* Status */}
                                                <div className="col-span-3 sm:col-span-2 text-center">
                                                    <div
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${statusInfo.color} ${statusInfo.bgColor}`}
                                                    >
                                                        <statusInfo.icon className="size-3" />
                                                        <span className="hidden sm:inline">
                                                            {statusInfo.text}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Date */}
                                                <div className="col-span-2 sm:col-span-2 text-center hidden sm:table-cell">
                                                    <div className="flex items-center justify-center gap-1 text-xs text-neutral-400">
                                                        <Calendar className="size-3 hidden sm:block" />
                                                        <span className="hidden sm:inline">
                                                            {reportDate}
                                                        </span>
                                                        <span className="sm:hidden">
                                                            {format(
                                                                new Date(
                                                                    report.createdAt
                                                                ),
                                                                "MMM dd"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1">
                                                    {/* View Details */}
                                                    <button
                                                        onClick={() =>
                                                            viewReportDetails(
                                                                report
                                                            )
                                                        }
                                                        className="p-1 sm:p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="size-3 sm:size-4" />
                                                    </button>

                                                    {report.status ===
                                                        "pending" && (
                                                        <>
                                                            {/* Delete Comment */}
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteComment(
                                                                        report._id,
                                                                        report.commentId
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading ===
                                                                    report._id
                                                                }
                                                                className="p-1 sm:p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                                title="Delete Comment"
                                                            >
                                                                {actionLoading ===
                                                                report._id ? (
                                                                    <div className="size-3 sm:size-4 border-2 border-red-400/20 border-t-red-400 rounded-full animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="size-3 sm:size-4" />
                                                                )}
                                                            </button>

                                                            {/* Warn User */}
                                                            {/* <button
                                                                onClick={() =>
                                                                    handleWarnUser(
                                                                        report._id,
                                                                        report.reportedUserId
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading ===
                                                                    report._id
                                                                }
                                                                className="p-1 sm:p-2 text-neutral-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                                title="Warn User"
                                                            >
                                                                <Shield className="size-3 sm:size-4" />
                                                            </button> */}

                                                            {/* Dismiss */}
                                                            <button
                                                                onClick={() =>
                                                                    handleDismissReport(
                                                                        report._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading ===
                                                                    report._id
                                                                }
                                                                className="p-1 sm:p-2 text-neutral-400 hover:text-gray-400 hover:bg-gray-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                                title="Dismiss Report"
                                                            >
                                                                <XCircle className="size-3 sm:size-4" />
                                                            </button>
                                                        </>
                                                    )}
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
                                        of {totalReports} reports
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={handlePreviousPage}
                                            disabled={currentPage === 1}
                                            className="p-1 sm:p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            className="p-1 sm:p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Report Details Modal */}
            {showModal && selectedReport && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-[#121212] border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                                    <Flag className="size-5" />
                                    Report Details
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                                >
                                    <XCircle className="size-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-neutral-300">
                                        Report ID
                                    </label>
                                    <p className="text-neutral-400">
                                        #{selectedReport._id}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-neutral-300">
                                        Reported Content
                                    </label>
                                    <div className="bg-neutral-900 p-3 rounded-lg mt-1">
                                        <p className="text-white">
                                            {selectedReport.commentContent}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-neutral-300">
                                            Reason
                                        </label>
                                        <p className="text-neutral-400">
                                            {
                                                getReasonDisplay(
                                                    selectedReport.reason
                                                ).text
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-neutral-300">
                                            Status
                                        </label>
                                        <p className="text-neutral-400">
                                            {
                                                getReportStatus(selectedReport)
                                                    .text
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-neutral-300">
                                        Reported By
                                    </label>
                                    <p className="text-neutral-400">
                                        {selectedReport.reportedBy?.name ||
                                            "Unknown User"}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-neutral-300">
                                        Report Date
                                    </label>
                                    <p className="text-neutral-400">
                                        {format(
                                            new Date(selectedReport.createdAt),
                                            "MMMM dd, yyyy 'at' hh:mm a"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
