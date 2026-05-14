import { Tables, TablesInsert, Enums } from "@/app/types/database.types";

export type Feedback = Tables<"feedback">;
export type NewFeedback = TablesInsert<"feedback">;
export type FeedbackType = Enums<"FeedbackType">;