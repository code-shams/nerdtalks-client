import { createBrowserRouter } from "react-router";
import Homepage from "../pages/Home/Homepage";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/Auth/LoginPage/LoginPage";
import SignInPage from "../pages/Auth/SignInPage/SignInPage";
const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: Homepage,
            },
            {
                path: "/login",
                Component: LoginPage,
            },
            {
                path: "/signin",
                Component: SignInPage,
            },
        ],
    },
]);

export default router;
