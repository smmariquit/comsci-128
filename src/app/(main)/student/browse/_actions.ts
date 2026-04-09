import { housingData } from "@/app/lib/data/housing-data";

export async function getDormDetails(id: number) {
    const dorm = await housingData.findById(id);
    return dorm;
}