"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getDictionary } from "@/app/lib/i18n/get-dictionary";
import { createClient } from "@/app/lib/supabase/server";

export type AuthState = { error?: string } | undefined;

export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const dict = await getDictionary();
  const loginSchema = z.object({
    email: z.string().trim().email({ message: dict.auth.errors.invalidEmail }),
    password: z.string().min(1, { message: dict.auth.errors.passwordRequired }),
  });

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.auth.errors.genericInvalid };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: dict.auth.errors.invalidLogin };
  }

  redirect("/dashboard");
}

export async function register(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const dict = await getDictionary();
  const registerSchema = z.object({
    name: z.string().trim().min(2, { message: dict.auth.errors.nameRequired }),
    email: z.string().trim().email({ message: dict.auth.errors.invalidEmail }),
    password: z.string().min(8, { message: dict.auth.errors.passwordTooShort }),
    confirmPassword: z.string(),
  });

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? dict.auth.errors.genericInvalid };
  }

  if (parsed.data.password !== parsed.data.confirmPassword) {
    return { error: dict.auth.errors.passwordMismatch };
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
        ? dict.auth.errors.userExists
        : error.code === "over_email_send_rate_limit"
          ? dict.auth.errors.rateLimited
          : dict.auth.errors.registerFailed;
    return { error: message };
  }

  // If e-mail confirmation is enabled in the Supabase project, signUp
  // succeeds but returns no session yet, send the user to login instead.
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
