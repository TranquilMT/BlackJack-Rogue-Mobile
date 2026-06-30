import { toast } from 'sonner';

// Define the interface for the Steam Service
export interface ISteamService {
  isAuthenticated: () => boolean;
  unlockAchievement: (achievementId: string) => Promise<void>;
  getLeaderboard: () => Promise<any[]>;
  saveCloudData: (data: any) => Promise<void>;
  loadCloudData: () => Promise<any>;
}

// Mock implementation
class MockSteamService implements ISteamService {
  isAuthenticated() {
    console.log("MockSteamService: Checking auth status...");
    return true; // Always authenticated in mock mode
  }

  async unlockAchievement(achievementId: string) {
    console.log(`MockSteamService: Unlocking achievement ${achievementId}`);
    toast.success(`[Steam Mock] Achievement Unlocked: ${achievementId}`);
    // In a real implementation, this would call the Steamworks API
    return Promise.resolve();
  }

  async getLeaderboard() {
    console.log("MockSteamService: Fetching leaderboard...");
    return Promise.resolve([
      { name: "Player1", score: 1000 },
      { name: "Player2", score: 850 },
      { name: "You", score: 700 },
    ]);
  }

  async saveCloudData(data: any) {
    console.log("MockSteamService: Saving cloud data...", data);
    localStorage.setItem('steam_cloud_save', JSON.stringify(data));
    return Promise.resolve();
  }

  async loadCloudData() {
    console.log("MockSteamService: Loading cloud data...");
    const data = localStorage.getItem('steam_cloud_save');
    return Promise.resolve(data ? JSON.parse(data) : null);
  }
}

// Real implementation (placeholder for future)
class RealSteamService implements ISteamService {
  isAuthenticated() {
    // This would check if the Steam overlay is active or if the user is logged in via Steam
    return false; 
  }

  async unlockAchievement(achievementId: string) {
    // Call Steamworks API here
    console.log("RealSteamService: Unlocking achievement", achievementId);
  }

  async getLeaderboard() {
    // Call Steamworks API here
    return [];
  }

  async saveCloudData(data: any) {
    // Call Steamworks API here
  }

  async loadCloudData() {
    // Call Steamworks API here
    return null;
  }
}

// Factory to get the correct service
export const getSteamService = (): ISteamService => {
  const hasApiKey = !!process.env.STEAM_API_KEY;
  if (hasApiKey) {
    return new RealSteamService();
  }
  return new MockSteamService();
};
