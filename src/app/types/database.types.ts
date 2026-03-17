export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      application: {
        Row: {
          account_number: number | null
          actual_move_out_date: string | null
          application_date: string | null
          application_id: number
          expected_moveout_date: string | null
          housing_address: string | null
          housing_name: string | null
          move_in_date: string | null
          preferred_room_bed_space: string | null
          status: string | null
          student_information: string | null
        }
        Insert: {
          account_number?: number | null
          actual_move_out_date?: string | null
          application_date?: string | null
          application_id?: never
          expected_moveout_date?: string | null
          housing_address?: string | null
          housing_name?: string | null
          move_in_date?: string | null
          preferred_room_bed_space?: string | null
          status?: string | null
          student_information?: string | null
        }
        Update: {
          account_number?: number | null
          actual_move_out_date?: string | null
          application_date?: string | null
          application_id?: never
          expected_moveout_date?: string | null
          housing_address?: string | null
          housing_name?: string | null
          move_in_date?: string | null
          preferred_room_bed_space?: string | null
          status?: string | null
          student_information?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["account_number"]
          },
        ]
      }
      application_required_documents: {
        Row: {
          application_id: number | null
          id: number
          required_documents: string
        }
        Insert: {
          application_id?: number | null
          id?: never
          required_documents: string
        }
        Update: {
          application_id?: number | null
          id?: never
          required_documents?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_required_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "application"
            referencedColumns: ["application_id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          account_number: number | null
          action_type: string
          audit_description: string | null
          audit_id: number
          timestamp: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          account_number?: number | null
          action_type: string
          audit_description?: string | null
          audit_id?: never
          timestamp?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          account_number?: number | null
          action_type?: string
          audit_description?: string | null
          audit_id?: never
          timestamp?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["account_number"]
          },
        ]
      }
      housing: {
        Row: {
          account_number: number | null
          housing_address: string | null
          housing_application_period: string | null
          housing_id: number
          housing_name: string
          housing_type: string | null
          rent_price: number | null
        }
        Insert: {
          account_number?: number | null
          housing_address?: string | null
          housing_application_period?: string | null
          housing_id?: never
          housing_name: string
          housing_type?: string | null
          rent_price?: number | null
        }
        Update: {
          account_number?: number | null
          housing_address?: string | null
          housing_application_period?: string | null
          housing_id?: never
          housing_name?: string
          housing_type?: string | null
          rent_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "housing_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["account_number"]
          },
        ]
      }
      housing_manager: {
        Row: {
          account_email: string
          account_number: number
          birthday: string | null
          contact_email: string | null
          first_name: string
          home_address: string | null
          last_name: string
          middle_name: string | null
          phone_number: string | null
          sex: string | null
        }
        Insert: {
          account_email: string
          account_number: number
          birthday?: string | null
          contact_email?: string | null
          first_name: string
          home_address?: string | null
          last_name: string
          middle_name?: string | null
          phone_number?: string | null
          sex?: string | null
        }
        Update: {
          account_email?: string
          account_number?: number
          birthday?: string | null
          contact_email?: string | null
          first_name?: string
          home_address?: string | null
          last_name?: string
          middle_name?: string | null
          phone_number?: string | null
          sex?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "housing_manager_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["account_number"]
          },
        ]
      }
      landlord: {
        Row: {
          account_email: string
          account_number: number
          birthday: string | null
          contact_email: string | null
          first_name: string
          home_address: string | null
          last_name: string
          middle_name: string | null
          phone_number: string | null
          sex: string | null
        }
        Insert: {
          account_email: string
          account_number: number
          birthday?: string | null
          contact_email?: string | null
          first_name: string
          home_address?: string | null
          last_name: string
          middle_name?: string | null
          phone_number?: string | null
          sex?: string | null
        }
        Update: {
          account_email?: string
          account_number?: number
          birthday?: string | null
          contact_email?: string | null
          first_name?: string
          home_address?: string | null
          last_name?: string
          middle_name?: string | null
          phone_number?: string | null
          sex?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landlord_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["account_number"]
          },
        ]
      }
      manager: {
        Row: {
          account_number: number
          manager_type: string | null
        }
        Insert: {
          account_number: number
          manager_type?: string | null
        }
        Update: {
          account_number?: number
          manager_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manager_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["account_number"]
          },
        ]
      }
      manager_payment_details: {
        Row: {
          account_number: number
          bank_name: string | null
          bank_number: string
          bank_type: string | null
        }
        Insert: {
          account_number: number
          bank_name?: string | null
          bank_number: string
          bank_type?: string | null
        }
        Update: {
          account_number?: number
          bank_name?: string | null
          bank_number?: string
          bank_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manager_payment_details_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "manager"
            referencedColumns: ["account_number"]
          },
        ]
      }
      room: {
        Row: {
          housing_id: number | null
          maximum_number_of_occupants: number | null
          number_of_available_bed_space: number | null
          occupancy_status: string | null
          payment_status: string | null
          room_id: number
          room_number: string
          room_type: string | null
        }
        Insert: {
          housing_id?: number | null
          maximum_number_of_occupants?: number | null
          number_of_available_bed_space?: number | null
          occupancy_status?: string | null
          payment_status?: string | null
          room_id?: never
          room_number: string
          room_type?: string | null
        }
        Update: {
          housing_id?: number | null
          maximum_number_of_occupants?: number | null
          number_of_available_bed_space?: number | null
          occupancy_status?: string | null
          payment_status?: string | null
          room_id?: never
          room_number?: string
          room_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_housing_id_fkey"
            columns: ["housing_id"]
            isOneToOne: false
            referencedRelation: "housing"
            referencedColumns: ["housing_id"]
          },
        ]
      }
      student: {
        Row: {
          accommodation_history: string | null
          account_number: number
          degree_program: string | null
          emergency_contact_name: string | null
          emergency_contact_phone_number: string | null
          emergency_contact_relationship: string | null
          housing_status: string | null
          room_id: number | null
          room_number: string | null
          standing: string | null
          status: string | null
          student_number: string
        }
        Insert: {
          accommodation_history?: string | null
          account_number: number
          degree_program?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone_number?: string | null
          emergency_contact_relationship?: string | null
          housing_status?: string | null
          room_id?: number | null
          room_number?: string | null
          standing?: string | null
          status?: string | null
          student_number: string
        }
        Update: {
          accommodation_history?: string | null
          account_number?: number
          degree_program?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone_number?: string | null
          emergency_contact_relationship?: string | null
          housing_status?: string | null
          room_id?: number | null
          room_number?: string | null
          standing?: string | null
          status?: string | null
          student_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["account_number"]
          },
          {
            foreignKeyName: "student_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room"
            referencedColumns: ["room_id"]
          },
        ]
      }
      student_accommodation_history: {
        Row: {
          accommodation_history: string
          account_number: number | null
          id: number
        }
        Insert: {
          accommodation_history: string
          account_number?: number | null
          id?: never
        }
        Update: {
          accommodation_history?: string
          account_number?: number | null
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "student_accommodation_history_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["account_number"]
          },
        ]
      }
      system_admin: {
        Row: {
          account_email: string
          account_number: number
          birthday: string | null
          contact_email: string | null
          first_name: string
          home_address: string | null
          last_name: string
          middle_name: string | null
          phone_number: string | null
          sex: string | null
        }
        Insert: {
          account_email: string
          account_number: number
          birthday?: string | null
          contact_email?: string | null
          first_name: string
          home_address?: string | null
          last_name: string
          middle_name?: string | null
          phone_number?: string | null
          sex?: string | null
        }
        Update: {
          account_email?: string
          account_number?: number
          birthday?: string | null
          contact_email?: string | null
          first_name?: string
          home_address?: string | null
          last_name?: string
          middle_name?: string | null
          phone_number?: string | null
          sex?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_admin_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["account_number"]
          },
        ]
      }
      user: {
        Row: {
          account_email: string
          account_number: number
          birthday: string | null
          contact_email: string | null
          first_name: string
          home_address: string | null
          last_name: string
          middle_name: string | null
          phone_number: string | null
          sex: string | null
          user_type: string
        }
        Insert: {
          account_email: string
          account_number?: never
          birthday?: string | null
          contact_email?: string | null
          first_name: string
          home_address?: string | null
          last_name: string
          middle_name?: string | null
          phone_number?: string | null
          sex?: string | null
          user_type: string
        }
        Update: {
          account_email?: string
          account_number?: never
          birthday?: string | null
          contact_email?: string | null
          first_name?: string
          home_address?: string | null
          last_name?: string
          middle_name?: string | null
          phone_number?: string | null
          sex?: string | null
          user_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Sex: "Male" | "Female" | "Non-binary" | "Prefer not to say"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Sex: ["Male", "Female", "Non-binary", "Prefer not to say"],
    },
  },
} as const
