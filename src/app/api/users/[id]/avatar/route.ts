import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/server-client";
import { createClient } from "@supabase/supabase-js";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verify auth using the standard client
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create an admin client to bypass RLS for bucket creation and profile update
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Ensure bucket exists (ignores error if it does)
    await supabaseAdmin.storage.createBucket("avatars", { public: true });

    const fileExt = file.name.split(".").pop();
    const filePath = `${id}-${Date.now()}.${fileExt}`;

    // Upload using admin client
    const { error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload avatar" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Update user profile using admin client
    const { error: updateError } = await supabaseAdmin
      .from("user")
      .update({ profile_picture: urlData.publicUrl })
      .eq("account_number", parseInt(id));

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile picture" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: urlData.publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
