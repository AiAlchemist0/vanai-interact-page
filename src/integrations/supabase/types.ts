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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      geographic_data: {
        Row: {
          city: string | null
          created_at: string
          id: string
          last_activity: string
          listening_count: number | null
          region: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          last_activity?: string
          listening_count?: number | null
          region?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          last_activity?: string
          listening_count?: number | null
          region?: string | null
        }
        Relationships: []
      }
      listening_sessions: {
        Row: {
          browser_type: string | null
          created_at: string
          device_type: string | null
          ended_at: string | null
          id: string
          started_at: string
          total_duration_seconds: number | null
          total_songs_played: number | null
          user_session_id: string
        }
        Insert: {
          browser_type?: string | null
          created_at?: string
          device_type?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string
          total_duration_seconds?: number | null
          total_songs_played?: number | null
          user_session_id: string
        }
        Update: {
          browser_type?: string | null
          created_at?: string
          device_type?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string
          total_duration_seconds?: number | null
          total_songs_played?: number | null
          user_session_id?: string
        }
        Relationships: []
      }
      real_time_metrics: {
        Row: {
          id: string
          metric_type: string
          metric_value: number
          timestamp: string
        }
        Insert: {
          id?: string
          metric_type: string
          metric_value: number
          timestamp?: string
        }
        Update: {
          id?: string
          metric_type?: string
          metric_value?: number
          timestamp?: string
        }
        Relationships: []
      }
      song_plays: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: string
          is_valid_play: boolean | null
          played_at: string
          song_id: string
          user_session_id: string | null
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_valid_play?: boolean | null
          played_at?: string
          song_id: string
          user_session_id?: string | null
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_valid_play?: boolean | null
          played_at?: string
          song_id?: string
          user_session_id?: string | null
        }
        Relationships: []
      }
      song_statistics: {
        Row: {
          created_at: string
          id: string
          last_played_at: string | null
          song_id: string
          total_plays: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_played_at?: string | null
          song_id: string
          total_plays?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_played_at?: string | null
          song_id?: string
          total_plays?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          action_type: string
          completion_percentage: number | null
          duration_listened: number | null
          id: string
          song_id: string
          timestamp: string
          user_session_id: string
        }
        Insert: {
          action_type: string
          completion_percentage?: number | null
          duration_listened?: number | null
          id?: string
          song_id: string
          timestamp?: string
          user_session_id: string
        }
        Update: {
          action_type?: string
          completion_percentage?: number | null
          duration_listened?: number | null
          id?: string
          song_id?: string
          timestamp?: string
          user_session_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      song_analytics: {
        Row: {
          avg_completion_rate: number | null
          avg_duration: number | null
          first_played_at: string | null
          last_played_at: string | null
          replay_count: number | null
          skip_count: number | null
          song_id: string | null
          total_plays: number | null
          valid_plays: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_sessions: number
          avg_session_duration: number
          peak_hour: number
          top_region: string
          total_plays: number
          unique_songs: number
        }[]
      }
      get_geographic_distribution: {
        Args: Record<PropertyKey, never>
        Returns: {
          city: string
          last_activity: string
          listening_count: number
          region: string
        }[]
      }
      get_hourly_patterns: {
        Args: Record<PropertyKey, never>
        Returns: {
          hour: number
          play_count: number
        }[]
      }
      get_public_song_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          last_played_at: string
          song_id: string
          total_plays: number
        }[]
      }
      get_song_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          last_played_at: string
          song_id: string
          total_plays: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
