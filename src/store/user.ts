import { create } from 'zustand';
import { getCurrentUser } from '@/apis/user';
import { loginPath, router } from '@/routes';
import type { CurrentUser } from '@/types/user';

interface UserState {
  loading?: boolean;
  currentUser: CurrentUser;
  fetchCurrentUser: () => void;
  clearCurrentUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  loading: false,
  currentUser: { permissions: [] },
  fetchCurrentUser: async () => {
    try {
      set({ loading: true });
      const { data } = await getCurrentUser();
      set({ currentUser: data, loading: false });
    } catch {
      set({ loading: false });
      router.navigate(loginPath, { replace: true });
    }
  },
  clearCurrentUser: () => set({ currentUser: { permissions: [] } }),
}));
