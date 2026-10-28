import { chromium } from "playwright";
import { mkdirSync } from "fs";

const outDir = "/opt/cursor/artifacts/screenshots";
mkdirSync(outDir, { recursive: true });

const baseUrl = process.env.LOGO_ORDER_URL || "http://127.0.0.1:3001/";
const EXPECTED = [
  "LinkedIn",
  "Gmail",
  "WhatsApp",
  "Outlook",
  "Google Agenda",
  "Outlook Calendar",
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.locator(".logos").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);

const labels = await page.locator(".logo-row span").evaluateAll((spans) =>
  spans.map((s) => {
    const img = s.querySelector("img");
    const text = s.textContent?.trim() || "";
    return { label: text, src: img?.getAttribute("src") || "" };
  })
);

console.log({ labels: labels.map((l) => l.label), srcs: labels.map((l) => l.src) });

const orderOk = labels.length === EXPECTED.length && labels.every((l, i) => l.label === EXPECTED[i]);
if (!orderOk) process.exitCode = 1;

const outlookMailIdx = labels.findIndex((l) => l.label === "Outlook");
const outlookCalIdx = labels.findIndex((l) => l.label === "Outlook Calendar");
if (!labels[outlookMailIdx]?.src.includes("outlook.svg") || labels[outlookCalIdx]?.src.includes("outlook.svg")) {
  console.error("Outlook mail/calendar logo paths swapped or wrong");
  process.exitCode = 1;
}
if (labels[outlookCalIdx]?.src && !labels[outlookCalIdx].src.includes("outlook-calendar")) {
  console.error("Outlook Calendar should use outlook-calendar.svg");
  process.exitCode = 1;
}

await page.locator(".logos .logo-row").screenshot({ path: `${outDir}/integration-logos-row.png`, timeout: 8000 });
await browser.close();
