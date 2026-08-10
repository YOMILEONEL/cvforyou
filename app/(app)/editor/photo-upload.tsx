"use client";

import { useRef, useState } from "react";

import { createClient } from "@/app/lib/supabase/client";

type PhotoUploadProps = {
  resumeId: string;
  value: string;
  onChange: (url: string) => void;
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function PhotoUpload({ resumeId, value, onChange }: PhotoUploadProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setErrorMessage("Bitte wähle eine Bilddatei aus.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setStatus("error");
      setErrorMessage("Das Foto darf höchstens 5 MB groß sein.");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("error");
      setErrorMessage("Nicht angemeldet.");
      return;
    }

    const extension = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${resumeId}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("resume-photos")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      setStatus("error");
      setErrorMessage("Upload fehlgeschlagen. Bitte versuche es erneut.");
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("resume-photos").getPublicUrl(path);
    setStatus("idle");
    onChange(publicUrlData.publicUrl);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 flex-none items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-ink/30 bg-paper dark:border-ink-dark/30 dark:bg-paper-dark">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-ink/30 dark:text-ink-dark/30">Foto</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
            className="border border-ink/30 px-3 py-1.5 text-sm font-medium text-ink disabled:cursor-not-allowed disabled:opacity-60 dark:border-ink-dark/30 dark:text-ink-dark"
          >
            {status === "uploading" ? "Lädt hoch …" : value ? "Foto ersetzen" : "Foto hochladen"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-sm text-rust hover:underline"
            >
              Entfernen
            </button>
          )}
        </div>
        <p className="text-xs text-ink/50 dark:text-ink-dark/50">
          Wird nur in Vorlagen mit Foto angezeigt (nicht bei &bdquo;Klassisch&ldquo;). Max. 5 MB.
        </p>
        {status === "error" && <p className="text-xs text-rust">{errorMessage}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelected}
          className="hidden"
        />
      </div>
    </div>
  );
}
