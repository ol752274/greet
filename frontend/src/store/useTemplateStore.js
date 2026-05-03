import { create } from 'zustand';

const useTemplateStore = create((set) => ({
  templates: [],
  activeCategory: 'All',
  loading: false,
  setTemplates: (templates) => set({ templates }),
  setCategory: (cat) => set({ activeCategory: cat }),
  setLoading: (loading) => set({ loading }),
}));

export default useTemplateStore;
