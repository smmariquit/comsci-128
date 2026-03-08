//User Model Interface

export type UserRole = 
  | 'Student' 
  | 'Dormitory Manager' 
  | 'Housing Administrator'     
  | 'System Administrator';               

export type AccountStatus = 'Active' | 'Inactive';

export interface User {
  // For Audit Trails 
  userId: string; 
  
  // Authentication: must be UP Mail / Google
  email: string; 
  
  // Mandatory profile fields
  fullName: string;
  contactNumber: string;   
  emergencyContact: string; 
  
  // Role-Based Access Control
  role: UserRole;
  
  // Status for account deactivation
  status: AccountStatus;
  
  // Management is restricted to assigned dorms
  assignedDormitories: string[]; 
  
  // Timestamps for activity logs 
  createdAt: Date;
  updatedAt: Date;
}
