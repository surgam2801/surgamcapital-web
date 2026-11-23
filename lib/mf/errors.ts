/** Turns any error from the API into one plain sentence a non-technical user can act on. */
export function friendlyError(err: unknown, fallback = "Something went wrong. Please try again."): string {
  const e = err as { message?: string; data?: { code?: string } } | null;
  const msg = e?.message ?? "";
  if (!msg) return fallback;
  if (/fetch|network|Failed to|ECONN|timed? ?out|Load failed/i.test(msg)) return "We couldn't reach Surgam. Check your internet connection and try again.";
  if (e?.data?.code === "UNAUTHORIZED") return "Please sign in again to continue.";
  // Validation errors from the server arrive as JSON lists; show the first message only.
  if (msg.trim().startsWith("[")) {
    try {
      const first = JSON.parse(msg)[0];
      if (first?.message && !/^(Invalid|Expected|Required)/.test(first.message)) return first.message;
    } catch {
      // fall through
    }
    return "Please check the details you entered and try again.";
  }
  return msg;
}
