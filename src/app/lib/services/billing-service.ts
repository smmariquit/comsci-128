import { billData } from "../data/bill-data";
import { BillRow } from "@/app/components/admin/billings/billingtable";

const fetchAllBills = async (): Promise<BillRow[]> => {
    try {
        const { data, error } = await billData.getAll();
        if (error) throw error;
        return (data || []) as unknown as BillRow[];
    } catch (error) {
        console.error("Service Error (fetchAllBills): ", error);
        return [];
    }
};

const markAsPaid = async (txnId: number) => {
    try {
        return await billData.markAsPaid(txnId);
    } catch (error) {
        console.error("Service Error (markAsPaid): ", error);
        throw new Error("Failed to update billing");
    }
};

const removeBill = async (txnId: number) => {
    try {
        await billData.remove(txnId);
        return { success: true };
    } catch (error) {
        console.error("Service Error (removeBill): ", error);
        throw new Error("Failed to delete billing");
    }
};

const createBill = async (billDetails: any) => {
    try {
        return await billData.create(billDetails);
    } catch (error) {
        console.error("Service Error (createBill): ", error);
        throw new Error("Failed to create billing");
    }
};

export const billingService = {
    fetchAllBills,
    markAsPaid,
    removeBill,
    createBill,
};