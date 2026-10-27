import { beforeEach, describe, expect, it, vi } from "vitest";

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke } },
}));

import { getAdminNotificationEmails, sendEmail } from "./sendEmail";

describe("admin email alerts", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    });
    invoke.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("always includes the official inbox even with local extra recipients", () => {
    localStorage.setItem("motokah_admin_notification_emails", JSON.stringify(["extra@example.com"]));
    expect(getAdminNotificationEmails()).toEqual(["motokahafrica@gmail.com", "extra@example.com"]);
  });

  it("does not report success when the function skips an email", async () => {
    invoke.mockResolvedValue({ data: { skipped: true, reason: "missing key" }, error: null });
    expect(await sendEmail({ toEmail: "motokahafrica@gmail.com", subject: "Test", html: "Test" })).toBe(false);
  });

  it("reports acceptance by the email provider", async () => {
    invoke.mockResolvedValue({ data: { sent: true }, error: null });
    expect(await sendEmail({ toEmail: "motokahafrica@gmail.com", subject: "Test", html: "Test" })).toBe(true);
  });
});
