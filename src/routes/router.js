import { createBrowserRouter } from "react-router";
import Homepage from "../pages/Home/Homepage";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/Auth/LoginPage/LoginPage";
import SignInPage from "../pages/Auth/SignInPage/SignInPage";
import AuthLayout from "../layouts/AuthLayout";
const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: Homepage,
            },
        ],
    },
    {
        path: "/auth",
        Component: AuthLayout,
        children: [
            {
                path: "/auth/login",
                Component: LoginPage,
            },
            {
                path: "/auth/signin",
                Component: SignInPage,
            },
        ],
    },
]);

export default router;
