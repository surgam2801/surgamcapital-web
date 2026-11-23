import { Platform } from "react-native";

/** Inter on web (loaded from Google Fonts); the platform system font on native. */
export const F = Platform.OS === "web" ? "Inter, 'Segoe UI', system-ui, -apple-system, sans-serif" : undefined;

let loaded = false;
export function loadWebFonts() {
  if (Platform.OS !== "web" || loaded || typeof document === "undefined") return;
  loaded = true;
  const pre = document.createElement("link");
  pre.rel = "preconnect";
  pre.href = "https://fonts.gstatic.com";
  pre.crossOrigin = "anonymous";
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
  document.head.append(pre, css);
  const style = document.createElement("style");
  style.textContent = "body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-feature-settings:'cv11','ss01';}";
  document.head.append(style);
}
