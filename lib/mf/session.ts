import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "surgam_investor_token";

export async function getInvestorToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") return typeof localStorage === "undefined" ? null : localStorage.getItem(KEY);
    return await SecureStore.getItemAsync(KEY);
  } catch {
    return null;
  }
}

export async function setInvestorToken(token: string) {
  if (Platform.OS === "web") localStorage.setItem(KEY, token);
  else await SecureStore.setItemAsync(KEY, token);
}

export async function clearInvestorToken() {
  try {
    if (Platform.OS === "web") localStorage.removeItem(KEY);
    else await SecureStore.deleteItemAsync(KEY);
  } catch {
    // ignore
  }
}
