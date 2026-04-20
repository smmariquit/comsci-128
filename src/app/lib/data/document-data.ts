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