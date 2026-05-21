#!/usr/bin/env node

/**
 * Script to upload an Unsplash image to Supabase storage and update Makiling Residence Hall
 * Usage: node scripts/upload-makiling-image.js
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
  console.error("Please ensure these are set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  try {
    console.log("🏢 Uploading image for Makiling Residence Hall...\n");

    // Step 1: Fetch a suitable image from Unsplash (dorm/residence hall themed)
    console.log("📥 Fetching image from Unsplash...");
    const unsplashUrl =
      "https://api.unsplash.com/photos/random?query=university+dormitory+residence+hall&orientation=landscape&collections=1459749";
    const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY || "demo";

    let imageUrl;

    // If no API key, use a free royalty-free image URL
    if (unsplashAccessKey === "demo") {
      // Using a direct image URL (no API key needed)
      imageUrl =
        "https://images.unsplash.com/photo-1515565099519-c21a91e89b5e?w=1200&h=800&fit=crop";
      console.log("⚠️  Using demo image (no Unsplash API key configured)");
    } else {
      try {
        const response = await fetch(
          `${unsplashUrl}&client_id=${unsplashAccessKey}`,
        );
        const data = await response.json();
        imageUrl = data.urls.regular;
        console.log(`✅ Found image by ${data.user.name}`);
      } catch (err) {
        console.log("⚠️  Unsplash API fetch failed, using demo image");
        imageUrl =
          "https://images.unsplash.com/photo-1515565099519-c21a91e89b5e?w=1200&h=800&fit=crop";
      }
    }

    console.log(`📷 Image URL: ${imageUrl}\n`);

    // Step 2: Download the image
    console.log("⬇️  Downloading image...");
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    console.log(`✅ Downloaded ${(imageBuffer.length / 1024).toFixed(2)} KB\n`);

    // Step 3: Upload to Supabase Storage
    console.log("☁️  Uploading to Supabase Storage (dorm_images bucket)...");
    const fileName = `makiling-${Date.now()}.jpg`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("dorm_images")
      .upload(fileName, imageBuffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/jpeg",
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log(`✅ Uploaded as: ${uploadData.path}\n`);

    // Step 4: Get public URL
    console.log("🔗 Getting public URL...");
    const { data: publicUrlData } = supabase.storage
      .from("dorm_images")
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`✅ Public URL: ${publicUrl}\n`);

    // Step 5: Update housing record
    console.log("🔄 Updating Makiling Residence Hall record...");
    const { data: updatedHousing, error: updateError } = await supabase
      .from("housing")
      .update({ housing_image: publicUrl })
      .eq("housing_id", 1)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Update failed: ${updateError.message}`);
    }

    console.log(`✅ Updated housing record\n`);

    // Summary
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✨ SUCCESS! Image uploaded and linked\n");
    console.log(
      `Housing: ${updatedHousing.housing_name} (ID: ${updatedHousing.housing_id})`,
    );
    console.log(`Image URL: ${publicUrl}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    process.exit(1);
  }
}

main();
