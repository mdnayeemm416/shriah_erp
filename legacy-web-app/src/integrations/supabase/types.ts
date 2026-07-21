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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_scans: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          extracted: Json | null
          file_type: string | null
          file_url: string | null
          id: string
          is_deleted: boolean
          notes: string | null
          raw_text: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          extracted?: Json | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          raw_text?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          extracted?: Json | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          raw_text?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          cf_require_attachment: boolean
          currency: string
          id: number
          opening_bank_balance: number
          opening_cash_received: number
          opening_company_balance: number
          opening_due_receivable: number
          opening_stock_value: number
          opening_supplier_payable: number
          opening_warehouse_balance: number
          store_whatsapp: string | null
        }
        Insert: {
          cf_require_attachment?: boolean
          currency?: string
          id?: number
          opening_bank_balance?: number
          opening_cash_received?: number
          opening_company_balance?: number
          opening_due_receivable?: number
          opening_stock_value?: number
          opening_supplier_payable?: number
          opening_warehouse_balance?: number
          store_whatsapp?: string | null
        }
        Update: {
          cf_require_attachment?: boolean
          currency?: string
          id?: number
          opening_bank_balance?: number
          opening_cash_received?: number
          opening_company_balance?: number
          opening_due_receivable?: number
          opening_stock_value?: number
          opening_supplier_payable?: number
          opening_warehouse_balance?: number
          store_whatsapp?: string | null
        }
        Relationships: []
      }
      cash_flow_cash_in: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          day_date: string
          id: string
          is_deleted: boolean
          notes: string | null
          recipient_user_id: string | null
          shop_id: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          created_by?: string
          day_date?: string
          id?: string
          is_deleted?: boolean
          notes?: string | null
          recipient_user_id?: string | null
          shop_id?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          day_date?: string
          id?: string
          is_deleted?: boolean
          notes?: string | null
          recipient_user_id?: string | null
          shop_id?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cash_flow_day_locks: {
        Row: {
          day_date: string
          id: string
          is_locked: boolean
          locked_at: string
          locked_by: string | null
          notes: string | null
          shop_id: string | null
          unlocked_at: string | null
          unlocked_by: string | null
        }
        Insert: {
          day_date: string
          id?: string
          is_locked?: boolean
          locked_at?: string
          locked_by?: string | null
          notes?: string | null
          shop_id?: string | null
          unlocked_at?: string | null
          unlocked_by?: string | null
        }
        Update: {
          day_date?: string
          id?: string
          is_locked?: boolean
          locked_at?: string
          locked_by?: string | null
          notes?: string | null
          shop_id?: string | null
          unlocked_at?: string | null
          unlocked_by?: string | null
        }
        Relationships: []
      }
      cash_flow_purchases: {
        Row: {
          attachment_url: string | null
          cash_amount: number
          cash_in_ref: string | null
          company: string
          created_at: string
          created_by: string
          credit_amount: number
          day_date: string
          due_amount: number
          id: string
          is_deleted: boolean
          notes: string | null
          ocr_confidence: string | null
          ocr_meta: Json | null
          purchaser: string | null
          reject_reason: string | null
          shop_id: string | null
          updated_at: string
          verified_at: string | null
          verified_by: string | null
          verify_status: Database["public"]["Enums"]["cf_verify_status"]
        }
        Insert: {
          attachment_url?: string | null
          cash_amount?: number
          cash_in_ref?: string | null
          company: string
          created_at?: string
          created_by?: string
          credit_amount?: number
          day_date?: string
          due_amount?: number
          id?: string
          is_deleted?: boolean
          notes?: string | null
          ocr_confidence?: string | null
          ocr_meta?: Json | null
          purchaser?: string | null
          reject_reason?: string | null
          shop_id?: string | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          verify_status?: Database["public"]["Enums"]["cf_verify_status"]
        }
        Update: {
          attachment_url?: string | null
          cash_amount?: number
          cash_in_ref?: string | null
          company?: string
          created_at?: string
          created_by?: string
          credit_amount?: number
          day_date?: string
          due_amount?: number
          id?: string
          is_deleted?: boolean
          notes?: string | null
          ocr_confidence?: string | null
          ocr_meta?: Json | null
          purchaser?: string | null
          reject_reason?: string | null
          shop_id?: string | null
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          verify_status?: Database["public"]["Enums"]["cf_verify_status"]
        }
        Relationships: [
          {
            foreignKeyName: "cash_flow_purchases_cash_in_ref_fkey"
            columns: ["cash_in_ref"]
            isOneToOne: false
            referencedRelation: "cash_flow_cash_in"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_handovers: {
        Row: {
          accepted_at: string | null
          amount: number
          attachment_url: string | null
          closed_at: string | null
          created_at: string
          created_by: string
          day_date: string
          from_user: string
          id: string
          is_deleted: boolean
          notes: string | null
          parent_handover_id: string | null
          purpose: string | null
          reject_reason: string | null
          rejected_at: string | null
          shop_id: string | null
          status: Database["public"]["Enums"]["cash_handover_status"]
          to_user: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          amount: number
          attachment_url?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string
          day_date?: string
          from_user: string
          id?: string
          is_deleted?: boolean
          notes?: string | null
          parent_handover_id?: string | null
          purpose?: string | null
          reject_reason?: string | null
          rejected_at?: string | null
          shop_id?: string | null
          status?: Database["public"]["Enums"]["cash_handover_status"]
          to_user: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          amount?: number
          attachment_url?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string
          day_date?: string
          from_user?: string
          id?: string
          is_deleted?: boolean
          notes?: string | null
          parent_handover_id?: string | null
          purpose?: string | null
          reject_reason?: string | null
          rejected_at?: string | null
          shop_id?: string | null
          status?: Database["public"]["Enums"]["cash_handover_status"]
          to_user?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_handovers_parent_handover_id_fkey"
            columns: ["parent_handover_id"]
            isOneToOne: false
            referencedRelation: "cash_handovers"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_in_hand_snapshots: {
        Row: {
          cash_in_app: number
          cash_in_hand: number
          created_at: string
          created_by: string | null
          difference: number
          holders: Json | null
          id: string
          notes: string | null
          snapshot_date: string
        }
        Insert: {
          cash_in_app?: number
          cash_in_hand?: number
          created_at?: string
          created_by?: string | null
          difference?: number
          holders?: Json | null
          id?: string
          notes?: string | null
          snapshot_date: string
        }
        Update: {
          cash_in_app?: number
          cash_in_hand?: number
          created_at?: string
          created_by?: string | null
          difference?: number
          holders?: Json | null
          id?: string
          notes?: string | null
          snapshot_date?: string
        }
        Relationships: []
      }
      cash_returns: {
        Row: {
          amount: number
          attachment_url: string | null
          created_at: string
          created_by: string
          day_date: string
          from_user: string
          id: string
          is_deleted: boolean
          notes: string | null
          related_handover_id: string | null
          shop_id: string | null
          to_user: string | null
        }
        Insert: {
          amount: number
          attachment_url?: string | null
          created_at?: string
          created_by?: string
          day_date?: string
          from_user: string
          id?: string
          is_deleted?: boolean
          notes?: string | null
          related_handover_id?: string | null
          shop_id?: string | null
          to_user?: string | null
        }
        Update: {
          amount?: number
          attachment_url?: string | null
          created_at?: string
          created_by?: string
          day_date?: string
          from_user?: string
          id?: string
          is_deleted?: boolean
          notes?: string | null
          related_handover_id?: string | null
          shop_id?: string | null
          to_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_returns_related_handover_id_fkey"
            columns: ["related_handover_id"]
            isOneToOne: false
            referencedRelation: "cash_handovers"
            referencedColumns: ["id"]
          },
        ]
      }
      cashiers: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          name: string
          shop_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          name: string
          shop_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          name?: string
          shop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cashiers_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          icon: string | null
          id: string
          is_deleted: boolean
          name: string
          txn_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          icon?: string | null
          id?: string
          is_deleted?: boolean
          name: string
          txn_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          icon?: string | null
          id?: string
          is_deleted?: boolean
          name?: string
          txn_type?: string
        }
        Relationships: []
      }
      cf_activity_log: {
        Row: {
          action: string
          actor: string
          at: string
          id: string
          meta: Json
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          actor?: string
          at?: string
          id?: string
          meta?: Json
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          actor?: string
          at?: string
          id?: string
          meta?: Json
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      cf_closing_proofs: {
        Row: {
          day_date: string
          id: string
          mime: string | null
          notes: string | null
          shop_id: string | null
          storage_path: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          day_date: string
          id?: string
          mime?: string | null
          notes?: string | null
          shop_id?: string | null
          storage_path: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          day_date?: string
          id?: string
          mime?: string | null
          notes?: string | null
          shop_id?: string | null
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "cf_closing_proofs_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      cf_purchase_attachments: {
        Row: {
          id: string
          kind: string | null
          mime: string | null
          notes: string | null
          purchase_id: string
          storage_path: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          id?: string
          kind?: string | null
          mime?: string | null
          notes?: string | null
          purchase_id: string
          storage_path: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Update: {
          id?: string
          kind?: string | null
          mime?: string | null
          notes?: string | null
          purchase_id?: string
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      company_aliases: {
        Row: {
          alias: string
          alias_normalized: string
          canonical: string
          created_at: string
          created_by: string | null
          id: string
          source: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          alias: string
          alias_normalized: string
          canonical: string
          created_at?: string
          created_by?: string | null
          id?: string
          source?: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          alias?: string
          alias_normalized?: string
          canonical?: string
          created_at?: string
          created_by?: string | null
          id?: string
          source?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      company_opening_balances: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          id: string
          month: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          created_by?: string
          id?: string
          month: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          id?: string
          month?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_transactions: {
        Row: {
          amount: number
          attachment_url: string | null
          category: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          notes: string | null
          txn_date: string
          txn_type: string
          updated_at: string
        }
        Insert: {
          amount?: number
          attachment_url?: string | null
          category: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          txn_date?: string
          txn_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          attachment_url?: string | null
          category?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          txn_date?: string
          txn_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_closings: {
        Row: {
          cash_sale: number
          closing_date: string
          counted_cash: number
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          difference: number
          distribution: Json
          distribution_total: number
          expected_cash: number
          expense: number
          holders: Json
          id: string
          is_deleted: boolean
          notes: string | null
          opening_cash: number
          purchase: number
          status: string
          updated_at: string
          withdraw: number
        }
        Insert: {
          cash_sale?: number
          closing_date: string
          counted_cash?: number
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          difference?: number
          distribution?: Json
          distribution_total?: number
          expected_cash?: number
          expense?: number
          holders?: Json
          id?: string
          is_deleted?: boolean
          notes?: string | null
          opening_cash?: number
          purchase?: number
          status?: string
          updated_at?: string
          withdraw?: number
        }
        Update: {
          cash_sale?: number
          closing_date?: string
          counted_cash?: number
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          difference?: number
          distribution?: Json
          distribution_total?: number
          expected_cash?: number
          expense?: number
          holders?: Json
          id?: string
          is_deleted?: boolean
          notes?: string | null
          opening_cash?: number
          purchase?: number
          status?: string
          updated_at?: string
          withdraw?: number
        }
        Relationships: []
      }
      employee_entries: {
        Row: {
          amount: number
          attachment_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          employee_id: string
          entry_type: Database["public"]["Enums"]["employee_entry_type"]
          id: string
          is_deleted: boolean
          kind: string
          notes: string | null
          txn_date: string
        }
        Insert: {
          amount?: number
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          employee_id: string
          entry_type: Database["public"]["Enums"]["employee_entry_type"]
          id?: string
          is_deleted?: boolean
          kind?: string
          notes?: string | null
          txn_date?: string
        }
        Update: {
          amount?: number
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          employee_id?: string
          entry_type?: Database["public"]["Enums"]["employee_entry_type"]
          id?: string
          is_deleted?: boolean
          kind?: string
          notes?: string | null
          txn_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_expense_categories: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      employee_expenses: {
        Row: {
          amount: number
          attachment_url: string | null
          category: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          employee_id: string
          id: string
          is_deleted: boolean
          kind: string
          linked_entry_id: string | null
          note: string
          status: string
          txn_date: string
          updated_at: string
          user_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          amount: number
          attachment_url?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          employee_id: string
          id?: string
          is_deleted?: boolean
          kind?: string
          linked_entry_id?: string | null
          note: string
          status?: string
          txn_date?: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          amount?: number
          attachment_url?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          employee_id?: string
          id?: string
          is_deleted?: boolean
          kind?: string
          linked_entry_id?: string | null
          note?: string
          status?: string
          txn_date?: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_expenses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_expenses_linked_entry_id_fkey"
            columns: ["linked_entry_id"]
            isOneToOne: false
            referencedRelation: "employee_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          attachment_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          iqama: string | null
          is_deleted: boolean
          mobile: string | null
          monthly_salary: number
          name: string
          notes: string | null
          shop_id: string | null
          shop_name: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          iqama?: string | null
          is_deleted?: boolean
          mobile?: string | null
          monthly_salary?: number
          name: string
          notes?: string | null
          shop_id?: string | null
          shop_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          iqama?: string | null
          is_deleted?: boolean
          mobile?: string | null
          monthly_salary?: number
          name?: string
          notes?: string | null
          shop_id?: string | null
          shop_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_history: {
        Row: {
          action: string
          changed_at: string
          changed_by: string | null
          changes: Json
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          changed_at?: string
          changed_by?: string | null
          changes?: Json
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          changed_at?: string
          changed_by?: string | null
          changes?: Json
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      entry_warning_log: {
        Row: {
          action_taken: string
          amount: number | null
          cashier_id: string | null
          created_at: string
          existing_entry_id: string | null
          id: string
          meta: Json
          new_entry_id: string | null
          shop_id: string | null
          shop_name: string | null
          transaction_type: string
          txn_date: string | null
          user_id: string
          user_name: string | null
          warning_type: string
        }
        Insert: {
          action_taken: string
          amount?: number | null
          cashier_id?: string | null
          created_at?: string
          existing_entry_id?: string | null
          id?: string
          meta?: Json
          new_entry_id?: string | null
          shop_id?: string | null
          shop_name?: string | null
          transaction_type: string
          txn_date?: string | null
          user_id: string
          user_name?: string | null
          warning_type: string
        }
        Update: {
          action_taken?: string
          amount?: number | null
          cashier_id?: string | null
          created_at?: string
          existing_entry_id?: string | null
          id?: string
          meta?: Json
          new_entry_id?: string | null
          shop_id?: string | null
          shop_name?: string | null
          transaction_type?: string
          txn_date?: string | null
          user_id?: string
          user_name?: string | null
          warning_type?: string
        }
        Relationships: []
      }
      erp_user_credentials: {
        Row: {
          password_hash: string
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          password_hash: string
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          password_hash?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invoice_v3_templates: {
        Row: {
          blocks: Json
          created_at: string
          id: string
          is_default: boolean
          name: string
          owner_id: string
          settings: Json
          updated_at: string
        }
        Insert: {
          blocks?: Json
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          owner_id?: string
          settings?: Json
          updated_at?: string
        }
        Update: {
          blocks?: Json
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          owner_id?: string
          settings?: Json
          updated_at?: string
        }
        Relationships: []
      }
      monthly_closings: {
        Row: {
          bank_balance: number
          closed_at: string
          closed_by: string | null
          company_expense: number
          company_income: number
          created_at: string
          final_business_profit: number
          id: string
          month: string
          notes: string | null
          reopened_at: string | null
          reopened_by: string | null
          snapshot: Json
          status: string
          total_shop_cash_position: number
          total_shop_expense: number
          total_shop_income: number
          total_shop_profit: number
          updated_at: string
        }
        Insert: {
          bank_balance?: number
          closed_at?: string
          closed_by?: string | null
          company_expense?: number
          company_income?: number
          created_at?: string
          final_business_profit?: number
          id?: string
          month: string
          notes?: string | null
          reopened_at?: string | null
          reopened_by?: string | null
          snapshot?: Json
          status?: string
          total_shop_cash_position?: number
          total_shop_expense?: number
          total_shop_income?: number
          total_shop_profit?: number
          updated_at?: string
        }
        Update: {
          bank_balance?: number
          closed_at?: string
          closed_by?: string | null
          company_expense?: number
          company_income?: number
          created_at?: string
          final_business_profit?: number
          id?: string
          month?: string
          notes?: string | null
          reopened_at?: string | null
          reopened_by?: string | null
          snapshot?: Json
          status?: string
          total_shop_cash_position?: number
          total_shop_expense?: number
          total_shop_income?: number
          total_shop_profit?: number
          updated_at?: string
        }
        Relationships: []
      }
      monthly_snapshots: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_hard_close: boolean
          label: string
          month: string
          notes: string | null
          payload: Json
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: string
          is_hard_close?: boolean
          label: string
          month: string
          notes?: string | null
          payload?: Json
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_hard_close?: boolean
          label?: string
          month?: string
          notes?: string | null
          payload?: Json
        }
        Relationships: []
      }
      notification_email_log: {
        Row: {
          action: string | null
          error: string | null
          event_type: string | null
          id: string
          module: string | null
          order_id: string | null
          payload: Json | null
          recipient_email: string
          record_id: string | null
          sent_at: string
          status: string
          subject: string | null
        }
        Insert: {
          action?: string | null
          error?: string | null
          event_type?: string | null
          id?: string
          module?: string | null
          order_id?: string | null
          payload?: Json | null
          recipient_email: string
          record_id?: string | null
          sent_at?: string
          status: string
          subject?: string | null
        }
        Update: {
          action?: string | null
          error?: string | null
          event_type?: string | null
          id?: string
          module?: string | null
          order_id?: string | null
          payload?: Json | null
          recipient_email?: string
          record_id?: string | null
          sent_at?: string
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      notification_recipients: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          event_flags: Json
          id: string
          is_active: boolean
          label: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          event_flags?: Json
          id?: string
          is_active?: boolean
          label?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          event_flags?: Json
          id?: string
          is_active?: boolean
          label?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notification_tokens: {
        Row: {
          created_at: string
          id: string
          platform: string | null
          role: string | null
          token: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform?: string | null
          role?: string | null
          token: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string | null
          role?: string | null
          token?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      overview_categories: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          entry_type: Database["public"]["Enums"]["overview_entry_type"]
          id: string
          is_deleted: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          entry_type: Database["public"]["Enums"]["overview_entry_type"]
          id?: string
          is_deleted?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          entry_type?: Database["public"]["Enums"]["overview_entry_type"]
          id?: string
          is_deleted?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      overview_entries: {
        Row: {
          amount: number
          attachment_url: string | null
          category: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          entry_type: Database["public"]["Enums"]["overview_entry_type"]
          id: string
          is_deleted: boolean
          notes: string | null
          txn_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          attachment_url?: string | null
          category?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          entry_type: Database["public"]["Enums"]["overview_entry_type"]
          id?: string
          is_deleted?: boolean
          notes?: string | null
          txn_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          attachment_url?: string | null
          category?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          entry_type?: Database["public"]["Enums"]["overview_entry_type"]
          id?: string
          is_deleted?: boolean
          notes?: string | null
          txn_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      owner_report_snapshots: {
        Row: {
          created_at: string
          created_by: string | null
          created_by_name: string | null
          deleted_at: string | null
          deleted_by: string | null
          from_date: string
          id: string
          is_deleted: boolean
          period_label: string
          storage_path: string
          to_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          from_date: string
          id?: string
          is_deleted?: boolean
          period_label: string
          storage_path: string
          to_date: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          from_date?: string
          id?: string
          is_deleted?: boolean
          period_label?: string
          storage_path?: string
          to_date?: string
        }
        Relationships: []
      }
      parties: {
        Row: {
          address: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          name: string
          opening_advance: number
          opening_due: number
          opening_notes: string | null
          opening_payable: number
          party_type: Database["public"]["Enums"]["party_type"]
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          name: string
          opening_advance?: number
          opening_due?: number
          opening_notes?: string | null
          opening_payable?: number
          party_type?: Database["public"]["Enums"]["party_type"]
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          name?: string
          opening_advance?: number
          opening_due?: number
          opening_notes?: string | null
          opening_payable?: number
          party_type?: Database["public"]["Enums"]["party_type"]
          phone?: string | null
        }
        Relationships: []
      }
      pos_customer_opening_edits: {
        Row: {
          changed_at: string
          changed_by: string | null
          customer_id: string
          id: string
          new_value: number
          note: string | null
          old_value: number
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          customer_id: string
          id?: string
          new_value?: number
          note?: string | null
          old_value?: number
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          customer_id?: string
          id?: string
          new_value?: number
          note?: string | null
          old_value?: number
        }
        Relationships: []
      }
      pos_customers: {
        Row: {
          address: string | null
          alias: string | null
          created_at: string
          created_by: string | null
          credit_limit: number
          customer_type: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_active: boolean
          is_deleted: boolean
          name: string
          notes: string | null
          opening_due: number
          phone: string | null
          tags: string[]
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          alias?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          customer_type?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          name: string
          notes?: string | null
          opening_due?: number
          phone?: string | null
          tags?: string[]
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          alias?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          customer_type?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          name?: string
          notes?: string | null
          opening_due?: number
          phone?: string | null
          tags?: string[]
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      pos_opening_stock_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          new_value: number
          note: string | null
          old_value: number
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_value?: number
          note?: string | null
          old_value?: number
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_value?: number
          note?: string | null
          old_value?: number
        }
        Relationships: []
      }
      pos_payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          customer_id: string
          id: string
          kind: string
          method: string
          notes: string | null
          sale_id: string | null
          txn_date: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          customer_id: string
          id?: string
          kind?: string
          method?: string
          notes?: string | null
          sale_id?: string | null
          txn_date?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          customer_id?: string
          id?: string
          kind?: string
          method?: string
          notes?: string | null
          sale_id?: string | null
          txn_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pos_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_payments_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "shop_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_sale_edits: {
        Row: {
          changed_at: string
          changed_by: string | null
          diff: Json
          id: string
          note: string | null
          sale_id: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          diff?: Json
          id?: string
          note?: string | null
          sale_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          diff?: Json
          id?: string
          note?: string | null
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_sale_edits_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "shop_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      price_compare_products: {
        Row: {
          barcode: string | null
          brand: string | null
          category: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          notes: string | null
          sale_price: number | null
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          notes?: string | null
          sale_price?: number | null
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          notes?: string | null
          sale_price?: number | null
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_compare_records: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          market_name: string | null
          notes: string | null
          offer_price: number | null
          product_id: string
          purchase_price: number
          record_date: string
          selling_price: number | null
          supplier_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          market_name?: string | null
          notes?: string | null
          offer_price?: number | null
          product_id: string
          purchase_price?: number
          record_date?: string
          selling_price?: number | null
          supplier_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          market_name?: string | null
          notes?: string | null
          offer_price?: number | null
          product_id?: string
          purchase_price?: number
          record_date?: string
          selling_price?: number | null
          supplier_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_compare_records_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "price_compare_products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          failed_login_count: number
          full_name: string | null
          id: string
          is_disabled: boolean
          landing_page: string | null
          last_failed_at: string | null
          mobile: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          failed_login_count?: number
          full_name?: string | null
          id: string
          is_disabled?: boolean
          landing_page?: string | null
          last_failed_at?: string | null
          mobile?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          failed_login_count?: number
          full_name?: string | null
          id?: string
          is_disabled?: boolean
          landing_page?: string | null
          last_failed_at?: string | null
          mobile?: string | null
          username?: string | null
        }
        Relationships: []
      }
      profit_snapshots: {
        Row: {
          cash_position: number
          created_at: string
          created_by: string
          id: string
          name: string
          net_profit: number
          payload: Json
          period_from: string
          period_to: string
          scope: string
          shop_id: string | null
          shop_name: string | null
          total_expense: number
        }
        Insert: {
          cash_position?: number
          created_at?: string
          created_by?: string
          id?: string
          name: string
          net_profit?: number
          payload?: Json
          period_from: string
          period_to: string
          scope: string
          shop_id?: string | null
          shop_name?: string | null
          total_expense?: number
        }
        Update: {
          cash_position?: number
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          net_profit?: number
          payload?: Json
          period_from?: string
          period_to?: string
          scope?: string
          shop_id?: string | null
          shop_name?: string | null
          total_expense?: number
        }
        Relationships: []
      }
      sales_return_items: {
        Row: {
          created_at: string
          id: string
          line_value: number
          name: string
          price: number
          product_id: string | null
          qty: number
          reason: string | null
          return_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          line_value?: number
          name: string
          price?: number
          product_id?: string | null
          qty: number
          reason?: string | null
          return_id: string
        }
        Update: {
          created_at?: string
          id?: string
          line_value?: number
          name?: string
          price?: number
          product_id?: string | null
          qty?: number
          reason?: string | null
          return_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "sales_returns"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_returns: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          customer_mobile: string | null
          customer_name: string | null
          id: string
          invoice_number: number | null
          notes: string | null
          processed_by_name: string | null
          reason: string | null
          refund_amount: number
          refund_type: string
          return_number: string | null
          return_value: number
          sale_id: string
          total_qty: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          customer_mobile?: string | null
          customer_name?: string | null
          id?: string
          invoice_number?: number | null
          notes?: string | null
          processed_by_name?: string | null
          reason?: string | null
          refund_amount?: number
          refund_type?: string
          return_number?: string | null
          return_value?: number
          sale_id: string
          total_qty?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          customer_mobile?: string | null
          customer_name?: string | null
          id?: string
          invoice_number?: number | null
          notes?: string | null
          processed_by_name?: string | null
          reason?: string | null
          refund_amount?: number
          refund_type?: string
          return_number?: string | null
          return_value?: number
          sale_id?: string
          total_qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_returns_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "shop_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_ad_popup: {
        Row: {
          button_link: string | null
          button_text: string | null
          id: number
          image_url: string | null
          is_active: boolean
          message: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean
          message?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean
          message?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shop_ads: {
        Row: {
          button_link: string | null
          button_text: string | null
          click_count: number
          created_at: string
          created_by: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          link_type: string
          link_value: string | null
          placement: string
          priority: number
          sort_order: number
          start_date: string | null
          subtitle: string | null
          title: string | null
          updated_at: string
          view_count: number
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          click_count?: number
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_type?: string
          link_value?: string | null
          placement?: string
          priority?: number
          sort_order?: number
          start_date?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          view_count?: number
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          click_count?: number
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_type?: string
          link_value?: string | null
          placement?: string
          priority?: number
          sort_order?: number
          start_date?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      shop_banners: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          image_url: string
          is_active: boolean
          link_type: string
          link_url: string | null
          link_value: string | null
          message: string | null
          message_ar: string | null
          message_bn: string | null
          sort_order: number
          start_date: string | null
          title: string | null
          title_ar: string | null
          title_bn: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          link_type?: string
          link_url?: string | null
          link_value?: string | null
          message?: string | null
          message_ar?: string | null
          message_bn?: string | null
          sort_order?: number
          start_date?: string | null
          title?: string | null
          title_ar?: string | null
          title_bn?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          link_type?: string
          link_url?: string | null
          link_value?: string | null
          message?: string | null
          message_ar?: string | null
          message_bn?: string | null
          sort_order?: number
          start_date?: string | null
          title?: string | null
          title_ar?: string | null
          title_bn?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shop_categories: {
        Row: {
          created_at: string
          created_by: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          name_ar: string | null
          name_bn: string | null
          slug: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          name_ar?: string | null
          name_bn?: string | null
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string | null
          name_bn?: string | null
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      shop_entries: {
        Row: {
          attachment_url: string | null
          bank_sale: number
          cash_sale: number
          cashier_id: string | null
          created_at: string
          created_by: string | null
          credit_sale: number
          deleted_at: string | null
          deleted_by: string | null
          difference: number
          due_receivable: number
          entry_type: string
          expense_amount: number
          id: string
          is_deleted: boolean
          notes: string | null
          ocr_confidence: string | null
          ocr_original_amount: number | null
          ocr_scan_id: string | null
          pos_sale: number
          purchase_amount: number
          shop_id: string
          txn_date: string
          withdraw_amount: number
        }
        Insert: {
          attachment_url?: string | null
          bank_sale?: number
          cash_sale?: number
          cashier_id?: string | null
          created_at?: string
          created_by?: string | null
          credit_sale?: number
          deleted_at?: string | null
          deleted_by?: string | null
          difference?: number
          due_receivable?: number
          entry_type: string
          expense_amount?: number
          id?: string
          is_deleted?: boolean
          notes?: string | null
          ocr_confidence?: string | null
          ocr_original_amount?: number | null
          ocr_scan_id?: string | null
          pos_sale?: number
          purchase_amount?: number
          shop_id: string
          txn_date?: string
          withdraw_amount?: number
        }
        Update: {
          attachment_url?: string | null
          bank_sale?: number
          cash_sale?: number
          cashier_id?: string | null
          created_at?: string
          created_by?: string | null
          credit_sale?: number
          deleted_at?: string | null
          deleted_by?: string | null
          difference?: number
          due_receivable?: number
          entry_type?: string
          expense_amount?: number
          id?: string
          is_deleted?: boolean
          notes?: string | null
          ocr_confidence?: string | null
          ocr_original_amount?: number | null
          ocr_scan_id?: string | null
          pos_sale?: number
          purchase_amount?: number
          shop_id?: string
          txn_date?: string
          withdraw_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_entries_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "cashiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_entries_ocr_scan_id_fkey"
            columns: ["ocr_scan_id"]
            isOneToOne: false
            referencedRelation: "ai_scans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_entries_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_notifications: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          is_pinned: boolean
          message: string | null
          title: string
          type: Database["public"]["Enums"]["shop_notification_type"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          message?: string | null
          title: string
          type?: Database["public"]["Enums"]["shop_notification_type"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          is_pinned?: boolean
          message?: string | null
          title?: string
          type?: Database["public"]["Enums"]["shop_notification_type"]
        }
        Relationships: []
      }
      shop_orders: {
        Row: {
          admin_notes: string | null
          created_at: string
          customer_address: string | null
          customer_mobile: string
          customer_name: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          items: Json
          notes: string | null
          order_number: number
          status: Database["public"]["Enums"]["shop_order_status"]
          total: number
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          customer_address?: string | null
          customer_mobile: string
          customer_name: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          items?: Json
          notes?: string | null
          order_number?: number
          status?: Database["public"]["Enums"]["shop_order_status"]
          total?: number
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          customer_address?: string | null
          customer_mobile?: string
          customer_name?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          items?: Json
          notes?: string | null
          order_number?: number
          status?: Database["public"]["Enums"]["shop_order_status"]
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      shop_products: {
        Row: {
          barcode: string | null
          category_id: string | null
          category_ids: string[]
          compare_price: number | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          gallery_image_urls: string[]
          id: string
          image_url: string | null
          is_deleted: boolean
          is_featured: boolean
          is_visible: boolean
          item_code: string | null
          location: string | null
          min_stock: number
          name: string
          name_ar: string | null
          name_bn: string | null
          price: number
          purchase_price: number
          search_keywords: string[]
          show_stock: boolean
          sort_order: number
          stock: number
          tax_inclusive: boolean
          tax_rate: number
          updated_at: string
          warehouse_item_id: string | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          category_ids?: string[]
          compare_price?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          gallery_image_urls?: string[]
          id?: string
          image_url?: string | null
          is_deleted?: boolean
          is_featured?: boolean
          is_visible?: boolean
          item_code?: string | null
          location?: string | null
          min_stock?: number
          name: string
          name_ar?: string | null
          name_bn?: string | null
          price?: number
          purchase_price?: number
          search_keywords?: string[]
          show_stock?: boolean
          sort_order?: number
          stock?: number
          tax_inclusive?: boolean
          tax_rate?: number
          updated_at?: string
          warehouse_item_id?: string | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          category_ids?: string[]
          compare_price?: number | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          gallery_image_urls?: string[]
          id?: string
          image_url?: string | null
          is_deleted?: boolean
          is_featured?: boolean
          is_visible?: boolean
          item_code?: string | null
          location?: string | null
          min_stock?: number
          name?: string
          name_ar?: string | null
          name_bn?: string | null
          price?: number
          purchase_price?: number
          search_keywords?: string[]
          show_stock?: boolean
          sort_order?: number
          stock?: number
          tax_inclusive?: boolean
          tax_rate?: number
          updated_at?: string
          warehouse_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "shop_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_products_warehouse_item_id_fkey"
            columns: ["warehouse_item_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_purchases: {
        Row: {
          attachment_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          invoice_number: number
          is_deleted: boolean
          items: Json
          memo_date: string | null
          notes: string | null
          status: string
          subtotal: number
          supplier_mobile: string | null
          supplier_name: string
          tax: number
          total: number
          txn_date: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          invoice_number?: number
          is_deleted?: boolean
          items?: Json
          memo_date?: string | null
          notes?: string | null
          status?: string
          subtotal?: number
          supplier_mobile?: string | null
          supplier_name: string
          tax?: number
          total?: number
          txn_date?: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          invoice_number?: number
          is_deleted?: boolean
          items?: Json
          memo_date?: string | null
          notes?: string | null
          status?: string
          subtotal?: number
          supplier_mobile?: string | null
          supplier_name?: string
          tax?: number
          total?: number
          txn_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      shop_sales: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          customer_mobile: string | null
          customer_name: string
          deleted_at: string | null
          deleted_by: string | null
          discount: number
          due_amount: number
          edit_count: number
          id: string
          invoice_number: number
          is_deleted: boolean
          items: Json
          notes: string | null
          order_id: string | null
          paid_amount: number
          payment_breakdown: Json
          payment_method: string
          status: string
          subtotal: number
          tax: number
          total: number
          txn_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          customer_mobile?: string | null
          customer_name: string
          deleted_at?: string | null
          deleted_by?: string | null
          discount?: number
          due_amount?: number
          edit_count?: number
          id?: string
          invoice_number?: number
          is_deleted?: boolean
          items?: Json
          notes?: string | null
          order_id?: string | null
          paid_amount?: number
          payment_breakdown?: Json
          payment_method?: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          txn_date?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          customer_mobile?: string | null
          customer_name?: string
          deleted_at?: string | null
          deleted_by?: string | null
          discount?: number
          due_amount?: number
          edit_count?: number
          id?: string
          invoice_number?: number
          is_deleted?: boolean
          items?: Json
          notes?: string | null
          order_id?: string | null
          paid_amount?: number
          payment_breakdown?: Json
          payment_method?: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          txn_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pos_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          name: string
          opening_cash: number
          shop_type: Database["public"]["Enums"]["shop_type"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          name: string
          opening_cash?: number
          shop_type?: Database["public"]["Enums"]["shop_type"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          name?: string
          opening_cash?: number
          shop_type?: Database["public"]["Enums"]["shop_type"]
        }
        Relationships: []
      }
      stock_count_adjustments: {
        Row: {
          created_at: string
          created_by: string | null
          diff_qty: number
          diff_value: number
          id: string
          note: string | null
          physical_qty: number
          product_id: string
          product_name: string
          reason: string | null
          session_id: string
          system_qty: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          diff_qty: number
          diff_value?: number
          id?: string
          note?: string | null
          physical_qty: number
          product_id: string
          product_name: string
          reason?: string | null
          session_id: string
          system_qty: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          diff_qty?: number
          diff_value?: number
          id?: string
          note?: string | null
          physical_qty?: number
          product_id?: string
          product_name?: string
          reason?: string | null
          session_id?: string
          system_qty?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_count_adjustments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_count_adjustments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_count_adjustments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "stock_count_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_count_items: {
        Row: {
          barcode: string | null
          category: string | null
          counted_at: string | null
          counted_by: string | null
          created_at: string
          frozen_qty: number
          id: string
          name: string
          physical_qty: number | null
          product_id: string
          purchase_price: number
          session_id: string
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          category?: string | null
          counted_at?: string | null
          counted_by?: string | null
          created_at?: string
          frozen_qty?: number
          id?: string
          name: string
          physical_qty?: number | null
          product_id: string
          purchase_price?: number
          session_id: string
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          category?: string | null
          counted_at?: string | null
          counted_by?: string | null
          created_at?: string
          frozen_qty?: number
          id?: string
          name?: string
          physical_qty?: number | null
          product_id?: string
          purchase_price?: number
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_count_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_count_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_count_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "stock_count_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_count_sessions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          blind_count: boolean
          count_date: string
          counted_products: number
          created_at: string
          created_by: string | null
          diff_qty: number
          diff_value: number
          id: string
          is_deleted: boolean
          name: string
          scan_mode: string
          shop_id: string | null
          status: string
          stock_applied: boolean
          stock_applied_at: string | null
          stock_applied_by: string | null
          total_products: number
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          blind_count?: boolean
          count_date?: string
          counted_products?: number
          created_at?: string
          created_by?: string | null
          diff_qty?: number
          diff_value?: number
          id?: string
          is_deleted?: boolean
          name: string
          scan_mode?: string
          shop_id?: string | null
          status?: string
          stock_applied?: boolean
          stock_applied_at?: string | null
          stock_applied_by?: string | null
          total_products?: number
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          blind_count?: boolean
          count_date?: string
          counted_products?: number
          created_at?: string
          created_by?: string | null
          diff_qty?: number
          diff_value?: number
          id?: string
          is_deleted?: boolean
          name?: string
          scan_mode?: string
          shop_id?: string | null
          status?: string
          stock_applied?: boolean
          stock_applied_at?: string | null
          stock_applied_by?: string | null
          total_products?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_count_sessions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_categories: {
        Row: {
          category_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          name: string
        }
        Insert: {
          category_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          name: string
        }
        Update: {
          category_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          attachment_url: string | null
          cashier: string | null
          category: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          notes: string | null
          payment_method: Database["public"]["Enums"]["pay_method"]
          shop_id: string | null
          source: string | null
          source_ref_id: string | null
          subcategory: string | null
          txn_date: string
          type: Database["public"]["Enums"]["txn_type"]
        }
        Insert: {
          amount: number
          attachment_url?: string | null
          cashier?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["pay_method"]
          shop_id?: string | null
          source?: string | null
          source_ref_id?: string | null
          subcategory?: string | null
          txn_date?: string
          type: Database["public"]["Enums"]["txn_type"]
        }
        Update: {
          amount?: number
          attachment_url?: string | null
          cashier?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["pay_method"]
          shop_id?: string | null
          source?: string | null
          source_ref_id?: string | null
          subcategory?: string | null
          txn_date?: string
          type?: Database["public"]["Enums"]["txn_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      user_page_access: {
        Row: {
          created_at: string
          page_key: string
          user_id: string
        }
        Insert: {
          created_at?: string
          page_key: string
          user_id: string
        }
        Update: {
          created_at?: string
          page_key?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_shop_access: {
        Row: {
          created_at: string
          id: string
          shop_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          shop_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          shop_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_shop_access_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse_items: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          product_name: string
          purchase_price: number
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          product_name: string
          purchase_price?: number
          quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          product_name?: string
          purchase_price?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      warehouse_ledger: {
        Row: {
          amount: number
          attachment_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          entry_type: Database["public"]["Enums"]["wh_entry_type"]
          id: string
          is_deleted: boolean
          notes: string | null
          paid_amount: number
          party_id: string | null
          party_name: string
          payment_status: Database["public"]["Enums"]["wh_pay_status"]
          remaining_due: number
          txn_date: string
        }
        Insert: {
          amount?: number
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          entry_type: Database["public"]["Enums"]["wh_entry_type"]
          id?: string
          is_deleted?: boolean
          notes?: string | null
          paid_amount?: number
          party_id?: string | null
          party_name: string
          payment_status?: Database["public"]["Enums"]["wh_pay_status"]
          remaining_due?: number
          txn_date?: string
        }
        Update: {
          amount?: number
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          entry_type?: Database["public"]["Enums"]["wh_entry_type"]
          id?: string
          is_deleted?: boolean
          notes?: string | null
          paid_amount?: number
          party_id?: string | null
          party_name?: string
          payment_status?: Database["public"]["Enums"]["wh_pay_status"]
          remaining_due?: number
          txn_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_ledger_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse_stock_adjustments: {
        Row: {
          created_at: string
          created_by: string | null
          diff_qty: number
          id: string
          new_qty: number
          note: string | null
          old_qty: number
          product_id: string
          product_name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          diff_qty: number
          id?: string
          new_qty: number
          note?: string | null
          old_qty: number
          product_id: string
          product_name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          diff_qty?: number
          id?: string
          new_qty?: number
          note?: string | null
          old_qty?: number
          product_id?: string
          product_name?: string
        }
        Relationships: []
      }
      website_activity_logs: {
        Row: {
          action: string
          amount: number | null
          created_at: string
          created_by: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          meta: Json
          subtitle: string | null
          title: string
        }
        Insert: {
          action: string
          amount?: number | null
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          meta?: Json
          subtitle?: string | null
          title: string
        }
        Update: {
          action?: string
          amount?: number | null
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          meta?: Json
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      website_categories: {
        Row: {
          created_at: string
          created_by: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          name_ar: string | null
          name_bn: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          name_ar?: string | null
          name_bn?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string | null
          name_bn?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      website_customers: {
        Row: {
          address: string | null
          alias: string | null
          created_at: string
          created_by: string | null
          credit_limit: number
          customer_type: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_active: boolean
          is_deleted: boolean
          name: string
          notes: string | null
          opening_due: number
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          alias?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          customer_type?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          name: string
          notes?: string | null
          opening_due?: number
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          alias?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit?: number
          customer_type?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          name?: string
          notes?: string | null
          opening_due?: number
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      website_orders: {
        Row: {
          admin_notes: string | null
          created_at: string
          customer_address: string | null
          customer_mobile: string | null
          customer_name: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean
          items: Json
          notes: string | null
          order_number: number
          status: string
          total: number
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          customer_address?: string | null
          customer_mobile?: string | null
          customer_name: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          items?: Json
          notes?: string | null
          order_number?: number
          status?: string
          total?: number
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          customer_address?: string | null
          customer_mobile?: string | null
          customer_name?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean
          items?: Json
          notes?: string | null
          order_number?: number
          status?: string
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      website_payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          customer_id: string
          id: string
          kind: string
          method: string
          notes: string | null
          sale_id: string | null
          txn_date: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          customer_id: string
          id?: string
          kind?: string
          method?: string
          notes?: string | null
          sale_id?: string | null
          txn_date?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          customer_id?: string
          id?: string
          kind?: string
          method?: string
          notes?: string | null
          sale_id?: string | null
          txn_date?: string
        }
        Relationships: []
      }
      website_products: {
        Row: {
          barcode: string | null
          category_id: string | null
          category_ids: string[] | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          gallery_image_urls: string[]
          id: string
          image_url: string | null
          is_deleted: boolean
          is_featured: boolean
          is_visible: boolean
          item_code: string | null
          min_stock: number
          name: string
          name_ar: string | null
          name_bn: string | null
          price: number
          purchase_price: number
          show_stock: boolean
          sort_order: number
          stock: number
          tax_rate: number
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          category_ids?: string[] | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          gallery_image_urls?: string[]
          id?: string
          image_url?: string | null
          is_deleted?: boolean
          is_featured?: boolean
          is_visible?: boolean
          item_code?: string | null
          min_stock?: number
          name: string
          name_ar?: string | null
          name_bn?: string | null
          price?: number
          purchase_price?: number
          show_stock?: boolean
          sort_order?: number
          stock?: number
          tax_rate?: number
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          category_ids?: string[] | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          gallery_image_urls?: string[]
          id?: string
          image_url?: string | null
          is_deleted?: boolean
          is_featured?: boolean
          is_visible?: boolean
          item_code?: string | null
          min_stock?: number
          name?: string
          name_ar?: string | null
          name_bn?: string | null
          price?: number
          purchase_price?: number
          show_stock?: boolean
          sort_order?: number
          stock?: number
          tax_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      website_purchases: {
        Row: {
          attachment_url: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          invoice_number: number
          is_deleted: boolean
          items: Json
          notes: string | null
          status: string
          subtotal: number
          supplier_mobile: string | null
          supplier_name: string
          tax: number
          total: number
          txn_date: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          invoice_number?: number
          is_deleted?: boolean
          items?: Json
          notes?: string | null
          status?: string
          subtotal?: number
          supplier_mobile?: string | null
          supplier_name: string
          tax?: number
          total?: number
          txn_date?: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          invoice_number?: number
          is_deleted?: boolean
          items?: Json
          notes?: string | null
          status?: string
          subtotal?: number
          supplier_mobile?: string | null
          supplier_name?: string
          tax?: number
          total?: number
          txn_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_sales: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          customer_mobile: string | null
          customer_name: string
          deleted_at: string | null
          deleted_by: string | null
          discount: number
          due_amount: number
          id: string
          invoice_number: number
          is_deleted: boolean
          items: Json
          notes: string | null
          order_id: string | null
          paid_amount: number
          payment_breakdown: Json
          payment_method: string
          status: string
          subtotal: number
          tax: number
          total: number
          txn_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          customer_mobile?: string | null
          customer_name: string
          deleted_at?: string | null
          deleted_by?: string | null
          discount?: number
          due_amount?: number
          id?: string
          invoice_number?: number
          is_deleted?: boolean
          items?: Json
          notes?: string | null
          order_id?: string | null
          paid_amount?: number
          payment_breakdown?: Json
          payment_method?: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          txn_date?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          customer_mobile?: string | null
          customer_name?: string
          deleted_at?: string | null
          deleted_by?: string | null
          discount?: number
          due_amount?: number
          id?: string
          invoice_number?: number
          is_deleted?: boolean
          items?: Json
          notes?: string | null
          order_id?: string | null
          paid_amount?: number
          payment_breakdown?: Json
          payment_method?: string
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          txn_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      wholesale_stock_checks: {
        Row: {
          checked_at: string
          checked_by: string | null
          product_id: string
        }
        Insert: {
          checked_at?: string
          checked_by?: string | null
          product_id: string
        }
        Update: {
          checked_at?: string
          checked_by?: string | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_stock_checks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wholesale_stock_checks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "shop_products_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      sale_returned_qty_v: {
        Row: {
          item_key: string | null
          returned_qty: number | null
          returned_value: number | null
          sale_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_returns_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "shop_sales"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_products_public: {
        Row: {
          barcode: string | null
          category_id: string | null
          category_ids: string[] | null
          compare_price: number | null
          created_at: string | null
          description: string | null
          gallery_image_urls: string[] | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          is_visible: boolean | null
          item_code: string | null
          location: string | null
          min_stock: number | null
          name: string | null
          name_ar: string | null
          name_bn: string | null
          price: number | null
          search_keywords: string[] | null
          show_stock: boolean | null
          sort_order: number | null
          stock: number | null
          tax_inclusive: boolean | null
          tax_rate: number | null
          updated_at: string | null
          warehouse_item_id: string | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          category_ids?: string[] | null
          compare_price?: number | null
          created_at?: string | null
          description?: string | null
          gallery_image_urls?: string[] | null
          id?: string | null
          image_url?: string | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          item_code?: string | null
          location?: string | null
          min_stock?: number | null
          name?: string | null
          name_ar?: string | null
          name_bn?: string | null
          price?: number | null
          search_keywords?: string[] | null
          show_stock?: boolean | null
          sort_order?: number | null
          stock?: number | null
          tax_inclusive?: boolean | null
          tax_rate?: number | null
          updated_at?: string | null
          warehouse_item_id?: string | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          category_ids?: string[] | null
          compare_price?: number | null
          created_at?: string | null
          description?: string | null
          gallery_image_urls?: string[] | null
          id?: string | null
          image_url?: string | null
          is_featured?: boolean | null
          is_visible?: boolean | null
          item_code?: string | null
          location?: string | null
          min_stock?: number | null
          name?: string | null
          name_ar?: string | null
          name_bn?: string | null
          price?: number | null
          search_keywords?: string[] | null
          show_stock?: boolean | null
          sort_order?: number | null
          stock?: number | null
          tax_inclusive?: boolean | null
          tax_rate?: number | null
          updated_at?: string | null
          warehouse_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "shop_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_products_warehouse_item_id_fkey"
            columns: ["warehouse_item_id"]
            isOneToOne: false
            referencedRelation: "warehouse_items"
            referencedColumns: ["id"]
          },
        ]
      }
      v_cash_holders: {
        Row: {
          balance: number | null
          display_name: string | null
          total_given: number | null
          total_received: number | null
          total_returned: number | null
          total_spent: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_cash_reconciliation: {
        Row: {
          cash_in: number | null
          day_date: string | null
          distributed: number | null
          purchases: number | null
          returns: number | null
          shop_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      adjust_warehouse_stock: {
        Args: { _new_qty: number; _note?: string; _product_id: string }
        Returns: Json
      }
      approve_stock_count: {
        Args: { _reason_map?: Json; _session_id: string }
        Returns: Json
      }
      bump_failed_login: { Args: { _identifier: string }; Returns: undefined }
      cancel_public_shop_order: {
        Args: { _customer_mobile: string; _order_id: string }
        Returns: Database["public"]["Enums"]["shop_order_status"]
      }
      cf_can_verify: { Args: { _user: string }; Returns: boolean }
      cf_is_locked: {
        Args: { _day: string; _shop_id: string }
        Returns: boolean
      }
      cleanup_entity_history: { Args: { _days: number }; Returns: number }
      cleanup_recycle_bin: { Args: { _days: number }; Returns: number }
      create_public_shop_order: {
        Args: {
          _customer_address: string
          _customer_mobile: string
          _customer_name: string
          _items: Json
          _notes: string
          _total: number
        }
        Returns: {
          id: string
          order_number: number
        }[]
      }
      delete_entity_history: { Args: { _ids: string[] }; Returns: number }
      end_stock_count_session: { Args: { _session_id: string }; Returns: Json }
      find_login_email: { Args: { _identifier: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_sales_delivery_role: { Args: { _user: string }; Returns: boolean }
      is_month_closed: { Args: { _d: string }; Returns: boolean }
      is_soft_deletable_table: {
        Args: { _table_name: string }
        Returns: boolean
      }
      is_valid_public_shop_order: {
        Args: {
          _admin_notes: string
          _customer_address: string
          _customer_mobile: string
          _customer_name: string
          _is_deleted: boolean
          _items: Json
          _notes: string
          _status: Database["public"]["Enums"]["shop_order_status"]
          _total: number
        }
        Returns: boolean
      }
      pos_customer_balance: {
        Args: { _customer_id: string }
        Returns: {
          current_due: number
          opening: number
          total_paid: number
          total_sales: number
        }[]
      }
      process_sales_return:
        | {
            Args: {
              _items: Json
              _notes?: string
              _refund_type?: string
              _sale_id: string
            }
            Returns: string
          }
        | {
            Args: {
              _items: Json
              _notes?: string
              _reason?: string
              _refund_type?: string
              _sale_id: string
            }
            Returns: string
          }
      reapply_stock_count: { Args: { _session_id: string }; Returns: Json }
      refresh_stock_count_progress: {
        Args: { _session_id: string }
        Returns: undefined
      }
      reset_failed_login: { Args: never; Returns: undefined }
      reset_stock_count_session: {
        Args: { _session_id: string }
        Returns: number
      }
      restore_record: {
        Args: { _record_id: string; _table_name: string }
        Returns: undefined
      }
      set_erp_user_password: {
        Args: { _password: string; _user_id: string }
        Returns: undefined
      }
      shop_ad_track: {
        Args: { _ad_id: string; _kind: string }
        Returns: undefined
      }
      soft_delete_record: {
        Args: { _record_id: string; _table_name: string }
        Returns: undefined
      }
      start_stock_count_session: {
        Args: { _session_id: string }
        Returns: number
      }
      stock_count_items_page: {
        Args: {
          _filter?: string
          _limit?: number
          _offset?: number
          _search?: string
          _session_id: string
        }
        Returns: {
          barcode: string
          category: string
          counted_at: string
          counted_by: string
          frozen_qty: number
          id: string
          name: string
          physical_qty: number
          product_id: string
          purchase_price: number
          session_id: string
          total_count: number
        }[]
      }
      stock_count_summary: {
        Args: { _session_id: string }
        Returns: {
          counted: number
          curr_total_qty: number
          curr_total_value: number
          diff_count: number
          diff_value: number
          extra_products: number
          extra_qty: number
          extra_value: number
          missing_products: number
          missing_qty: number
          missing_value: number
          nodiff_products: number
          prev_total_qty: number
          prev_total_value: number
          total: number
        }[]
      }
      trace_cash: {
        Args: { _handover_id: string }
        Returns: {
          amount: number
          day_date: string
          from_user: string
          id: string
          level: number
          parent_handover_id: string
          status: Database["public"]["Enums"]["cash_handover_status"]
          to_user: string
        }[]
      }
      update_public_shop_order: {
        Args: {
          _customer_mobile: string
          _items: Json
          _notes: string
          _order_id: string
          _total: number
        }
        Returns: undefined
      }
      user_can_access_shop: {
        Args: { _shop_id: string; _user: string }
        Returns: boolean
      }
      verify_erp_login: {
        Args: { _identifier: string; _password: string }
        Returns: {
          email: string
          user_id: string
        }[]
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "manager"
        | "staff"
        | "viewer"
        | "accountant"
        | "purchaser"
        | "verifier"
        | "super_admin"
        | "cashier"
        | "deliveryman"
        | "sales_delivery"
      cash_handover_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "returned"
        | "closed"
      cf_verify_status: "pending" | "verified" | "rejected"
      employee_entry_type: "given" | "received"
      overview_entry_type: "income" | "cost"
      party_type: "customer" | "supplier" | "mixed"
      pay_method: "cash" | "bank" | "card" | "other"
      shop_notification_type: "offer" | "stock" | "new_product" | "important"
      shop_order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "delivered"
        | "cancelled"
      shop_type: "full_erp" | "simple_cash"
      txn_type:
        | "cash_in"
        | "cash_out"
        | "bank_withdraw"
        | "purchase"
        | "expense"
        | "supervisor_payment"
        | "adjustment"
      wh_entry_type:
        | "warehouse_sale"
        | "warehouse_purchase"
        | "payment_received"
        | "supplier_payment"
        | "adjustment"
      wh_pay_status: "cash" | "credit" | "partial"
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
      app_role: [
        "admin",
        "manager",
        "staff",
        "viewer",
        "accountant",
        "purchaser",
        "verifier",
        "super_admin",
        "cashier",
        "deliveryman",
        "sales_delivery",
      ],
      cash_handover_status: [
        "pending",
        "accepted",
        "rejected",
        "returned",
        "closed",
      ],
      cf_verify_status: ["pending", "verified", "rejected"],
      employee_entry_type: ["given", "received"],
      overview_entry_type: ["income", "cost"],
      party_type: ["customer", "supplier", "mixed"],
      pay_method: ["cash", "bank", "card", "other"],
      shop_notification_type: ["offer", "stock", "new_product", "important"],
      shop_order_status: [
        "pending",
        "confirmed",
        "preparing",
        "delivered",
        "cancelled",
      ],
      shop_type: ["full_erp", "simple_cash"],
      txn_type: [
        "cash_in",
        "cash_out",
        "bank_withdraw",
        "purchase",
        "expense",
        "supervisor_payment",
        "adjustment",
      ],
      wh_entry_type: [
        "warehouse_sale",
        "warehouse_purchase",
        "payment_received",
        "supplier_payment",
        "adjustment",
      ],
      wh_pay_status: ["cash", "credit", "partial"],
    },
  },
} as const
