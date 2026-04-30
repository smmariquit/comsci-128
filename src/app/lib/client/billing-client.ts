"use client";

import type { BillRow } from "@/app/components/admin/billings/billingtable";

const API_BASE = "/api/billing";

const fetchAllBills = async (
	managedHousingIds: number[] = [],
): Promise<BillRow[]> => {
  const params = new URLSearchParams();
  managedHousingIds.forEach((housingId) => {
    params.append("managedHousingIds", String(housingId));
  });

  const res = await fetch(`${API_BASE}?${params}`, { method: "GET" });
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
  return await res.json();
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
