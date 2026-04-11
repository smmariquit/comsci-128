import { create } from "domain";
import { billingData } from "../data/bill-data";
import { BillRow } from "@/app/components/admin/billings/billingtable";

const fetchAllBills = async (): Promise<BillRow[]> => {
    try {
        return await billingData.findAllBillings();
    } catch (error) {
        console.error("Service Error (fetchAllBillings): ", error);
        return [];
    }
};

const markAsPaid = async (txnId: number) => {
    try {
        const now = new Date().toISOString();
        return await billingData.updateBilling(txnId, "Paid", now);
    } catch (error) {
        console.error("Service Error (markAsPaid): ", error);
        throw new Error("Failed to update billing");
    }
};

const removeBill = async (txnId: number) => {
    try {
        await billingData.deleteBilling(txnId);
        return { success: true };
    } catch (error) {
        console.error("Service Error (removeBill): ", error);
        throw new Error("Failed to delete billing");
    }
};

const createBill = async (billDetails: any) => {
    try {
        return await billingData.createBilling(billDetails);
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