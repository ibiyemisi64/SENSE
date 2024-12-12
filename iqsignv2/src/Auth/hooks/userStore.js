import { create } from "zustand";

const useUserStore = create((set) => ({
  username: "jasonsilva2202@gmail.com", // Initial state
  setUsername: (newUsername) => set(() => ({ username: newUsername })), // Function to update username
}));

export default useUserStore;
