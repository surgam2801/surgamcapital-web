import { Platform } from "react-native";

export const surgam = {
  colors: {
    // Mature palette (2026-11): Surgam's teal, shifted toward blue and deepened;
    // neutral cool greys instead of tinted ones; accents muted.
    ink: "#0E1A22",
    inkSoft: "#3E4C56",
    muted: "#6A7781",
    canvas: "#F6F7F9",
    surface: "#FFFFFF",
    surfaceTint: "#EFF3F5",
    border: "#E1E6EB",
    evergreen: "#0F6168", // primary
    evergreenDark: "#0A3F45",
    mint: "#A9CDD0",
    mintSoft: "#EAF2F3",
    blueSoft: "#EBF1F7",
    blue: "#2C5D8F",
    amberSoft: "#FBF3E4",
    amber: "#8A5A0B",
    coralSoft: "#FBECE9",
    coral: "#A8443A",
    white: "#FFFFFF",
    navy: "#0B1E2A", // dark bands (hero, footer)
    gain: "#147A55",
    loss: "#B23A31",
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
