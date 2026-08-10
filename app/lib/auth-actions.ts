"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/app/lib/supabase/server";

export type AuthState = { error?: string } | undefined;

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Bitte gib eine gültige E-Mail-Adresse ein." }),
  password: z.string().min(1, { message: "Bitte gib dein Passwort ein." }),
});

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "E-Mail oder Passwort ist falsch." };
  }

  redirect("/dashboard");
}

const registerSchema = z.object({
  name: z.string().trim().min(2, { message: "Bitte gib deinen Namen ein." }),
  email: z.string().trim().email({ message: "Bitte gib eine gültige E-Mail-Adresse ein." }),
  password: z.string().min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." }),
});

export async function register(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.name } },
  });

  if (error) {
    const message =
      error.code === "user_already_exists"
        ? "Für diese E-Mail existiert bereits ein Konto."
        : error.code === "over_email_send_rate_limit"
          ? "Zu viele Registrierungsversuche in kurzer Zeit. Bitte warte ein paar Minuten und versuche es erneut."
          : "Registrierung fehlgeschlagen. Bitte versuche es erneut.";
    return { error: message };
  }

  // If e-mail confirmation is enabled in the Supabase project, signUp
  // succeeds but returns no session yet — send the user to login instead.
  if (data.session) {
    redirect("/dashboard");
  }
  redirect("/login?registered=1");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
