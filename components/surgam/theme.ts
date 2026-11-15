import { Platform } from "react-native";

export const surgam = {
  colors: {
    ink: "#10211D",
    inkSoft: "#48615B",
    muted: "#6D817B",
    canvas: "#F6F8F5",
    surface: "#FFFFFF",
    surfaceTint: "#EAF5F0",
    border: "#DCE7E2",
    evergreen: "#147D6B",
    evergreenDark: "#0E5F52",
    mint: "#BFE9D6",
    mintSoft: "#E8F6EF",
    blueSoft: "#E7F0FA",
    blue: "#2F6BA8",
    amberSoft: "#FFF3D6",
    amber: "#A66A00",
    coralSoft: "#FDE9E5",
    coral: "#B94B3F",
    white: "#FFFFFF",
  },
  radii: {
    card: 24,
    control: 16,
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
      shadowColor: "#10211D",
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
