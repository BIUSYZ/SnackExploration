import { create } from 'zustand';
import { api } from './api';

export interface Snack {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  listType: 'red' | 'black';
  description?: string;
  price?: number;
  category?: string;
  location?: string;
  createdAt?: string;
}

interface SnackStore {
  snacks: Snack[];
  loading: boolean;
  fetchSnacks: (type: 'red' | 'black') => Promise<void>;
  addSnack: (snack: Omit<Snack, 'id'>) => Promise<void>;
  deleteSnack: (id: string) => Promise<void>;
}

export const useSnackStore = create<SnackStore>((set) => ({
  snacks: [],
  loading: false,
  fetchSnacks: async (type) => {
    set({ loading: true });
    try {
      const response = await api.get('/snacks', { params: { filter: type } });
      if (response.data.success) {
        set({ snacks: response.data.data });
      }
    } catch (error) {
      console.error('Fetch snacks failed:', error);
    } finally {
      set({ loading: false });
    }
  },
  addSnack: async (snackData) => {
    try {
      const response = await api.post('/snacks', snackData);
      if (response.data.success) {
        // Refresh current list after add (simpler than manual update)
        // Or we could manually add it to state
      }
    } catch (error) {
      console.error('Add snack failed:', error);
      throw error;
    }
  },
  deleteSnack: async (id) => {
    try {
      const response = await api.delete(`/snacks/${id}`);
      if (response.data.success) {
        set((state) => ({ snacks: state.snacks.filter((s) => s.id !== id) }));
      }
    } catch (error) {
      console.error('Delete snack failed:', error);
    }
  },
}));
