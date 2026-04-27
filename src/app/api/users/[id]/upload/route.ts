import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const docType = formData.get("docType"); // e.g., "ID_PHOTO" or "PROOF_OF_PAYMENT"

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        //Upload to Supabase Storage
        const filePath = `${id}/${Date.now()}_${file.name}`;
        const { data: storageData, error: storageError } = await supabase.storage
            .from("student-docs")
            .upload(filePath, file);

        if (storageError) throw storageError;

        //Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from("student-docs")
            .getPublicUrl(filePath);

        //Update Database 
        const { error: dbError } = await supabase
            .from("application")
            .update({ document_url: publicUrl, document_type: docType })
            .eq("student_account_number", id);

        if (dbError) throw dbError;

        return NextResponse.json({ message: "Upload successful!", url: publicUrl });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}