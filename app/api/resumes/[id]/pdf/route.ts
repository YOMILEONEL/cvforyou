import { NextResponse } from "next/server";

import { renderPdf } from "@/app/lib/pdf/render-pdf";
import { renderResumeHtml } from "@/app/lib/pdf/render-resume-html";
import { getResume } from "@/app/lib/resumes";

function sanitizeFilename(title: string): string {
  const cleaned = title
    .trim()
    .replace(/[^a-zA-Z0-9äöüÄÖÜß\- ]/g, "")
    .replace(/\s+/g, "-");
  return cleaned || "lebenslauf";
}

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const resume = await getResume(id);

  const html = renderResumeHtml(resume.data, resume.sectionMeta, resume.templateName);
  const pdf = await renderPdf(html);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${sanitizeFilename(resume.title)}.pdf"`,
    },
  });
}
