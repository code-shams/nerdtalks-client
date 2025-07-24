import { useState, useEffect } from "react";
import {
    Megaphone,
    Pin,
    Clock,
    ChevronLeft,
    ChevronRight,
    User,
    Calendar,
    AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

const Announcements = ({ announcements }) => {
    const formatTimeAgo = (date) => {
        const now = new Date();
        const announcementDate = new Date(date);
        const diffInHours = Math.floor(
            (now - announcementDate) / (1000 * 60 * 60)
        );

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return format(announcementDate, "MMM dd, yyyy");
    };

    // Get audience badge style
    const getAudienceBadgeStyle = (audience) => {
        switch (audience) {
            case "admin":
                return "bg-red-500/20 text-red-300 border-red-500/30";
            case "member":
                return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
            case "all":
                return "bg-green-500/20 text-green-300 border-green-500/30";
            default:
                return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        }
    };

    return (
        <div className="space-y-6 pri-font pb-3 ">
            {/* Header */}
            <div className="">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                        <Megaphone className="size-6 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-lg sm:text-2xl font-bold text-white">
                            All Announcements
                        </h1>
                        <p className="text-neutral-400 text-sm sm:text-base">
                            Important updates and notifications from the team
                        </p>
                    </div>
                </div>
                <div className="text-sm text-neutral-400 mt-4">
                    <span className="font-medium text-blue-400">
                        {announcements?.length}
                    </span>{" "}
                    total announcements
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {announcements.map((announcement) => {
                    const timeAgo = formatTimeAgo(announcement.createdAt);

                    return (
                        <div
                            key={announcement._id}
                            className={`bg-[#121212] rounded-2xl border p-2 sm:p-2 transition-colors ${
                                announcement.pinned
                                    ? "border-blue-500/50 bg-blue-500/5"
                                    : "border-neutral-800 hover:border-neutral-700"
                            }`}
                        >
                            {/* Author Info */}
                            <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
                                <img
                                    src={announcement.authorImage}
                                    alt={announcement.authorName}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-neutral-700"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-medium text-white text-sm sm:text-base">
                                            {announcement.authorName}
                                        </h4>
                                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                                            <User className="size-3" />
                                            <span className="truncate">
                                                {announcement.authorEmail}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
                                        <Calendar className="size-3" />
                                        <span>
                                            {format(
                                                new Date(
                                                    announcement.createdAt
                                                ),
                                                "PPP 'at' p"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Header with Pin Status */}
                            <div className="flex items-start justify-between my-2">
                                <div className="flex items-center gap-2">
                                    {announcement.pinned && (
                                        <div className="flex items-center gap-1 text-blue-400 text-sm font-medium">
                                            <Pin className="size-4" />
                                            <span>Pinned</span>
                                        </div>
                                    )}
                                    <span
                                        className={`inline-flex items-center px-3 py-1 text-xs sm:text-sm rounded-full border ${getAudienceBadgeStyle(
                                            announcement.audience
                                        )}`}
                                    >
                                        {announcement.audience === "all"
                                            ? "Everyone"
                                            : announcement.audience}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
                                    <Clock className="size-3" />
                                    <span>{timeAgo}</span>
                                </div>
                            </div>

                            {/* Announcement Content */}
                            <div className="mb-1">
                                <h2 className="text-base sm:text-lg font-bold text-white mb-0.5">
                                    {announcement.title}
                                </h2>
                                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                                    {announcement.message}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Announcements;
