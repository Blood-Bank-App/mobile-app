import { UserProfile } from "@/lib/types";
import * as SecureStore from "expo-secure-store";

export const userManager = {
  async setUser(user: UserProfile) {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
  },
  async getUser() {
    const data = await SecureStore.getItemAsync('user');
    return data ? JSON.parse(data) : null;
  },
  async clearUser() {
    await SecureStore.deleteItemAsync('user');
  }
};
