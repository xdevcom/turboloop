import { expect, test, type Page } from "@playwright/test";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const signupEmail = process.env.E2E_SIGNUP_EMAIL;
const password = process.env.E2E_PASSWORD;

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`${name} is required for E2E tests`);
  return value;
}

function captureBrowserErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

test("public landing interactions work without runtime errors", async ({ page, context }) => {
  const browserErrors = captureBrowserErrors(page);

  await page.goto("/");
  await expect(page).toHaveTitle(/TurboLoop/);
  await expect(page.getByRole("heading", { name: /Earn on TurboLoop/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Community Event" })).toBeVisible();
  await expect(page.getByAltText("Community meetup")).toBeVisible();

  await page.locator("#calc-amount").fill("200");
  await expect(page.getByText("Total Profit").locator("..").getByText("108 USDT")).toBeVisible();
  await expect(page.getByText("Total Return").locator("..").getByText("308 USDT")).toBeVisible();

  await page.locator("#calc-plan").click();
  await page.getByRole("option", { name: /Sprint Loop/ }).click();
  await expect(page.getByText("Total Profit").locator("..").getByText("6 USDT")).toBeVisible();
  await expect(page.getByText("Total Return").locator("..").getByText("206 USDT")).toBeVisible();

  const faq = page.getByRole("button", { name: "What is TurboLoop?", exact: true });
  await faq.click();
  await expect(
    page.getByText(/TurboLoop is a decentralized liquidity protocol on BNB Smart Chain/i),
  ).toBeVisible();

  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: new URL(page.url()).origin,
  });
  await page.getByRole("button", { name: "Copy", exact: true }).click();
  await expect(page.getByRole("button", { name: "Copied", exact: true })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("turboloop.io");

  await page.getByRole("button", { name: "Play What is TurboLoop" }).click();
  await expect(page.locator('iframe[title="What is TurboLoop"]')).toHaveAttribute(
    "src",
    /youtube\.com\/embed\/e7Hyq6rr_F8/,
  );

  await expect(browserErrors).toEqual([]);
});

test("mobile navigation is usable without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const browserErrors = captureBrowserErrors(page);

  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("link", { name: "Calculator", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Calculator", exact: true }).click();
  await expect(page).toHaveURL(/#calculator$/);

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  expect(browserErrors).toEqual([]);
});

test("Supabase public read is allowed while anonymous writes are blocked", async ({ request }) => {
  const url = requireEnv("SUPABASE_URL", supabaseUrl);
  const key = requireEnv("SUPABASE_PUBLISHABLE_KEY", supabaseKey);
  const headers = { apikey: key, Authorization: `Bearer ${key}` };

  const read = await request.get(`${url}/rest/v1/community_media?select=id&type=eq.image&limit=1`, {
    headers,
  });
  expect(read.ok(), await read.text()).toBeTruthy();

  const write = await request.post(`${url}/rest/v1/community_media`, {
    headers: { ...headers, Prefer: "return=minimal" },
    data: {
      type: "image",
      url: "https://invalid.example/e2e-must-not-be-created.webp",
      alt: "E2E anonymous write must be blocked",
      sort_order: 9999,
    },
  });
  expect([401, 403]).toContain(write.status());
});

test("email signup handles Supabase confirmation or rate limiting", async ({ page }) => {
  const email = requireEnv("E2E_SIGNUP_EMAIL", signupEmail);
  const secret = requireEnv("E2E_PASSWORD", password);
  const browserErrors = captureBrowserErrors(page);

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign up", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(secret);
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/auth/v1/signup") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Sign up", exact: true }).click();
  const response = await responsePromise;

  if (response.ok()) {
    await expect(
      page.getByText("Account created. You may need to confirm your email."),
    ).toBeVisible();
  } else {
    expect(response.status()).toBe(429);
    const body = (await response.json()) as { code?: string; message?: string };
    expect(body.code).toBe("over_email_send_rate_limit");
    await expect(page.locator("[data-sonner-toast]")).toContainText("email rate limit exceeded");
  }
  await expect(page).toHaveURL(/\/auth$/);
  expect(browserErrors.filter((error) => !error.includes("Failed to load resource"))).toEqual([]);
});

test("authenticated admin can create, publish, delete, and sign out", async ({ page }) => {
  const email = requireEnv("E2E_ADMIN_EMAIL", adminEmail);
  const secret = requireEnv("E2E_PASSWORD", password);
  const mediaAlt = `E2E community media ${email.split("@")[0]}`;
  const browserErrors = captureBrowserErrors(page);

  await page.goto("/admin/community");
  await expect(page).toHaveURL(/\/auth$/);
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(secret);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();

  await expect(page).toHaveURL(/\/admin\/community$/);
  await expect(page.getByRole("heading", { name: "Community Event Admin" })).toBeVisible();
  await expect(page.getByText("Current media (0)")).toBeVisible();

  await page.locator("#url").fill(new URL("/community-fallback-1.webp", page.url()).href);
  await page.locator("#alt").fill(mediaAlt);
  await page.locator("#sort").fill("-999");
  await page.getByRole("button", { name: "Add media" }).click();
  await expect(page.getByText("Media added")).toBeVisible();
  await expect(page.getByText(mediaAlt, { exact: true })).toBeVisible();
  await expect(page.getByText("Current media (1)")).toBeVisible();

  await page.getByRole("link", { name: "Site", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByAltText(mediaAlt)).toBeVisible();

  await page.goto("/admin/community");
  const mediaCard = page.getByText(mediaAlt, { exact: true }).locator("..");
  page.once("dialog", (dialog) => dialog.accept());
  await mediaCard.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Deleted")).toBeVisible();
  await expect(page.getByText(mediaAlt, { exact: true })).toHaveCount(0);
  await expect(page.getByText("Current media (0)")).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/auth$/);
  await page.goto("/admin/community");
  await expect(page).toHaveURL(/\/auth$/);
  expect(browserErrors).toEqual([]);
});
