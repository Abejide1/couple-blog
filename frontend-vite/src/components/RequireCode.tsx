import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCouple } from '../contexts/CoupleContext';

interface RequireCodeProps {
    children: React.ReactNode;
}

const RequireCode: React.FC<RequireCodeProps> = ({ children }) => {
    const { coupleCode } = useCouple();
    const location = useLocation();

    if (!coupleCode) {
        // Redirect to the code entry page, but save the current page
        // so we can redirect back after entering the code
        return <Navigate to="/code" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default RequireCode;
