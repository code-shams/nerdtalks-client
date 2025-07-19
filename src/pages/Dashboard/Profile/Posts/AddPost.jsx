// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import Select from "react-select";
// const AddPost = () => {
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm();

//     const [selectedTag, setSelectedTag] = useState(null);

//     const [loading, setLoading] = useState(false);

//     const tags = [
//         { value: "anime", label: "Anime" },
//         { value: "manga", label: "Manga" },
//         { value: "coding", label: "Coding" },
//         { value: "books", label: "Books" },
//         { value: "tv", label: "TV Shows" },
//         { value: "games", label: "Games" },
//         { value: "movies", label: "Movies" },
//     ];
//     return (
//         <div className="pri-font max-w-3xl mx-auto bg-[#121212] p-6 rounded-2xl border border-neutral-800 space-y-6">
//             <h2 className="text-xl font-semibold text-white">Add a New Post</h2>

//             <form className="space-y-4">
//                 <div>
//                     <label className="block text-sm mb-1 text-neutral-300">
//                         Title *
//                     </label>
//                     <input
//                         type="text"
//                         {...register("title", { required: true })}
//                         placeholder="Enter post title"
//                         className="w-full p-2 rounded-md bg-neutral-900 border border-neutral-700 text-white"
//                     />
//                     {errors.title && (
//                         <p className="text-red-500 text-xs mt-1">
//                             Title is required
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-sm mb-1 text-neutral-300">
//                         Description *
//                     </label>
//                     <textarea
//                         {...register("description", { required: true })}
//                         placeholder="Write your post..."
//                         rows="6"
//                         className="w-full p-2 rounded-md bg-neutral-900 border border-neutral-700 text-white resize-none"
//                     />
//                     {errors.description && (
//                         <p className="text-red-500 text-xs mt-1">
//                             Description is required
//                         </p>
//                     )}
//                 </div>

//                 <div>
//                     <label className="block text-sm mb-1 text-neutral-300">
//                         Tag *
//                     </label>
//                     <Select
//                         options={tags}
//                         value={selectedTag}
//                         onChange={setSelectedTag}
//                         placeholder="Select a tag"
//                         className="text-black"
//                     />
//                     <select name="" id=""></select>
//                 </div>

//                 <div className="text-sm text-neutral-500 mt-2">
//                     <p>
//                         <span className="font-medium text-white">Author:</span>{" "}
//                         {/* {dbUser.name} */}
//                         {"author name"}
//                     </p>
//                     <p>
//                         <span className="font-medium text-white">Email:</span>{" "}
//                         {/* {dbUser.email} */}
//                         {"author email"}
//                     </p>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                     {loading ? "Posting..." : "Submit Post"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AddPost;

import Select from "react-select";
import React, { use, useState } from "react";
import { AuthContext } from "../../../../contexts/Auth/AuthContext";
import useDbUser from "../../../../hooks/useDbUser";
import { Link, useNavigate } from "react-router";
import { Crown, FileText, Lock, PenTool, Tag } from "lucide-react";
import { useForm } from "react-hook-form";

