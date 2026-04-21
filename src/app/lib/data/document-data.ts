import { supabase } from "@/lib/supabase"
import type { Document, NewDocument, UpdateDocument } from "@/lib/models/document"

async function create(documentContent: Document): Promise<NewDocument> {
	const { data, error } = await supabase
		.from("document")
		.insert(documentContent)
		.select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
}

async function findById(documentId: number) {
	const { data, error } = await supabase
		.from("document")
		.select()
		.eq("document_id", documentId)
		.eq("is_deleted", false);

    if (error) throw new Error(`Find User by ID Error: ${error.message}`);

    return data && data.length > 0 ? data[0] : null;
}