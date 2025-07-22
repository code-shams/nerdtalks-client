import { createBrowserRouter } from "react-router";
import Homepage from "../pages/Home/Homepage";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/Auth/LoginPage/LoginPage";
import SignInPage from "../pages/Auth/SignInPage/SignInPage";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/Dashboard/Profile/Profile";
import AddPost from "../pages/Dashboard/Profile/Posts/AddPost";
import MyPosts from "../pages/Dashboard/Profile/Posts/MyPosts";

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
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <DashboardLayout></DashboardLayout>
            </PrivateRoute>
        ),
        children: [
            {
                path: "/dashboard",
                element: (
                    <PrivateRoute>
                        <Profile></Profile>
                    </PrivateRoute>
                ),
            },
            {
                path: "/dashboard/add-post",
                element: (
                    <PrivateRoute>
                        <AddPost></AddPost>
                    </PrivateRoute>
                ),
            },
            {
                path: "/dashboard/my-posts",
                element: (
                    <PrivateRoute>
                        <MyPosts></MyPosts>
                    </PrivateRoute>
                ),
            },
        ],
    },
]);

export default router;
