import { Search, Sparkles, X } from "lucide-react";
import banner from "../../../assets/banner2.gif";
import Select from "react-select";
import { useRef, useState } from "react";

const Banner = ({ searchTerm, setSearchTerm, tagsData }) => {
    const bannerStyle = {
        backgroundImage: `url(${banner})`,
        backgroundSize: "cover", // Ensures the image covers the entire area
        backgroundPosition: "center", // Centers the image
        backgroundRepeat: "no-repeat", // Prevents repeating
        width: "auto", // Optional: define dimensions
        height: "100%", // Optional: adjust as needed
    };

    const selectRef = useRef();

    //?Custom style for react-select
    const selectStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#1a1a1a1",
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
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "80%", // or use a pixel value for stricter control
        }),
        input: (styles) => ({
            ...styles,
            color: "#e5e5e5",
        }),
    };

    const customComponents = {
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null, // Optional: removes the small vertical line
    };

    const tags = tagsData?.map((tag) => {
        return { value: tag?.name.toLowerCase(), label: tag.name };
    });

    return (
        <section
            style={bannerStyle}
            className="text-white py-5 sm:py-10 pri-font relative rounded-xl"
        >
            <div className="absolute inset-0 bg-black/70 z-0"></div>

            <div className="flex items-center justify-center mb-2 sm:mb-4">
                <div className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm font-medium border border-blue-500/30 z-10 relative">
                    <Sparkles className="size-3 sm:size-4" />
                    <span>Welcome to nerdtalks</span>
                </div>
            </div>
            <div className="contain flex items-center justify-center gap-10 z-10 relative">
                {/* Left Text Content */}
                <div className="max-w-xl space-y-2 sm:space-y-4 text-center">
                    <h1 className="text-xl sm:text-3xl font-bold">
                        Discover Amazing Discussions
                    </h1>
                    <p className="text-neutral-400 text-xs sm:text-base">
                        Join our community of nerds discussing coding, games,
                        movies, sports and everything in between.
                    </p>

                    {/* Search Input */}
                    <div className="relative mt-4">
                        <Select
                            ref={selectRef}
                            options={tags}
                            menuPlacement="bottom"
                            components={customComponents}
                            styles={selectStyles}
                            className="text-xs sm:text-sm text-left"
                            placeholder="Search posts by tags? (e.g. coding, tech, anime, sports.....)"
                            isSearchable
                            onChange={(e) => {
                                setSearchTerm(e?.value);
                            }}
                        />

                        <button
                            onClick={() => {
                                selectRef.current.clearValue();
                                setSearchTerm("");
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 p-1 sm:p-1.5 rounded-full"
                        >
                            {searchTerm && (
                                <X className="text-white size-3 sm:size-4"></X>
                            )}
                            {!searchTerm && (
                                <Search className="text-white size-3 sm:size-4" />
                            )}
                        </button>
                    </div>

                    {/* Popular Tags */}
                    <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm pt-2">
                        <span className="text-neutral-400 font-medium">
                            Popular:
                        </span>
                        {tags?.map((tag, i) => {
                            if (i > 4) {
                                return;
                            }
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setTagValue(tag?.value);
                                        setSearchTerm(tag?.value);
                                    }}
                                    className="px-3 py-1 rounded-full bg-[#2D2E30] text-white cursor-pointer"
                                >
                                    {tag?.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
