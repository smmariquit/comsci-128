/**
 * check authorization header
 * verifies token with supabase
 * return user if valid or error if not
 */

import type { NextRequest } from "next/server";
import { supabase } from "./supabase";
import { createSupabaseServerClient } from "./server-client";

export async function authenticate(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Access denied. No token provided." };
  }

  const token = authHeader.split(" ")[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { error: "Invalid token." };
  }

  return { user: data.user };
}

export async function getManagerAccountNumber(): Promise<number | null> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("user")
    .select("account_number")
    .eq("uuid", user.id)
    .single()

  return data?.account_number ?? null
}