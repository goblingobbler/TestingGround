import { AuthedRoutes, AdminRoutes, Login, logout } from 'pages';

const routes = [
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/logout',
        element: <logout />,
    },
    {
        path: '/',
        element: <AuthedRoutes />,
        children: [
            {
                index: true,
                path: '',
                element: <div>Hello world!</div>,
            },
        ],
    },
    {
        path: '/admin',
        element: <AdminRoutes />,
        children: [
            {
                index: true,
                path: '',
                element: <div>Hello admin!</div>,
            },
        ],
    },
];

export default routes;
