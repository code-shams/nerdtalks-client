import { useState, useEffect } from "react";
import {
    Users,
    Search,
    Shield,
    ShieldCheck,
    Crown,
    User,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import loadImg from "../../../assets/loading.gif";
import useAxios from "../../../hooks/axios/useAxios";
import useDbUser from "../../../hooks/useDbUser";

const ManageUsers = () => {
    const { axiosSecure } = useAxios();
    const [makeAdminLoading, setMakeAdminLoading] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch users with server-side pagination and search
    const {
        data: usersData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["allUsers", currentPage, searchQuery],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: usersPerPage.toString(),
            });

            if (searchQuery.trim()) {
                params.append("search", searchQuery.trim());
            }

            const response = await axiosSecure.get(`/users?${params}`);
            return response.data;
        },
        keepPreviousData: true,
    });

    // Extract data from API response
    const users = usersData?.users || [];
    const totalUsers = usersData?.totalUsers || 0;
    const totalPages = usersData?.totalPages || 0;
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = Math.min(startIndex + users.length, totalUsers);

    // Handle data fetching error
    useEffect(() => {
        if (isError) {
            Swal.fire({
                icon: "error",
                title: "Loading Failed",
                text: "Unable to load users. Please try again.",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#dc2626",
            });
        }
    }, [isError]);

    // Check if user is premium (has gold badge)
    const isPremiumUser = (user) => {
        return user.badges && user.badges.includes("gold");
    };

    // Handle search
    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setSearchQuery(searchTerm);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm("");
        setSearchQuery("");
        setCurrentPage(1);
    };

    // Make user admin handler
    const handleMakeAdmin = async (userId, userName) => {
        const result = await Swal.fire({
            title: "Make Admin?",
            text: `Are you sure you want to make "${userName}" an admin? This will grant them administrative privileges.`,
            icon: "warning",
            background: "#1a1a1a",
            color: "#e5e5e5",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#404040",
            confirmButtonText: "Yes, Make Admin",
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
            setMakeAdminLoading(userId);
            
            const response = await axiosSecure.patch(
                `/users/${userId}/make-admin`
            );

            if (response?.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Admin Created",
                    text: `${userName} has been successfully made an admin.`,
                    background: "#1a1a1a",
                    color: "#e5e5e5",
                    confirmButtonColor: "#2563eb",
                    timer: 2000,
                    timerProgressBar: true,
                    customClass: {
                        popup: "!text-xs sm:!text-base",
                        title: "!text-xs sm:!text-xl",
                        htmlContainer: "!text-xs sm:!text-base",
                        confirmButton:
                            "!text-xs sm:!text-base !px-3 !py-1.5 sm:!px-4 sm:!py-2",
                    },
                });
                refetch();
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed to Make Admin",
                text: "Unable to make user admin. Please try again.",
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
            setMakeAdminLoading(null);
        }
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

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center mt-20">
                <img src={loadImg} className="w-24 h-24" alt="" />
                <h2 className="sec-font">Loading</h2>
            </div>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-6 pri-font">
            {/* Header */}
            <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Users className="size-4 sm:size-6" />
                        <div>
                            <h1 className="text-sm sm:text-xl font-semibold">
                                Manage Users
                            </h1>
                            <p className="text-neutral-400 text-xs sm:text-sm">
                                View and manage all registered users
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="bg-neutral-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg w-max">
                            <span className="text-neutral-400">
                                Total Users:
                            </span>
                            <span className="ml-2 font-semibold text-blue-400">
                                {totalUsers}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search by username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch(e);
                                }
                            }}
                            className="w-full pl-10 pr-10 py-2 sm:py-3 bg-neutral-900 border border-neutral-700 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors text-xs sm:text-sm"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:py-3 rounded-xl transition-colors flex items-center gap-2 text-xs sm:text-sm w-max sm:w-auto justify-center"
                    >
                        <Search className="size-4" />
                        Search
                    </button>
                </div>

                {searchQuery && (
                    <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
                        <span>Search results for:</span>
                        <span className="text-blue-400 font-medium">
                            "{searchQuery}"
                        </span>
                        <button
                            onClick={handleClearSearch}
                            className="text-blue-400 hover:text-blue-300 transition-colors ml-2"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {/* Users Content */}
            <div className="bg-[#121212] rounded-2xl border border-neutral-800 overflow-hidden mb-10">
                {totalUsers === 0 ? (
                    // Empty State
                    <div className="p-3 sm:p-12 text-center">
                        <div className="w-12 h-12 sm:w-24 sm:h-24 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-6">
                            <Users className="size-5 sm:size-12 text-neutral-600" />
                        </div>
                        <h3 className="text-sm sm:text-xl font-semibold mb-2">
                            {searchQuery ? "No Users Found" : "No Users Yet"}
                        </h3>
                        <p className="text-neutral-400 mb-4 sm:mb-6 max-w-md mx-auto text-xs sm:text-base">
                            {searchQuery
                                ? `No users found matching "${searchQuery}". Try a different search term.`
                                : "No users have registered yet."}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-medium transition-colors text-xs sm:text-base"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    // Users Available state
                    <>
                        <div className="overflow-x-auto">
                            {/* Table header */}
                            <div className="bg-neutral-900 px-3 py-2 sm:px-6 sm:py-4 border-b border-neutral-800">
                                <div className="grid grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-neutral-300">
                                    <div className="col-span-4 sm:col-span-4">
                                        User
                                    </div>
                                    <div className="col-span-3 sm:col-span-3">
                                        Email
                                    </div>
                                    <div className="col-span-2 sm:col-span-2 text-center">
                                        Status
                                    </div>
                                    <div className="col-span-3 sm:col-span-3 text-right">
                                        Actions
                                    </div>
                                </div>
                            </div>

                            {/* Table body */}
                            <div className="divide-y divide-neutral-800">
                                {users.map((user) => {
                                    const joinedDate = format(
                                        new Date(user.joinedAt),
                                        "MMM dd, yyyy"
                                    );
                                    const isAdmin = user.role === "admin";
                                    const isPremium = isPremiumUser(user);
                                    return (
                                        <div
                                            key={user._id}
                                            className="px-3 py-2 sm:px-6 sm:py-4 hover:bg-neutral-900/50 transition-colors"
                                        >
                                            <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
                                                {/* User Info */}
                                                <div className="col-span-4 sm:col-span-4">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="relative">
                                                            <img
                                                                src={
                                                                    user.avatar
                                                                }
                                                                alt={user.name}
                                                                className="w-6 h-6 sm:w-10 sm:h-10 rounded-full object-cover"
                                                            />
                                                            {isAdmin && (
                                                                <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1">
                                                                    <ShieldCheck className="size-2 sm:size-3 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="font-medium text-white truncate text-xs sm:text-base">
                                                                {user.name}
                                                            </h3>
                                                            <p className="text-neutral-400 text-xs hidden sm:block">
                                                                Joined{" "}
                                                                {joinedDate}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Email */}
                                                <div className="col-span-3 sm:col-span-3">
                                                    <p className="text-neutral-300 truncate text-xs sm:text-sm">
                                                        {user.email}
                                                    </p>
                                                </div>

                                                {/* Subscription Status */}
                                                <div className="col-span-2 sm:col-span-2 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        {isPremium ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-md">
                                                                <Crown className="size-3" />
                                                                <span className="hidden sm:inline">
                                                                    Premium
                                                                </span>
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-500/20 text-neutral-400 text-xs rounded-md">
                                                                <User className="size-3" />
                                                                <span className="hidden sm:inline">
                                                                    Free
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="col-span-3 sm:col-span-3 flex items-center justify-end">
                                                    {isAdmin ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 bg-blue-500/20 text-blue-300 text-xs rounded-lg">
                                                            <ShieldCheck className="size-3 sm:size-4" />
                                                            <span className="hidden sm:inline">
                                                                Admin
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleMakeAdmin(
                                                                    user._id,
                                                                    user.name
                                                                )
                                                            }
                                                            disabled={
                                                                makeAdminLoading ===
                                                                user._id
                                                            }
                                                            className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {makeAdminLoading ===
                                                            user._id ? (
                                                                <div className="size-3 sm:size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                            ) : (
                                                                <Shield className="size-3 sm:size-4" />
                                                            )}
                                                            <span className="hidden sm:inline">
                                                                Make Admin
                                                            </span>
                                                        </button>
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
                                        of {totalUsers} users
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
        </div>
    );
};

export default ManageUsers;
