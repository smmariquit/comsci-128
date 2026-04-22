import { C } from "@/lib/palette";

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserType        = "Student" | "Landlord" | "Housing Admin" | "Guest";
export type HousingStatus   = "Assigned" | "Not Assigned" | "Pending";
export type Sex             = "Male" | "Female" | "Prefer not to say";

export interface UserRow {
  account_number:  number;
  full_name:       string;
  account_email:   string;
  phone_number:    string;
  user_type:       UserType;
  housing_status?: HousingStatus; // only for students
  housing_name?:   string;        // property they belong to
  is_deleted:      boolean;
  sex:             Sex;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

export const MOCK_USERS: UserRow[] = [
  {
    account_number: 1001,
    full_name: "Maria Santos",
    account_email: "maria.santos@up.edu.ph",
    phone_number: "09171234567",
    user_type: "Student",
    housing_status: "Assigned",
    housing_name: "Kalayaan Residence Hall",
    is_deleted: false,
    sex: "Female",
  },
  {
    account_number: 1002,
    full_name: "Juan dela Cruz",
    account_email: "juan.delacruz@up.edu.ph",
    phone_number: "09189876543",
    user_type: "Student",
    housing_status: "Pending",
    housing_name: "Kalayaan Residence Hall",
    is_deleted: false,
    sex: "Male",
  },
  {
    account_number: 1003,
    full_name: "Ana Reyes",
    account_email: "ana.reyes@up.edu.ph",
    phone_number: "09201122334",
    user_type: "Student",
    housing_status: "Not Assigned",
    housing_name: "Kalayaan Residence Hall",
    is_deleted: false,
    sex: "Female",
  },
  {
    account_number: 1004,
    full_name: "Carlos Mendoza",
    account_email: "carlos.mendoza@gmail.com",
    phone_number: "09271234321",
    user_type: "Guest",
    housing_name: "Kalayaan Residence Hall",
    is_deleted: false,
    sex: "Male",
  },
  {
    account_number: 1005,
    full_name: "Lorna Villanueva",
    account_email: "lorna.villanueva@gmail.com",
    phone_number: "09154443322",
    user_type: "Landlord",
    housing_name: "Kalayaan Residence Hall",
    is_deleted: false,
    sex: "Female",
  },
  {
    account_number: 1006,
    full_name: "Ramon Bautista",
    account_email: "ramon.bautista@up.edu.ph",
    phone_number: "09352221100",
    user_type: "Student",
    housing_status: "Assigned",
    housing_name: "Kalayaan Residence Hall",
    is_deleted: true,
    sex: "Male",
  },
];

// ── User type badge ───────────────────────────────────────────────────────────

const USER_TYPE_STYLE: Record<UserType, { bg: string; text: string }> = {
  Student:       { bg: "rgba(86,115,117,0.13)",  text: C.teal },
  Landlord:      { bg: "rgba(201,100,42,0.13)",  text: C.orange },
  "Housing Admin": { bg: "rgba(28,38,50,0.09)",  text: C.navy },
  Guest:         { bg: "rgba(227,175,100,0.18)", text: "#A07820" },
};

function UserTypeBadge({ type }: { type: UserType }) {
  const s = USER_TYPE_STYLE[type];
  return (
    <span style={{
      background: s.bg,
      color: s.text,
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 6,
      whiteSpace: "nowrap",
    }}>
      {type}
    </span>
  );
}

// ── Housing status badge ──────────────────────────────────────────────────────

const HOUSING_STATUS_STYLE: Record<HousingStatus, { bg: string; dot: string; text: string }> = {
  Assigned:     { bg: "rgba(86,115,117,0.12)",  dot: C.teal,   text: C.teal },
  Pending:      { bg: "rgba(227,175,100,0.18)", dot: "#D4A017", text: "#A07820" },
  "Not Assigned": { bg: "rgba(28,38,50,0.08)", dot: C.navy,   text: C.navy },
};

function HousingStatusBadge({ status }: { status: HousingStatus }) {
  const s = HOUSING_STATUS_STYLE[status];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: s.bg,
      color: s.text,
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 8px",
      borderRadius: 20,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {status}
    </span>
  );
}

// ── Active / Removed badge ────────────────────────────────────────────────────

