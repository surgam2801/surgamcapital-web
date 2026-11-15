import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { surgam } from "@/components/surgam/theme";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: surgam.colors.evergreen,
        tabBarInactiveTintColor: surgam.colors.muted,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: true,
        tabBarStyle: isWide ? { display: "none" } : {
          paddingTop: 7,
          paddingBottom: bottomPadding,
          height: 64 + bottomPadding,
          backgroundColor: surgam.colors.surface,
          borderTopColor: surgam.colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarIcon: ({ color, focused }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: focused ? "home" : "home-outline",
            investments: focused ? "pie-chart" : "pie-chart-outline",
            plans: focused ? "repeat" : "repeat-outline",
            help: focused ? "help-circle" : "help-circle-outline",
          };
          return <Ionicons name={icons[route.name] ?? "ellipse-outline"} size={23} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Overview" }} />
      <Tabs.Screen name="investments" options={{ title: "Investments" }} />
      <Tabs.Screen name="plans" options={{ title: "Plans" }} />
      <Tabs.Screen name="help" options={{ title: "Help" }} />
    </Tabs>
  );
}
