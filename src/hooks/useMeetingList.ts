import { useState, useEffect, useCallback } from "react";
import { listMeetings } from "@/src/server/modules/meeting/meeting.action";
import { Meeting } from "@prisma/client";

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await listMeetings();
      if (res.success && res.data) {
        setMeetings(res.data);
      } else {
        setError(res.error ?? new Error("Failed to fetch meetings"));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Refetch function
  const refetch = useCallback(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  return { meetings, loading, error, refetch, setMeetings };
}
