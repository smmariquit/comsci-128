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
          actual_moveout_date: string | null
          application_id: number
          application_status: Database["public"]["Enums"]["ApplicationStatus"]
          created_at: string | null
          document_type: string | null
          document_url: string | null
          expected_moveout_date: string
          housing_name: string | null
          is_deleted: boolean | null
          landlord_account_number: number
          manager_account_number: number | null
          preferred_room_type: Database["public"]["Enums"]["RoomType"] | null
          room_id: number | null
          student_account_number: number | null
        }
        Insert: {
          actual_moveout_date?: string | null
          application_id?: never
          application_status?: Database["public"]["Enums"]["ApplicationStatus"]
          created_at?: string | null
          document_type?: string | null
          document_url?: string | null
          expected_moveout_date: string
          housing_name?: string | null
          is_deleted?: boolean | null
          landlord_account_number: number
          manager_account_number?: number | null
          preferred_room_type?: Database["public"]["Enums"]["RoomType"] | null
          room_id?: number | null
          student_account_number?: number | null
        }
        Update: {
          actual_moveout_date?: string | null
          application_id?: never
          application_status?: Database["public"]["Enums"]["ApplicationStatus"]
          created_at?: string | null
          document_type?: string | null
          document_url?: string | null
          expected_moveout_date?: string
          housing_name?: string | null
          is_deleted?: boolean | null
          landlord_account_number?: number
          manager_account_number?: number | null
          preferred_room_type?: Database["public"]["Enums"]["RoomType"] | null
          room_id?: number | null
          student_account_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "application_landlord_account_number_fkey"
            columns: ["landlord_account_number"]
            isOneToOne: false
            referencedRelation: "landlord"
            referencedColumns: ["account_number"]
          },
          {
            foreignKeyName: "application_manager_account_number_fkey"
            columns: ["manager_account_number"]
            isOneToOne: false
            referencedRelation: "housing_admin"
            referencedColumns: ["account_number"]
          },
          {
            foreignKeyName: "application_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "application_student_account_number_fkey"
            columns: ["student_account_number"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["account_number"]
          },
        ]
      }
      audit_log: {
        Row: {
          account_number: number | null
          action_type: Database["public"]["Enums"]["ActionType"] | null
          assigned_manager: number | null
          audit_description: string | null
          audit_id: number
          partial_ip: string
          timestamp: string | null
          user_name: string | null
        }
        Insert: {
          account_number?: number | null
          action_type?: Database["public"]["Enums"]["ActionType"] | null
          assigned_manager?: number | null
          audit_description?: string | null
          audit_id?: never
          partial_ip: string
          timestamp?: string | null
          user_name?: string | null
        }
        Update: {
          account_number?: number | null
          action_type?: Database["public"]["Enums"]["ActionType"] | null
          assigned_manager?: number | null
          audit_description?: string | null
          audit_id?: never
          partial_ip?: string
          timestamp?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["account_number"]
          },
          {
            foreignKeyName: "audit_log_assigned_manager_fkey"
            columns: ["assigned_manager"]
            isOneToOne: false
            referencedRelation: "manager"
            referencedColumns: ["account_number"]
          },
        ]
      }
      bill: {
        Row: {
          amount: number
          bill_type: Database["public"]["Enums"]["BillType"]
          date_paid: string | null
          due_date: string
          is_deleted: boolean | null
          issue_date: string
          manager_account_number: number | null
          proof_of_payment_url: string | null
          status: Database["public"]["Enums"]["PaymentStatus"]
          student_account_number: number | null
          transaction_id: number
        }
        Insert: {
          amount: number
          bill_type?: Database["public"]["Enums"]["BillType"]
          date_paid?: string | null
          due_date: string
          is_deleted?: boolean | null
          issue_date?: string
          manager_account_number?: number | null
          proof_of_payment_url?: string | null
          status?: Database["public"]["Enums"]["PaymentStatus"]
          student_account_number?: number | null
          transaction_id?: number
        }
        Update: {
          amount?: number
          bill_type?: Database["public"]["Enums"]["BillType"]
          date_paid?: string | null
          due_date?: string
          is_deleted?: boolean | null
          issue_date?: string
          manager_account_number?: number | null
          proof_of_payment_url?: string | null
          status?: Database["public"]["Enums"]["PaymentStatus"]
          student_account_number?: number | null
          transaction_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bill_manager_account_number_fkey"
            columns: ["manager_account_number"]
            isOneToOne: false
            referencedRelation: "manager"
            referencedColumns: ["account_number"]
          },
          {
            foreignKeyName: "bill_student_account_number_fkey"
            columns: ["student_account_number"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["account_number"]
          },
        ]
      }
      document: {
        Row: {
          application_id: number
          document_id: number
          storage_link: string | null
          type: Database["public"]["Enums"]["DocumentType"]
        }
        Insert: {
          application_id: number
          document_id?: number
          storage_link?: string | null
          type: Database["public"]["Enums"]["DocumentType"]
        }
        Update: {
          application_id?: number
          document_id?: number
          storage_link?: string | null
          type?: Database["public"]["Enums"]["DocumentType"]
        }
        Relationships: [
          {
            foreignKeyName: "document_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "application"
            referencedColumns: ["application_id"]
          },
        ]
      }
      housing: {
        Row: {
          end_application_date: string | null
          housing_address: string
          housing_id: number
          housing_image: string | null
          housing_name: string
          housing_type: Database["public"]["Enums"]["HousingType"]
          is_deleted: boolean | null
          landlord_account_number: number
          manager_account_number: number | null
          rent_price: number
          start_application_date: string | null
        }
        Insert: {
          end_application_date?: string | null
          housing_address: string
          housing_id?: number
          housing_image?: string | null
          housing_name: string
          housing_type?: Database["public"]["Enums"]["HousingType"]
          is_deleted?: boolean | null
          landlord_account_number?: number
          manager_account_number?: number | null
          rent_price: number
          start_application_date?: string | null
        }
        Update: {
          end_application_date?: string | null
          housing_address?: string
          housing_id?: number
          housing_image?: string | null
          housing_name?: string
          housing_type?: Database["public"]["Enums"]["HousingType"]
          is_deleted?: boolean | null
          landlord_account_number?: number
          manager_account_number?: number | null
          rent_price?: number
          start_application_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "housing_landlord_account_number_fkey"
            columns: ["landlord_account_number"]
            isOneToOne: false
            referencedRelation: "landlord"
            referencedColumns: ["account_number"]
          },
          {
            foreignKeyName: "housing_manager_account_number_fkey"
            columns: ["manager_account_number"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["account_number"]
          },
        ]
      }
      housing_admin: {
        Row: {
          account_number: number
        }
        Insert: {
          account_number: number
        }
        Update: {
          account_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "housing_admin_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: true
            referencedRelation: "manager"
            referencedColumns: ["account_number"]
          },
        ]
      }
      landlord: {
        Row: {
          account_number: number
        }
        Insert: {
          account_number: number
        }
        Update: {
          account_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "landlord_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: true
            referencedRelation: "manager"
            referencedColumns: ["account_number"]
          },
        ]
      }
      manager: {
        Row: {
          account_number: number
          manager_type: Database["public"]["Enums"]["ManagerType"]
        }
        Insert: {
          account_number?: number
          manager_type?: Database["public"]["Enums"]["ManagerType"]
        }
        Update: {
          account_number?: number
          manager_type?: Database["public"]["Enums"]["ManagerType"]
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
      manager_bank: {
        Row: {
          bank_name: string
          bank_number: number
          bank_type: string
        }
        Insert: {
          bank_name: string
          bank_number: number
          bank_type: string
        }
        Update: {
          bank_name?: string
          bank_number?: number
          bank_type?: string
        }
        Relationships: []
      }
      manager_payment_details: {
        Row: {
          account_number: number
          bank_number: number
          bank_type: string
        }
        Insert: {
          account_number?: number
          bank_number: number
          bank_type: string
        }
        Update: {
          account_number?: number
          bank_number?: number
          bank_type?: string
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
      permissions: {
        Row: {
          action: string
          housing_admin: boolean
          landlord: boolean
          permission_id: number
          public: boolean | null
          student: boolean
          system_admin: boolean
        }
        Insert: {
          action: string
          housing_admin?: boolean
          landlord?: boolean
          permission_id: number
          public?: boolean | null
          student?: boolean
          system_admin?: boolean
        }
        Update: {
          action?: string
          housing_admin?: boolean
          landlord?: boolean
          permission_id?: number
          public?: boolean | null
          student?: boolean
          system_admin?: boolean
        }
        Relationships: []
      }
      room: {
        Row: {
          housing_id: number
          is_deleted: boolean | null
          maximum_occupants: number | null
          occupancy_status:
            | Database["public"]["Enums"]["OccupancyStatus"]
            | null
          occupants_count: number
          payment_status: Database["public"]["Enums"]["PaymentStatus"]
          room_code: number
          room_id: number
          room_type: Database["public"]["Enums"]["RoomType"]
        }
        Insert: {
          housing_id: number
          is_deleted?: boolean | null
          maximum_occupants?: number | null
          occupancy_status?:
            | Database["public"]["Enums"]["OccupancyStatus"]
            | null
          occupants_count?: number
          payment_status?: Database["public"]["Enums"]["PaymentStatus"]
          room_code?: number
          room_id?: number
          room_type?: Database["public"]["Enums"]["RoomType"]
        }
        Update: {
          housing_id?: number
          is_deleted?: boolean | null
          maximum_occupants?: number | null
          occupancy_status?:
            | Database["public"]["Enums"]["OccupancyStatus"]
            | null
          occupants_count?: number
          payment_status?: Database["public"]["Enums"]["PaymentStatus"]
          room_code?: number
          room_id?: number
          room_type?: Database["public"]["Enums"]["RoomType"]
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
          account_number: number
          emergency_contact_name: string | null
          emergency_contact_number: string | null
          emergency_contact_relationship: string | null
          housing_status: Database["public"]["Enums"]["HousingStatus"]
          is_deleted: boolean
          student_number: number
        }
        Insert: {
          account_number?: number
          emergency_contact_name?: string | null
          emergency_contact_number?: string | null
          emergency_contact_relationship?: string | null
          housing_status?: Database["public"]["Enums"]["HousingStatus"]
          is_deleted?: boolean
          student_number: number
        }
        Update: {
          account_number?: number
          emergency_contact_name?: string | null
          emergency_contact_number?: string | null
          emergency_contact_relationship?: string | null
          housing_status?: Database["public"]["Enums"]["HousingStatus"]
          is_deleted?: boolean
          student_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["account_number"]
          },
        ]
      }
      student_academic: {
        Row: {
          account_number: number
          degree_program: string
          standing: Database["public"]["Enums"]["StudentStanding"]
          status: Database["public"]["Enums"]["StudentStatus"]
        }
        Insert: {
          account_number?: number
          degree_program: string
          standing?: Database["public"]["Enums"]["StudentStanding"]
          status?: Database["public"]["Enums"]["StudentStatus"]
        }
        Update: {
          account_number?: number
          degree_program?: string
          standing?: Database["public"]["Enums"]["StudentStanding"]
          status?: Database["public"]["Enums"]["StudentStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "student_academic_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: true
            referencedRelation: "student"
            referencedColumns: ["account_number"]
          },
        ]
      }
      student_accommodation_history: {
        Row: {
          account_number: number
          movein_date: string
          moveout_date: string | null
          room_id: number
        }
        Insert: {
          account_number: number
          movein_date: string
          moveout_date?: string | null
          room_id: number
        }
        Update: {
          account_number?: number
          movein_date?: string
          moveout_date?: string | null
          room_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_accommodation_history_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["account_number"]
          },
          {
            foreignKeyName: "student_accommodation_history_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "room"
            referencedColumns: ["room_id"]
          },
        ]
      }
      system_admin: {
        Row: {
          account_number: number
        }
        Insert: {
          account_number: number
        }
        Update: {
          account_number?: number
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
          google_identity: string | null
          home_address: string | null
          is_deleted: boolean | null
          last_name: string
          middle_name: string | null
          password: string | null
          phone_number: string | null
          profile_picture: string | null
          sex: Database["public"]["Enums"]["Sex"]
          user_type: Database["public"]["Enums"]["UserType"]
        }
        Insert: {
          account_email: string
          account_number?: number
          birthday?: string | null
          contact_email?: string | null
          first_name: string
          google_identity?: string | null
          home_address?: string | null
          is_deleted?: boolean | null
          last_name: string
          middle_name?: string | null
          password?: string | null
          phone_number?: string | null
          profile_picture?: string | null
          sex?: Database["public"]["Enums"]["Sex"]
          user_type?: Database["public"]["Enums"]["UserType"]
        }
        Update: {
          account_email?: string
          account_number?: number
          birthday?: string | null
          contact_email?: string | null
          first_name?: string
          google_identity?: string | null
          home_address?: string | null
          is_deleted?: boolean | null
          last_name?: string
          middle_name?: string | null
          password?: string | null
          phone_number?: string | null
          profile_picture?: string | null
          sex?: Database["public"]["Enums"]["Sex"]
          user_type?: Database["public"]["Enums"]["UserType"]
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
      ActionType:
        | "Application Status"
        | "Bill Status"
        | "Auth Register"
        | "Auth Login"
        | "Change Auth Password"
        | "Delete Account"
        | "Update User Role"
        | "Update User Details"
        | "Submit Application"
        | "Update Application Status"
        | "Withdraw Application"
        | "Create Housing"
        | "Update Housing"
        | "Assign Room"
        | "Assign Bill"
        | "Issue Bill Refund"
        | "Update Bill Status"
      ApplicationStatus:
        | "Pending Manager Approval"
        | "Pending Admin Approval"
        | "Approved"
        | "Cancelled"
        | "Rejected"
      BillType: "Rent" | "Utility" | "WiFi"
      DocumentType: "Form 5" | "Payment Receipt" | "Contract" | "Waiver"
      HousingStatus: "Assigned" | "Not Assigned"
      HousingType: "Non-UP Housing" | "UP Housing"
      ManagerType: "Housing Administrator" | "Landlord"
      OccupancyStatus: "Fully Occupied" | "Empty" | "Partially Occupied"
      PaymentStatus: "Pending" | "Paid" | "Overdue"
      RoomType: "Women Only" | "Men Only" | "Co-ed"
      Sex: "Male" | "Female" | "Prefer not to say"
      StudentStanding: "Freshman" | "Sophomore" | "Junior" | "Senior"
      StudentStatus: "Active" | "Delayed" | "Graduating"
      UserType: "Student" | "Manager" | "System Admin"
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
      ActionType: [
        "Application Status",
        "Bill Status",
        "Auth Register",
        "Auth Login",
        "Change Auth Password",
        "Delete Account",
        "Update User Role",
        "Update User Details",
        "Submit Application",
        "Update Application Status",
        "Withdraw Application",
        "Create Housing",
        "Update Housing",
        "Assign Room",
        "Assign Bill",
        "Issue Bill Refund",
        "Update Bill Status",
      ],
      ApplicationStatus: [
        "Pending Manager Approval",
        "Pending Admin Approval",
        "Approved",
        "Cancelled",
        "Rejected",
      ],
      BillType: ["Rent", "Utility", "WiFi"],
      DocumentType: ["Form 5", "Payment Receipt", "Contract", "Waiver"],
      HousingStatus: ["Assigned", "Not Assigned"],
      HousingType: ["Non-UP Housing", "UP Housing"],
      ManagerType: ["Housing Administrator", "Landlord"],
      OccupancyStatus: ["Fully Occupied", "Empty", "Partially Occupied"],
      PaymentStatus: ["Pending", "Paid", "Overdue"],
      RoomType: ["Women Only", "Men Only", "Co-ed"],
      Sex: ["Male", "Female", "Prefer not to say"],
      StudentStanding: ["Freshman", "Sophomore", "Junior", "Senior"],
      StudentStatus: ["Active", "Delayed", "Graduating"],
      UserType: ["Student", "Manager", "System Admin"],
    },
  },
} as const
