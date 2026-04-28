"use client";

import type { BillRow } from "@/app/components/admin/billings/billingtable";

const API_BASE = "../../api/billing";

const fetchAllBills = async (): Promise<BillRow[]> => {
  const res = await fetch(API_BASE, { method: "GET" });
  if (!res.ok) throw new Error(`Failed to fetch bills (${res.status})`);
  return (await res.json()) as BillRow[];
};

const markAsPaid = async (txnId: number) => {
  const res = await fetch(`${API_BASE}/${txnId}`, { method: "PUT" });
  if (!res.ok) throw new Error(`Failed to mark as paid (${res.status})`);
  return await res.json();
};

const removeBill = async (txnId: number) => {
  const res = await fetch(`${API_BASE}/${txnId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to remove bill (${res.status})`);
  return { success: true };
};

const createBill = async (billDetails: any) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(billDetails),
  });
  if (!res.ok) throw new Error(`Failed to create bill (${res.status})`);
  return await res.json();
};

export const billingClient = {
  fetchAllBills,
  markAsPaid,
  removeBill,
  createBill,
};
