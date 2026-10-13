# Project Specifications for a University Student Accommodation Tracker

**University of the Philippines Los Baños** 
**College of Arts and Sciences** 
**Institute of Computer Science** 
**CMSC 128: Introduction to Software Engineering** 
**2nd Semester AY 2025–2026** 

**Instructor:** RNC Recario 

---

## Rationale
The University of the Philippines Los Baños accommodates students through various on-campus dormitories, off-campus university-managed housing, and partner private accommodations. Currently, tracking student housing assignments, availability, applications, approvals, and billing is fragmented across manual forms, spreadsheets, and email exchanges between students, dormitory managers, and university offices.

The University Student Accommodation Tracker aims to simplify the application, allocation, monitoring, and management of student housing, ensuring transparency, efficiency, and proper documentation of accommodation-related transactions.

This system will serve students, dormitory administrators, and university housing administrators by providing a centralized platform for managing accommodations.

---

## Specifications / Features

### Core System Features
* **User Login:** Supports Google / UP Mail authentication.
* **User Activity Logs:** Tracks user login, applications, approvals, updates, etc.
* **Dormitories / Housing Facilities CRUD:** Allows administrative management of dorms.
* **Rooms / Bed Spaces CRUD:** Allows management of rooms and individual bed spaces.
* **Student Users CRUD:** Supports student profile management.
* **Accommodation Applications CRUD:** simplify submission, review, and status tracking.
* **Housing/Apartment Administrators / Landlords & Dormitory Managers CRUD:** Manages staff and landlord records.
* **Summary and Administrative Reports:** Generates system-wide analytics and documents.

---

## Main Functional Modules

### 1. Accommodation Management
* **Manage Dormitories / Housing Facilities:**
 * Name
 * Location
 * Type (on-campus, off-campus, partner housing)
 * Capacity
 * Assigned dormitory manager / landlord
* **Manage Rooms and Bed Spaces:**
 * Room number
 * Room type (single, double, shared)
 * Capacity
 * Current occupancy
 * Availability status

### 2. Student Accommodation Application
* **Students can:**
 * View available housing options.
 * Submit accommodation applications.
 * Indicate preferred dormitory and room type.
 * Upload required documents (e.g., proof of enrollment).
 * View application status (pending, approved, rejected, waitlisted).
* *Note:* Applications must be submitted within the allowed application period.

### 3. Assignment & Occupancy Tracking
* Assign approved students to specific rooms/bed spaces.
* **Track:**
 * Move-in date
 * Expected move-out date
 * Actual move-out date
* Prevent overbooking of rooms.
* Maintain accommodation history per student.

---

## Privileges

### Student
* View available accommodations.
* Apply for housing.
* Upload required documents.
* View application and assignment status.
* View billing and payment status.

### Dormitory/Apartment Manager
* View applications for assigned dormitory.
* Approve or reject accommodation requests (initial screening).
* Assign rooms or bed spaces.
* Manage occupancy and move-in/move-out records.
* Report room availability issues.

### Housing Administrator (Admin) / Landlord
* Final approval of accommodation applications.
* Override room assignments if necessary.
* Manage dormitories, rooms, and users.
* Manage billing and payments.
* Generate official documents (assignment notices, billing statements).
* Generate reports.

---

## Possible User Classes
1. Student
2. Dormitory Manager
3. Housing Administrator (Admin)
4. Guest / Temporary Resident

---

## Accommodation Approval System

### General Flow
1. **Student** submits accommodation application.
2. **Dormitory Manager:**
 * Reviews application.
 * Checks room availability.
 * Provides initial approval or rejection.
3. **Housing/Apartment Administrator / Landlord:**
 * Grants final approval.
 * Assigns student to a room.
 * Generates accommodation notice.
4. **Student** is notified of status via email/system notification.

---

## Reports to be Generated
* List of all dormitories/apartments/bedspace with occupancy rates.
* Available vs occupied rooms per dormitories/apartments/bedspace.
* Students currently housed per dormitories/apartments/bedspace.
* Students on waiting list.
* Accommodation history of a given student.
* Revenue summary per dormitories/apartments/bedspace (if billing is implemented).
* List of overdue or unpaid dormitories/apartments/bedspace fees.

---

## Non-Functional Requirements
* Role-based access control.
* Secure authentication via UP Mail.
* Audit trail for approvals and assignments.
* Responsive web interface.
* Data validation and error handling.

---

## Notes for Students
* The system must follow software engineering principles discussed in CMSC 128.
* **Clear separation of:**
 * Requirements
 * Design
 * Implementation
* UML diagrams (use case, class, sequence) are encouraged.
* Assumptions must be clearly stated and documented.