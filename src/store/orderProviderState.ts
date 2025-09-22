// store/dashboardStore.ts
import { create } from "zustand";
import axios from "axios";

interface DashboardCounts {
  orderCount: number;
  serviceRequestCount: number;
  projectCount: number;
}

interface DashboardStore extends DashboardCounts {
  loading: boolean;
  fetchCounts: () => Promise<void>;
  setCounts: (counts: Partial<DashboardCounts>) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  orderCount: 0,
  serviceRequestCount: 0,
  projectCount: 0,
  loading: false,

  fetchCounts: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(
        "http://localhost/Git/Project1/Backend/GetCountsProvider.php",
        { withCredentials: true }
      );
      if (res.data.success) {
        set({
          orderCount: res.data.data.orderCount,
          serviceRequestCount: res.data.data.serviceRequestCount,
          projectCount: res.data.data.projectCount,
        });
      }
    } catch (err) {
      console.error("Failed to fetch counts", err);
    } finally {
      set({ loading: false });
    }
  },

  setCounts: (counts) => set((state) => ({ ...state, ...counts })),
}));
