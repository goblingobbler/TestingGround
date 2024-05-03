import { Navigate, Outlet } from 'react-router-dom';

import { UserValidator } from 'functions';

const AuthedRoutes = () => {
    let checker = new UserValidator();
    let is_logged_in = checker.logged_id();

    return is_logged_in ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthedRoutes;
