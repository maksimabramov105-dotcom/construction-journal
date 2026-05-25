import type { EntryPayload, JournalEntry, WorkType } from "../types";

const BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface EntriesFilter {
  dateFrom?: string;
  dateTo?: string;
  sortOrder?: "asc" | "desc";
}

export const api = {
  getEntries(filter: EntriesFilter = {}): Promise<JournalEntry[]> {
    const params = new URLSearchParams();
    if (filter.dateFrom) params.set("dateFrom", filter.dateFrom);
    if (filter.dateTo) params.set("dateTo", filter.dateTo);
    if (filter.sortOrder) params.set("sortOrder", filter.sortOrder);
    const qs = params.toString();
    return request<JournalEntry[]>(`/entries${qs ? `?${qs}` : ""}`);
  },

  createEntry(payload: EntryPayload): Promise<JournalEntry> {
    return request<JournalEntry>("/entries", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateEntry(id: number, payload: EntryPayload): Promise<JournalEntry> {
    return request<JournalEntry>(`/entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteEntry(id: number): Promise<void> {
    return request<void>(`/entries/${id}`, { method: "DELETE" });
  },

  getWorkTypes(): Promise<WorkType[]> {
    return request<WorkType[]>("/work-types");
  },
};
