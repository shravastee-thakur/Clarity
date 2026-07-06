import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      email: null,
      userInfo: null,
      accessToken: null,
      isVerified: false,
      workspaceRole: null,
      workspaceStatus: null,
      activeWorkspaceId: null,

      setUserEmail: (email) => set({ email: email }),
      setUserInfo: (info) => set({ userInfo: info }),
      setAccessToken: (token) => set({ accessToken: token }),
      setIsVerified: (status) => set({ isVerified: status }),
      setWorkspaceRole: (role) => set({ workspaceRole: role }),
      setWorkspaceStatus: (status) => set({ workspaceStatus: status }),
      setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),

      clearAuth: () =>
        set({
          email: null,
          userInfo: null,
          accessToken: null,
          isVerified: false,
          workspaceRole: null,
          workspaceStatus: null,
          activeWorkspaceId: null,
        }),
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        email: state.email,
        userInfo: state.userInfo,
        isVerified: state.isVerified,
        workspaceRole: state.workspaceRole,
        workspaceStatus: state.workspaceStatus,
        activeWorkspaceId: state.activeWorkspaceId,
      }),
    },
  ),
);
