import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { surgam } from "./theme";

export interface SupportedLanguage {
  code: string;
  name: string;
  native: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "ar", name: "Arabic", native: "العربية" },
];

export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const [currentLang, setCurrentLang] = useState("en");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    // Read current language from googtrans cookie if present
    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-zA-Z-]+)/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }

    // Ensure Google Translate library script is dynamically injected if not already loaded
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    }

    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        try {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi,ta,te,bn,mr,gu,kn,ml,pa,ur,es,fr,de,ar,zh-CN,ja",
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element"
          );
        } catch {
          // ignore re-init errors
        }
      }
    };

    if ((window as any).google && (window as any).google.translate) {
      (window as any).googleTranslateElementInit();
    }
  }, []);

  const selectLanguage = (code: string) => {
    if (Platform.OS !== "web" || typeof document === "undefined") return;

    setCurrentLang(code);
    setOpen(false);

    // Set Google translate cookie
    const host = window.location.hostname;
    const isDomain = host.includes(".");
    document.cookie = `googtrans=/en/${code}; path=/;`;
    if (isDomain) {
      document.cookie = `googtrans=/en/${code}; path=/; domain=.${host};`;
    }

    // Trigger select change if google combo is in DOM
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event("change"));
    } else {
      // Reload page to apply cookie
      window.location.reload();
    }
  };

  if (Platform.OS !== "web") {
    return null;
  }

  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <View style={styles.wrapper}>
      {/* Hidden container for Google's native translate widget element */}
      <View
        // @ts-ignore
        nativeID="google_translate_element"
        id="google_translate_element"
        style={styles.googleElement}
      />

      {/* Styled Surgam Pill Trigger */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Select language"
        onPress={() => setOpen(!open)}
        style={({ pressed }) => [
          styles.pillButton,
          compact && styles.pillButtonCompact,
          open && styles.pillButtonActive,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.globeIcon}>🌐</Text>
        <Text style={styles.pillText}>{compact ? activeLangObj.native : `${activeLangObj.native} (${activeLangObj.name})`}</Text>
        <Text style={styles.chevronIcon}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      {/* Language Selection Dropdown Menu */}
      {open && (
        <View style={styles.dropdown}>
          <Text style={styles.dropdownTitle}>Translate with Google</Text>
          <View style={styles.langList}>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <Pressable
                  key={lang.code}
                  onPress={() => selectLanguage(lang.code)}
                  style={({ pressed }) => [
                    styles.langItem,
                    isSelected && styles.langItemSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.langItemCopy}>
                    <Text style={[styles.langNative, isSelected && styles.langTextSelected]}>{lang.native}</Text>
                    <Text style={styles.langName}>{lang.name}</Text>
                  </View>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 9999,
  },
  googleElement: {
    display: "none",
  },
  pillButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: surgam.colors.surface,
    borderWidth: 1,
    borderColor: surgam.colors.border,
  },
  pillButtonCompact: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillButtonActive: {
    borderColor: surgam.colors.evergreen,
    backgroundColor: surgam.colors.mintSoft,
  },
  globeIcon: {
    fontSize: 14,
  },
  pillText: {
    color: surgam.colors.ink,
    fontSize: 13,
    fontWeight: "700",
  },
  chevronIcon: {
    color: surgam.colors.muted,
    fontSize: 9,
    marginLeft: 2,
  },
  dropdown: {
    position: "absolute",
    top: 42,
    right: 0,
    width: 220,
    maxHeight: 320,
    backgroundColor: surgam.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: surgam.colors.border,
    padding: 10,
    shadowColor: "#10211D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    zIndex: 10000,
  },
  dropdownTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: surgam.colors.muted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: surgam.colors.border,
    marginBottom: 6,
  },
  langList: {
    gap: 4,
  },
  langItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  langItemSelected: {
    backgroundColor: surgam.colors.mintSoft,
  },
  langItemCopy: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  langNative: {
    color: surgam.colors.ink,
    fontSize: 13,
    fontWeight: "700",
  },
  langName: {
    color: surgam.colors.muted,
    fontSize: 11,
  },
  langTextSelected: {
    color: surgam.colors.evergreenDark,
    fontWeight: "800",
  },
  checkMark: {
    color: surgam.colors.evergreen,
    fontWeight: "900",
    fontSize: 13,
  },
  pressed: {
    opacity: 0.7,
  },
});
