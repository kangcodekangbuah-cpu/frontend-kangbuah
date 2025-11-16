import { create } from 'zustand';

const initialState = {
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Konfirmasi',
  cancelText: 'Batal',
  confirmVariant: 'danger',
  isLoading: false,
  onConfirm: () => {},
};

export const useModalStore = create((set) => ({
  ...initialState,

  
  openModal: (props) => {
    set({
      ...initialState, 
      ...props,        
      isOpen: true,   
    });
  },


  closeModal: () => {
    set(initialState);
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));