import { createBrowserRouter } from "react-router";
import Homepage from "../pages/Home/Homepage";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/Auth/LoginPage/LoginPage";
import SignInPage from "../pages/Auth/SignInPage/SignInPage";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/Dashboard/Profile/Profile";
import PostDetails from "../pages/Home/Posts/PostDetails";
import Loading from "../shared/Navbar/Loading/Loading";
import axios from "axios";
import AddPost from "../pages/Dashboard/Posts/AddPost";
import MyPosts from "../pages/Dashboard/Posts/MyPosts";
import AllComments from "../pages/Dashboard/Comments/AllComments";
import MembershipPage from "../pages/MembershipPage/MembershipPage";

const serverURL = import.meta.env.VITE_SERVER_URL;
const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        loader: () => fetch(`${serverURL}/announcements`),
        HydrateFallback: Loading,
        children: [
            {
                index: true,
                Component: Homepage,
            },
            {
                path: "/post/:id",
                Component: PostDetails,
            },
            {
                path: "/membership",
                element: (
                    <PrivateRoute>
                        <MembershipPage></MembershipPage>
                    </PrivateRoute>
                ),
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
            {
                path: "/dashboard/comments/:postId",
                element: (
                    <PrivateRoute>
                        <AllComments></AllComments>
                    </PrivateRoute>
                ),
            },
        ],
    },
]);

export default router;
