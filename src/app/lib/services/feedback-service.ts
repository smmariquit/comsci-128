import { feedbackData } from "../data/feedback-data";
import { validateAction, validateOwnership } from "./authorization-service";
import { AppAction } from "../models/permissions";
import { Feedback } from "../models/feedback";

const createFeedback = async (feedbackDetails: any) => {
    try {
        return await feedbackData.create(feedbackDetails);
    } catch (error) {
        console.error("Service Error (createFeedback): ", error);
        throw new Error("Failed to create feedback");
    }
};

const findFeedbackById = async (feedbackId: number) => {
    try {
        return await feedbackData.findById(feedbackId);
    } catch (error) {
        console.error("Service Error (findFeedbackById): ", error);
        throw new Error("Failed to retrieve feedback");
    }
};

const fetchAllFeedback = async (): Promise<Partial<Feedback>[]> => {
    try {
        const feedbacks = await feedbackData.getAll([], []);
        return feedbacks.map((feedback) => ({
                id: feedback.id,
                text: feedback.text,
                feedback_type: feedback.feedback_type,
                category: feedback.category,
                created_at: feedback.created_at,
                status: feedback.status,
        }));
    } catch (error) {   
        console.error("Service Error (fetchAllFeedback): ", error);
        return [];
    }
}

const getAllByManagerId = async (managerId: number, sortList: any[] = [], filterList: any[] = []) => {
    try {
        return await feedbackData.getAllByManagerId(managerId, sortList, filterList);
    } catch (error) {
        console.error("Service Error (getAllByManagerId): ", error);
        return [];
    }
}

const getAllByHousingId = async (housingId: number, sortList: any[] = [], filterList: any[] = []) => {
    try {
        return await feedbackData.getAllByHousingId(housingId, sortList, filterList);
    } catch (error) {
        console.error("Service Error (getAllByHousingId): ", error);
        return [];
    }
}

export const feedbackService = {
    createFeedback,
    findFeedbackById,
    fetchAllFeedback,
    getAllByManagerId,
    getAllByHousingId
};