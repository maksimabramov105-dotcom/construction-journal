import { useState, useEffect, useCallback } from "react";
import { api, type EntriesFilter } from "../api/client";
import type { JournalEntry } from "../types";

export function useEntries(filter: EntriesFilter) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEntries(filter);
      setEntries(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [filter.dateFrom, filter.dateTo, filter.sortOrder]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  return { entries, loading, error, reload: load };
}
