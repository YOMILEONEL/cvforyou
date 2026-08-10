import type { Metadata } from "next";

import { EditorClient } from "@/app/(app)/editor/editor-client";

export const metadata: Metadata = {
  title: "Editor – CVio",
};

export default function EditorPage() {
  return <EditorClient />;
}
