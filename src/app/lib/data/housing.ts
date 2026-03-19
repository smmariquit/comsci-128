import { supabase } from "@/lib/supabase";

// Define Housing record based on DB schema
export interface Housing {
  housing_id?: number;
  housing_name: string;
  housing_address: string;
  housing_type: string;
  rent_price: number;
  start_application_date?: string;
  end_application_date?: string;
  manager_account_number?: number;
  is_deleted?: boolean;
}

// Inserts a new record and returns the created object with its new ID
export async function createHousing(data: Housing) {
  const { data: newRecord, error } = await supabase
    .from('housing')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return newRecord;
}

// Fetches all active dorms, sorted alphabetically
export async function getAllHousing() {
  const { data, error } = await supabase
    .from('housing')
    .select('*')
    .eq('is_deleted', false)
    .order('housing_name', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

// Fetches a specific dorm by its unique ID
export async function getHousingById(id: string) {
  const { data, error } = await supabase
    .from('housing')
    .select('*')
    .eq('housing_id', id)
    .eq('is_deleted', false)
    .single();

  if (error) throw new Error(error.message);
  return data;
}