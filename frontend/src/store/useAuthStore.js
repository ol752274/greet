import { create } from 'zustand';
import { api, normalizeUser } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('wc_token') || null,
  loading: true,

  setAuth: (token, user) => {
    localStorage.setItem('wc_token', token);
    set({ token, user: normalizeUser(user), loading: false });
  },

  setUser: (user) => set({ user: normalizeUser(user) }),

  logout: () => {
    localStorage.removeItem('wc_token');
    set({ user: null, token: null });
  },

  init: async () => {
    const token = localStorage.getItem('wc_token');
    if (!token) { set({ loading: false }); return; }
    try {
      const data = await api.me();
      set({ user: normalizeUser(data.user), loading: false });
    } catch {
      localStorage.removeItem('wc_token');
      set({ user: null, token: null, loading: false });
    }
  },
}));

export default useAuthStore;
