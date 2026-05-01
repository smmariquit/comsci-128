import { billData } from "../data/bill-data";
import { BillRow } from "@/app/components/admin/billings/billingtable";
import { validateAction, validateOwnership } from "./authorization-service";
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
        
        const { data, error } = await billData.getAll();
        if (error) throw error;

        return (data || []).map((bill: any) => {
            const user = bill.student?.user;
            const app = bill.student?.student_accommodation_history || [];
            const relevantApp = app.find((a: any) => {
                const room = Array.isArray(a.room) ? a.room[0] : a.room;
                const housing = Array.isArray(room?.housing) ? room.housing[0] : room?.housing;
                return managedHousingIds.map(Number).includes(Number(housing?.housing_id));
            });

            const room = Array.isArray(relevantApp?.room) ? relevantApp.room[0] : relevantApp?.room;
            const housing = Array.isArray(room?.housing) ? room.housing[0] : room?.housing;
            const housingName = housing?.housing_name;

            return {
                transaction_id: bill.transaction_id,
                student_account_number: bill.student_account_number,
                student_name: user ? `${user.first_name} ${user.last_name}` : "Unknown Student",
                housing_name: housingName || "Unassigned Property",
                amount: Number(bill.amount),
                bill_type: bill.bill_type,
                status: getEffectiveStatus(bill),
                due_date: bill.due_date,
                issue_date: bill.issue_date,
                date_paid: bill.date_paid,
            };
        });
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