import { feedbackData } from "../data/feedback-data";

const createFeedback = async (feedbackDetails: any) => {
    try {
        return await feedbackData.create(feedbackDetails);
    } catch (error) {
        console.error("Service Error (createFeedback): ", error);
        throw new Error("Failed to create feedback");
    }
};

export const feedbackService = {
    createFeedback,
};