import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../services/api';


// interface UserPayload {
//   sub: string;
//   role: 'ADMIN' | 'CUSTOMER';
//   username: string;
//   email: string;
// }

export const useAuthStore = create((set) => ({
    accessToken: null,
    user: null,
    authStatus: 'loading',

    setToken: (token) => {
        try {
            const decodedUser = jwtDecode(token);
            set({ accessToken: token, user: decodedUser, authStatus: 'authenticated' });

            localStorage.setItem('role', decodedUser.role);
        } catch (error) {
            console.error("Gagal mendekode token:", error);
            useAuthStore.getState().clearAuth();
        }
    },

    clearAuth: () => {
        set({ accessToken: null, user: null, authStatus: 'unauthenticated' });
        localStorage.removeItem('role');
        localStorage.removeItem('token');
    },

    logout: async () => {
        try {
            if (useAuthStore.getState().accessToken) {
                await apiClient.post('/auth/logout');
            }
        } catch (error) {
            console.error("Error saat logout di backend:", error);
        } finally {
            useAuthStore.getState().clearAuth();
        }
    },
}));
