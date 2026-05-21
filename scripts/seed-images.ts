import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Run with --env-file=.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const housingImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1de2d9d0cb?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
];

const avatarImages = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&q=80",
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80",
];

async function ensureBucket(bucketName: string) {
  const { data, error } = await supabase.storage.getBucket(bucketName);
  if (error || !data) {
    console.log(`Creating bucket ${bucketName}...`);
    await supabase.storage.createBucket(bucketName, { public: true });
  }
}

async function uploadImageFromUrl(url: string, bucket: string, path: string) {
  console.log(`Downloading ${url}...`);
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();

  console.log(`Uploading to ${bucket}/${path}...`);
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, {
      contentType: res.headers.get("content-type") || "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.error(`Error uploading to ${path}:`, error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  return publicUrlData.publicUrl;
}

async function main() {
  await ensureBucket("user-avatar");
  await ensureBucket("housing-images");

  const { data: users, error: userErr } = await supabase
    .from("user")
    .select("account_number");
  if (userErr) throw userErr;

  console.log(`Found ${users?.length || 0} users. Uploading avatars...`);
  if (users) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const imgUrl = avatarImages[i % avatarImages.length];
      const path = `avatar_${user.account_number}.jpg`;

      const publicUrl = await uploadImageFromUrl(imgUrl, "user-avatar", path);
      if (publicUrl) {
        await supabase
          .from("user")
          .update({ profile_picture: publicUrl })
          .eq("account_number", user.account_number);
        console.log(`Updated user ${user.account_number}`);
      }
    }
  }

  const { data: housings, error: housingErr } = await supabase
    .from("housing")
    .select("housing_id");
  if (housingErr) throw housingErr;

  console.log(
    `Found ${housings?.length || 0} housings. Uploading housing images...`,
  );
  if (housings) {
    for (let i = 0; i < housings.length; i++) {
      const housing = housings[i];
      const imgUrl = housingImages[i % housingImages.length];
      const path = `housing_${housing.housing_id}.jpg`;

      const publicUrl = await uploadImageFromUrl(
        imgUrl,
        "housing-images",
        path,
      );
      if (publicUrl) {
        await supabase
          .from("housing")
          .update({ housing_image: publicUrl })
          .eq("housing_id", housing.housing_id);
        console.log(`Updated housing ${housing.housing_id}`);
      }
    }
  }

  console.log("Image seed complete!");
}

main().catch(console.error);
