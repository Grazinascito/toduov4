/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useSupabase.ts
import { useEffect, useState, useRef } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { RealtimeChannel } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: number;
  username: string;
  online_status: boolean;
  created_at: string; // ISO 8601 format
};

const useSupabase = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);

  const insertUser = async (username: string) => {
    const { data, error } = await supabase.from("users").insert([{ username }]);
    if (error) {
      setError(error.message);
    } else {
      if (data) {
        setUsers((prevUsers) => [...prevUsers, data[0]]);
      }
    }
  };

  const handleInserts = (payload: any) => {
    setUsers((prevUsers) => [...prevUsers, payload.new]);
  };

  const handleUpdates = (payload: any) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === payload.new.id ? payload.new : user))
    );
  };

  const handleDeletes = (payload: any) => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== payload.old.id)
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        setError(error.message);
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    const fetchChannelId = async () => {
      const { data, error } = await supabase.from("sync_channels").select("id");

      console.log("fetchChannelId data:", data); // Debugging information

      if (error) {
        setError(error.message);
      } else if (!data || data.length === 0) {
        setError("No channel found");
      } else if (data.length > 1) {
        setError("Multiple channels found");
      } else {
        setChannelId(data[0].id);
      }
    };

    // const createChannel = async () => {
    //   const { data, error } = await supabase
    //     .from("sync_channels")
    //     .insert([{ user1_id: /* your user ID */, user2_id: /* other user ID */ }]);

    //   if (error) {
    //     setError(error.message);
    //   } else {
    //     setChannelId(data[0].id);
    //   }
    // };

    fetchUsers();
    fetchChannelId();

    channelRef.current = supabase
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        handleInserts
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users" },
        handleUpdates
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "users" },
        handleDeletes
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  return { users, loading, error, insertUser, channelId };
};

export default useSupabase;
