import React, { useEffect, useState } from "react";
import Banner from "./Banner/Banner";
import useAxios from "../../hooks/axios/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../shared/Navbar/Loading/Loading";
import Swal from "sweetalert2";
import AllPosts from "./Posts/AllPosts";
import AllTags from "./Tags/AllTags";
import Announcements from "./Announcements/Announcement";

const Homepage = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1); //? For AllPosts pagination

    const [sortByPopularity, setSortByPopularity] = useState(false); //?For AllPosts sorting

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
        data: postsData,
        isLoading: postsLoading,
        isError: postsError,
        error: errPost,
        refetch,
    } = useQuery({
        queryKey: ["allPosts", currentPage, sortByPopularity, searchTerm],
        queryFn: async () => {
            const response = await axiosDef.get("/posts", {
                params: {
                    page: currentPage,
                    limit: 5,
                    sortByPopularity,
                    tag: searchTerm,
                },
            });
            return response.data;
        },
    });

    // ?Fetch announcements
    const {
        data: announcementsData,
        isLoading: announcementsLoading,
        isError: announcementsError,
        error: errAnnouncements,
    } = useQuery({
        queryKey: ["announcements"],
        queryFn: async () => {
            const response = await axiosDef.get("/announcements");
            return response.data;
        },
    });

    useEffect(() => {
        refetch();
    }, [postsData, searchTerm, currentPage, sortByPopularity]);

    // ? Handling data fetching error from tanstack
    useEffect(() => {
        if (tagsError || postsError || announcementsError) {
            Swal.fire({
                icon: "error",
                title: "Loading Failed",
                text: "Something went wrong! Please try again!",
                background: "#1a1a1a",
                color: "#e5e5e5",
                confirmButtonColor: "#dc2626",
            }).then(() => {
                console.log(errTags || errPost || errAnnouncements);
            });
        }
    }, [tagsError, postsError, announcementsError]);

    if (postsLoading || tagsLoading || announcementsLoading)
        return <Loading></Loading>;

    const allPostsProps = {
        currentPage,
        setCurrentPage,
        sortByPopularity,
        setSortByPopularity,
        postsData,
        searchTerm,
    };

    const allTagsProps = {
        searchTerm,
        setSearchTerm,
        tagsData,
    };

    return (
        <div className="relative">
            <section>
                <Banner
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    tagsData={tagsData}
                ></Banner>
            </section>

            <section className="pt-5 sm:pt-15 contain">
                <AllTags allTagsProps={allTagsProps}></AllTags>
            </section>

            {/* //?Annoucements */}
            {announcementsData?.length ? (
                <section className="contain pt-5 sm:pt-10">
                    <Announcements
                        announcements={announcementsData}
                    ></Announcements>
                </section>
            ) : (
                ""
            )}

            <section className="contain pt-5">
                <AllPosts allPostsProps={allPostsProps}></AllPosts>
            </section>
        </div>
    );
};

export default Homepage;
