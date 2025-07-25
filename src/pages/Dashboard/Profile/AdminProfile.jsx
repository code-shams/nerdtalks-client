import React, { useState, useEffect } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import {
    User,
    MessageCircle,
    FileText,
    Tag,
    Plus,
    Crown,
    TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import loadImg from "../../../assets/loading.gif";
import useAxios from "../../../hooks/axios/useAxios";
import useDbUser from "../../../hooks/useDbUser";

const AdminProfile = () => {
    const { dbUser } = useDbUser();
    const { axiosSecure, axiosDef } = useAxios();
    const [tagName, setTagName] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch site statistics
    const {
        data: stats,
        isLoading: statsLoading,
        isError: statsError,
    } = useQuery({
        queryKey: ["siteStats"],
        queryFn: async () => {
            const response = await axiosSecure.get("/admin/stats");
            return response.data;
        },
        enabled: !!dbUser?._id && dbUser?.role === "admin",
    });

    // ?Fetch existing tags
    const {
        data: tagsData,
        isLoading: tagsLoading,
        isError: tagsError,
        error: errTags,
        refetch: refetchTags,
    } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const response = await axiosDef.get("/tags");
            return response.data;
        },
    });

    // Handle errors
    useEffect(() => {
        if (statsError || tagsError) {
            Swal.fire({
                icon: "error",
                title: "Loading Failed",
                text: "Unable to load admin data. Please try again.",
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
        }
    }, [statsError, tagsError]);

    // Prepare data for pie chart
    const chartData = stats
        ? [
              { name: "Posts", value: stats.totalPosts, color: "#3b82f6" },
              {
                  name: "Comments",
                  value: stats.totalComments,
                  color: "#06b6d4",
              },
              { name: "Users", value: stats.totalUsers, color: "#10b981" },
          ]
        : [];

    const handleAddTag = async () => {
        if (
            !formData.name.trim() ||
            !formData.description.trim() ||
            !formData.icon.trim()
        ) {
            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please fill in all fields (name, description, and icon).",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#f59e0b",
                customClass: {
                    popup: "!text-xs sm:!text-base",
                    title: "!text-xs sm:!text-xl",
                    htmlContainer: "!text-xs sm:!text-base",
                    confirmButton:
                        "!text-xs sm:!text-base !px-3 !py-1.5 sm:!px-4 sm:!py-2",
                },
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axiosSecure.post("/tags", {
                name: formData.name.trim(),
                description: formData.description.trim(),
                icon: formData.icon.trim(),
            });

            if (response.status === 201) {
                await Swal.fire({
                    icon: "success",
                    title: "Category Added! 🎉",
                    text: `"${formData.name}" has been successfully added to categories.`,
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

                setFormData({ name: "", description: "", icon: "" });
                refetchTags();
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                "Unable to add the category. Please try again.";
            Swal.fire({
                icon: "error",
                title: "Failed to Add Category",
                text: errorMessage,
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#ef4444",
                customClass: {
                    popup: "!text-xs sm:!text-base",
                    title: "!text-xs sm:!text-xl",
                    htmlContainer: "!text-xs sm:!text-base",
                    confirmButton:
                        "!text-xs sm:!text-base !px-3 !py-1.5 sm:!px-4 sm:!py-2",
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-3 shadow-lg">
                    <p className="text-neutral-300 font-medium text-sm">
                        {payload[0].name}
                    </p>
                    <p className="text-white font-bold text-base">
                        {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Loading state
    if (statsLoading || tagsLoading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center mt-20">
                <img src={loadImg} className="w-24 h-24" alt="" />
                <h2 className="sec-font text-neutral-400 mt-4">
                    Loading admin data...
                </h2>
            </div>
        );
    }

    return (
        <div className="space-y-3 sm:space-y-6 pri-font mb-20">
            {/* Header */}
            {/* <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <Crown className="size-4 sm:size-5 text-yellow-500" />
                    <h1 className="text-lg sm:text-2xl font-semibold">
                        Admin Profile
                    </h1>
                </div>
                <p className="text-neutral-400 text-xs sm:text-sm">
                    Manage your profile and monitor site statistics
                </p>
            </div> */}

            {/* Admin Profile Card */}
            <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4 text-neutral-300">
                    Administrator Information
                </h3>
                <div className="flex items-center gap-4">
                    <img
                        src={dbUser?.avatar}
                        alt={dbUser?.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-yellow-500"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-sm sm:text-xl font-semibold text-white">
                                {dbUser?.name}
                            </h2>
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-md font-medium">
                                {dbUser?.role}
                            </span>
                        </div>
                        <p className="text-neutral-300 text-xs sm:text-sm mb-1 break-all">
                            {dbUser?.email}
                        </p>
                        <p className="text-neutral-400 text-xs">
                            Joined on {formatDate(dbUser?.joinedAt)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-neutral-400 text-xs sm:text-sm font-medium mb-1">
                                Total Posts
                            </h3>
                            <p className="text-xl sm:text-3xl font-bold text-white">
                                {stats?.totalPosts || 0}
                            </p>
                        </div>
                        <div className="p-2 sm:p-3 bg-blue-600 rounded-xl">
                            <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-neutral-400 text-xs sm:text-sm font-medium mb-1">
                                Total Comments
                            </h3>
                            <p className="text-xl sm:text-3xl font-bold text-white">
                                {stats?.totalComments || 0}
                            </p>
                        </div>
                        <div className="p-2 sm:p-3 bg-cyan-600 rounded-xl">
                            <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-neutral-400 text-xs sm:text-sm font-medium mb-1">
                                Total Users
                            </h3>
                            <p className="text-xl sm:text-3xl font-bold text-white">
                                {stats?.totalUsers || 0}
                            </p>
                        </div>
                        <div className="p-2 sm:p-3 bg-emerald-600 rounded-xl">
                            <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <TrendingUp className="size-4 sm:size-5 text-blue-500" />
                    <h3 className="text-sm sm:text-xl font-semibold text-white">
                        Site Statistics Overview
                    </h3>
                </div>
                <div className="h-64 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={window.innerWidth < 640 ? 70 : 120}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, value, percent }) =>
                                    window.innerWidth < 640
                                        ? `${name}`
                                        : `${name}: ${value} (${(
                                              percent * 100
                                          ).toFixed(0)}%)`
                                }
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Add Tags Section */}
            <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Tag className="size-4 sm:size-5 text-blue-500" />
                    <h3 className="text-sm sm:text-xl font-semibold text-white">
                        Manage Categories
                    </h3>
                </div>

                {/* Existing Tags */}
                <div className="mb-4 sm:mb-6">
                    <h4 className="text-neutral-300 font-medium mb-2 sm:mb-3 text-xs sm:text-sm">
                        Current Categories ({tagsData?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {tagsData?.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 sm:px-3 sm:py-1 bg-neutral-900 text-neutral-200 rounded-lg text-xs sm:text-sm border border-neutral-800"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Add Tag Form */}
                <div className="space-y-3 sm:space-y-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-neutral-300 mb-2">
                            Add New Category
                        </label>

                        {/* Category Name */}
                        <div className="mb-3 sm:mb-4">
                            <label
                                htmlFor="categoryName"
                                className="block text-xs text-neutral-400 mb-1"
                            >
                                Category Name *
                            </label>
                            <input
                                type="text"
                                id="categoryName"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="e.g., Anime, Coding, Games..."
                                className="w-full p-2 sm:p-3 placeholder:text-xs sm:placeholder:text-base text-xs sm:text-base bg-neutral-900 border border-neutral-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Category Description */}
                        <div className="mb-3 sm:mb-4">
                            <label
                                htmlFor="categoryDescription"
                                className="block text-xs text-neutral-400 mb-1"
                            >
                                Description *
                            </label>
                            <textarea
                                id="categoryDescription"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Brief description of this category..."
                                rows={2}
                                className="w-full p-2 sm:p-3 placeholder:text-xs sm:placeholder:text-base text-xs sm:text-base bg-neutral-900 border border-neutral-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Category Icon */}
                        <div className="mb-3 sm:mb-4">
                            <label
                                htmlFor="categoryIcon"
                                className="block text-xs text-neutral-400 mb-1"
                            >
                                Icon *
                            </label>
                            <input
                                type="text"
                                id="categoryIcon"
                                value={formData.icon}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        icon: e.target.value,
                                    }))
                                }
                                placeholder="Emoji that matches the icon..."
                                className="w-full p-2 sm:p-3 placeholder:text-xs sm:placeholder:text-base text-xs sm:text-base bg-neutral-900 border border-neutral-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                disabled={isSubmitting}
                            />
                            {/* <p className="text-xs text-neutral-500 mt-1">
                                Use Lucide React icon names (e.g., Gamepad2,
                                Code, Film, Book)
                            </p> */}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleAddTag}
                            disabled={
                                isSubmitting ||
                                !formData.name.trim() ||
                                !formData.description.trim() ||
                                !formData.icon.trim()
                            }
                            className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Adding Category...
                                </>
                            ) : (
                                <>
                                    <Plus className="size-3 sm:size-4" />
                                    Add Category
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
