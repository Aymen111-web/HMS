import api from './api';

export const getAppointments = () => api.get('/appointments');
export const getDoctorAppointments = (doctorId) => api.get(`/appointments/doctor/${doctorId}`);
export const createAppointment = (appointmentData) => api.post('/appointments', appointmentData);
export const updateAppointment = (id, updateData) => api.patch(`/appointments/${id}`, updateData);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
