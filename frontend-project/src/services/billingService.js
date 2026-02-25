import api from './api';

export const getAllPayments = () => api.get('/payments');
export const getBillingStats = () => api.get('/payments/stats');
export const updatePaymentStatus = (id, status) => api.patch(`/payments/${id}`, { status });
export const generateInvoice = (id) => api.get(`/payments/${id}/invoice`, { responseType: 'blob' });
