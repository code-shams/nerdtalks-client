import React, { use, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../../contexts/Auth/AuthContext";
import { Link, useNavigate } from "react-router";
import { toast, Bounce } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAxios from "../../../hooks/axios/useAxios";

const LoginPage = () => {
    const { loginUser, googleSignIn, setLoading, loading } = use(AuthContext);

    const { axiosDef } = useAxios();

    const [showPass, setShowPass] = useState(false);

    const handleShowPass = () => {
        setShowPass(!showPass);
    };

    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        setLoading(true);

        try {
            const result = await googleSignIn();
            const userData = result?.user;

            if (!userData) throw new Error("Google sign-in failed.");

            // Save to DB
            await axiosDef.post("/users", {
                uid: userData.uid,
                name: userData.displayName,
                email: userData.email,
                avatar: userData.photoURL,
            });

            toast.success("Welcome to NerdTalks!", {
                position: "bottom-center",
                autoClose: 3000,
                theme: "dark",
                transition: Bounce,
                hideProgressBar: true,
            });

            navigate("/");
        } catch (error) {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        loginUser(email, password)
            .then(() => {
                navigate("/");
                toast.success("Welcome back!", {
                    position: "bottom-center",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Bounce,
                    hideProgressBar: true,
                });
            })
            .catch((error) =>
                toast.error(`${error.message}`, {
                    position: "bottom-center",
                    autoClose: 3000,
                    theme: "dark",
                    transition: Bounce,
                    hideProgressBar: true,
                })
            )
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center px-4 mt-5 relative">
            <div className="w-full max-w-md bg-slate-200/10 border border-slate-100/20 rounded-2xl shadow-lg p-4 sm:p-8">
                <p className="text-center pb-2 font-medium sec-font">
                    Welcome back!
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-xs sm:text-sm font-medium text-gray-300"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="you@nerdtalks.app"
                            required
                            className="w-full bg-[#2a2a40] border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-1.5 sm:p-2.5"
                        />
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
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            required
                            className="w-full bg-[#2a2a40] border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 p-1.5 sm:p:-2.5"
                        />
                        <button
                            type="button"
                            onClick={handleShowPass}
                            className="absolute top-8 sm:top-9 right-2"
                        >
                            {showPass ? (
                                <FaEyeSlash size={24} />
                            ) : (
                                <FaEye size={24} />
                            )}
                        </button>
                    </div>

                    {/* //?Login button behavior according to laoding state */}
                    {loading ? (
                        // ?when loading
                        <button
                            type="button"
                            disabled
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2 sm:py-2.5 text-center inline-flex items-center justify-center transition duration-200"
                        >
                            <svg
                                aria-hidden="true"
                                role="status"
                                className="inline w-4 h-4 me-2 text-white animate-spin"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 
                                    22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 
                                    73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 
                                    50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 
                                    9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 
                                    97.0079 33.5539C95.2932 28.8227 92.871 24.3692 
                                    89.8167 20.348C85.8452 15.1192 80.8826 10.7238 
                                    75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 
                                    56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 
                                    41.7345 1.27873C39.2613 1.69328 37.813 
                                    4.19778 38.4501 6.62326C39.0873 9.04874 
                                    41.5694 10.4717 44.0505 10.1071C47.8511 
                                    9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 
                                    10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 
                                    17.9648 79.3347 21.5619 82.5849 25.841C84.9175 
                                    28.9121 86.7997 32.2913 88.1811 35.8758C89.083 
                                    38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor"
                                />
                            </svg>
                            Loading...
                        </button>
                    ) : (
                        // ?When not loading
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-xs sm:text-sm sm:px-5 py-2 sm:py-2.5 text-center transition duration-200"
                        >
                            Login to your account
                        </button>
                    )}

                    <div className="flex items-center justify-between gap-4 mb-2 sm:mb-6">
                        <hr className="flex-grow border-gray-700" />
                        <span className="text-sm text-gray-400 whitespace-nowrap">
                            or
                        </span>
                        <hr className="flex-grow border-gray-700" />
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="w-full flex items-center justify-center gap-2 text-white hover:bg-slate-200/15 border border-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-xs sm:text-sm px-5 py-2 sm:py-2.5 transition duration-200"
                    >
                        <FcGoogle className="w-5 h-5" />
                        Sign in with Google
                    </button>

                    <p className="text-xs sm:text-sm font-medium text-gray-400 text-center">
                        Not registered?{" "}
                        <Link
                            to={"/auth/signin"}
                            className="text-blue-500 hover:underline"
                        >
                            Create account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
