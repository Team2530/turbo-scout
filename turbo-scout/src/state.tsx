import { create } from 'zustand';

/**
 * This file handles state management over the entire frontend application.
 * 
 * TODO: Store state in localstorage instead of in memory to prevent data loss
 *  --> https://github.com/pmndrs/zustand?tab=readme-ov-file#persist-middleware
 */

export interface TurboStore {
    entries: any[];
    addEntry: (entry: any) => any[];
}

export const useTurboStore = create<TurboStore>((set: any) => ({
    entries: [],
    addEntry: (entry: any) => set((state: TurboStore) => ({ 
        ...state,
        entries: [...state.entries, entry] 
    }))
}));