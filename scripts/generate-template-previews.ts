// Renders one representative template per style with placeholder data and
// screenshots it to public/template-previews/. Re-run whenever a layout in
// app/lib/pdf/render-resume-html.ts changes: `npm run generate:previews`.
import { mkdirSync } from "fs";
import path from "path";

import puppeteer from "puppeteer";

import { previewResumeData, previewSectionMeta } from "@/app/lib/preview-resume";
import { renderResumeHtml } from "@/app/lib/pdf/render-resume-html";
import type { TemplateStyle } from "@/app/lib/templates";

const REPRESENTATIVE_TEMPLATE: Record<TemplateStyle, string> = {
  Minimalistisch: "Berlin",
  Modern: "Lissabon",
  Kreativ: "Kyoto",
  Klassisch: "München",
};

function slugify(style: string): string {
  return style
    .toLowerCase()
    .replace(/ü/g, "ue")
    .replace(/ö/g, "oe")
    .replace(/ä/g, "ae");
}

async function main() {
  const outDir = path.resolve("./public/template-previews");
  mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

  try {
    for (const [style, templateName] of Object.entries(REPRESENTATIVE_TEMPLATE)) {
      const html = renderResumeHtml(previewResumeData, previewSectionMeta, templateName);
      const page = await browser.newPage();
      await page.setViewport({ width: 794, height: 1000, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: "load" });
      const outPath = path.join(outDir, `${slugify(style)}.png`);
      await page.screenshot({ path: outPath as `${string}.png`, type: "png" });
      await page.close();
      console.log("Generated", outPath);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
