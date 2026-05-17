import { supabase } from "@/lib/supabase"
import type { Feedback, NewFeedback, FeedbackType } from "@/lib/models/feedback"

type SortFilterColumns = "subject" | "feedback_type" | "category" | "created_at" | "status";

type SortOrder = {
    column: SortFilterColumns,
    isAscending: boolean
};

type FilterOptions = {
    column: SortFilterColumns,
    value: string
}

async function create(content: NewFeedback): Promise<NewFeedback | null> {
    const { data, error } = await supabase
        .from("feedback")
        .insert(content)
        .select("*");

    if (error) {
        throw new Error(`Error creating feedback: ${error.message}`);
    }

    return data && data.length > 0 ? data[0] : null;
}

async function findById(feedbackId: number): Promise<Feedback | null> {
    const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("id", feedbackId);

    if (error) throw new Error(`Find Feedback by ID Error: ${error.message}`);

    return data && data.length > 0 ? data[0] : null;
}

async function getAll(sortList: SortOrder[], filterList: FilterOptions[]): Promise<Partial<Feedback>[]> {
    // get all feedbacks in the system (sysadmin view)

    let query = supabase
        .from("feedback")
        .select("*");

    sortList.forEach(item => {
        query = query.order(item.column, { ascending: item.isAscending });
    });

    filterList.forEach(filter => {
        query = query.eq(filter.column, filter.value);
    });

    const { data, error } = await query;

    if (error) throw new Error(`Get All Feedback Error: ${error.message}`);

    return data || [];
}

async function getAllByManagerId(managerId: number): Promise<Partial<Feedback>[]> {
    // get the feedback associated with the provided manager ID

    const { data, error } = await supabase
        .from("feedback")
        .select("id, text, feedback_type, category, created_at, status")
        .eq("involved_manager_id", managerId)
        .eq("feedback_type", "Manager");

    if (error) throw new Error(`Get All Feedback by Manager ID Error: ${error.message}`);

    return data || [];
}

async function getAllByHousingId(housingId: number): Promise<Partial<Feedback>[]> {
    // get the feedback associated with the provided housing ID

    const { data, error } = await supabase
        .from("feedback")
        .select("id, text, feedback_type, category, created_at, status")
        .eq("involved_housing_id", housingId)
        .eq("feedback_type", "Housing");

    if (error) throw new Error(`Get All Feedback by housing ID Error: ${error.message}`);

    return data || [];
}

async function getAllAppFeedback(): Promise<Partial<Feedback>[]> {
    // get the feedbacks for the application

    const { data, error } = await supabase
        .from("feedback")
        .select("id, text, feedback_type, category, created_at, status")
        .eq("feedback_type", "App");

    if (error) throw new Error(`Get All Application Feedback Error: ${error.message}`);

    return data || [];
}

async function getOwnFeedbacks(userId: number): Promise<Partial<Feedback>[]> {
    // get the feedbacks of a user by their account number
    
    const { data, error } = await supabase
        .from("feedback")
        .select("id, text, feedback_type, category, created_at, status")
        .eq("account_number", userId);

    if (error) throw new Error(`Get All Feedbacks of User Error: ${error.message}`);
    
    return data || [];
}

async function updateStatus(feedbackId: number, newStatus: string): Promise<Partial<Feedback> | null> {
    const { data, error } = await supabase
        .from("feedback")
        .update({ status: newStatus })
        .eq("id", feedbackId)
        .select("id, text, feedback_type, category, created_at, status");

    if (error) throw new Error(`Update Feedback Status Error: ${error.message}`);

    return data && data.length > 0 ? data[0] : null;
}

export const feedbackData = {
	create,
	findById,
    getAll,
	getAllByManagerId,
	getAllByHousingId,
    getAllAppFeedback,
    getOwnFeedbacks,
    updateStatus
}