function AccountStatusBadge({ isDeleted }: { isDeleted: boolean }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: isDeleted ? "rgba(201,100,42,0.10)" : "rgba(86,115,117,0.12)",
      color: isDeleted ? C.orange : C.teal,
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 8px",
      borderRadius: 20,
      whiteSpace: "nowrap",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: isDeleted ? C.orange : C.teal,
      }} />
      {isDeleted ? "Removed" : "Active"}
    </span>
  );
}

// ── Action button ─────────────────────────────────────────────────────────────

type BtnVariant = "ghost" | "danger";

const BTN_STYLE: Record<BtnVariant, React.CSSProperties> = {
  ghost:  { background: "#fff", color: C.navy, border: `1px solid ${C.cream}` },
  danger: { background: "rgba(201,100,42,0.10)", color: C.orange, border: `1px solid rgba(201,100,42,0.2)` },
};

function ActionBtn({ label, onClick, variant = "ghost", disabled }: {
  label: string;
  onClick: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...BTN_STYLE[variant],
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {label}
    </button>
  );
}

// ── Columns ───────────────────────────────────────────────────────────────────

const COLUMNS = [
  { key: "name",           label: "Name" },
  { key: "email",          label: "Email" },
  { key: "phone",          label: "Phone" },
  { key: "user_type",      label: "Role" },
  { key: "housing_status", label: "Housing Status" },
  { key: "property",       label: "Property" },
  { key: "status",         label: "Account Status" },
  { key: "actions",        label: "Actions" },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  data:     UserRow[];
  onView:   (row: UserRow) => void;
  onRemove: (row: UserRow) => void;
}

// ── Table ─────────────────────────────────────────────────────────────────────

export default function UserTable({ data, onView, onRemove }: Props) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      outline: `1px solid ${C.cream}`,
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 18px",
        borderBottom: `1px solid ${C.dividerLight}`,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
            Users
          </div>
          <div style={{ fontSize: 11, color: C.teal }}>
            {data.length} total
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.cream }}>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: "8px 14px",
                    textAlign: "left",
                    fontSize: 10,
                    color: C.teal,
                    textTransform: "uppercase",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} style={{
                  padding: "32px 14px",
                  textAlign: "center",
                  color: C.teal,
                  opacity: 0.5,
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  No users found.
                </td>
              </tr>
            ) : data.map((row, i) => (
              <tr key={row.account_number} style={{
                borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}`,
                opacity: row.is_deleted ? 0.55 : 1,
              }}>
                {/* Name */}
                <td style={{ padding: "8px 14px", color: C.navy, fontWeight: 600, whiteSpace: "nowrap" }}>
                  {row.full_name}
                </td>

                {/* Email */}
                <td style={{ padding: "8px 14px", color: C.teal, fontFamily: "monospace" }}>
                  {row.account_email}
                </td>

                {/* Phone */}
                <td style={{ padding: "8px 14px", color: C.navy, fontFamily: "monospace" }}>
                  {row.phone_number ?? <span style={{ opacity: 0.4 }}>—</span>}
                </td>

                {/* Role */}
                <td style={{ padding: "8px 14px" }}>
                  <UserTypeBadge type={row.user_type} />
                </td>

                {/* Housing Status — only meaningful for students */}
                <td style={{ padding: "8px 14px" }}>
                  {row.housing_status
                    ? <HousingStatusBadge status={row.housing_status} />
                    : <span style={{ color: C.teal, opacity: 0.35, fontSize: 11 }}>N/A</span>
                  }
                </td>

                {/* Property */}
                <td style={{ padding: "8px 14px", color: C.navy, fontWeight: 500 }}>
                  {row.housing_name ?? <span style={{ opacity: 0.4 }}>—</span>}
                </td>

                {/* Account Status */}
                <td style={{ padding: "8px 14px" }}>
                  <AccountStatusBadge isDeleted={row.is_deleted} />
                </td>

                {/* Actions */}
                <td style={{ padding: "8px 14px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <ActionBtn label="View" onClick={() => onView(row)} />
                    <ActionBtn
                      label="Remove"
                      onClick={() => onRemove(row)}
                      variant="danger"
                      disabled={row.is_deleted}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}