import React, { useEffect, useState } from "react";
import Banner from "./Banner/Banner";
import useAxios from "../../hooks/axios/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../shared/Navbar/Loading/Loading";
import Swal from "sweetalert2";

const Homepage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const { axiosDef } = useAxios();

    // ?Fetch tags
    const {
        data: tagsData,
        isLoading: tagsLoading,
        isError: tagsError,
        error: errTags,
    } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const response = await axiosDef.get("/tags");
            return response.data;
        },
    });

    // ?Fetch user post length
    const {
        data: posts,
        isLoading: postsLoading,
        isError: postsError,
        error: errPost,
        refetch,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await axiosDef.get(
                `/posts?searchTerm=${searchTerm}`
            );
            return response.data;
        },
    });

    useEffect(() => {
        console.log("before refetch", searchTerm);
        refetch();
        console.log("AFTER refetch", searchTerm);
        console.log(posts);
    }, [posts, searchTerm]);

    // ? Handling data fetching error from tanstack
    useEffect(() => {
        if (tagsError || postsError) {
            Swal.fire({
                icon: "error",
                title: "Loading Failed",
                text: "Something went wrong! Please try again!",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#dc2626",
            }).then(() => {
                console.log(errTags || errPost);
            });
        }
    }, [tagsError, postsError]);

    if (postsLoading || tagsLoading) return <Loading></Loading>;
    return (
        <div className="relative">
            <Banner
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                tagsData={tagsData}
            ></Banner>
        </div>
    );
};

export default Homepage;
