import api from './api';

export const getDepartments = () => api.get('/departments');
export const seedDepartments = () => api.post('/departments/seed');
export const createDepartment = (data) => api.post('/departments', data);
export const updateDepartment = (id, data) => api.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);

const departmentService = {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
};

export default departmentService;
