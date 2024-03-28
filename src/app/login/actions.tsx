"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { LoginInput } from "./page";
import { SignupInput } from "../signup/page";

export async function login(data: LoginInput) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(data);
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(data: SignupInput) {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp(data);
  if (error) {
    console.error(error);
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
