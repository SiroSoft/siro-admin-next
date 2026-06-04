import api from './api';
export const serverService = {
  getInfo: () => api.get('/api/server/info').then(res => res.data.data),
};
