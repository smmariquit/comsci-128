import { feedbackData } from "../data/feedback-data";

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

export const feedbackService = {
    createFeedback,
    findFeedbackById,
};