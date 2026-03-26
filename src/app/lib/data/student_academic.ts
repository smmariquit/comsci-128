import { supabase } from "../supabase";

export type StudentStanding = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
export type StudentStatus = 'Active' | 'Delayed' | 'Graduating';

export interface StudentAcademic {
  account_number: number;
  student_number: string;
  degree_program: string;
  standing: StudentStanding;
  status: StudentStatus;
}

// CREATE student academic record
// Needs the generated account_number from the parent User/Student class.

export async function createStudentAcademic(academicData: StudentAcademic) {
  const { data, error } = await supabase
    .from('student_academic')
    .insert([academicData])
    .select()
    .single();

  if (error) throw new Error(`Academic Record Creation Error: ${error.message}`);
  return data;
}

// READ academic record by account number

export async function getStudentAcademicById(accountNumber: number) {
  const { data, error } = await supabase
    .from('student_academic')
    .select('*')
    .eq('account_number', accountNumber)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// UPDATE academic record

export async function updateStudentAcademic(accountNumber: number, updates: Partial<StudentAcademic>) {
  const { data, error } = await supabase
    .from('student_academic')
    .update(updates)
    .eq('account_number', accountNumber)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}