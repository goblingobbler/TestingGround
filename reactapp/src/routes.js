import { Login, Logout, Landing, AllProjects, Gears } from 'pages';

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
    {
        path: '/all_projects',
        element: <AllProjects />,
    },
    {
        path: '/gears',
        element: <Gears />,
    },
];

export default routes;
