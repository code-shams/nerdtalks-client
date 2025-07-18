import axios from "axios";
import React, { use, useEffect } from "react";
import { AuthContext } from "../../contexts/Auth/AuthContext";

const axiosDef = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
});

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
});
const useAxios = () => {
    const { user } = use(AuthContext);

    useEffect(() => {
        //? If no user, skip setting the token
        if (!user) return;

        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                config.headers.Authorization = `Bearer ${user.accessToken}`;
                return config;
            },
            (error) => Promise.reject(error)
        );

        //? Cleanup the interceptor on unmount or user change
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
        };
    }, [user]);
    return { axiosDef, axiosSecure };
};

export default useAxios;
