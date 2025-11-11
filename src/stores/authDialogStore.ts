import { create } from 'zustand';

/**
 * Auth action types for login and register flows
 */
export enum AuthLoginRegisterAction {
  LOGIN = 'login',
  REGISTER = 'register',
}

/**
 * Auth dialog store state interface
 */
interface AuthDialogState {
  /**
   * Whether the auth dialog is open
   */
  isOpen: boolean;

  /**
   * Current auth action (login or register)
   */
  action: AuthLoginRegisterAction;

  /**
   * Open the dialog with a specific action
   * @param action - The auth action to perform
   */
  openDialog: (action: AuthLoginRegisterAction) => void;

  /**
   * Close the dialog
   */
  closeDialog: () => void;

  /**
   * Switch between login and register actions
   * @param action - The action to switch to
   */
  setAction: (action: AuthLoginRegisterAction) => void;
}

/**
 * Zustand store for managing auth dialog state
 *
 * This store manages:
 * - Dialog open/close state
 * - Current action (login or register)
 * - Switching between login and register flows
 */
export const useAuthDialogStore = create<AuthDialogState>((set) => ({
  isOpen: false,
  action: AuthLoginRegisterAction.LOGIN,

  openDialog: (action) => set({ isOpen: true, action }),

  closeDialog: () => set({ isOpen: false }),

  setAction: (action) => set({ action }),
}));
