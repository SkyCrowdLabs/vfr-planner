export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      aircraft: {
        Row: {
          bew: number | null;
          bew_cg: number | null;
          cg_limit_aft: number | null;
          cg_limit_fwd: number | null;
          climb_ff: number | null;
          climb_ias: number | null;
          climb_vs: number | null;
          created_at: string;
          cruise_ff: number | null;
          cruise_ias: number | null;
          descent_ff: number | null;
          descent_ias: number | null;
          descent_vs: number | null;
          engine: string | null;
          engine_hp: number | null;
          equipment: string | null;
          id: string;
          manufacturer: string | null;
          model: string | null;
          tail_num: string | null;
          transponder: string | null;
          type: string | null;
          user_id: string | null;
        };
        Insert: {
          bew?: number | null;
          bew_cg?: number | null;
          cg_limit_aft?: number | null;
          cg_limit_fwd?: number | null;
          climb_ff?: number | null;
          climb_ias?: number | null;
          climb_vs?: number | null;
          created_at?: string;
          cruise_ff?: number | null;
          cruise_ias?: number | null;
          descent_ff?: number | null;
          descent_ias?: number | null;
          descent_vs?: number | null;
          engine?: string | null;
          engine_hp?: number | null;
          equipment?: string | null;
          id?: string;
          manufacturer?: string | null;
          model?: string | null;
          tail_num?: string | null;
          transponder?: string | null;
          type?: string | null;
          user_id?: string | null;
        };
        Update: {
          bew?: number | null;
          bew_cg?: number | null;
          cg_limit_aft?: number | null;
          cg_limit_fwd?: number | null;
          climb_ff?: number | null;
          climb_ias?: number | null;
          climb_vs?: number | null;
          created_at?: string;
          cruise_ff?: number | null;
          cruise_ias?: number | null;
          descent_ff?: number | null;
          descent_ias?: number | null;
          descent_vs?: number | null;
          engine?: string | null;
          engine_hp?: number | null;
          equipment?: string | null;
          id?: string;
          manufacturer?: string | null;
          model?: string | null;
          tail_num?: string | null;
          transponder?: string | null;
          type?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_aircraft_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      "airport-frequencies": {
        Row: {
          airport_ident: string | null;
          airport_ref: number | null;
          description: string | null;
          frequency_mhz: number | null;
          id: number;
          type: string | null;
        };
        Insert: {
          airport_ident?: string | null;
          airport_ref?: number | null;
          description?: string | null;
          frequency_mhz?: number | null;
          id: number;
          type?: string | null;
        };
        Update: {
          airport_ident?: string | null;
          airport_ref?: number | null;
          description?: string | null;
          frequency_mhz?: number | null;
          id?: number;
          type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_airport-frequencies_airport_ref_fkey";
            columns: ["airport_ref"];
            isOneToOne: false;
            referencedRelation: "airports";
            referencedColumns: ["id"];
          }
        ];
      };
      airports: {
        Row: {
          continent: string | null;
          elevation_ft: string | null;
          gps_code: string | null;
          home_link: string | null;
          iata_code: string | null;
          id: number;
          ident: string | null;
          iso_country: string | null;
          iso_region: string | null;
          keywords: string | null;
          latitude_deg: number | null;
          local_code: string | null;
          longitude_deg: number | null;
          municipality: string | null;
          name: string | null;
          scheduled_service: string | null;
          type: string | null;
          wikipedia_link: string | null;
          ident_name: string | null;
        };
        Insert: {
          continent?: string | null;
          elevation_ft?: string | null;
          gps_code?: string | null;
          home_link?: string | null;
          iata_code?: string | null;
          id: number;
          ident?: string | null;
          iso_country?: string | null;
          iso_region?: string | null;
          keywords?: string | null;
          latitude_deg?: number | null;
          local_code?: string | null;
          longitude_deg?: number | null;
          municipality?: string | null;
          name?: string | null;
          scheduled_service?: string | null;
          type?: string | null;
          wikipedia_link?: string | null;
        };
        Update: {
          continent?: string | null;
          elevation_ft?: string | null;
          gps_code?: string | null;
          home_link?: string | null;
          iata_code?: string | null;
          id?: number;
          ident?: string | null;
          iso_country?: string | null;
          iso_region?: string | null;
          keywords?: string | null;
          latitude_deg?: number | null;
          local_code?: string | null;
          longitude_deg?: number | null;
          municipality?: string | null;
          name?: string | null;
          scheduled_service?: string | null;
          type?: string | null;
          wikipedia_link?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          first_name: string | null;
          id: string;
          last_name: string | null;
          middle_name: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          middle_name?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          middle_name?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      routes: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
          user_id: string | null;
          waypoints: Json | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
          user_id?: string | null;
          waypoints?: Json | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
          user_id?: string | null;
          waypoints?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_routes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      runways: {
        Row: {
          airport_ident: string | null;
          airport_ref: number | null;
          closed: string | null;
          he_displaced_threshold_ft: string | null;
          he_elevation_ft: string | null;
          he_heading_degT: string | null;
          he_ident: string | null;
          he_latitude_deg: string | null;
          he_longitude_deg: string | null;
          id: number | null;
          le_displaced_threshold_ft: string | null;
          le_elevation_ft: string | null;
          le_heading_degT: string | null;
          le_ident: string | null;
          le_latitude_deg: string | null;
          le_longitude_deg: string | null;
          length_ft: string | null;
          lighted: string | null;
          surface: string | null;
          width_ft: string | null;
        };
        Insert: {
          airport_ident?: string | null;
          airport_ref?: number | null;
          closed?: string | null;
          he_displaced_threshold_ft?: string | null;
          he_elevation_ft?: string | null;
          he_heading_degT?: string | null;
          he_ident?: string | null;
          he_latitude_deg?: string | null;
          he_longitude_deg?: string | null;
          id?: number | null;
          le_displaced_threshold_ft?: string | null;
          le_elevation_ft?: string | null;
          le_heading_degT?: string | null;
          le_ident?: string | null;
          le_latitude_deg?: string | null;
          le_longitude_deg?: string | null;
          length_ft?: string | null;
          lighted?: string | null;
          surface?: string | null;
          width_ft?: string | null;
        };
        Update: {
          airport_ident?: string | null;
          airport_ref?: number | null;
          closed?: string | null;
          he_displaced_threshold_ft?: string | null;
          he_elevation_ft?: string | null;
          he_heading_degT?: string | null;
          he_ident?: string | null;
          he_latitude_deg?: string | null;
          he_longitude_deg?: string | null;
          id?: number | null;
          le_displaced_threshold_ft?: string | null;
          le_elevation_ft?: string | null;
          le_heading_degT?: string | null;
          le_ident?: string | null;
          le_latitude_deg?: string | null;
          le_longitude_deg?: string | null;
          length_ft?: string | null;
          lighted?: string | null;
          surface?: string | null;
          width_ft?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_runways_airport_ref_fkey";
            columns: ["airport_ref"];
            isOneToOne: false;
            referencedRelation: "airports";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      ident_name: {
        Args: {
          "": unknown;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
