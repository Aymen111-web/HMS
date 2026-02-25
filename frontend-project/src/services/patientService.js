import api from './api';

export const getPatientProfile = (id) => api.get(`/patients/${id}`);
export const updatePatientProfile = (id, data) => api.put(`/patients/${id}`, data);
export const getPatientMedicalRecords = (patientId) => api.get(`/medical-records/patient/${patientId}`);
export const getPatientLabReports = (patientId) => api.get(`/lab-reports/patient/${patientId}`);
export const getPatientPayments = (patientId) => api.get(`/payments/patient/${patientId}`);
export const getPatientPrescriptions = (patientId) => api.get(`/prescriptions/patient/${patientId}`);
export const getPatientAppointments = (patientId) => api.get(`/appointments/patient/${patientId}`);
export const createAppointment = (data) => api.post('/appointments', data);
export const cancelAppointment = (id) => api.patch(`/appointments/${id}`, { status: 'Cancelled' });

// Admin/Staff Actions
export const getPatients = () => api.get('/patients');
export const createPatient = (data) => api.post('/patients', data);
export const deletePatient = (id) => api.delete(`/patients/${id}`);
