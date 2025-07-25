import React, { useEffect, useState } from "react";
import Banner from "./Banner/Banner";
import useAxios from "../../hooks/axios/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../shared/Navbar/Loading/Loading";
import Swal from "sweetalert2";
import AllPosts from "./Posts/AllPosts";
import AllTags from "./Tags/AllTags";
import Announcements from "./Announcements/Announcement";
import InPageLoading from "../../components/InPageLoading";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
                customClass: {
                    popup: "!text-xs sm:!text-base",
                    title: "!text-xs sm:!text-xl",
                    htmlContainer: "!text-xs sm:!text-base",
                    confirmButton:
                        "!text-xs sm:!text-base !px-3 !py-1.5 sm:!px-4 sm:!py-2",
                },
            }).then(() => {
                console.log(errTags || errPost || errAnnouncements);
            });
        }
    }, [tagsError, postsError, announcementsError]);

    if (tagsLoading || announcementsLoading) return <Loading></Loading>;

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const allTagsProps = {
        searchTerm,
        setSearchTerm,
        tagsData,
    };

    const allPostsProps = {
        currentPage,
        setCurrentPage,
        sortByPopularity,
        setSortByPopularity,
        postsData,
        searchTerm,
        handlePageChange,
    };

    const postsPerPage = 5;

    let { posts = [], total = 0, totalPages = 0 } = postsData || {};

    return (
        <div className="relative pb-5">
            {/* //?Annoucements */}
            {announcementsData?.length ? (
                <section className="contain pt-5 sm:py-10">
                    <Announcements
                        announcements={announcementsData}
                    ></Announcements>
                </section>
            ) : (
                ""
            )}
            <section>
                <Banner
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    tagsData={tagsData}
                ></Banner>
            </section>

            <section className="contain grid grid-cols-1 md:grid-cols-12 gap-5 pt-5 sm:pt-10">
                {postsLoading ? (
                    <div className="col-span-8 order-last sm:order-first">
                        <InPageLoading></InPageLoading>
                    </div>
                ) : (
                    <section className="col-span-8 order-last sm:order-first">
                        <AllPosts allPostsProps={allPostsProps}></AllPosts>
                    </section>
                )}
                <section className="contain col-span-4 hidden md:block">
                    <AllTags allTagsProps={allTagsProps}></AllTags>
                </section>
            </section>

            {/* //?Annoucements */}
            {/* {announcementsData?.length ? (
                <section className="contain pt-5 sm:pt-10">
                    <Announcements
                        announcements={announcementsData}
                    ></Announcements>
                </section>
            ) : (
                ""
            )} */}

            {/* {postsLoading ? (
                <div className="max-w-4xl mx-auto pt-5">
                    <InPageLoading></InPageLoading>
                </div>
            ) : (
                <section className="contain pt-5">
                    <AllPosts allPostsProps={allPostsProps}></AllPosts>
                </section>
            )} */}

            {/* //? Paginations */}
            {totalPages > 1 && (
                <div className="bg-[#121212] contain rounded-2xl border border-neutral-800 p-4 sm:p-6 mt-5">
                    <div className="flex items-center justify-center gap-2 sm:justify-between flex-wrap">
                        <div className="text-sm text-neutral-400">
                            Showing{" "}
                            {Math.min(
                                (currentPage - 1) * postsPerPage + 1,
                                searchTerm ? posts.length : total
                            )}{" "}
                            -{" "}
                            {Math.min(
                                currentPage * postsPerPage,
                                searchTerm ? posts.length : total
                            )}{" "}
                            of {searchTerm ? posts.length : total} posts
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="size-4" />
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from(
                                    {
                                        length: searchTerm
                                            ? Math.ceil(posts.length / 5)
                                            : totalPages,
                                    },
                                    (_, i) => i + 1
                                )
                                    .filter((page) => {
                                        return Math.abs(page - currentPage) <=
                                            2 ||
                                            page === 1 ||
                                            page === searchTerm
                                            ? Math.ceil(posts.length / 5)
                                            : totalPages;
                                    })
                                    .map((page, index, array) => {
                                        const showEllipsis =
                                            index > 0 &&
                                            array[index - 1] !== page - 1;
                                        return (
                                            <div
                                                key={page}
                                                className="flex items-center gap-1"
                                            >
                                                {showEllipsis && (
                                                    <span className="text-neutral-500 px-1">
                                                        ...
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                                        currentPage === page
                                                            ? "bg-blue-600 text-white"
                                                            : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            </div>
                                        );
                                    })}
                            </div>
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homepage;
