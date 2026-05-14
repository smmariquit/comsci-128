import { supabase } from "@/lib/supabase"
import type { Feedback, NewFeedback, FeedbackType } from "@/lib/models/feedback"

async function create(content: NewFeedback): Promise<Feedback | null> {
    const { data, error } = await supabase
        .from("feedback")
        .insert(content)
        .select("*");

    if (error) {
        throw new Error(`Error creating feedback: ${error.message}`);
    }

    return data[0];
}