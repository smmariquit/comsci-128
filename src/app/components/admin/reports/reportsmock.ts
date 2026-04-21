// ── Shared Types ──────────────────────────────────────────────────────────────

export type OccupancyStatus  = "Empty" | "Partially Occupied" | "Fully Occupied";
export type RoomType         = "Women Only" | "Men Only" | "Co-ed";
export type ApplicationStatus= "Pending Manager Approval" | "Pending Admin Approval" | "Approved" | "Rejected" | "Cancelled";
export type PaymentStatus    = "Pending" | "Paid" | "Overdue";
export type BillType         = "Rent" | "Utility" | "Maintenance" | "Miscellaneous";

// ── Occupancy Report ──────────────────────────────────────────────────────────

export interface OccupancyReportRow {
  room_id:          number;
  room_code:        string;
  housing_name:     string;
  room_type:        RoomType;
  maximum_occupants:number;
  current_occupants:number;
  occupancy_status: OccupancyStatus;
}

export const MOCK_OCCUPANCY: OccupancyReportRow[] = [
  { room_id:1, room_code:"KRH-101", housing_name:"Kalayaan Residence Hall", room_type:"Women Only",   maximum_occupants:1, current_occupants:1, occupancy_status:"Fully Occupied" },
  { room_id:2, room_code:"KRH-102", housing_name:"Kalayaan Residence Hall", room_type:"Women Only",   maximum_occupants:2, current_occupants:1, occupancy_status:"Partially Occupied" },
  { room_id:3, room_code:"KRH-103", housing_name:"Kalayaan Residence Hall", room_type:"Men Only", maximum_occupants:4, current_occupants:0, occupancy_status:"Empty" },
  { room_id:4, room_code:"KRH-104", housing_name:"Kalayaan Residence Hall", room_type:"Men Only",    maximum_occupants:3, current_occupants:2, occupancy_status:"Partially Occupied" },
  { room_id:5, room_code:"KRH-105", housing_name:"Kalayaan Residence Hall", room_type:"Men Only",   maximum_occupants:1, current_occupants:0, occupancy_status:"Empty" },
  { room_id:6, room_code:"IRM-201", housing_name:"Ilagan Residence Hall",   room_type:"Co-ed",   maximum_occupants:2, current_occupants:0, occupancy_status:"Empty" },
  { room_id:7, room_code:"IRM-202", housing_name:"Ilagan Residence Hall",   room_type:"Co-ed", maximum_occupants:6, current_occupants:5, occupancy_status:"Partially Occupied" },
  { room_id:8, room_code:"IRM-203", housing_name:"Ilagan Residence Hall",   room_type:"Co-ed",   maximum_occupants:1, current_occupants:0, occupancy_status:"Empty" },
];

// ── Application Report ────────────────────────────────────────────────────────

export interface ApplicationReportRow {
  application_id:        number;
  student_name:          string;
  student_number:        string;
  housing_name:          string;
  preferred_room_type:   RoomType;
  application_status:    ApplicationStatus;
  expected_moveout_date: string;
  actual_moveout_date?:  string;
}

export const MOCK_APPLICATIONS: ApplicationReportRow[] = [
  { application_id:101, student_name:"Maria Santos",   student_number:"2021-00001", housing_name:"Kalayaan Residence Hall", preferred_room_type:"Women Only",   application_status:"Approved",  expected_moveout_date:"2025-05-31" },
  { application_id:102, student_name:"Juan dela Cruz", student_number:"2021-00002", housing_name:"Kalayaan Residence Hall", preferred_room_type:"Men Only",   application_status:"Pending Admin Approval",   expected_moveout_date:"2025-05-31" },
  { application_id:103, student_name:"Ana Reyes",      student_number:"2020-00045", housing_name:"Kalayaan Residence Hall", preferred_room_type:"Women Only", application_status:"Rejected",  expected_moveout_date:"2025-05-31" },
  { application_id:104, student_name:"Ramon Bautista", student_number:"2022-00011", housing_name:"Ilagan Residence Hall",   preferred_room_type:"Co-ed",    application_status:"Approved",  expected_moveout_date:"2025-06-30" },
  { application_id:105, student_name:"Lorna Villanueva",student_number:"2019-00088",housing_name:"Ilagan Residence Hall",   preferred_room_type:"Co-ed",   application_status:"Cancelled", expected_moveout_date:"2025-06-30", actual_moveout_date:"2025-03-15" },
  { application_id:106, student_name:"Carlos Mendoza", student_number:"2023-00033", housing_name:"Kalayaan Residence Hall", preferred_room_type:"Men Only",   application_status:"Pending Admin Approval",   expected_moveout_date:"2025-07-31" },
];

