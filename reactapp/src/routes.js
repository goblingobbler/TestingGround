import { Login, Logout, Landing } from 'pages';

const routes = [
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/logout',
        element: <Logout />,
    },
    {
        path: '/',
        children: [
            {
                index: true,
                path: '',
                element: <Landing />,
            },
        ],
    },
];

export default routes;
