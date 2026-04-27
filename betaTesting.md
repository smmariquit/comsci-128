# UPLB CASA — Beta Testing Guide

**URL:** [uplb.casa](https://uplb.casa)  
**Alternative URLs**: [128.stimmie.dev](https://128.stimmie.dev) or [comsci-128.vercel.app](https://comsci-128.vercel.app)
**Repository:** [github.com/smmariquit/comsci-128](https://github.com/smmariquit/comsci-128)

This guide walks you through testing UPLB CASA as each user role. Our team has included the relevant functional requirements alongside each test case so you know exactly what the system is supposed to do. We request that you verify the accuracy of these requirements alongside the testing. Please file issues using the template at the bottom of this document.

> [!IMPORTANT]
> All four portals share the same login page. Role-based redirection happens automatically after authentication.

## Test Logins

email: student@tester.com
pw: student

email: systemadmin@tester.com
pw: systemadmin

email: housingadmin@tester.com
pw: housingadmin

email: landlord@tester.com
pw: landlord

--------------------------------

## Summarized Application Flow 

```
Student submits an application
              ↓
    [Pending Manager Approval]
              ↓  Manager approves
    [Pending Admin Approval]
              ↓  Admin approves
          [Approved]
              ↓  Manager/Admin can assign room
  Accommodation history created → Occupancy tracking begins → Billings, 
  Reports are generated throughout user's stay
```

Rejection at any stage sets the application status to `Rejected` and closes the application. If a housing has no assigned manager, the Admin/Landlord handles both levels of screening directly.

---

## Per-Role Testing

---

### Student - `/student`

#### Happy Path

1. Log in with email/Google account and verify you land on the Student dashboard
2. Navigate to **Accommodations** and verify listings load with room types, capacity, and availability
3. Click into a housing then verify details display correctly
4. Submit an application:
   - Select a housing and preferred room type
   - Fill in all required fields
   - Upload all four documents: **Form 5, Payment Receipt, Contract, Waiver**
5. Verify the application appears with status `Pending Manager Approval`
6. After a Manager approves, verify status updates to `Pending Admin Approval`
7. After Admin approves, verify status updates to `Approved`
<!-- TODO: Verify final path for billing -->
8. Navigate to **Billing** to verify outstanding balance and billing history display

#### Edge Cases 

| Test | Expected Behavior | SRS Ref |
|---|---|---|
| Submit application with missing required fields | Blocked with an error message | REQ-4 §4.4 |
| Upload a file larger than 10MB | Rejected with an error message | REQ-3, REQ-6 §4.4 |
| Upload a non-PDF/image file | Rejected; only PDF and image files accepted (in student's case)| §3.3 |
| Submit a second application while one is active | Blocked; one active application per student | §5.5.2 |
| Submit outside the application period | Blocked with an error message | REQ-5 §4.4 |
| Manually navigate to `/manage`, `/admin`, `/sys` | Redirected or shown unauthorized | REQ-5 §4.1 |


---

### Manager -`/manage`

#### Happy Path

1. Log in with a Manager account and verify the dashboard loads with live statistics
2. Navigate to **Accommodations** and verify assigned dorms load with occupant counts and free slots
3. Click into a dorm and verify room units show occupancy and room type
4. Click into a room unit and verify current tenant list with move-in and move-out dates
5. Navigate to **Applications** and verify the applicant table loads
6. Filter by status to verify filtering works
7. Click **Review** on a `Pending Manager Approval` application:
   - Verify applicant name and housing info display correctly
   - Verify all four document buttons appear wherein missing documents should appear disabled
   - Click each document button, then the file renders in the viewer
   - Click **Approve** to verify status changes to `Pending Admin Approval`
   - On a separate application, click **Reject** to verify status changes to `Rejected`
8. Navigate to **Accommodations → [Dorm] → Assign Rooms**:
   - Verify only approved, unassigned applicants for this housing appear on the left table
   - Select applicants and confirm, verify they appear in the room's tenant list
   - Verify assigned students disappear from the unassigned list

#### Edge Cases

| Test | Expected Behavior | SRS Ref |
|---|---|---|
| Assign more students than room's maximum occupants | Blocked; overbooking is prevented | REQ-8 §4.5 |
| Assign a student to a full room | Blocked with an error message | §5.5.9 |
| View applications for a dorm not assigned to you | Not visible; scoped to assigned dorms only | REQ-4 §4.3 |
| Navigate to `/admin` or `/sys` | Redirected or shown unauthorized | REQ-5 §4.1 |


---

### Admin / Landlord - `/admin`

#### Happy Path

1. Log in with an Admin account to verify dashboard loads with system-wide stats
2. Navigate to **Properties and Dorms** and verify housing management and CRUD operations work
3. Navigate to **Rooms** to verify room listings, assignment, creation, editing, and deletion work
4. Navigate to **Applications**  and verify `Pending Admin Approval` applications appear
5. Open an application and give **final approval** to verify status changes to `Approved`
6. Reject a different application and verify status changes to `Rejected`
7. Navigate to **Users** to verify user list loads; test deactivating an account
8. Navigate to **Billing**:
   - Verify billing records display
   - Verify billing CRUD
   - Test setting billing periods and accommodation rates
   - Verify final payment approval works
9. Navigate to **Reports**: verify generation and filtering of occupancy, financial, and applicant reports

#### Edge Cases 

| Test | Expected Behavior | SRS Ref |
|---|---|---|
| Access housing data from another admin's dorms | Not accessible: scoped per admin | §5.5.6 |
| `Pending Manager Approval` applications appearing for final review | Should not appear; only `Pending Admin Approval` | REQ-12 §4.4 |
| Deactivate a user account | User can no longer log in; but records preserved | REQ-9–10 §4.2 |
| Mark a billing record as Paid | Only accessible to Admin and not visible to Manager | REQ-10 §4.6 |
| Override a room assignment | Allowed; system logs the override action | REQ-6 §4.5 |
| Export a report | Prompts for format (PDF, CSV, Excel); downloads file | REQ-6 §4.7 |

---

### System Admin — `/sys`

#### Happy Path

1. Log in — verify dashboard shows system-wide data (total users, total dorms, recent activity, occupancy, etc.)
2. Navigate to **User Management** and verify all user accounts across all roles are visible
3. Assign a test user the Manager role and verify they can access `/manage`
4. Navigate to **Dorm Management** to verify full housing management access
5. Navigate to **Logs** and verify audit trail entries are present and filterable by user ID, date, IP, and transaction type
6. Click **View** on a log entry: verify it shows the specific details/data fields that changed
7. Navigate to **Role Management**: verify role assignment interface works
8. Navigate to **System Configuration** and verify system configuration options

#### Edge Cases 
| Test | Expected Behavior | SRS Ref |
|---|---|---|
| Try to edit or delete an audit log entry | No edit/delete controls exist for any user | REQ-4 §4.8 |
| Deactivate an account; check previous data | Application history, accommodation records, and logs remain | §5.5.12 |

---