// ── Revenue Report ────────────────────────────────────────────────────────────

export interface RevenueReportRow {
  transaction_id:         number;
  student_name:           string;
  housing_name:           string;
  bill_type:              BillType;
  amount:                 number;
  status:                 PaymentStatus;
  due_date:               string;
  issue_date:             string;
  date_paid?:             string;
}

export const MOCK_REVENUE: RevenueReportRow[] = [
  { transaction_id:3001, student_name:"Maria Santos",    housing_name:"Kalayaan Residence Hall", bill_type:"Rent",          amount:5500, status:"Paid",    due_date:"2025-04-05", issue_date:"2025-03-20", date_paid:"2025-04-03" },
  { transaction_id:3002, student_name:"Juan dela Cruz",  housing_name:"Kalayaan Residence Hall", bill_type:"Utility",       amount:850,  status:"Pending",  due_date:"2025-04-15", issue_date:"2025-04-01" },
  { transaction_id:3003, student_name:"Ana Reyes",       housing_name:"Kalayaan Residence Hall", bill_type:"Rent",          amount:5500, status:"Overdue",  due_date:"2025-03-31", issue_date:"2025-03-15" },
  { transaction_id:3004, student_name:"Ramon Bautista",  housing_name:"Ilagan Residence Hall",   bill_type:"Maintenance",   amount:1200, status:"Pending",  due_date:"2025-04-20", issue_date:"2025-04-05" },
  { transaction_id:3005, student_name:"Maria Santos",    housing_name:"Kalayaan Residence Hall", bill_type:"Miscellaneous", amount:300,  status:"Overdue",  due_date:"2025-03-10", issue_date:"2025-02-28" },
  { transaction_id:3006, student_name:"Ana Reyes",       housing_name:"Kalayaan Residence Hall", bill_type:"Utility",       amount:720,  status:"Paid",     due_date:"2025-03-25", issue_date:"2025-03-10", date_paid:"2025-03-22" },
  { transaction_id:3007, student_name:"Lorna Villanueva",housing_name:"Ilagan Residence Hall",   bill_type:"Rent",          amount:4800, status:"Paid",     due_date:"2025-04-05", issue_date:"2025-03-20", date_paid:"2025-04-01" },
];

// ── Accommodation History ─────────────────────────────────────────────────────

export interface AccommodationHistoryRow {
  account_number: number;
  student_name:   string;
  student_number: string;
  room_id:        number;
  room_code:      string;
  housing_name:   string;
  room_type:      RoomType;
  movein_date:    string;
  moveout_date:   string;
}

export const MOCK_ACCOMMODATION: AccommodationHistoryRow[] = [
  { account_number:1001, student_name:"Maria Santos",    student_number:"2021-00001", room_id:1, room_code:"KRH-101", housing_name:"Kalayaan Residence Hall", room_type:"Women Only",   movein_date:"2024-06-01", moveout_date:"2024-10-31" },
  { account_number:1001, student_name:"Maria Santos",    student_number:"2021-00001", room_id:2, room_code:"KRH-102", housing_name:"Kalayaan Residence Hall", room_type:"Women Only",   movein_date:"2024-11-01", moveout_date:"2025-05-31" },
  { account_number:1002, student_name:"Juan dela Cruz",  student_number:"2021-00002", room_id:3, room_code:"KRH-103", housing_name:"Kalayaan Residence Hall", room_type:"Men Only", movein_date:"2024-08-15", moveout_date:"2025-05-31" },
  { account_number:1003, student_name:"Ana Reyes",       student_number:"2020-00045", room_id:4, room_code:"KRH-104", housing_name:"Kalayaan Residence Hall", room_type:"Women Only",    movein_date:"2023-06-01", moveout_date:"2024-05-31" },
  { account_number:1004, student_name:"Ramon Bautista",  student_number:"2022-00011", room_id:7, room_code:"IRM-202", housing_name:"Ilagan Residence Hall",   room_type:"Co-ed", movein_date:"2024-06-01", moveout_date:"2025-06-30" },
  { account_number:1005, student_name:"Lorna Villanueva",student_number:"2019-00088", room_id:6, room_code:"IRM-201", housing_name:"Ilagan Residence Hall",   room_type:"Co-ed",   movein_date:"2022-06-01", moveout_date:"2023-05-31" },
];

// ── Shared helpers ────────────────────────────────────────────────────────────

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", { year:"numeric", month:"short", day:"numeric" });
}

export function formatPeso(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

export const ALL_HOUSING = [
  "Kalayaan Residence Hall",
  "Ilagan Residence Hall",
];