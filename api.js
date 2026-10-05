import axios from 'axios';

const API_BASE = '/api/employees';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all employees with optional filters
export const getEmployees = async (params = {}) => {
  const response = await api.get('/', { params });
  return response.data;
};

// Get dashboard stats
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

// Get single employee by ID
export const getEmployee = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

// Create new employee
export const createEmployee = async (data) => {
  const response = await api.post('/', data);
  return response.data;
};

// Update employee
export const updateEmployee = async (id, data) => {
  const response = await api.put(`/${id}`, data);
  return response.data;
};

// Delete employee
export const deleteEmployee = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export default api;
