

import { supabase } from "@/lib/supabase";

export async function getCurrentTenantsByHousingId(housingId: number) {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("student_accommodation_history")
    .select(`
      account_number,
      movein_date,
      moveout_date,
      room:room_id (
        room_id,
        housing_id
      ),
      student:account_number (
        user:account_number (
          first_name,
          middle_name,
          last_name
        )
      )
    `)
    .lte("movein_date", today)
    .gte("moveout_date", today)

  if (error) throw new Error(error.message)

  return (data ?? []).filter((t: any) => t.room?.housing_id === housingId)
}