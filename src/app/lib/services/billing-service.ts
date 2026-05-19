import { billData } from "../data/bill-data";
import { BillRow } from "@/app/components/admin/billings/billingtable";
import { validateAction } from "./authorization-service";
import { AppAction } from "../models/permissions";
import { createAuditLog } from "./audit-log-service";
import { supabase } from "@/app/lib/supabase";
import { sendBillAssignedEmail, sendBillStatusUpdatedEmail } from "./email-service";

function normalizeStatus(rawStatus: unknown): BillRow["status"] {
  const value = String(rawStatus ?? "")
    .trim()
    .toLowerCase();
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

const fetchAllBills = async (
  managedHousingIds: number[] = [],
): Promise<BillRow[]> => {
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
          const housing = Array.isArray(room?.housing)
            ? room.housing[0]
            : room?.housing;
          return managedHousingIds.includes(Number(housing?.housing_id));
        });

        if (!relevantHistory) return null;

        const room = Array.isArray(relevantHistory.room)
          ? relevantHistory.room[0]
          : relevantHistory.room;
        const housing = Array.isArray(room?.housing)
          ? room?.housing[0]
          : room?.housing;

        return {
          transaction_id: bill.transaction_id,
          student_account_number: bill.student_account_number,
          student_name: user
            ? `${user.first_name} ${user.last_name}`
            : "Unknown Student",
          housing_name: housing?.housing_name || "Unassigned Property",
          amount: Number(bill.amount),
          bill_type: bill.bill_type,
          status: getEffectiveStatus(bill),
          due_date: bill.due_date,
          issue_date: bill.issue_date,
          date_paid: bill.date_paid,
        };
      })
      .filter(Boolean) as BillRow[];
  } catch (error) {
    console.error("Service Error (fetchAllBills): ", error);
    return [];
  }
};

const markAsPaid = async (txnId: number) => {
    try {
        // RBAC
        await validateAction(AppAction.UPDATE_BILL_STATUS);
        const { data, error } = await billData.markAsPaid(txnId);
        if (error) throw error;

        if (data) {
            const accountNumber = data.student_account_number ?? null;
            if (accountNumber) {
                await createAuditLog(
                    accountNumber,
                    "",
                    "Update Bill Status",
                    `Bill ${data.transaction_id} marked as paid`,
                    data.manager_account_number ?? null,
                );

                // Send payment confirmation email notification to student asynchronously
                (async () => {
                    try {
                        const { data: studentData, error: studentError } = await supabase
                            .from("student")
                            .select(`
                                user:user!account_number (
                                    first_name,
                                    last_name,
                                    account_email
                                )
                            `)
                            .eq("account_number", accountNumber)
                            .single();

                        if (!studentError && studentData) {
                            const studentUser = (studentData as any).user;
                            const studentEmail = studentUser?.account_email;
                            const studentName = `${studentUser?.first_name || ""} ${studentUser?.last_name || ""}`.trim();

                            if (studentEmail) {
                                await sendBillStatusUpdatedEmail(
                                    studentEmail,
                                    studentName || "Student",
                                    data.transaction_id,
                                    "Paid"
                                );
                            }
                        }
                    } catch (err) {
                        console.error("Failed to fetch student details for payment email:", err);
                    }
                })();
            }
        }

        return { data, error };
    } catch (error) {
        console.error("Service Error (markAsPaid): ", error);
        throw new Error("Failed to update billing");
    }
};

const removeBill = async (txnId: number) => {
  try {
    // RBAC
    await validateAction(AppAction.UPDATE_BILL_STATUS);

        const { data: existingBill, error: fetchError } = await billData.getById(txnId);
        if (fetchError) throw fetchError;

        await billData.remove(txnId);

        if (existingBill) {
            const accountNumber = existingBill.student_account_number ?? null;
            if (accountNumber) {
                await createAuditLog(
                    accountNumber,
                    "",
                    "Bill Status",
                    `Bill ${txnId} removed`,
                    existingBill.manager_account_number ?? null,
                );
            }
        }
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
        const { data, error } = await billData.create(billDetails);
        if (error) throw error;

        if (data) {
            const accountNumber = data.student_account_number ?? null;
            if (accountNumber) {
                await createAuditLog(
                    accountNumber,
                    "",
                    "Assign Bill",
                    `Bill ${data.transaction_id} created`,
                    data.manager_account_number ?? null,
                );

                // Send bill assigned email notification to student asynchronously
                (async () => {
                    try {
                        const { data: studentData, error: studentError } = await supabase
                            .from("student")
                            .select(`
                                user:user!account_number (
                                    first_name,
                                    last_name,
                                    account_email
                                )
                            `)
                            .eq("account_number", accountNumber)
                            .single();

                        if (!studentError && studentData) {
                            const studentUser = (studentData as any).user;
                            const studentEmail = studentUser?.account_email;
                            const studentName = `${studentUser?.first_name || ""} ${studentUser?.last_name || ""}`.trim();

                            if (studentEmail) {
                                await sendBillAssignedEmail(
                                    studentEmail,
                                    studentName || "Student",
                                    Number(data.amount),
                                    data.bill_type || "Housing Bill",
                                    data.due_date ? new Date(data.due_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "N/A"
                                );
                            }
                        }
                    } catch (err) {
                        console.error("Failed to fetch student details for bill creation email:", err);
                    }
                })();
            }
        }

        return { data, error };
    } catch (error: any) {
        console.error("Service Error (createBill): ", error);
        throw new Error(error?.message || "Failed to create billing");
    }
};

const getGrossRevenue = async (
  managerAccountNumber?: number,
): Promise<number> => {
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
  getGrossRevenue,
};
