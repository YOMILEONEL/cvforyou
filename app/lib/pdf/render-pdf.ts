import "server-only";

// Full `puppeteer` bundles its own Chromium download (~700 MB locally) —
// fine for local dev, but far too large for a Vercel serverless function.
// In production we use `puppeteer-core` with `@sparticuz/chromium`, a
// Chromium build compressed specifically to fit serverless size limits.
// Both branches use dynamic imports so the unused one is never touched.

type MinimalPage = {
  setContent: (html: string, options: { waitUntil: "load" }) => Promise<void>;
  pdf: (options: { format: "A4"; printBackground: boolean }) => Promise<Uint8Array>;
};

type MinimalBrowser = {
  newPage: () => Promise<MinimalPage>;
  close: () => Promise<void>;
};

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

async function launchBrowser(): Promise<MinimalBrowser> {
  if (isServerless) {
    const [{ default: chromium }, { default: puppeteerCore }] = await Promise.all([
      import("@sparticuz/chromium"),
      import("puppeteer-core"),
    ]);

    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    }) as unknown as MinimalBrowser;
  }

  const { default: puppeteer } = await import("puppeteer");
  return puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  }) as unknown as MinimalBrowser;
}

export async function renderPdf(html: string): Promise<Buffer> {
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
