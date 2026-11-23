import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { surgam } from "@/components/surgam/theme";
import { F } from "./fonts";

type Toast = { id: number; message: string; actionLabel?: string; onAction?: () => void; onExpire?: () => void };
type Ctx = { show: (t: Omit<Toast, "id"> & { durationMs?: number }) => void };

const ToastContext = createContext<Ctx>({ show: () => {} });
const c = surgam.colors;

/**
 * Bottom toasts. Used for "Undo" on non-money actions instead of "Are you sure?" pop-ups.
 * `onExpire` runs if the user does not press the action before the toast goes away.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const current = useRef<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  const finish = useCallback((acted: boolean) => {
    if (timer.current) clearTimeout(timer.current);
    const t = current.current;
    current.current = null;
    if (t && !acted) t.onExpire?.();
    setToast(null);
  }, []);

  const show: Ctx["show"] = useCallback(
    ({ durationMs = 6000, ...t }) => {
      finish(false); // a new toast commits the previous pending action
      const next = { ...t, id: Date.now() };
      current.current = next;
      setToast(next);
      timer.current = setTimeout(() => finish(false), durationMs);
    },
    [finish],
  );

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast ? (
        <View pointerEvents="box-none" style={[s.wrap, { bottom: Math.max(insets.bottom, 16) + 8 }]}>
          <View style={s.toast} accessibilityRole="alert" accessibilityLiveRegion="polite">
            <Text style={s.text}>{toast.message}</Text>
            {toast.actionLabel ? (
              <Pressable accessibilityRole="button" hitSlop={10} onPress={() => { toast.onAction?.(); finish(true); }} style={s.action}>
                <Text style={s.actionText}>{toast.actionLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const s = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, alignItems: "center", paddingHorizontal: 16, zIndex: 100 },
  toast: { flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: c.navy, borderRadius: 10, paddingLeft: 18, paddingRight: 6, minHeight: 52, maxWidth: 520, width: "100%" },
  text: { fontFamily: F, color: c.white, fontSize: 15, flex: 1, paddingVertical: 12 },
  action: { minHeight: 44, minWidth: 64, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  actionText: { fontFamily: F, color: c.onDarkAccent, fontSize: 15, fontWeight: "600" },
});
