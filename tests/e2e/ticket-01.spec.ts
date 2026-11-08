import { expect, test } from "@playwright/test";

// T01 has no product web flow. This is a smoke test of the scaffold app in a real browser: it renders in
// Bahasa Indonesia, uses the design tokens, and claims nothing about sessions, payments or devices.
test("scaffold web app renders honestly in Bahasa Indonesia", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(e.message));

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("yravg HatchSystem");
  const note = page.getByRole("note");
  await expect(note).toContainText("Belum ada fitur produk");
  await expect(page.locator("body")).not.toContainText(/aktif|lunas|siap digunakan|terhubung/i);

  // Token wiring: the note background is the provisional brand tint from the design tokens (#F6E7DF).
  await expect(note).toHaveCSS("background-color", "rgb(246, 231, 223)");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(250, 249, 245)");

  await page.screenshot({ path: info.outputPath("scaffold-home.png"), fullPage: true });
  expect(errors).toEqual([]);
});
