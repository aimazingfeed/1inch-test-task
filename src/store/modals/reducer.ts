import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Modals, ModalsInitialState, ModalState } from 'types';

const initialState: ModalsInitialState = {
  modalState: {
    activeModal: Modals.init,
    txHash: '',
    open: false,
  },
};

export const modalsReducer = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setActiveModal: (state, action: PayloadAction<Partial<ModalState>>) => ({
      ...state,
      modalState: {
        ...state.modalState,
        ...action.payload,
      },
    }),

    closeModal: (state) => ({
      ...state,
      modalState: {
        activeModal: Modals.init,
        txHash: '',
        open: false,
      },
    }),
  },
});

export const { setActiveModal } = modalsReducer.actions;

export default modalsReducer.reducer;
