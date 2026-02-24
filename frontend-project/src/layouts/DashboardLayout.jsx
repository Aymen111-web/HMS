import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <Navbar />
            <div className="layout-body">
                <Sidebar />
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
