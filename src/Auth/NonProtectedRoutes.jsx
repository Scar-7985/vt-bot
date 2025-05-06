import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './Define';

const NonProtectedRoutes = () => {
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default NonProtectedRoutes;
