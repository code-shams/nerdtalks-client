import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import AuthProvider from "./contexts/Auth/AuthProvider";
import { ToastContainer } from "react-toastify";
import router from "./routes/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Step 1: Create the query client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ToastContainer></ToastContainer>
                <RouterProvider router={router}></RouterProvider>
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>
);
