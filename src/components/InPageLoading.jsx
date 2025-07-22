import React from "react";

const InPageLoading = () => {
    return (
        <div className="min-h-screen bg-neutral-900 p-4 sm:p-6 contain">
            <div className="max-w-4xl mx-auto">
                <div className="bg-[#121212] rounded-2xl border border-neutral-800 p-6 sm:p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-neutral-700 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-neutral-700 rounded w-1/4"></div>
                                <div className="h-3 bg-neutral-700 rounded w-1/6"></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-8 bg-neutral-700 rounded w-3/4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-neutral-700 rounded"></div>
                                <div className="h-4 bg-neutral-700 rounded"></div>
                                <div className="h-4 bg-neutral-700 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InPageLoading;
