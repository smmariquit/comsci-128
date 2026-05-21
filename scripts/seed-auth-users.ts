/**
 * seed-auth-users.ts
 *
 * Creates Supabase Auth entries for the beta-testing accounts.
 * Run once against your hosted Supabase project so that
 * the test logins actually work with `signInWithPassword()`.
 *
 * Usage:
 *   npx tsx scripts/seed-auth-users.ts
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Simple built-in parser for .env.local to avoid external 'dotenv' dependency
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) {
    return;
  }
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      // Remove surrounding quotes if any
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Beta-testing accounts
const testUsers = [
  { email: "student@tester.com", password: "student" },
  { email: "systemadmin@tester.com", password: "systemadmin" },
  { email: "housingadmin@tester.com", password: "housingadmin" },
  { email: "landlord@tester.com", password: "landlord" },
];

async function seed() {
  for (const user of testUsers) {
    // Check if auth user already exists
    const { data: existing } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    const alreadyExists = existing?.users?.some(
      (u) => u.email?.toLowerCase() === user.email.toLowerCase(),
    );

    if (alreadyExists) {
      console.log(`⏭️  Auth user already exists: ${user.email}`);
      continue;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true, // Skip email verification for test accounts
    });

    if (error) {
      console.error(`❌ Failed to create ${user.email}: ${error.message}`);
    } else {
      console.log(`✅ Created auth user: ${user.email} (id: ${data.user.id})`);
    }
  }

  console.log("\nDone! Test accounts are now usable with signInWithPassword().");
}

seed().catch(console.error);
