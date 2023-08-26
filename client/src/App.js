import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import bg from './assets/bg.mp4';
import './App.css';

/** importing all routers*/
import Username from './components/Username';
import Register from './components/Register';
import Profile from './components/Profile';
import Password from './components/Password';
import PageNotFound from './components/PageNotFound';
import Recovery from './components/Recovery';
import Reset from './components/Reset';


/** auth middleware */
import { AuthorizeUser,ProtectRoute } from './middleware/auth';

/** Root Routers **/
const router = createBrowserRouter([
    {
        path: '/',
        element: <Username/>
    },
    {
        path: '/register',
        element: <Register/>
    },
    {
        path: '/profile',
        element: <AuthorizeUser><Profile/></AuthorizeUser>
    },
    {
        path: '/password',
        element: <ProtectRoute><Password/></ProtectRoute>
    },
    {
        path: '/recovery',
        element: <Recovery></Recovery>
    },
    {
        path: '/reset',
        element: <Reset></Reset>
    },
    {
        path: '*',
        element: <PageNotFound></PageNotFound>
    }
])

export default function App() {
    return (
        <>
            <video autoPlay loop muted className="bg-vid">
                <source src={bg} type="video/mp4" />
            </video>
            <main>
                <RouterProvider router={router}>
                </RouterProvider>
            </main>
        </>
    )
}
