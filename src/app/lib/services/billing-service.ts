import { billData } from "../data/bill-data";
import { BillRow } from "@/app/components/admin/billings/billingtable";

const fetchAllBills = async (managedHousingIds: number[] = []): Promise<BillRow[]> => {
    try {
        const { data, error } = await billData.getBillsOfLandlord(managedHousingIds);
        if (error) throw error;

        return (data || []).map((bill: any) => {
            const user = bill.student?.user;
            const app = bill.student?.student_accommodation_history || [];
            console.log("managedHousingIds:", managedHousingIds);
            console.log("raw app:", JSON.stringify(app));
            const relevantApp = app.find((a: any) => {
                const room = Array.isArray(a.room) ? a.room[0] : a.room;
                const housing = Array.isArray(room?.housing) ? room.housing[0] : room?.housing;
                return managedHousingIds.map(Number).includes(Number(housing?.housing_id));
            });

            const room = Array.isArray(relevantApp?.room) ? relevantApp.room[0] : relevantApp?.room;
            const housing = Array.isArray(room?.housing) ? room.housing[0] : room?.housing;
            const housingName = housing?.housing_name;
            console.log(housingName)

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
        });
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