import { Navigate, Outlet } from 'react-router-dom';

import { UserValidator } from 'functions';

const AdminRoutes = () => {
    let checker = new UserValidator();
    let is_staff = checker.is_staff();

    return is_staff ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;
