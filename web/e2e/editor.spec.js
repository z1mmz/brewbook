import { test, expect } from "@playwright/test";

function collectErrors(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  return errors;
}

async function openHarness(page) {
  await page.goto("/e2e/harness.html");
  const editor = page.locator(".lexical-input");
  await expect(editor).toBeVisible();
  return editor;
}

test("mounts and types text", async ({ page }) => {
  const errors = collectErrors(page);
  const editor = await openHarness(page);

  await editor.click();
  await page.keyboard.type("Hello brew");
  await expect(editor).toContainText("Hello brew");
  await expect(page.getByTestId("serialized")).toContainText("Hello brew");

  expect(errors).toEqual([]);
});

test("applies bold formatting", async ({ page }) => {
  const editor = await openHarness(page);
  await editor.click();
  await page.keyboard.type("Strong words");
  await page.keyboard.press("ControlOrMeta+a");
  await page.getByRole("button", { name: "Bold" }).click();
  await expect(editor.locator("strong")).toHaveText("Strong words");
  await expect(page.getByTestId("serialized")).toContainText('"format":1');
});

test("converts block types", async ({ page }) => {
  const editor = await openHarness(page);
  await editor.click();
  await page.keyboard.type("Section title");

  await page.getByLabel("Block type").selectOption("h1");
  await expect(editor.locator("h1")).toHaveText("Section title");
  await expect(page.getByTestId("serialized")).toContainText('"tag":"h1"');

  await page.getByLabel("Block type").selectOption("quote");
  await expect(editor.locator("blockquote")).toContainText("Section title");

  await page.getByLabel("Block type").selectOption("paragraph");
  await expect(editor.locator("p")).toContainText("Section title");
});

test("creates lists and code blocks", async ({ page }) => {
  const editor = await openHarness(page);
  await editor.click();
  await page.keyboard.type("First item");
  await page.getByRole("button", { name: "Bullet list" }).click();
  await expect(editor.locator("ul li")).toContainText("First item");

  await page.getByRole("button", { name: "Code block" }).click();
  await expect(editor.locator("code")).toContainText("First item");
});

test("creates a numbered list", async ({ page }) => {
  const editor = await openHarness(page);
  await editor.click();
  await page.keyboard.type("Step one");
  await page.getByRole("button", { name: "Numbered list" }).click();
  await expect(editor.locator("ol li")).toContainText("Step one");
});

test("applies text alignment", async ({ page }) => {
  const editor = await openHarness(page);
  await editor.click();
  await page.keyboard.type("Centered");
  await page.getByRole("button", { name: "Align center" }).click();
  await expect(editor.locator("p")).toHaveCSS("text-align", "center");
});

test("toolbar select resists form input styles", async ({ page }) => {
  await openHarness(page);
  const select = page.locator(".lexical-toolbar .tb-select");
  const toolbar = page.locator(".lexical-toolbar");
  const selectBox = await select.boundingBox();
  const toolbarBox = await toolbar.boundingBox();

  expect(selectBox.width).toBeLessThan(toolbarBox.width / 2);
  await expect(select).toHaveCSS("padding-top", "0px");
});

test("adds a link to selected text and renders it", async ({ page }) => {
  const errors = collectErrors(page);
  const editor = await openHarness(page);

  await editor.click();
  await page.keyboard.type("Source article");
  await page.keyboard.press("ControlOrMeta+a");
  await page.getByRole("button", { name: "Insert link" }).click();
  await page.getByLabel("Link URL").fill("example.com/source");
  await page.getByRole("button", { name: "Apply link" }).click();

  const link = editor.locator("a");
  await expect(link).toHaveText("Source article");
  await expect(link).toHaveAttribute("href", "https://example.com/source");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(page.getByTestId("serialized")).toContainText('"type":"link"');
  await expect(page.locator("#renderer .lexical-readonly a")).toHaveText(
    "Source article"
  );

  expect(errors).toEqual([]);
});

test("removes a link", async ({ page }) => {
  const editor = await openHarness(page);

  await editor.click();
  await page.keyboard.type("Source article");
  await page.keyboard.press("ControlOrMeta+a");
  await page.getByRole("button", { name: "Insert link" }).click();
  await page.getByLabel("Link URL").fill("example.com/source");
  await page.getByRole("button", { name: "Apply link" }).click();
  await expect(editor.locator("a")).toHaveCount(1);

  await editor.click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.getByRole("button", { name: "Edit link" }).click();
  await page.getByRole("button", { name: "Remove link" }).click();

  await expect(editor.locator("a")).toHaveCount(0);
  await expect(editor).toContainText("Source article");
});

test("auto-links a typed URL and renders it", async ({ page }) => {
  const errors = collectErrors(page);
  const editor = await openHarness(page);

  await editor.click();
  await page.keyboard.type("Read more at https://example.com/guide ");
  await expect(editor).toContainText("Read more at");

  const link = editor.locator('a[href="https://example.com/guide"]');
  await expect(link).toHaveText("https://example.com/guide");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noreferrer");
  await expect(page.getByTestId("serialized")).toContainText('"type":"autolink"');

  await expect(
    page.locator('#renderer .lexical-readonly a[href="https://example.com/guide"]')
  ).toHaveCount(1);

  expect(errors).toEqual([]);
});

test("undo and redo", async ({ page }) => {
  const editor = await openHarness(page);
  await editor.click();
  await page.keyboard.type("Draft");

  const undo = page.getByRole("button", { name: "Undo" });
  const redo = page.getByRole("button", { name: "Redo" });
  await expect(undo).toBeEnabled();
  await undo.click();
  await expect(editor).not.toContainText("Draft");
  await expect(redo).toBeEnabled();
  await redo.click();
  await expect(editor).toContainText("Draft");
});

test("renders serialized value read-only", async ({ page }) => {
  const errors = collectErrors(page);
  await openHarness(page);
  await page.getByRole("button", { name: "Load preset" }).click();

  const editor = page.locator(".lexical-input");
  await expect(editor).toContainText("Loaded from storage");

  const renderer = page.locator("#renderer .lexical-readonly");
  await expect(renderer).toContainText("Loaded from storage");
  await expect(renderer).toHaveAttribute("contenteditable", "false");

  expect(errors).toEqual([]);
});
