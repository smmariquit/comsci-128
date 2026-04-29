import { billData } from "../data/bill-data";
import { BillRow } from "@/app/components/admin/billings/billingtable";
import { validateAction, validateOwnership } from "./authorization-service";
import { AppAction } from "../models/permissions";

const fetchAllBills = async (): Promise<BillRow[]> => {
    try {
        // RBAC
        await validateAction(AppAction.BILL_STATUS);
        
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
        // RBAC
        await validateAction(AppAction.UPDATE_BILL_STATUS);
        return await billData.markAsPaid(txnId);
    } catch (error) {
        console.error("Service Error (markAsPaid): ", error);
        throw new Error("Failed to update billing");
    }
};

const removeBill = async (txnId: number) => {
    try {
        // RBAC
        await validateAction(AppAction.UPDATE_BILL_STATUS);

        await billData.remove(txnId);
        return { success: true };
    } catch (error) {
        console.error("Service Error (removeBill): ", error);
        throw new Error("Failed to delete billing");
    }
};

const createBill = async (billDetails: any) => {
    try {
        // RBAC
        await validateAction(AppAction.ASSIGN_BILL);

        return await billData.create(billDetails);
    } catch (error) {
        console.error("Service Error (createBill): ", error);
        throw new Error("Failed to create billing");
    }
};


const getGrossRevenue = async (managerAccountNumber?: number): Promise<number> => {
  try {
    return await billData.getGrossRevenue(managerAccountNumber);
  } catch (error) {
    console.error("Service Error (getGrossRevenue): ", error);
    throw new Error("Failed to fetch gross revenue");
  }
};

export const billingService = {
    fetchAllBills,
    markAsPaid,
    removeBill,
    createBill,
    getGrossRevenue
};