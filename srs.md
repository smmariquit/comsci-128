	

# **Software Requirements Specification**

# **for**

# **University Student Accommodation Tracker**

**In partial fulfillment of the requirements of CMSC 128**

**Version 1.0**

**Prepared by CMSC 128 A13L**

**Feb 18, 2026**

**Table of Contents**

**[1\. Introduction	1](#introduction)**

[1.1 Purpose	1](#purpose)

[1.2 Document Conventions	1](#heading=)

[1.3 Intended Audience and Reading Suggestions	1](#heading=)

[1.4 Product Scope	1](#heading=)

[1.5 References	1](#heading=)

[**2\. Overall Description	2**](#heading=)

[2.1 Product Perspective	2](#product-perspective)

[2.2 Product Functions	2](#heading=)

[2.3 User Classes and Characteristics	3](#heading=)

[2.4 Operating Environment	3](#heading=)

[2.5 Design and Implementation Constraints	4](#heading=)

[2.6 User Documentation	4](#heading=)

[2.7 Assumptions and Dependencies	4](#heading=)

[**3\. External Interface Requirements	5**](#heading=)

[3.1 User Interface	5](#user-interface)

[3.1.1 Interface Overview	5](#3.1.1-interface-overview)

[3.1.2 Interface Components	6](#3.1.2-interface-components)

[3.1.3  Interface Standards	8](#3.1.3-interface-standards)

[3.2 Hardware Interfaces	9](#heading=)

[3.3 Software Interfaces	9](#heading=)

[3.4 Communications Interfaces	10](#heading=)

[**4\. System Features	11**](#heading=)

[4.1 Authentication and Access Control	11](#heading=)

[4.2 User Management	12](#heading=)

[4.3 Dormitory or Housing Management	14](#dormitory-or-housing-management)

[4.4 Accommodation Application Processing	16](#accommodation-application-processing)

[4.5 Room Assignment and Occupancy Tracking	18](#room-assignment-and-occupancy-tracking)

[4.6 Billing and Payment Management	20](#billing-and-payment-management)

[4.7 Reporting and Document Generation	22](#reporting-and-document-generation)

[4.8 Activity Logs	24](#activity-logs)

[**5\. Other Nonfunctional Requirements	25**](#other-nonfunctional-requirements)

[5.1 Performance Requirements	25](#performance-requirements)

[5.2 Safety Requirements	26](#heading=)

[5.3 Security Requirements	27](#heading=)

[5.4 Software Quality Attributes	28](#heading=)

[5.5 Business Rules	28](#heading=)

**Revision History**

| Name | Date | Reason For Changes | Version |
| :---- | :---- | :---- | :---- |
| CMSC 128 A13L | Feb 27, 2026 | Initial release. This document was drafted collaboratively by the whole section. | 1.0 |

1. # **Introduction** {#introduction}

   1. ## **Purpose**  {#purpose}

This Software Requirements Specification (SRS) document outlines the requirements for the University Student Accommodation Tracker version 1.0. The scope of this product includes a centralized web-based platform designed to manage the entire lifecycle of student housing at the University of the Philippines Los Baños. This includes the digital application process, room allocation, occupancy monitoring, and administrative reporting. This system is intended to replace current fragmented manual forms and spreadsheets with a unified digital workflow.

2. ## **Document Conventions**

The title page of this document is written in Arial font, sizes 32 and 20 for the title, and 14 for the  
subtitles. Headers are written in bold Times New Roman, with section headers at size 18 and subheaders at size 14\. The rest of the text in this document is in Arial, size 11\.

3. ## **Intended Audience and Reading Suggestions**

This document is intended for the stakeholders (developers, product owner, and client) and users (students, dorm managers, housing administrations) of this project. Non-technical users may skim across Chapters 3 to 5, while developers are encouraged to read through the entire document carefully.

4. ## **Product Scope**

The University Student Accommodation Tracker is a management system developed for CMSC 128 (*Introduction to Software Engineering*) to streamline student housing operations. This software serves as a bridge between students seeking housing and the administrators managing on-campus dormitories, off-campus university housing, and partner private accommodations.

The primary objectives and benefits of the system include, but are not limited to, the following: 1\) centralization by replacing manual forms, email exchanges, and fragmented spreadsheets with a single platform for all housing transactions; 2\) efficiency by automating the application and approval workflow, including initial screening by dorm managers and final approval by housing admins; 3\) transparency by providing students updates on their application status and room assignments; 4\) resource management by ensuring proper tracking of occupancy and preventing overbooking; and, 5\) accountability by implementing role-based access control and audit trails for all approvals and assignments, ensuring data integrity.

5. ## **References**

This document is based on a template downloaded from IEEE, distributed by Dr. Shyama Prasad Mukherjee University. 

2. # **Overall Description**

   1. ## **Product Perspective** {#product-perspective}

The University Student Accommodation Tracker is a responsive web-based application designed to streamline the fragmented accommodation processes of the university. It provides a centralized platform for managing applications, room assignments, occupancy records, billing, and related administrative tasks.

The system supports secure authentication and notifications through UP Mail. The system also supports role-based access, ensuring that students, dormitory managers, and housing administrators have access only to functions relevant to their responsibilities.

**Figure 1**  
*System Context Diagram:*  
![][image1]

2. ## **Product Functions**

The system provides the following functionalities:

* User login with Google / UP Mail authentication  
* Role-based access control to support different levels of user permissions  
* Display and management of accommodation information including availability and occupancy rates  
* Submission and processing of accommodation applications  
* Real-time monitoring and display of application and accommodation assignment status.  
* Submission and management of room availability issues  
* Recording and monitoring of user activity logs  
* Administrative management of user records and dormitory data  
* Billing and payment verification for dormitories/apartments/bedspace fees  
* Generate report of unpaid or overdue dormitories/apartments/bedspace fees  
* Billing periods during which bills are generated and payments are collected  
* Revenue summary per dormitories/apartments/bedspace 

  3. ## **User Classes and Characteristics**

Students are the primary users of the system. They interact with the system to apply for dormitory accommodations, submit necessary documents, and track their application and assignment status. The system centralizes all relevant files and records, replacing the previous fragmented processes.

Housing Authorities pertain to the administrative bodies responsible for managing accommodation operations. This role may correspond to the UP Housing Office for UP dormitories or a Private Landlord for non-UP housings. 

They have the authority to make final decisions on accommodation applications. Their decision on a student’s application would be reflected on the system for the students to see. They manage billing and payment processing. They also generate reports and official documents related to these activities. 

Access privileges are restricted to dormitories assigned to the specific authority. In the absence of a designated manager for a dorm or apartment, the initial approval of applications and verification of room availability are given to the Private Landlord.

Dormitory or Apartment Managers act as intermediaries between students and the Housing Administrator. They review applications, assign rooms and bedspaces, and manage occupancy records, including move-ins and move-outs. They also report on room availability issues. 

Each dormitory is assumed to have one designated manager. However, a manager can oversee multiple dormitories. Non-UP dorms or apartments may operate without an assigned manager. In such cases, a manager’s responsibilities would be performed directly by the Private Landlord.

The System Administrator holds the highest level of access within the system. They oversee the vetting of landlords and validation of student status. The System Administrator manages system-wide configurations and maintains full access to master data, including dormitory records, user accounts, and other core system information.

4. ## **Operating Environment**

**Server & Deployment Environment**  
The system backend and frontend are implemented using the NextJS framework built on React and runs on the NodeJS environment. The software is deployed on Vercel, a serverless cloud platform. Supabase handles the database management and authentication using its PostgreSQL database and Google user authentication services.

**Client Environment**  
End-users can access the application through any standard, modern web browser (e.g., Chrome, Firefox, Edge, Safari) on any device, provided they have a stable internet connection and JavaScript enabled.

**Development Environment**  
For local development, the system can be executed on any operating system that has [Node](http://Node.js)JS installed.

5. ## **Design and Implementation Constraints**

The design and implementation of the system is limited by the timeframe of the University of the Philippines Los Baños academic calendar for the second semester of AY 2025-2026 given that it is a requirement in the course CMSC 128\. The team members use their personal computers and hardware resources for the software development which may set constraints on local testing based on the storage, compatibility and performance of these devices. 

The system is implemented as a web application written in TypeScript using the NextJS framework built on React, with Tailwind assisting the styling. Database management and authentication services will be provided by Supabase. This technology infrastructure is fixed for the duration of the development. The system database must follow strict security policies such that clients’ sensitive information will be hidden and users can only view and modify data in accordance to their role. The team will not be responsible for maintaining the delivered software.

6. ## **User Documentation**

The system shall include a README file in Markdown format which contains a detailed description of the software’s purpose and functionalities, installation instructions, system requirements, and instructions for end users on how to access and navigate the system’s features. The document shall be accessible through the project repository.

7. ## **Assumptions and Dependencies**

1. The users of the University Student Accommodation Tracker must have basic computer literacy skills to be able to access, navigate, and interact with the system.  
2. The device which the user intends to use must be able to run a modern and up-to-date web browser supporting JavaScript to be able to access the system.  
3. In line with AD-2, the device must also be able to sustain a stable internet connection for as long as is necessary in the facilitation of secure and authorized transactions between the client and the server.  
4. All data transmission between the client and the server is done via HTTPS, which is required to ensure data confidentiality and integrity in transit.  
5. The system utilizes Google’s OAuth service for UP mail authentication. The system cannot authenticate users if the Google identity service is unavailable.  
6. The application is hosted on Vercel. Scheduled maintenance or service outages on the Vercel platform may render the application unreachable.  
7. The application relies on external DNS resolution (e.g., Cloudflare) to route traffic. Disruptions at the DNS layer or within the wider internet routing infrastructure will prevent users from accessing the system.

3. # **External Interface Requirements**

   1. ## **User Interface** {#user-interface}

This section contains the expected user interface requirements of the system, including an overview of the role-based portals, the interface components for each user class, and the accessibility standards the system shall comply with.

## **3.1.1	Interface Overview**  {#3.1.1-interface-overview}

The system is a responsive web application accessible via modern browsers. It consists of four role-based portals:

**Table 1**  
*Role-based Portals and their Functionalities*

| Portal | Users | Primary Functions |
| :---- | :---- | :---- |
| Student/Guest Portal | Students/Guest/Temporary Residents | Browse housing, submit applications, upload documents, track status |
| Manager Portal | Dormitory/Apartment Manager | Review submitted applications, Room assignments, Occupancy tracking |
| Admin Portal | Housing Administrators Landlords | Final approval of applications, override assignments, manage dormitories and users, manage billing and payments, generate reports |
| System Admin Portal | System Admin | Manage all user accounts, assign landlords and housing admins to specific accommodations, full access to audit logs, and system-wide configuration. |

All portals share a uniform design with role-specific navigation sidebars and are accessed through a secure login with UP Mail/Google authentication.

## **3.1.2	Interface Components** {#3.1.2-interface-components}

All portals share a common navigation bar and role-specific sidebar to maintain a consistent and uniform user experience across the system. The system shall provide separate interfaces for Students/Guests, Managers, Housing Administrators/Landlords and System Admin.

### 3.1.2.1 Student/Guest Interface

The Student/Guest interface shall include the following components:

* **Login Page**

  The system shall allow students/guests to authenticate using their UP Mail or Google Account


* **Dashboard**

  The dashboard shall display the user’s:

* Application Status (pending, approved, rejected, waitlisted)  
* Assigned room information  
* Pending notifications  
* Billing summary

* **Housing Browser**

  The system shall allow students to:

* View available dormitories/apartments  
* View room types, capacity, and availability status  
* Filter housing options by type and location

* **Application Form**

  The system shall provide a multi-step form that allows student to:

* Select preferred dormitory/apartment and room type  
* Submit application within allowed application period  
* Validate required fields before submission


* **Document Upload Page**

  The system shall allow users to upload required supporting documents (e.g., proof of enrollment) in supported file formats.


* **Billing Status Page**

  The system shall display:

* Outstanding Balance  
* Billing History  
* Due dates  
* Payment-related information

### 3.1.2.2 Manager Interface

The Manager portal shall include the following components:

* **Login Page**

  The system shall allow managers to authenticate using their UP Mail or Google Account.


* **Dashboard**

  The dashboard shall display the user’s:

* Pending housing applications for dormitories/apartments  
* Occupancy Statistics and Visual representation   
* Alerts related to the assigned dormitory

* **Application Review Page**

		The system shall provide a dedicated interface for reviewing submitted applications

* **Room Assignment Interface**

  The system shall allow managers to update occupancy of students or guests and assign them to designated rooms


* **Occupancy Tracker**

  The system shall record and manage student move-in and move-out dates for assigned room or dormitory/apartment

### 3.1.2.3 Housing Admin / Landlord Interface

The Housing Admin/ Landlord portal shall include the following components:

* **Login Page**

  The system shall allow administrators to authenticate using their UP Mail or Google Account


* **Dashboard**

  The dashboard shall display the user’s:

* List of applications  
* Occupancy statistics  
* Active users

* **Dormitory and Room Management Module**

  Allows administrators to create, update, and delete dormitories, rooms, and bed spaces.


* **User Management Module**

  Allows administrators to manage student, manager, and guest accounts.


  

* **Billing Management Module**

  Allows generation of billing statements, recording of payments, and monitoring of overdue accounts.


* **Reports Generation Module**

  Allows generation of occupancy, application, revenue, and accommodation history reports.


* **Audit Log Viewer**

  Display user activity logs which includes login activity, approvals, assignments and billing updates.

### 3.1.2.4 System Administrator Interface

The System Administrator Portal shall include the following components:

* **Login Page**  

  Allows the System Administrator to authenticate using their UP Mail or Google account via OAuth 2.0


* **Dashboard** 

  Displays a system-wide overview of total active users, total dormitories, recent activity, and other necessary information for managing the system.


* **User Management Module** 

  Allows the System Administrator to manage user accounts across. 


* **Role Assignment Module** 

  Allows the System Administrator to assign or reassign landlords and housing administrators to specific dormitories or accommodations.


* **Audit Log Viewer** 

  Provides full unrestricted access to all system-wide activity logs


* **System Configuration Module** 

  Allows management of system-wide settings such as bypassing application periods and other configurable parameters

## **3.1.3  Interface Standards** {#3.1.3-interface-standards}

The system shall comply with recognized web accessibility and usability standards. The user interface shall adhere to Level AA compliance of the Web Content Accessibility Guidelines (WCAG) 2.1 published by the World Wide Web Consortium (W3C), to the extent permitted by the project timeline and available resources.

### 3.1.3.1  Accessibility Standards

The system shall implement the following accessibility requirements:

* **Alternative Text** \- All non-text content shall include descriptive text  
* **Contrast Ratio**  \- Normal text shall meet a minimum contrast ratio of 4.5:1 and large text at 3:1.  
* **Zoom and Responsiveness** \- Users should be able to zoom in up to 200% without compromising functionality.  
* **Keyboard accessibility**  \- interactive elements (button, links, forms) must be usable via Tab key.  
* **Skip Navigation** \- A “Skip to content” must be implemented to allow users bypass repetitive navigation.  
* **Semantic Structure** \- The system shall use proper HTML semantic elements; text shall not be embedded within images when HTML/CSS alternatives are available.

  	

  2. ## **Hardware Interfaces**

The system does not require any specialized hardware components. It operates as a web-based application accessible through devices capable of running modern web browsers.

Minimum device requirements include:  
**Display** \- a screen capable of displaying and rendering a modern web browser with a       minimum resolution of 360 x 640 pixels.  
**I/O Devices** \- a keyboard and pointing device (mouse or touchscreen) for interacting with the web interface.  
**Network Adapter** \- A functional network adapter capable of maintaining stable internet connection for client-server communication.

Aside from this, the system does not require any external peripherals or devices.

3. ## **Software Interfaces**

The system shall interface with the following external software components to support and perform its core features. Each specific component description identifies data items or messages exchanged, the purpose of the interface, and its data sharing mechanism.  
	  
**Google OAuth 2.0 / Google Identity Platform:** The system shall redirect authentication requests to Google’s Identity Platform through Supabase Auth. OAuth 2.0 allows access to user data without exposing their login credentials by having access to a user’s data via tokens rather than passwords.  
	  
**Next.js 16 (React Framework):** The system shall use Next.js 16, which runs on a Node.js environment, for the frontend rendering and backend API route handling. Data exchanged between the client and the server consists of  HTTP requests/responses in JSON format.

**SMTP Email Service:** The system shall use a SMTP-compatible provider for sending email notifications for billing, application status, and updates. Outgoing email data includes HTML/CSS-formatted message body, recipient address, and subject.

**Supabase:** The system shall use Supabase as its backend service provider. The system will utilize the following core interfaces of Supabase:

* **PostgreSQL Database:** The system shall use Supabase, which uses PostgreSQL as its database engine, as the primary database to store all system data. Data in the Supabase is managed through the Supabase JavaScript client library.  
* **Supabase Auth:** The system shall delegate authentication to Supabase Auth that internally communicates with Google’s OAuth 2.0 Identity Provider to facilitate verification of UP mail credentials. Successful logins will receive a JSON Web Token (JWT) given by Supabase. The system uses JWT to validate user sessions.  
* **Supabase Storage:** The system shall use Supabase Storage for all uploaded files. The system shall accept only PDF, image (.jpg, .png, .jpeg), CSV, and Excel files.  
    
  **Vercel:** The system shall be deployed on Vercel’s serverless cloud platform to simplify the deployment and hosting of the frontend application. It is suited for Next.js, React, and others for the development process. Vercel also uses a Global Content Delivery Network (CDN) for quick loading of applications.


### 3.3.1  Shared Data Across Software Components

Data items shared and remain consistent across software components include:

* **Application and Occupancy Records** \- shared between Next.js frontend and Supabase PostgreSQL. These data records stored in Supabase PostgreSQL are fetched by the frontend for display.  
* **Activity Logs** \- shared between Supabase PostgreSQL and Next.js Admin Interface. System logs are stored in PostgreSQL and can be accessed or retrieved by the Admin interface. These logs are immutable and cannot be modified through any application interface.  
* **Billing and Payment Records** \- shared between Supabase PostgreSQL, Next.js frontend, and SMTP Email Service. These data records stored in PostgreSQL are displayed in the frontend and email notifications.  
* **User Identity (JWT)** \- shared between Next.js, Supabase auth, and API Routes. JWT is used to verify user identity and role.

  4. ## **Communications Interfaces**

The system is primarily a web app and is dependent on the availability of a client’s HTTPS connection to the server and on the availability of a DNS service from the client to the user. The HTTPS connection also ensures that all data sent is encrypted using TLS 1.2 or higher in transit.

The system must also be able to connect to Google’s OAuth2.0 via Google Identity Provider, as the user’s UP mail credentials are needed for authentication. The system will receive a JSON Web Token (JWT) upon successful login to manage user sessions.

The system shall use SMTP to send email notifications. All outgoing emails shall be formatted in HTML/CSS for professional presentation. The primary data exchange between the frontend (NextJS) and the backend API shall be JSON. The system shall use asynchronous communication for API requests. The following events shall trigger the email notification system: authentication of UP Mail, accommodation application status updates, billing statements, and payment confirmations.

To prevent storage exhaustion, document uploads shall be transmitted over HTTPS, and client-side validation shall enforce file type and size restrictions.

All API requests shall have a 30-second timeout. If a connection fails, the system provides a user-friendly “request timed out” message. 

4. # **System Features**

   1. ## **Authentication and Access Control**

4.1.1	Description and Priority

This feature allows users to access the accommodation system using a valid Google or UP Mail account. It adopts role-based access control to ensure authorized user interactions and implement a secure system. Roles are defined as Student, Dormitory Manager, Housing Administrator, System Administrator to grant appropriate access.

**Priority**: High

4.1.2	Stimulus/Response Sequences

1. The user is initially directed to the “Login” page.  
2. The system displays a “Login with Google / UP Mail” button.  
3. The user selects the “Login with Google / UP Mail” button.  
4. The system connects to the authentication page.  
5. The user enters their Google or UP Mail credentials.  
6. The system validates their university credentials.  
   1. Upon successful validation:  
      1. The system identifies the user’s role.  
      2. The system initially provisions the lowest role (Student) by default unless manually assigned by the System Administrator as Dormitory Manager or Housing Administrator.  
      3. The system redirects the user to their respective dashboard based on role.  
      4. The system logs the session activity.  
   2. Upon failed validation:  
      1. The system displays an error message for invalid credentials.  
      2. The system prevents system access.  
7. The user forgets their password:	  
   1. The user clicks the “Forgot Password” button in the sign-in page.  
   2. The authentication provider (Google) handles the password reset.  
8. The user performs role-specific tasks.  
   1. Student: View accommodations, submit applications, upload documents  
   2. Dormitory Manager: Review applications, check accommodation availability, room assignment  
   3. Housing Administrator: Manage dormitories, students, managers  
   4. System Administrator: System management, role assignment, vetting of landlords, validating student access  
9. The user clicks the “Logout” button.  
10. The system terminates the session and returns to the initial “Login” page.

4.1.3	Functional Requirements

REQ-1:	The system shall validate user credentials through Google or UP Mail authentication.  
REQ-2:	The system shall provide a secure session upon successful authentication, and shall automatically timeout after a period of inactivity.  
REQ-3:	The system shall implement the Role-Based Access Control to restrict features based on the assigned user class.  
REQ-4:	The system shall authorize system privilege access based on the assigned user class.  
REQ-5:	The system shall allow or deny access to the system and return an error code and message for instances that the user with lower permissions attempts to manually navigate restricted portions of the system.   
REQ-6:	The system shall have a respective user dashboard based on the assigned user class.  
REQ-7: 	The system shall automatically record activity for any actions performed by the user during the session using an Audit Trail. The log will include user ID, timestamp, IP address, actions performed by the user, and affected entities.  
REQ-8: 	The system shall clear and invalidate the session upon user logout.

2. ## **User Management**

4.2.1	Description and Priority

This feature sets and maintains the digital identities of all individuals interacting with the University Student Accommodation Tracker. Ensures accurate user records, enables profile personalization, and structures the organizational hierarchy within the system.

**For Students**: This feature allows them to automatically create an account via UP Mail upon their first login, complete their profile setup, and maintain updated personal and emergency contact information.

**For Dormitory Manager**: This feature enables them to view the profiles and contact details of the specific students residing in their assigned dormitories. For managers affiliated with private partner accommodations, access is granted only after their non-university-issued email addresses have been pre-validated and authorized by the System Administrator.

**For Housing Administrator and Landlord**: This feature grants full administrative control over the system's user base. They can onboard new dormitory managers, update user roles, and deactivate accounts of individuals who are no longer affiliated with the university while preserving historical data. For private partner personnel, non-university-issued email accounts must be pre-validated and activated by the System Administrator prior to role assignment and system access.

**Priority**: High

4.2.2	Stimulus/Response Sequences

1. The unregistered student logs into the system for the first time via UP Mail.  
a. The system automatically generates a new "Student" profile.  
b. The system prompts the student to complete missing profile details (e.g., contact number, emergency contact).  
3\. The student navigates to "My Profile" and updates their contact information.  
a. The system validates the new input format.  
b. The system saves the updated personal information to the database.  
4\. The Housing Administrator navigates to "Manage Users" to onboard a new staff member.  
a. If there are no users, the system displays a user-friendly error message.  
b. The Housing Administrator enters the staff member's UP Mail and assigns the "Dormitory Manager" role.  
c. The system creates the new profile and grants the associated manager privileges.  
5\. The Dormitory Manager navigates to "View Residents".  
a. The system retrieves and displays the user profiles exclusively assigned to the dormitories managed by that specific manager.  
b. The system hides the profiles of students from unassigned dormitories.  
6\. The Housing Administrator selects a user profile and clicks "Deactivate Account".  
a. The system prompts for a confirmation and reason for deactivation.  
b. Upon confirmation, the system updates the account status to "Inactive."  
c. The system restricts future access for that user while retaining their past application, accommodation, and billing history.

4.2.3	Functional Requirements

REQ-1: The system shall automatically generate a Student profile upon the first successful authentication of an unregistered user.

REQ-2: The system shall require new students to complete mandatory profile fields (e.g., full name, contact number, emergency contact details) upon initial account creation.

REQ-3: The system shall allow Students to view and update their own personal and contact information.

REQ-4: The system shall prevent Students from modifying their own assigned user role or system privileges.

REQ-5: The system shall allow the Housing Administrator to manually register new profiles and assign them the "Dormitory Manager" or "Housing Administrator" roles.

REQ-6: The system shall allow the Housing Administrator to view, search, and edit all user profiles across the entire system.

REQ-7: The system shall allow Dormitory Managers to view the profiles and contact information of Students strictly assigned to their designated dormitories.

REQ-8: The system shall prevent Dormitory Managers from viewing or modifying the user profiles of students outside their assigned jurisdiction.

REQ-9: The system shall allow the Housing Administrator to deactivate user accounts.

REQ-10: The system shall retain all historical data (applications, occupancy tracking, billing records) associated with a deactivated user account.

3. ## **Dormitory or Housing Management** {#dormitory-or-housing-management}

4.3.1	Description and Priority

This feature allows management of all dormitories and housing facilities, as well as the rooms and bed spaces within them. Only dormitory managers and housing administrators can perform these actions.

**For Dormitory Manager:** This feature enables them to view and update the occupancy of rooms or bed spaces within the dormitory or housing facility. The system shall enforce that each dormitory can only be handled by one assigned dormitory manager at a time; however, a dormitory manager may oversee multiple dormitories. In the absence of a dormitory manager, the housing administrator or landlord shall take the responsibility of a dormitory manager.

**For Housing Administrator and Landlord:** This feature provides control over all dormitories and rooms, both on and off the campus. They can add, view, update, and delete (CRUD) dormitories and rooms. The system requires that only one entity, the housing administrator, operate on-campus dormitories or housing units. Likewise, off-campus dormitories or housing units are under the responsibility of landlords.

**Priority:** High

4.3.2	Stimulus/Response Sequences

1. The dormitory manager navigates to “Manage Rooms” for their assigned dormitory.  
   1. The system displays all rooms and bed spaces in the dormitory, including room number, room type (single, double, shared), capacity, current occupancy, and availability status. Otherwise, display a “No room available” message.  
2. The housing administrator or landlord navigates to “Manage Dormitories”.  
   1. The system displays all dormitories and rooms added by the house administrator or landlord, including assigned dormitory managers, capacities, current occupancy, and availability. Otherwise, display a “No dormitory available” message.  
3. The housing administrator or landlord creates, updates, or deletes dormitories and rooms.  
   1. Upon successful operation:  
      1. The system saves the changes.  
      2. The system logs the action with timestamp, user, and entity affected.  
   2. Upon failed operation:  
      1. The system displays an error message.  
4. The housing administrator or landlord views full administrative logs of all owned dormitory and room management actions.  
   1. The system displays a complete audit trail, including action type, user, timestamp, and affected entity.

4.3.3	Functional Requirements

REQ-1:	The system shall allow the housing administrator and landlord to do CRUD operations on dormitories on and off the campus, requiring the following fields: Name, Location, Type (on-campus, off-campus university-managed, or partner private accommodation), and Capacity

* Create: Add new dormitories or housing facilities.  
* Read: View details of all dormitories or housing facilities.  
* Update: Modify details of existing dormitories or housing facilities.  
* Delete: Remove existing dormitories or housing facilities.

  REQ-2:	The system shall allow the housing administrator and landlord to do CRUD operations on rooms and bed spaces for all dormitories, requiring the selection of a Room Type (Single, Double, or Shared).

* Create: Add new rooms and bed spaces.  
* Read: View details of all rooms and bed spaces.  
* Update: Modify details of existing rooms and bed spaces.  
* Delete: Remove existing rooms or bed spaces from the system.

  REQ-3:	The system shall restrict access to dormitory and room management functions exclusively to dormitory manager, housing administrator, and landlord.

  REQ-4: 	The system shall restrict dormitory managers to viewing and managing only the dormitories assigned to them.

  REQ-5: 	The system shall enforce that each dormitory is assigned to at most one dormitory manager at a time.

  REQ-6: 	The system shall allow dormitory managers to be assigned to multiple dormitories.

  REQ-7: 	The system shall allow only the housing administrator to create, update, or delete on-campus dormitories.

  REQ-8:	 The system shall allow only the landlord to create, update, or delete off-campus dormitories owned by the landlord.

  REQ-9:	The system shall give the responsibility of a dormitory manager to a house administrator or landlord if there is no dormitory manager assigned to a housing facility.

  REQ-10:	The system shall allow the housing administrator or landlord to assign dormitory managers to specific dormitories.

  REQ-11:	The system shall log all administrative actions performed on dormitories, apartments, and rooms, including: 

* User performing the action  
* Timestamp  
* Action type  
* Affected entity


  4. ## **Accommodation Application Processing** {#accommodation-application-processing}

4.4.1	Description and Priority

**For Students:** This feature allows students to view available dormitories, apartments, and bed spaces along with their room types. Students can submit an application to the system that includes all of the required documents. Students can monitor their application status and can only apply during the time period specified by the housing administrator or landlord.

**For Dormitory Manager:** This feature enables the manager to view all applications within the designated dormitories. The system gives control over the initial screening for approval or rejection of the application.

**For Housing Administrator and Landlord:** This feature grants the administrator control over the final screening for applications. In the case when there is no dormitory manager present within a facility, the housing administrator shall take the responsibility of a dormitory manager.

**Priority:** High

4.4.2	Stimulus/Response Sequences

1. The student navigates to "Dormitories."  
   1. The system displays all available dormitories and room types.  
2. The student selects the preferred dormitory or apartment, as well as the room type or bed space,  and uploads required documents.  
   1. The system validates the following criteria:  
      1. The application is submitted during the allowed period specified by the housing administrator or landlord.  
      2. The required fields (e.g. Room type) are completed.  
      3. The required documents (e.g. Proof of enrollment) are uploaded.  
      4. Upon successful validation:  
         1. The system accepts the application.  
         2. The system sets the status to "Pending."  
         3. The system displays confirmation of the application.  
      5. Upon failed validation:  
         1. The system displays a corresponding error message.  
         2. The system prevents the application from being submitted.  
3. The student navigates to "My Application."  
   1. The system displays the submitted information, including the preferred dormitory or apartment, as well as the room type or bed space, and the application’s current status.  
4. The dormitory manager navigates to “Housing Application”.  
   1. The system displays all applications to the designated dormitories, apartments, or bed spaces.  
5. The dormitory manager approves or rejects the application.  
   1. The system shall perform one of the following actions:  
      1. Upon approval:  
         1. The system passes control to the house administrator for the final screening of the application.  
      2. Upon rejection:  
         1. The system sets the status to “Rejected”.  
6. The house administrator approves or rejects the application.  
   1. Upon approval:  
      1. The system sets the status to “Approved.”  
   2. Upon rejection:  
      1. The system sets the status to “Rejected”.

4.4.3	Functional Requirements

REQ-1:	The system shall allow the student to view a list of available dormitories and room types.  
REQ-2:	The system shall require the student to select one preferred dormitory or apartment, as well as the room type or bed space per application.  
REQ-3:	The system shall require the student to upload the required documents with a maximum upload size of 10MB.  
REQ-4:	The system shall prevent the student from submitting their application if there are any missing field requirements.  
REQ-5:	The system shall prevent the student from submitting their application outside the allowed application period specified by the housing administrator or landlord.  
REQ-6:	The system shall display an error message if the uploaded documents exceed the maximum size of 10MB.  
REQ-7:	The system shall provide an option for cancelling an application once it has been submitted.  
REQ-8:	The system shall enforce a private transaction between the applicant and the authority (i.e. the transaction for application is between the student and the housing authority such as dormitory manager, house administrator, and landlord)  
REQ-9:	The system shall allow the student to view the details of the application, including the application status and details.  
REQ-10:	The system shall assign a default “Pending” status to valid applications.  
REQ-11:	The system shall grant exclusive control of initial screening for approval to dormitory managers.  
REQ-12:	The system shall grant exclusive control of final screening for approval to the house administrator or landlord.  
REQ-13:	In the absence of a dormitory manager, the system shall immediately provide control to the house administrator or landlord for final screening of the application.	  
REQ-14:	The system shall require the dormitory manager and house administrators to select either an approval or a rejection of an application with remarks.  
REQ-15:	The system shall prevent the dormitory manager and house administrators from sending an approval or a rejection of an application without remarks.  
REQ-16:	The system shall reassign an “Approved” or “Rejected” status after the final screening.  
REQ-17: The system shall pass the application data to the house administrator upon approval of the dormitory manager.  
REQ-18:	The system shall save a draft of the application if it is partially completed.

5. ## **Room Assignment and Occupancy Tracking** {#room-assignment-and-occupancy-tracking}

4.5.1	Description and Priority

This feature enables room occupancy management to prevent overbooking while maintaining a detailed accommodation history and occupancy record for each student. The system prevents overbooking by verifying the room capacity limits. Moreover, it monitors move-in and move-out dates. This information is used to track a student's accommodation history and enables the system to report room availability difficulties.

**For Dormitory Manager:** This feature enables them to assign rooms or bed spaces within the dormitories they oversee, manage occupancy records, including move-in and move-out dates, and report room availability issues to the housing administrator or landlord.

**For Housing Administrator and Landlord:** This feature allows them to assign rooms and override initial room assignments if necessary.

**Priority:** High

4.5.2	Stimulus/Response Sequences

1. The dormitory manager navigates to “Manage Rooms.”  
2. The dormitory manager selects an available room or bed space and assigns the student.  
   1. Upon successful assignment:  
      1. The system updates the occupancy record.  
      2. The student’s assignment status is set to “Assigned.”  
      3. The system logs the move-in date.  
      4. The system records the assignment in the activity log.  
   2. Upon failed assignment:  
      1. The system prevents overbooking.  
      2. The system displays an appropriate error message.  
3. The dormitory manager updates the student’s move-out date or marks the student as moved out.  
   1. The system updates the occupancy records.  
   2. The system logs the move-out action in the activity log.  
   3. The student’s assignment status is updated accordingly (e.g., “Vacated”).  
4. The dormitory manager reports room availability or occupancy issues.  
   1. The system records the issue in the administrative log.  
   2. The system notifies the housing administrator if action is required.  
5. The housing administrator navigates to “Manage Dormitories.”  
6. The housing administrator selects a student and overrides the room assignment when necessary.  
   1. The system updates occupancy records.  
   2. The system logs the override action in the activity log.

4.5.3	Functional Requirements

REQ-1:	The system shall allow the dormitory manager to assign approved students to available rooms or bed spaces within the facilities they oversee.  
REQ-2:	The system shall automatically update the student’s assignment status (e.g., “Assigned,” “Vacated”) based on occupancy actions.  
REQ-3:	The system shall allow the housing administrator and landlord to assign students to rooms or bed spaces within their authorized dormitories.  
REQ-4:	The system shall allow the dormitory manager to manage occupancy records, including move-in and move-out dates for students in their assigned dormitories.  
REQ-5:	The system shall allow the dormitory manager to report room availability issues via in-app and email to the housing administrator or landlord.  
REQ-6:	The system shall allow the housing administrator or landlord to override room assignments when necessary and will notify the affected students.  
REQ-7:	The system shall notify the affected students via in-app notification when the housing administrator or landlord overrides the room assignments  
REQ-8:	The system shall prevent overbooking by validating room capacity against current occupancy before confirming assignments.  
REQ-9:	The system shall enforce concurrency control mechanisms to prevent simultaneous assignments from exceeding room capacity.  
REQ-10:	The system shall maintain a complete accommodation history for each student, including:

*  All past rooms assigned  
* Current room assignment  
* Corresponding move-in date  
* Corresponding expected move-out date  
* Corresponding actual move-out date

  REQ-11:	The system shall log all room assignments, occupancy updates, override actions, and issue reports, including:

* User performing the action  
* Timestamp  
* Action type  
* Affected dormitory, room, or student


  6. ## **Billing and Payment Management** {#billing-and-payment-management}

4.6.1	Description and Priority

This feature enables the centralized management and tracking of all financial transactions related to student accommodations. It replaces fragmented manual forms and spreadsheets with a digital billing system that automates fee calculations based on room assignments and additional student-declared assets.

**For Student:** This feature allows students to view their individual billing statements, request for a Statement of Account, upload proof of payment, and real-time payment status.

**For Dormitory Manager:** This feature allows managers to view the billing status of students of their dormitory. Managers can generate and issue Statement of Accounts (SOA) for their residents, but they cannot modify the billing amounts or finalize the payments in the system.

**For Housing Administrator and Landlord:** This feature provides full administrative control of the finances of their housing facilities in the system. They are responsible for setting their housing facilities’ accommodation rates and fees, granting final approval on billing records, managing official payments, and generating financial reports.

**Priority:** High

4.6.2	Stimulus/Response Sequences

1. The Housing Administrator navigates to “Manage Dormitories”.  
2. The system shall display a list of the housing administrator’s managed housing facilities; If no facilities are assigned, the system shall display a “No Facilities Managed” message.  
3. The Housing Administrator selects the "Billing Period Settings" and defines the date ranges for the current semester (e.g., February 1–28, March 1–31) or a custom application period for a private dorm.  
4. The system shall save these periods as the only valid options for SOA requests and reporting.  
5. The Housing Administrator selects one or multiple dormitories and clicks “Update Rates/Fees”  
6. The system shall provide an interface to modify the room rates and update or create new fees.  
7. The Housing Administrator modifies the room rates and/or creates new fees using the provided interface.  
8. The system shall validate the inputs and prompt for a “Confirm and Apply” action to finalize the updates.  
9. The Student navigates to Billing and Payments  
10. The system shall display the student’s total balance, due dates, and payment history.  
11. The Student selects the “Request SOA” option and specifies the billing period (e.g. Month of February).  
12. The system shall prompt the Student to declare payable items (e.g. Appliances) they currently have in their accommodation.  
13. The Student submits the declaration and SOA request.  
14. The system shall notify the Dormitory Manager of the pending request for their assigned facility; if no manager is assigned, the notification shall be sent directly to the Housing Administrator.  
15. The Dormitory Manager reviews the request and may add miscellaneous fees (e.g. penalties) or deductions (e.g. discounts or use of deposit) and clicks “Issue SOA”.  
16. The system shall generate the SOA by calculating the base room rate plus the additional fees or minus the deductions and can be downloaded as a PDF file.  
17. The Student uploads a digital copy of their proof of payment (bank transfer receipt or deposit slip) to the system.  
18. The system shall update the payment status to "For Verification" and notify the Dormitory Manager.  
19. The Dormitory Manager reviews the uploaded documents and finds it invalid (e.g, wrong amount, blurry image)  
20. The system shall set the payment status to “Rejected/Requires Re-upload” and notifies the Student.  
21. The Student reviews the rejection and uploads a new proof of payment.  
22. The system shall set the payment status to “For Verification” again.  
23. The Dormitory Manager reviews the uploaded document and approves the document.  
24. The system shall forward the verified record to the Housing Administrator for final approval.  
25. The Housing Administrator grants final approval to the payment record.  
26. The system shall update the student's status to "Paid" and record the transaction in the audit trail.

4.6.3	Functional Requirements

REQ-1:	The system shall allow Housing Administrators to define and manage a list of valid billing periods (e.g., monthly cycles) for their managed housing facilities.  
REQ-2:	The system shall provide an interface for Housing Administrators to set and update their base monthly rates for specific or multiple selected facilities they are managing/assigned to.  
REQ-3:	The system shall automatically calculate “Overdue” status if a billing record remains “Unpaid” 24 hours after the defined due date.  
REQ-4:	The system shall allow the addition of “Deductions” to a SOA to account for security deposits, prorated stays (calculated by dividing the monthly rate by 30 days and multiplying by the days of occupancy), scholarship rates, and other deductibles.  
REQ-5:	The system shall allow Housing Administrators to generate university-wide financial reports, including revenue summaries and lists of overdue fees.  
REQ-6:	The system shall provide a form for students to declare assets/consumables for a specific billing period.  
REQ-7:	The system shall calculate the total amount due by summing the facility-specific base fee and the miscellaneous charges for the selected period.  
REQ-8:	The system shall allow Dormitory Managers (and Housing Admins or Landlords) to view individual billing records and issue SOAs only for students within their assigned dormitory.  
REQ-9:	The system shall allow Students to upload proof of payment files (image/PDF).  
REQ-10:	The system shall restrict the final marking of a bill as "Paid" to the Housing Administrator / Landlord.  
REQ-11:	The system shall maintain an audit trail of all financial actions, including period definitions, rate changes, and payment approvals.  
REQ-12:	The system shall restrict the viewing of individual financial records to the specific Student, their assigned Dormitory Manager, and the relevant Housing Administrator.

7. ## **Reporting and Document Generation** {#reporting-and-document-generation}

4.7.1	Description and Priority

This feature enables the generation of real-time reports and official documents related to accommodation operations. It provides housing administrators and dormitory managers with actionable insights through occupancy summaries, financial reports, and applicant status summaries. Additionally, the system supports the generation of official documents such as admission letters, billing statements, and clearance forms for students.

**For Students:** this feature allows generation of personalized documents such as proof of accommodation, billing history, and application status letters.

**For Dormitory Managers:** this feature allows generation of reports limited to their assigned dormitories, such as current occupancy, move-in/move-out logs, and room availability issues.

**For Housing Administrators:** this feature offers full access to all system reports, including revenue summaries, occupancy trends, and audit logs. Administrators can filter data by date, dormitory, or student status and export reports in various formats.

**Priority:** Medium

4.7.2	Stimulus/Response Sequences

1. The housing administrator navigates to the "Reports" dashboard.  
   1. The system displays the available report types: Occupancy Summary, Financial Summary, Applicant Status Summary, and Activity Logs.  
   2. The system provides filter options including date range, dormitory, and applicant status.  
2. The housing administrator selects a report type and applies specific filters.  
   1. If the filter returns no matches, the system displays a user-friendly error message.  
   2. The system generates the report in real-time based on the selected filters.  
   3. The system displays the generated report in a tabular or graphical format within the interface, depending on the user’s preference.  
3. The housing administrator requests an export of the displayed report.  
   1. The system prompts the user to select an export format (PDF, CSV, or Excel).  
   2. Upon selection, the system generates the file and initiates a download.  
   3. The system records the export action in the audit trail, including the user, timestamp, and report type.  
4. The dormitory manager navigates to the "Reports" section from their dashboard.  
   1. The system displays report options limited to their assigned dormitory: Occupancy Report, Issues Report, and Move-in/Move-out Logs.  
5. The dormitory manager requests to generate an Occupancy Report.  
   1. The system displays the current occupancy data, including total capacity, available rooms, and a list of current residents with their move-in dates.  
6. The student navigates to the "My Documents" page.  
   1. The system displays a list of available documents that the student can generate: Billing Statement, Proof of Accommodation, and Clearance Form.  
7. The student requests to generate a specific document.  
   1. The system retrieves the student's current and relevant data from the database.  
   2. The system generates the document in PDF format, complete with the university logo and official headers and a watermark for tamper-prevention.  
   3. The system initiates a download of the generated document.  
   4. The system logs the document request action in the activity logs.

4.7.3	Functional Requirements

REQ-1:	The system shall allow housing administrators to generate the following reports:

* Occupancy Summary (includes per dormitory or university-wide)  
* Financial Summary (revenue per dormitory, overdue fees)  
* Applicant Status Summary   
* Activity Logs 

  REQ-2:	The system shall allow dormitory managers to generate reports limited to their assigned dormitories, including:

* Current Occupancy Report  
* Room Availability Issues Report  
* Move-in/Move-out Logs

  REQ-3: The system shall allow students to generate and download the following documents:

* Billing Statement  
* Proof of Accommodation / Accommodation Notice  
* Clearance Form

  REQ-4: The system shall provide filter options for reports, including:

* Date range  
* Dormitory  
* Applicant/Student status  
* Payment status  
  REQ-5: The system shall display generated reports in a readable format (tables, charts, or graphs) within the web interface.

  REQ-6: 	The system shall support export of reports in at least the following formats: PDF, CSV, and Excel.  
  REQ-7: 	The system shall log all report generation and document download actions in the audit trail, including user identity, timestamp, and report/document type.  
  REQ-8: 	The system shall restrict access to reports and documents based on the user roles:  
* Housing administrators: full access  
* Dormitory managers: access limited based on their assigned dormitories  
* Students: access is limited to their own documents and basic occupancy information

  REQ-9: 	The system shall ensure that generated documents reflect the most up-to-date information from the database at the time of request with a maximum allowance of 10 minutes.

  REQ-10: The system shall automatically generate an Accommodation Notice in PDF format once the Housing Administrator or Landlord grants final approval and assigns a room

  REQ-11: The system shall include the university logo, official headers, and timestamps on all generated official documents.

  8. ## **Activity Logs** {#activity-logs}

4.8.1	Description and Priority

This feature maintains a log of every transaction, identified by the user ID, partial IP address, transaction type, and timestamp, and specific data modified, if any. This ensures that the transactions made within the system are verifiable. Dorm managers can only see audit logs of the students who currently occupy their dormitory, as well as those of their fellow dorm managers of the same dorm.

		**Priority:** Medium

4.8.2	Stimulus/Response Sequences

1. A Dormitory Manager or Housing Administrator navigates to the “Activity Logs” Dashboard  
2. The system filters which activity logs to show based on their role and assigned dormitory, if any  
   1. If the search returns any activity logs, transactions are displayed in a tabular format with user ID, partial IP address that is masked by the backend, transaction type, timestamp, and specific data modified, if any.  
   2. If the search does not return any activity logs, the user is shown a message that there are no activity logs available.  
3. The viewer can narrow their search with any of these filters: user ID, partial IP address, specific transaction type, and a date range.  
4. If any activity logs appear based on the filtered search, they are displayed. Otherwise, the user is shown a message that there are no activity logs available.  
5. If the viewer wants to see the specific activity, they may click “View” on the identified transaction.  
6. The system details which specifically changed.

4.8.3	Functional Requirements

REQ-1: 	The system shall generate an audit log entry for every transaction within the system. Each entry must include: 

* User ID: the unique identifier of the actor  
* Timestamp: precise time of the transaction  
* Partial IP address  
* Transaction Type: categorization of the transaction (e.g. create user, approve payment)  
* Activity Info: the specific data modified

  REQ-2: 	The system shall capture the user's IP address, but must apply a masking algorithm at the backend level to display only a partial IP address to the viewer. The system shall only display the first two octets of the IP address (e.g. 192.168.x.x)

  REQ-3: 	The system shall enforce boundaries on data visibility based on user roles. Housing administrators shall have unrestricted access to all activity logs. Dorm managers shall only see logs related to their dormitory, actions performed by other managers assigned to the same dormitory, and students occupying their dormitory. Students shall see only logs of their activity.

  REQ-4:	 The system shall ensure that once an activity log is written to the database, it cannot be modified or deleted through the application interface, even by housing administrators.

  REQ-5:	 The "Activity Logs" dashboard shall allow users to narrow results based on the following parameters:

* User ID  
* Date range  
* Partial IP address  
* Transaction type

  REQ-6: 	The system shall provide a “View” function for each log entry. Upon using this, the system shall display a detailed comparison on the specific data fields that were altered during the transaction.


5. # **Other Nonfunctional Requirements** {#other-nonfunctional-requirements}

   1. ## **Performance Requirements** {#performance-requirements}

**5.1.1 Page Load Time**  
*The system shall have 2-3 seconds of loading time for each page under normal operating conditions with up to 500 concurrent users and peak load conditions with up to 1000 simultaneous users during the housing application period.* 

	**5.1.2 Authentication Performance**  
*The system shall complete authentication within 3 seconds and shall provide error message for failed authentication attempts within 2 seconds. The immediate feedback from failed attempts minimizes confusion and reduces repeated login submissions that may increase system load. This will also allow users to have sufficient time to secure credential validation.* 

**5.1.3 CRUD Operations**

* ***Dormitories and Housing***

  *The system shall complete CRUD operations within 2-3 seconds for a single record while listing all dormitories within 5 seconds under normal operating conditions.*

* ***Rooms and Bed Spaces***

  *The system shall complete CRUD operations within 2-3 seconds per room while full listing of all rooms shall complete within 5 seconds under normal operating conditions. Updating room availability shall reflect in the database within 1 second.*

* ***Student Users***

  *The system shall complete CRUD operations on a student record within 2-3 seconds while listing of all student profiles shall complete within 5 seconds under normal operating conditions.*

* ***Accommodation applications***

  *The system shall complete CRUD operations on a single application within 2-3 seconds while retrieval of all applications shall complete within 5 seconds. Submitting application shall complete within 3 seconds. Application rejection/approval shall complete within 2 seconds and status updates shall reflect in real-time with at most 1 second delay. All under normal operating conditions.*

* ***Housing Administrators/Landlords***

  *The system shall complete CRUD operations within 2-3 seconds per record under normal operating conditions.*

	*If CRUD operation fails, the system shall notify the user with error messages within 2 seconds. The immediate and real-time updates ensure system responsiveness and accurate information for both students and administrators.*

**5.1.4 Report Generation and Document Export**  
*The system shall generate summary and administrative reports within 5 seconds. Export and downloading of documents shall complete within 10 seconds under normal operating conditions.* 

2. ## **Safety Requirements**

The University Student Accommodation Tracker is a web-based information system. At the same time, it does not directly control physical hardware or infrastructure; the following safety requirement must be observed to prevent harm arising from data loss.

**5.2.1  Data Integrity and Loss Prevention**   
The system shall ensure that no accommodation, assignment record, billing entry, or student documents are permanently lost due to accidental deletion or system failure. All deletions of critical records shall require administrator-level confirmation. The system shall maintain database backups at regular intervals to enable recovery in case of failure. 

3. ## **Security Requirements**

**5.3.1 Role-Based Access Safeguards**

* The system shall enforce role-based access control to prevent unauthorized actions. Students shall not be permitted to approve their own applications, modify room assignments, or access other students’ personal records. Dormitory managers shall only access records for their assigned dormitory. Unauthorized access attempts shall be logged and flagged.


	**5.3.2 Audit Trail Preservation**

* The system shall maintain a complete, tamper-evident audit trail of all significant actions, including logins, application submissions, approvals, rejections, room assignments, and billing updates. This audit log shall not be editable by any user, including administrators, to ensure accountability and prevent concealment of errors or misconduct.


	**5.3.3 Compliance with University and Data Privacy Policies**

* The system shall comply with the Republic of the Philippines Data Privacy Act of 2012 (RA 10173\) and the University of the Philippines System’s data governance policies. Student personal data, housing records, and financial information shall be treated as confidential and shall not be disclosed to unauthorized parties. Consent for data collection and use shall be obtained from students during registration.


	**5.3.4 Document Upload Safety**

* The system must check every file that a student or manager uploads to the platform. This safety step ensures that only allowed file types, like PDFs or images for proof of enrollment, are accepted. By blocking hidden scripts or dangerous file formats, the system prevents hackers from sending viruses that could steal data or break the website.

	  
	**5.3.5 Data Encryption Standards**

* The system must protect all information as it moves between the user’s device and the university servers. By using standard encryption (like HTTPS), the system ensures that private details cannot be read by outsiders if they try to intercept the data. This keeps information safe even on public internet connections.

	  
	**5.3.6 Housing Data Access Safeguards** 

* The system must not allow the landlord or UP Housing Office to have access to data of dormitories or apartments that they are not assigned to. Upon login, the server shall display information only associated with their assigned housings.

	**5.3.7** **Student Identification**

* The system must tag users who are not logged in with a UP email address. These users will be labelled as non-UP users, and they are either a dormitory manager, landlord, or system administrator. This helps clearly distinguish the students from the higher authorities.

  4. ## **Software Quality Attributes**

***Availability:** The system must be accessible more than or equal to 90% of the time during peak registration periods, to ensure uninterrupted access for all users.*

***Portability:** The system must work on both personal computers and iOS/Android devices.* 

***Robustness:** The system must handle all invalid inputs made by the users without crashing.* 

***Correctness:** The system must accurately generate reports, and state accommodation assignments, billing, and payments.* 

***Reliability:** The system must return back to service at most 10 minutes in the case of an internal error or failure.*

***Maintainability:** Developers must fix any bugs on the system within 48 hours of the problem being reported.*

***Usability:** The system should allow users to do specific tasks such as accommodation searching, billing, or request submissions within 5 minutes maximum, without going through unnecessary steps.*

***Security:** The system must protect all information within its database. It may include 2FA or standard data encryption.*

***Scalability:** The system must handle at least 100% extra load, assuming the student or guest population increases per year or increased traffic is experienced during an application period..* 

***Readability:** The system must use at least Font Size 11 (same as here) to ensure individuals up to 60 years of age can read and understand all of the texts displayed.* 

***Accessibility:** The system must have language options for those users who are unable to understand the default language (English). Languages such as Tagalog and/or Bisaya may suffice.* 

5. ## **Business Rules**

**5.5.1 User Roles and Access**

Users can only log in using a valid UP Mail or Google account. 

Each user is assigned to a role:

- Student  
- Dormitory Manager  
- Housing Administrator, which may be either:  
  	\- UP Housing Administrator  
  	\- Private Landlord  
- System Administrator

Users may only perform actions allowed for their assigned role.

**5.5.2 Student Restrictions** 

Students are only allowed to:

- Look for available dormitories and rooms  
- Submit and manage their own accommodation application  
- View their own application status, room assignment,and  billing and payment records  
- Upload required documents

Students are not allowed to:

- Apply for accommodation outside the given application period  
- Submit more than one active accommodation application at the same time  
- Assign or change room or bed assignments  
- Manage any accommodation application (including their own)  
- Change billing rates or payment statuses  
- View or access other students’ personal, accommodation, or billing information  
- Change their assigned role or system privileges

**5.5.3 Dormitory Manager**

Each dormitory may only have one dormitory manager.  
A dormitory manager can handle multiple dormitories.

Dormitory Managers may only:

- Review, approve, or reject housing requests  
- Conduct initial screening of applications  
- Assign rooms and manage occupancy  
- View records for dormitories assigned to them

Dormitory Managers are not allowed to:

- Access or manage other dormitories beyond their assignment  
- Perform final approval of applications

If there is no Dormitory Manager (e.g., off-campus dormitories), initial approval and room availability check access is given to the landlord as well.

**5.5.4 Housing Administrator**

The Housing Administrator role can be:

- UP Housing Administrator  
- Private Landlord (for non-UP dormitories)


Only the UP Housing Administrators may:

- Give final approval or rejection of accommodation applications for UP-managed dormitories.  
- Set application periods, billing periods, and accommodation rates  
- Manage and approve payments  
- Manage UP-managed housing facilities.

Private Landlords may:

- Perform initial screening and availability checks  
- Provide final approval or rejection for privately managed housing   
- Manage their own housing units

Housing Administrators cannot:

- Access system-level configurations.  
- Assign or modify user roles  
- Access housing data outside their assigned dormitories.


**5.5.5 System Administrator**

The System Administrator may:

- Control the overall system   
- Manage accommodations and user accounts  
- Validate student status  
- Assign and modify user roles  
- Access the master data  
- Deactivate accounts

The System Administrator is not responsible for the following, but nonetheless could bypass:

- Participating in the accommodation screening or approval process  
- Managing room assignments  
- Managing billing and payment decisions

**5.5.6 Data Privacy**

Users may only view information related to their role:

- Students: view only their own records  
- Dormitory Managers: view records for students currently assigned to their dormitories  
- UP Housing Administrators: view records for UP-managed dormitories  
- Landlords: view records for their own housing units  
- System Administrators: can access all system records including the Housing Administrators

**5.5.7 Billing and Payment Responsibilities**

Dorm Managers can issue Billing Statements and check proof of payment but only the Housing Administrators can approve given payments or change current billing rates.

**5.5.8 Application Period** 

Students may only submit accommodation applications during the given application period set by the Housing Administrator or Landlord. Any application submitted after this period must not be accepted by the system.

**5.5.9 Room Capacity Control**

The system must strictly enforce room and dormitory capacity limits to make sure that no room or housing facility exceeds its maximum allowed occupancy. 

If a dormitory manager or housing administrator attempts to assign a student to a room with full capacity, the system must automatically block the given action and display an error message.

**5.5.10 Activity Logs**

All important actions, such as application approvals, room assignments, and billing and payment updates, must be recorded in the activity logs. 

Activity logs are auto-generated and are not editable or deletable by any user.

**5.5.11 Application Approval Process**

Application for dormitories with separate dorm manager and landlords must undergo:

1. Initial screening by the Dormitory Manager  
2. Final approval or rejection by the Housing Administrator

Accommodation application under this management shall not be approved unless it has successfully completed both levels of review.

If a housing or dormitory doesn’t have a dorm manager, applications:

- Won’t require initial approval, and  
- Will only need final approval from the landlord

**5.5.12 Account Deactivation Policy**

Only System Administrators are allowed to deactivate user accounts. Deactivated accounts will no longer have access to the system. 

All previous records associated with the account, including their accommodation history and activity logs remain stored in the system for reporting purposes.

Accounts may only be considered for deactivation if:

- The user is no longer enrolled, employed, or officially affiliated with the university.  
- The user has already graduated, or permanently moved out of the university housing.  
- The account has been inactive for an extended period  
- The account violates university housing policies or system usage rules

**Appendix A: Glossary**

UPLB \- University of the Philippines \- Los Baños

**Appendix B: Analysis Models**

**Figure A1:**  
*Use Case Diagram*  
![][image2]

**Figure A2:**  
*Activity Diagram*

**![][image3]**

**Appendix C: Optional Features**

* Smart Allocation Engine: automatically recommend student housing based on predefined preferences and room availability  
* Advanced Analytics: provide data-driven insights on dorm occupancy trends  
* Dark Mode: a low-light, high-contrast user-interface  
* Automated Overdue Alerts: monitor payment deadlines and lease expirations  
* Transient Module: allow temporary guests to stay for a few days at a time  
* Support for Multiple Housing Applications: allow students to apply to multiple housing applications at a time.

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,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EAQgjbznGFQDx6+1puwXQlCC8FJYllBECAKaI+85BtXA8WutKfuFEJQgDECEILRLN0ij++Q9x6AaOH6tNWW/EIIKQAhCK1mCNOojzznGf5x+586dbvrss8/Gn2Xx+eefR5988klcfPb+scce6/F5SGPhmXAboX/84x/RF1984fpHWrhwYTi7Lf197f7kWT/P8WuCpuwXQpDnb3/7W6/WH1qC0ClZfodQH1nOMUY90rd6ncf5558ffhTzt62AcPfdd/9/pifN9xN+Hr7vT5rl0ywjScudd9554Uf9ynP8mqAp+4UQlODAAw+M/vSnP7nX99xzT7T//vsHSyQjBKEVQlB3ynOOeeihh6J169a517fffrubDh8+3E2HDh0aPfjgg9GMGTNc69DWrVujp556yo1RpxaY+++/P96OKASpvymVr776yn02bdo0tw0LC5rq682ZM8dfNXbFFVf0WNamH374YXTYYYe51ia9f/PNN6PXXnsteuONN+L3GjJk1apVbp2rr7463ubxxx8frV+/Prryyitda5ctv2HDhuiPf/yjW+bUU09102OPPdZ9f/7X1j+lQ4YMce/1hKXW8+drW2qJUs/PS5cudZ/nkef4NUFT9gshKMGhhx7a4/0+++zT431fCEFohRDUnfKeY7797W/36CxTIWjRokXRxIkTo0mTJrmKXoPpXnLJJdGIESOio446Kjr33HO9LfyPQtCyZctcWb16dfSXv/wlnueHhr5aghSC/v73v0cTJkxwy7799ttxSHvmmWfc1LblhyCjn+XTTz+N38uCBQuikSNHupAitnwYgqZMmRKvo2V27drlupHQPhg7dqz73Fq7xo8fHy8n+kdV+0X7La+8x6/bNWW/EIISqMLSfz/y+uuvZ6rACEFoJcvvEOoj7zlG48WphcMoBK1YsSJ6//33/79Q9L8KX+Wkk07qETxMeDnM7+k+SwgStdpoWW3DWnVmzZrlpn2FIAURCyghC1O2vNZ98skn3WuFoCVLlkSbNm3qsczMmTPd1CSFIPPPf/7TBcY88h6/bteU/UIIShDeD5SlAiMEoZUsv0Ooj7znmJdeeqlHZW6XwzTkij7X5R7RpS21nqjVQy01csghh8TrKSBYULLtqSVbl5L8EGTr6Ybmk08+OV5fLASJLXvmmWe619b6ZK1TrUKQWoF02cy3fPlyt4xaiWTu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>