import { createBrowserRouter, Outlet }from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import Home from "./features/interview/pages/home";
import Interview from "./features/interview/pages/interview";


export const router = createBrowserRouter([
    {
        element: (
            <AuthProvider>
                <Outlet />
            </AuthProvider>
        ),
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/",
                element: <Protected><Home /></Protected>
            },
            {
                path: "/interview/:interviewId",
                element: <Protected><Interview /></Protected>
            }
        ]
    }
])