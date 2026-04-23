// ── Types ─────────────────────────────────────────────────────────────────────

export type ActionType =
  | "LOGIN"
  | "APPROVE_APPLICATION"
  | "ASSIGN_ROOM"
  | "BILL_UPDATE"
  | "LOGOUT";

export interface AuditLogRow {
  audit_id: number;
  timestamp: string;
  user_name: string;
  account_number: number;
  action_type: ActionType;
  audit_description: string;
  partial_ip: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

export const MOCK_AUDIT_LOGS: AuditLogRow[] = [
  {
    audit_id: 1,
    timestamp: "2026-04-07T08:12:00Z",
    user_name: "Maria Santos",
    account_number: 1001,
    action_type: "LOGIN",
    audit_description: "User logged into the system",
    partial_ip: "192.168.xxx.xxx",
  },
  {
    audit_id: 2,
    timestamp: "2026-04-07T08:30:00Z",
    user_name: "Lorna Villanueva",
    account_number: 1005,
    action_type: "APPROVE_APPLICATION",
    audit_description: "Approved application #203",
    partial_ip: "192.168.xxx.xxx",
  },
  {
    audit_id: 3,
    timestamp: "2026-04-07T09:10:00Z",
    user_name: "Ramon Bautista",
    account_number: 1006,
    action_type: "ASSIGN_ROOM",
    audit_description: "Assigned Room 301 to student #1002",
    partial_ip: "10.0.xxx.xxx",
  },
  {
    audit_id: 4,
    timestamp: "2026-04-07T10:05:00Z",
    user_name: "Ana Reyes",
    account_number: 1003,
    action_type: "BILL_UPDATE",
    audit_description: "Updated bill #501 status to Paid",
    partial_ip: "172.16.xxx.xxx",
  },
  {
    audit_id: 5,
    timestamp: "2026-04-07T11:20:00Z",
    user_name: "Juan dela Cruz",
    account_number: 1002,
    action_type: "LOGOUT",
    audit_description: "User logged out",
    partial_ip: "192.168.xxx.xxx",
  },
];