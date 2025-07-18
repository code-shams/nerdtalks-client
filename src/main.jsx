import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import AuthProvider from "./contexts/Auth/AuthProvider";
import { ToastContainer } from "react-toastify";
import router from "./routes/router";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <ToastContainer></ToastContainer>
            <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
    </StrictMode>
);
