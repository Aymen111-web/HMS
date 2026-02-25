import api from './api';

export const getAppointments = () => api.get('/appointments');
export const createAppointment = (appointmentData) => api.post('/appointments', appointmentData);
export const updateAppointmentStatus = (id, status) => api.patch(`/appointments/${id}`, { status });
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