const AddPost = () => {
    const { user } = use(AuthContext);
    const { dbUser } = useDbUser();
    const navigate = useNavigate();
    // const [tags, setTags] = useState([]);
    const tags = [
        { value: "anime", label: "Anime" },
        { value: "manga", label: "Manga" },
        { value: "coding", label: "Coding" },
        { value: "books", label: "Books" },
        { value: "tv", label: "TV Shows" },
        { value: "games", label: "Games" },
        { value: "movies", label: "Movies" },
    ];
    const [userPosts, setUserPosts] = useState([]);
    const [isLocked, setIsLocked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            tag: null,
        },
    });
    const isMember = false;

    const selectStyles = {
        //?Custom style for react-select
        control: (styles) => ({
            ...styles,
            backgroundColor: "#1a1a1a",
            borderColor: "#404040",
            borderRadius: "12px",
            minHeight: "48px",
            boxShadow: "none",
            "&:hover": {
                borderColor: "#525252",
            },
        }),
        menu: (styles) => ({
            ...styles,
            backgroundColor: "#1a1a1a",
            border: "1px solid #404040",
            borderRadius: "12px",
        }),
        option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: isSelected
                ? "#404040"
                : isFocused
                ? "#262626"
                : "transparent",
            color: "#e5e5e5",
            "&:hover": {
                backgroundColor: "#262626",
            },
        }),
        singleValue: (styles) => ({
            ...styles,
            color: "#e5e5e5",
        }),
        placeholder: (styles) => ({
            ...styles,
            color: "#a3a3a3",
        }),
        input: (styles) => ({
            ...styles,
            color: "#e5e5e5",
        }),
    };

    if (isLocked) {
        return (
            <div className="space-y-6 pri-font">
                {/* Locked State */}
                <div className="bg-[#121212] p-8 rounded-2xl border border-neutral-800 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold mb-4">
                        Post Limit Reached
                    </h2>
                    <p className="text-neutral-400 mb-6 max-w-md mx-auto">
                        You've reached the limit of 5 posts for free users.
                        Upgrade to premium membership to post unlimited content
                        and unlock exclusive features!
                    </p>

                    <div className="bg-neutral-900 p-4 rounded-xl mb-6">
                        <div className="flex items-center justify-center gap-2 text-sm text-neutral-300">
                            <span>
                                Your posts:{" "}
                                <span className="font-semibold text-white">
                                    {/* {userPosts.length} */}5
                                </span>
                                /5
                            </span>
                        </div>
                    </div>

                    <Link to="/membership">
                        <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 mx-auto">
                            <Crown className="w-5 h-5" />
                            Become a Member
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pri-font mb-20">
            {/* Header */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-neutral-800">
                <div className="flex items-center gap-3 mb-2">
                    <PenTool className="w-6 h-6 text-blue-500" />
                    <h1 className="text-2xl font-semibold">Create New Post</h1>
                </div>
                <p className="text-neutral-400 text-sm">
                    Share your thoughts with the NerdTalks community
                </p>

                {/* Post limit indicator for free users */}
                {!isMember && (
                    <div className="mt-4 p-3 bg-neutral-900 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-300">
                                Posts remaining:
                            </span>
                            <span className="font-semibold">
                                {/* {5 - userPosts.length} of 5 */}4
                            </span>
                        </div>
                        <div className="w-full bg-neutral-700 rounded-full h-2 mt-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${(2 / 5) * 100}%`,
                                    // width: `${(userPosts.length / 5) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* //?Add post form */}
            <div className="bg-[#121212] p-6 rounded-2xl border border-neutral-800">
                <form onSubmit={handleSubmit()} className="space-y-6">
                    {/* //?Author Information */}
                    <div className="bg-neutral-900 p-4 rounded-xl">
                        <h3 className="text-sm font-medium mb-3 text-neutral-300">
                            Author Information
                        </h3>
                        <div className="flex items-center gap-4">
                            <img
                                src={dbUser?.avatar}
                                alt="Author"
                                className="w-12 h-12 rounded-full object-cover border border-neutral-700"
                            />
                            <div>
                                <p className="font-medium">{dbUser?.name}</p>
                                <p className="text-sm text-neutral-400">
                                    {dbUser?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* //?Post Title */}
                    <div className="">
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Post Title *
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
                            className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="Enter your post title..."
                        />
                        {errors.title && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/*//? Post Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Post Description *
                        </label>
                        <textarea
                            {...register("description", {
                                required: "Post description is required",
                                minLength: {
                                    value: 20,
                                    message:
                                        "Description must be at least 20 characters",
                                },
                            })}
                            rows={6}
                            className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                            placeholder="Write your post content here..."
                        />
                        {errors.description && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/*//? Tag Selection */}
                    <div className="">
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Category *
                        </label>
                        <Select
                            options={tags}
                            menuPlacement="top"
                            styles={selectStyles}
                            placeholder="Select a category..."
                            // value={selectedTag}
                            // onChange={(selected) => setValue("tag", selected)}
                            isSearchable
                        />
                        {errors.tag && (
                            <p className="text-red-400 text-sm mt-1">
                                Please select a category
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <PenTool className="w-5 h-5" />
                                    Publish Post
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-6 py-3 border border-neutral-700 hover:border-neutral-600 text-neutral-300 rounded-xl transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPost;
