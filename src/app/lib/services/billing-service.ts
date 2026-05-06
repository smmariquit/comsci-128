import { billData } from "../data/bill-data";
import { BillRow } from "@/app/components/admin/billings/billingtable";
import { validateAction } from "./authorization-service";
import { AppAction } from "../models/permissions";

function normalizeStatus(rawStatus: unknown): BillRow["status"] {
    const value = String(rawStatus ?? "").trim().toLowerCase();
    if (value === "paid") return "Paid";
    if (value === "overdue") return "Overdue";
    return "Pending";
}

function getEffectiveStatus(bill: any): BillRow["status"] {
    const normalized = normalizeStatus(bill?.status);
    if (normalized === "Paid") return "Paid";

    const due = new Date(bill?.due_date);
    const now = new Date();
    if (!Number.isNaN(due.getTime()) && due < now) {
        return "Overdue";
    }

    return normalized;
}

const fetchAllBills = async (managedHousingIds: number[] = []): Promise<BillRow[]> => {
    try {
        // RBAC
        await validateAction(AppAction.BILL_STATUS);
        
        const { data, error } = await billData.getBillsOfLandlord();
if (error) throw error;

return (data || [])
    .map((bill: any) => {
        const user = bill.student?.user;
        const histories = bill.student?.student_accommodation_history || [];

        const relevantHistory = histories.find((h: any) => {
            const room = Array.isArray(h.room) ? h.room[0] : h.room;
            const housing = Array.isArray(room?.housing) ? room.housing[0] : room?.housing;
            return managedHousingIds.includes(Number(housing?.housing_id));
        });

        if (!relevantHistory) return null;

        const room = Array.isArray(relevantHistory.room) ? relevantHistory.room[0] : relevantHistory.room;
        const housing = Array.isArray(room?.housing) ? room?.housing[0] : room?.housing;

        return {
            transaction_id: bill.transaction_id,
            student_account_number: bill.student_account_number,
            student_name: user ? `${user.first_name} ${user.last_name}` : "Unknown Student",
            housing_name: housing?.housing_name || "Unassigned Property",
            amount: Number(bill.amount),
            bill_type: bill.bill_type,
            status: getEffectiveStatus(bill),
            due_date: bill.due_date,
            issue_date: bill.issue_date,
            date_paid: bill.date_paid,
        };
    }).filter(Boolean) as BillRow[];
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
    } catch (error: any) {
        console.error("Service Error (createBill): ", error);
        throw new Error(error?.message || "Failed to create billing");
    }
};

export const billingService = {
    fetchAllBills,
    markAsPaid,
    removeBill,
    createBill,
};