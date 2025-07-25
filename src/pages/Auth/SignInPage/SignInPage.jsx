import React, { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../../contexts/Auth/AuthContext";
import { Link, useNavigate } from "react-router";
import { toast, Bounce } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAxios from "../../../hooks/axios/useAxios";

const SignInPage = () => {
    const { createUser, googleSignIn, setLoading, loading, updateUser } =
        useContext(AuthContext);

    const { axiosDef } = useAxios();

    const [localLoading, setLocalLoading] = useState(false);

    const [showPass, setShowPass] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(); //?react-hook-form

    const handleShowPass = () => {
        setShowPass(!showPass);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true); // Start loading early

        try {
            const result = await googleSignIn();

            const user = result?.user;
            if (!user) throw new Error("Google sign-in failed.");

            // Save or update user in DB
            await axiosDef.post("/users", {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
            });

            toast.success("Welcome to nerdtalks!", {
                position: "bottom-center",
                autoClose: 3000,
                theme: "dark",
                transition: Bounce,
                hideProgressBar: true,
            });

            navigate("/");
        } catch (error) {
            console.error("Google sign-in error:", error);
            toast.error(error.message || "Something went wrong!", {
                position: "bottom-center",
                autoClose: 3000,
                theme: "dark",
                transition: Bounce,
                hideProgressBar: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setLocalLoading(true);
        const { email, name, password, image } = data;

        try {
            // 1. Create Firebase user
            const userCredential = await createUser(email, password);
            const uid = userCredential?.user.uid;

            // 2. Upload image to imgbb
            const formData = new FormData();
            formData.append("image", image[0]);

            const imgUploadRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${
                    import.meta.env.VITE_IMGBB_API
                }`,
                formData
            );

            if (!imgUploadRes.data?.success) {
                throw new Error("Image upload failed");
            }

            const avatarURL = imgUploadRes.data.data.display_url;

            // 3. Update Firebase profile
            await updateUser(name, avatarURL);

            // 4. Store user in your database
            await axiosDef.post("/users", {
                uid,
                name,
                email,
                avatar: avatarURL,
            });

            // 5. Success toast and redirect
            toast.success(`Welcome to nerdtalks!`, {
                position: "bottom-center",
                autoClose: 3000,
                theme: "dark",
                transition: Bounce,
                hideProgressBar: true,
            });

            navigate("/");
        } catch (error) {
            console.error("Registration Error:", error);
            toast.error(error.message || "Something went wrong", {
                position: "bottom-center",
                autoClose: 3000,
                theme: "dark",
                transition: Bounce,
                hideProgressBar: true,
            });
        } finally {
            setLoading(false);
            setLocalLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 mt-5 relative">
            <div className="w-full max-w-md bg-slate-200/10 border border-slate-100/20 rounded-2xl shadow-lg p-4 sm:p-8">
                <p className="text-center pb-2 font-medium sec-font">Sign In</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-xs sm:text-sm font-medium text-gray-300"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@nerdtalks.app"
                            className="w-full bg-[#2a2a40] border border-gray-600 text-white text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-1.5 sm:p-2.5"
                            {...register("email", {
                                required: "Email is required",
                            })}
                        />
                        {errors.email && (
                            <p className="text-xs sm:text-sm text-red-500 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="name"
                            className="block mb-2 text-xs sm:text-sm font-medium text-gray-300"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="your name"
                            className="w-full bg-[#2a2a40] border border-gray-600 text-white text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-1.5 sm:p-2.5"
                            {...register("name", {
                                required: "Name is required",
                            })}
                        />
                        {errors.name && (
                            <p className="text-xs sm:text-sm text-red-500 mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <label
                            htmlFor="password"
                            className="block mb-2 text-xs sm:text-sm font-medium text-gray-300"
                        >
                            Password
                        </label>
                        <input
                            type={showPass ? "text" : "password"}
                            id="password"
                            placeholder="••••••••"
                            className="w-full bg-[#2a2a40] border border-gray-600 text-white text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-1.5 sm:p-2.5"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                                    message:
                                        "Password must include uppercase, lowercase, and a number",
                                },
                            })}
                        />
                        <button
                            type="button"
                            onClick={handleShowPass}
                            className="absolute top-7.5 sm:top-9.5 right-2"
                        >
                            {showPass ? (
                                <FaEyeSlash size={24} />
                            ) : (
                                <FaEye size={24} />
                            )}
                        </button>
                        {errors.password && (
                            <p className="text-xs sm:text-sm text-red-500 mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="py-2">
                        <label
                            htmlFor="image"
                            className="block mb-2 text-xs sm:text-sm font-medium text-gray-300"
                        >
                            Upload Profile Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            className="w-full text-xs sm:text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            {...register("image", {
                                required: "Image upload is required",
                            })}
                        />
                        {errors.image && (
                            <p className="text-xs sm:text-sm text-red-500 mt-1">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    {loading || localLoading ? (
                        <button
                            type="button"
                            disabled
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-xs sm:text-sm px-5 py-1.5 sm:py-2.5 text-center inline-flex items-center justify-center gap-2 transition duration-200"
                        >
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            Loading...
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-xs sm:text-sm px-5 py-1.5 sm:py-2.5 text-center transition duration-200"
                        >
                            Create your account
                        </button>
                    )}

                    <div className="flex items-center justify-between gap-4 mb-3 sm:mb-6">
                        <hr className="flex-grow border-gray-700" />
                        <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                            or
                        </span>
                        <hr className="flex-grow border-gray-700" />
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="w-full flex items-center justify-center gap-2 text-white hover:bg-slate-200/15 border border-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-xs sm:text-sm px-5 py-1.5 sm:py-2.5 transition duration-200"
                    >
                        <FcGoogle className="w-5 h-5" />
                        Sign up with Google
                    </button>

                    <p className="text-xs sm:text-sm font-medium text-gray-400 text-center">
                        Already have an account?{" "}
                        <Link
                            to="/auth/login"
                            className="text-blue-500 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;
