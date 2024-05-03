import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import routes from './routes';

import { ContextLoader } from 'pages';

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root')).render(
    <ContextLoader>
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    </ContextLoader>,
);
