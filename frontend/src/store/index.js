import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
      return false;
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
  updateProfile: async (formData) => {
    try {
      const response = await api.post('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}));

export const useInventoryStore = create((set, get) => ({
  items: [],
  categories: [],
  locations: [],
  isLoading: false,
  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/inventory');
      set({ items: res.data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },
  fetchMasterData: async () => {
    try {
      const res = await api.get('/master-data');
      set({ categories: res.data.categories, locations: res.data.locations });
    } catch (err) {
      console.error(err);
    }
  },
  addCategory: async (name) => {
    try {
      const res = await api.post('/master-data/category', { name });
      get().fetchMasterData();
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  addLocation: async (name) => {
    try {
      const res = await api.post('/master-data/location', { name });
      get().fetchMasterData();
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  deleteCategory: async (id) => {
    try {
      await api.delete(`/master-data/category/${id}`);
      get().fetchMasterData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  deleteLocation: async (id) => {
    try {
      await api.delete(`/master-data/location/${id}`);
      get().fetchMasterData();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  addItem: async (itemData) => {
    try {
      const res = await api.post('/inventory', itemData);
      get().fetchItems();
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  updateItem: async (id, itemData) => {
    try {
      const res = await api.put(`/inventory/${id}`, itemData);
      get().fetchItems();
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  deleteItem: async (id) => {
    try {
      await api.delete(`/inventory/${id}`);
      get().fetchItems();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}));

export const useDashboardStore = create((set) => ({
  stats: null,
  isLoading: false,
  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/dashboard/stats');
      set({ stats: res.data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  }
}));
