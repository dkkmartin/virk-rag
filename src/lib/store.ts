import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Root } from '@/types/virk-response';

interface CVRStore {
  responses: Root[];
  addResponse: (response: Root) => void;
  removeResponse: (cvrnummer: string) => void;
  clearResponses: () => void;
}

const initialState: Pick<CVRStore, 'responses'> = {
  responses: [],
};

export const useCVRStore = create(
  persist<CVRStore>(
    (set) => ({
      ...initialState,
      addResponse: (response: Root) =>
        set((state) => {
          // Check if CVR number already exists
          const existingIndex = state.responses.findIndex(
            (existingResponse) =>
              existingResponse.data.stamdata?.cvrnummer === response.data.stamdata?.cvrnummer
          );

          // If CVR exists, move it to the top
          if (existingIndex !== -1) {
            const newResponses = [...state.responses];
            newResponses.splice(existingIndex, 1);
            return {
              responses: [state.responses[existingIndex], ...newResponses],
            };
          }

          // Add new response at the start of the array
          return {
            responses: [response, ...state.responses],
          };
        }),
      removeResponse: (cvrnummer: string) =>
        set((state) => ({
          responses: state.responses.filter(
            (response) => response.data.stamdata?.cvrnummer !== cvrnummer
          ),
        })),
      clearResponses: () => set(initialState),
    }),
    {
      name: 'cvr-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
