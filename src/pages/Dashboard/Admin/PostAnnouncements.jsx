// import React from 'react'

// const PostAnnouncements = () => {
//   return (
//     <div>PostAnnouncements</div>
//   )
// }

// export default PostAnnouncements

import Select from "react-select";
import React, { use, useEffect, useState } from "react";

import { Link, useNavigate } from "react-router";
import { Crown, FileText, Lock, PenTool, Tag } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import loadImg from "../../../assets/loading.gif";
import useAxios from "../../../hooks/axios/useAxios";
import useDbUser from "../../../hooks/useDbUser";

const PostAnnouncements = () => {
    const { dbUser } = useDbUser();

    const navigate = useNavigate();

    const { axiosSecure, axiosDef } = useAxios();

    // ?Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ?Hook form initialization
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            tag: null,
        },
    });

    //? Handle form submission
    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const announcementData = {
                title: data.title,
                message: data.description,
                audience: "all",
                pinned: false,
                authorId: dbUser._id,
                authorName: dbUser.name,
                authorEmail: dbUser.email,
                authorImage: dbUser.avatar,
            };

            const response = await axiosSecure.post(
                "/announcements",
                announcementData
            );

            if (response.status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Announcement Published! 🎉",
                    text: "Your announcement has been successfully published to the community.",
                    background: "#1a1a1a",
                    color: "#e5e5e5",
                });

                reset();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Publication Failed",
                    text: "Unable to publish your announcement. Please check your connection and try again.",
                    background: "#1a1a1a",
                    color: "#e5e5e5",
                    confirmButtonColor: "#ef4444",
                    footer: '<span style="color: #a3a3a3">If the problem persists, please contact support.</span>',
                });
            }
        } catch (err) {
            // Show error alert
            Swal.fire({
                icon: "error",
                title: "Publication Failed",
                text: "Unable to publish your announcement. Please check your connection and try again.",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#ef4444",
                footer: '<span style="color: #a3a3a3">If the problem persists, please contact support.</span>',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-3 sm:space-y-6 pri-font mb-20">
            {/*//? Header */}
            <div className="bg-[#121212] p-3 sm:p-6 rounded-2xl border border-neutral-800">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <PenTool className="size-4 sm:size-5 text-blue-500" />
                    <h1 className="text-lg sm:text-2xl font-semibold">
                        Make Announcement
                    </h1>
                </div>
                <p className="text-neutral-400 text-xs sm:text-sm">
                    Make an announcement for the nerdtalks community
                </p>
            </div>

            {/* //?Add post form */}
            <div className="bg-[#121212] p-2 sm:p-6 rounded-2xl border border-neutral-800">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3 sm:space-y-6"
                >
                    {/* //?Author Information */}
                    <div className="bg-neutral-900 p-2 sm:p-4 rounded-xl">
                        <h3 className="text-xs sm:text-sm font-medium mb-3 text-neutral-300">
                            Author Information
                        </h3>
                        <div className="flex items-center gap-4">
                            <img
                                src={dbUser?.avatar}
                                alt="Author"
                                className="w-12 h-12 rounded-full object-cover border border-neutral-700"
                            />
                            <div>
                                <p className="text-sm sm:text-base font-medium">
                                    {dbUser?.name}
                                </p>
                                <p className="text-xs sm:text-sm break-all text-neutral-400">
                                    {dbUser?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* //?Announcement Title */}
                    <div className="">
                        <label className="text-xs sm:text-sm font-medium mb-2 flex items-center gap-2">
                            <FileText className="size-4 sm:size-5" />
                            Announcement Title *
                        </label>
                        <input
                            type="text"
                            {...register("title", {
                                required: "Post title is required",
                                minLength: {
                                    value: 5,
                                    message:
                                        "Title must be at least 5 characters",
                                },
                                maxLength: {
                                    value: 100,
                                    message:
                                        "Title must not exceed 100 characters",
                                },
                            })}
                            className="w-full p-2 sm:p-3 placeholder:text-xs sm:placeholder:text-base text-xs sm:text-base bg-neutral-900 border border-neutral-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="Enter your announcement title..."
                        />
                        {errors.title && (
                            <p className="text-red-400 text-xs sm:text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/*//? Announcement Description */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2">
                            Announcement Description *
                        </label>
                        <textarea
                            {...register("description", {
                                required: "Post description is required",
                                minLength: {
                                    value: 5,
                                    message:
                                        "Description must be at least 5 characters",
                                },
                            })}
                            rows={6}
                            className="w-full p-2 sm:p-3 placeholder:text-xs sm:placeholder:text-base text-xs sm:text-base bg-neutral-900 border border-neutral-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                            placeholder="Write your announcement content here..."
                        />
                        {errors.description && (
                            <p className="text-red-400 text-xs sm:text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white sm:py-3 sm:px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <PenTool className="size-4 sm:size-5" />
                                    Publish
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-3 py-1 text-sm sm:text-base sm:px-6 sm:py-3 border border-neutral-700 hover:border-neutral-600 text-neutral-300 rounded-xl transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostAnnouncements;
