import api from './api';

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getRecentActivities = () => api.get('/dashboard/recent');
export const getDoctorStats = (doctorId) => api.get(`/dashboard/doctor/${doctorId}`);
