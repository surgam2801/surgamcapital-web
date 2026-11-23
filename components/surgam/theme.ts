import { Platform } from "react-native";

/**
 * Colour scales (Refactoring UI style): 50 lightest → 900 darkest, picked once.
 * Components use the role names in `surgam.colors`, never raw hex.
 * Text pairs checked for WCAG AA (≥4.5:1); input outlines ≥3:1.
 */
export const scales = {
  grey: { 50: "#F6F7F9", 100: "#EFF2F5", 200: "#E1E6EB", 300: "#C5CED6", 400: "#7E8B96", 500: "#5B6873", 600: "#3E4C56", 700: "#2A3741", 800: "#1A2730", 900: "#0E1A22" },
  teal: { 50: "#EAF2F3", 100: "#CFE2E4", 200: "#A9CDD0", 300: "#7BB0B5", 400: "#4A9097", 500: "#22747B", 600: "#0F6168", 700: "#0C5157", 800: "#0A3F45", 900: "#072D31" },
  navy: { 700: "#1E3442", 800: "#132836", 900: "#0B1E2A" },
  onDark: { strong: "#FFFFFF", body: "#B4C2CB", muted: "#9FB0BB", accent: "#8FB7BB", rule: "#1E3442" },
  green: { 50: "#EAF6EE", 600: "#1A7F37", 700: "#146C2E" },
  red: { 50: "#FCEDEB", 600: "#B42318", 700: "#912018" },
  amber: { 50: "#FBF3E4", 700: "#8A5A0B" },
  blue: { 50: "#EBF1F7", 700: "#2C5D8F" },
};

export const surgam = {
  colors: {
    ink: scales.grey[900],
    inkSoft: scales.grey[600],
    muted: scales.grey[500], // 5.3:1 on the page background
    canvas: scales.grey[50],
    surface: "#FFFFFF",
    surfaceTint: scales.grey[100],
    border: scales.grey[200], // dividers only
    borderStrong: scales.grey[400], // input and control outlines (3.5:1)
    borderHover: scales.grey[300],
    evergreen: scales.teal[600], // primary
    evergreenDark: scales.teal[800],
    mint: scales.teal[200],
    mintSoft: scales.teal[50],
    blueSoft: scales.blue[50],
    blue: scales.blue[700],
    amberSoft: scales.amber[50],
    amber: scales.amber[700],
    coralSoft: scales.red[50],
    coral: scales.red[600],
    white: "#FFFFFF",
    navy: scales.navy[900], // dark bands (hero, footer)
    navyRule: scales.navy[700],
    onDark: scales.onDark.strong,
    onDarkBody: scales.onDark.body,
    onDarkMuted: scales.onDark.muted,
    onDarkAccent: scales.onDark.accent,
    gain: scales.green[600],
    gainSoft: scales.green[50],
    loss: scales.red[600],
    lossSoft: scales.red[50],
  },
  radii: {
    card: 12,
    control: 8,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 44,
  },
  shadow: Platform.select({
    web: { boxShadow: "0px 10px 30px rgba(16, 33, 29, 0.06)" },
    default: {
      shadowColor: "#10201F",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.06,
      shadowRadius: 18,
      elevation: 3,
    },
  }),
};

export type SurgamIconName =
  | "home"
  | "investments"
  | "plans"
  | "help"
  | "plus"
  | "arrow-up"
  | "arrow-down"
  | "chevron"
  | "bell"
  | "check"
  | "phone"
  | "chat"
  | "document"
  | "calendar"
  | "close"
  | "shield"
  | "settings";
