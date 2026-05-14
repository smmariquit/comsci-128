"use server";

import { auditLogData } from "../data/audit-log-data";
import type { Role } from "../models/audit_log";

export interface RawNotification {
  id: string;
  title: string;
  body: string;
  time: string;
}

const STUDENT_TYPES = new Set([
  "Update Application Status",
  "Assign Room",
  "Assign Bill",
  "Update Bill Status",
  "Bill Status",
]);

const MANAGER_TYPES = new Set([
  "Submit Application",
  "Update Application Status",
  "Assign Room",
  "Assign Bill",
  "Update Bill Status",
  "Bill Status",
]);

function titleFor(actionType: string): string {
  const map: Record<string, string> = {
    "Update Application Status": "Application Update",
    "Assign Room": "Room Assignment",
    "Assign Bill": "New Bill",
    "Update Bill Status": "Bill Updated",
    "Bill Status": "Bill Update",
    "Submit Application": "New Application",
  };
  return map[actionType] ?? actionType;
}

function timeAgo(timestamp: string | null): string {
  if (!timestamp) return "";
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function getNotificationsForUser(
  accountNumber: number,
  role: Role,
): Promise<RawNotification[]> {
  try {
    const logs = await auditLogData.getAll(role, accountNumber);

    const relevantTypes =
      role === "Student"
        ? STUDENT_TYPES
        : role === "Manager"
          ? MANAGER_TYPES
          : null; // System Admin sees all

    const filtered = (
      relevantTypes
        ? logs.filter((l) => relevantTypes.has(l.action_type ?? ""))
        : logs
    )
      .sort(
        (a, b) =>
          new Date(b.timestamp ?? 0).getTime() -
          new Date(a.timestamp ?? 0).getTime(),
      )
      .slice(0, 30);

    return filtered.map((l) => ({
      id: String(l.audit_id),
      title: titleFor(l.action_type ?? ""),
      body: l.audit_description ?? "",
      time: timeAgo(l.timestamp),
    }));
  } catch {
    return [];
  }
}
