import { Hash, Search, Tag, TrendingUp } from "lucide-react";
import React from "react";

const AllTags = ({ allTagsProps }) => {
    const { searchTerm, setSearchTerm, tagsData: tags } = allTagsProps;

    //? Handle tag selection
    const handleTagClick = (tagName) => {
        const newSelectedTag = searchTerm === tagName ? "" : tagName;
        setSearchTerm(newSelectedTag);
    };

    //? Clear all filters
    const handleClearFilters = () => {
        setSearchTerm("");
    };

    //? Get tag color based on popularity or index
    const getTagColor = (index, isPopular = false) => {
        const colors = [
            "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30",
            "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30",
            "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30",
            "bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30",
            "bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30",
            "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30",
            "bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/30",
            "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30",
        ];

        if (isPopular) {
            return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30";
        }

        return colors[index % colors.length];
    };

    if (!tags || tags.length === 0) {
        return (
            <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-6 text-center">
                <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="size-8 text-neutral-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                    No Tags Available
                </h3>
                <p className="text-neutral-400 text-sm">
                    Tags will appear here as posts are created with different
                    categories.
                </p>
            </div>
        );
    }

    //? Sort tags by usage count or alphabetically
    const sortedTags = [...tags].sort((a, b) => {
        if (a.usageCount !== undefined && b.usageCount !== undefined) {
            if (b.usageCount !== a.usageCount) {
                return b.usageCount - a.usageCount; // Most used first
            }
        }
        return a.name.localeCompare(b.name); // Alphabetical fallback
    });

    return (
        <div className="space-y-4 pri-font">
            {/* Header */}
            <div className="">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Hash className="size-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-white">
                                Browse by Tags
                            </h2>
                            <p className="text-neutral-400 text-sm">
                                Discover posts by category
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-neutral-400">
                            <span className="font-medium text-blue-400">
                                {tags.length}
                            </span>{" "}
                            tags available
                        </span>

                        {searchTerm && (
                            <button
                                onClick={handleClearFilters}
                                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors text-xs"
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Active Filter Display */}
                {searchTerm && (
                    <div className=" sm:mt-4 pt-4 border-t border-neutral-800">
                        <div className="flex items-center gap-2">
                            <Search className="size-4 text-blue-400" />
                            <span className="text-sm text-neutral-400">
                                Filtering by:
                            </span>
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                                {searchTerm}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* All Tags Section */}
            <div className="">
                <div className="flex items-center gap-2 mb-4">
                    <Tag className="size-5 text-neutral-400" />
                    <h3 className="text-lg font-semibold text-white">
                        All Categories
                    </h3>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {sortedTags.map((tag, index) => (
                        <button
                            key={tag._id}
                            onClick={() => handleTagClick(tag.name)}
                            className={`px-2 py-1 sm:px-4 sm:py-2.5 rounded-lg border transition-all duration-200 text-xs sm:text-sm font-medium hover:scale-105 ${
                                searchTerm === tag.name
                                    ? "bg-blue-500/30 text-blue-200 border-blue-400 ring-2 ring-blue-500/20"
                                    : getTagColor(index)
                            }`}
                            title={tag.description} // Show description on hover
                        >
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-sm">{tag.icon}</span>
                                <span>#{tag.name}</span>
                                {tag.usageCount > 0 && (
                                    <span className="text-xs opacity-75 bg-black/20 px-1.5 py-0.5 rounded-full">
                                        {tag.usageCount}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
                <p className="text-neutral-400 text-xs sm:text-sm mt-3">
                    <span className="text-blue-400 font-medium">💡 Tip:</span>{" "}
                    Click on any tag to filter posts by category. Click again to
                    remove the filter.
                </p>
            </div>
        </div>
    );
};

export default AllTags;
