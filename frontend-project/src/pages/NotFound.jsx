import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found-page">
            <h2>404 - Page Not Found</h2>
            <Link to="/">Go back to Dashboard</Link>
        </div>
    );
};

export default NotFound;
