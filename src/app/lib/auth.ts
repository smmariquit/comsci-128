/**
 * check authorization header
 * verifies token with supabase
 * return user if valid or error if not
 */

import { NextRequest } from "next/server";
import { supabase } from "./supabase";

export async function authenticate(req: NextRequest){
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return { error: "Access denied. No token provided."};
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user){
        return { error: "Invalid token."};
    }

    return { user: data.user };

}