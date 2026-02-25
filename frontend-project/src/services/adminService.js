import api from './api';

export const getAdminAnalytics = () => api.get('/admin/analytics');
export const getAllUsers = () => api.get('/admin/users');
export const toggleUserStatus = (id, role, status) => api.patch(`/admin/users/${id}/status`, { role, status });

const adminService = {
    getAdminAnalytics,
    getAllUsers,
    toggleUserStatus
};

export default adminService;
