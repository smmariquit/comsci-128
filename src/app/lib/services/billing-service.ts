import { billData } from "../data/bill-data";
import { BillRow } from "@/app/components/admin/billings/billingtable";

const fetchAllBills = async (managedHousingIds: number[] = []): Promise<BillRow[]> => {
    try {
        const { data, error } = await billData.getBillsOfLandlord(managedHousingIds);
        if (error) throw error;

        return (data || []).map((bill: any) => {
            const user = bill.student?.user;
            const app = bill.student?.student_accommodation_history || [];
            const relevantApp = app.find((a: any) =>
                managedHousingIds.includes(a.room?.housing?.housing_id)
            );
            const housingName = relevantApp?.room?.housing?.housing_name;

            return {
                transaction_id: bill.transaction_id,
                student_account_number: bill.student_account_number,
                student_name: user ? `${user.first_name} ${user.last_name}` : "Unknown Student",
                housing_name: housingName || "Unassigned Property",
                amount: Number(bill.amount),
                bill_type: bill.bill_type,
                status: bill.status,
                due_date: bill.due_date,
                issue_date: bill.issue_date,
            };
        }).filter(bill => managedHousingIds.length === 0 || bill.housing_name !== "Unassigned Property");
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