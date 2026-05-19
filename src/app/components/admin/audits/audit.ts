// ── Types ─────────────────────────────────────────────────────────────────────
import { ActionType } from "@/app/lib/models/audit_log";

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
