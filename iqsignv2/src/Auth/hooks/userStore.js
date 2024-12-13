import { create } from "zustand";

const useUserStore = create((set) => ({
  username: "", // Initial state
  setUsername: (newUsername) => set(() => ({ username: newUsername })), // Function to update username
}));

export default useUserStore;
