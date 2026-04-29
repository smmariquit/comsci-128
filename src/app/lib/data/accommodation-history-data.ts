import { supabase } from "@/lib/supabase";



const getCurrentTenantsByHousingId = async (housingId: number) => {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("student_accommodation_history")
    .select(`
      account_number,
      movein_date,
      moveout_date,
      room:room!room_id (
        room_id,
        housing_id
      ),
      student:student!account_number (
        account_number,
        user:user!account_number (
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

const getCurrentTenantsByRoomId = async (roomId: number) => {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("student_accommodation_history")
    .select(`
      account_number,
      movein_date,
      moveout_date,
      student:student!account_number (
        account_number,
        user:user!account_number (
          first_name,
          middle_name,
          last_name,
          profile_picture
        )
      )
    `)
    .eq("room_id", roomId)
    .lte("movein_date", today)
    .gte("moveout_date", today)

  if (error) throw new Error(error.message)
  return data ?? []
}

const createTenantRecord = async(
  accountNumber: number,
  roomId: number,
  moveoutDate: string
) => {
  const today = new Date().toISOString().split("T")[0] 

  const { data, error } = await supabase
    .from("student_accommodation_history")
    .insert({
      account_number: accountNumber,
      room_id: roomId,
      movein_date: today,
      moveout_date: moveoutDate,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export const accommodationHistoryData = {
  getCurrentTenantsByHousingId,
  getCurrentTenantsByRoomId,
  createTenantRecord
}