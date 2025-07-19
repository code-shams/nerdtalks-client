import React from "react";

const Loading = () => {
    return (
        <div className="flex flex-col w-full items-center justify-center min-h-screen">
            <div className="min-h-14 min-w-14 sm:min-h-20 sm:w-20 border-y-5 border-white rounded-full animate-spin"></div>
            <h1 className="sec-font text-sm sm:text-base font-bold mt-2">Loading</h1>
        </div>
    );
};

export default Loading;
