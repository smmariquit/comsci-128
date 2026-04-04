import { supabase } from "@/app/lib/supabase";

export async function getAllDorms(){
    try{
        const { data: dorms, error } = await supabase
            .from("housing")
            .select("*")
            .eq("is_deleted", false);

        if (error) throw error;

        return dorms;
    } catch (error: any) {
        console.error("Error fetching dorms:", error);
        throw new Error(error.message);
    }
}