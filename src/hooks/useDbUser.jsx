import { useQuery } from "@tanstack/react-query";
import useAxios from "./axios/useAxios";
import { use } from "react";
import { AuthContext } from "../contexts/Auth/AuthContext";

const useDbUser = () => {
    const { axiosSecure } = useAxios();
    const { user } = use(AuthContext);

    const {
        data: dbUser = {},
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["dbUser", user?.uid],
        enabled: !!user?.uid, // only run if user exists
        queryFn: async () => {
            const res = await axiosSecure(`/users/${user.uid}`);
            return res.data;
        },
    });
    return { dbUser, isLoading, isError, error, refetch };
};
export default useDbUser;
