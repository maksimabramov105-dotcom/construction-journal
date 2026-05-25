import type { EntriesFilter } from "../api/client";

interface Props {
  filter: EntriesFilter;
  onChange: (f: EntriesFilter) => void;
}

export function FilterBar({ filter, onChange }: Props) {
  return (
    <div style={styles.bar}>
      <label style={styles.label}>
        С
        <input
          type="date"
          value={filter.dateFrom || ""}
          onChange={(e) => onChange({ ...filter, dateFrom: e.target.value || undefined })}
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        По
        <input
          type="date"
          value={filter.dateTo || ""}
          onChange={(e) => onChange({ ...filter, dateTo: e.target.value || undefined })}
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        Сортировка
        <select
          value={filter.sortOrder || "desc"}
          onChange={(e) =>
            onChange({ ...filter, sortOrder: e.target.value as "asc" | "desc" })
          }
          style={styles.input}
        >
          <option value="desc">Сначала новые</option>
          <option value="asc">Сначала старые</option>
        </select>
      </label>
      {(filter.dateFrom || filter.dateTo) && (
        <button
          style={styles.reset}
          onClick={() => onChange({ sortOrder: filter.sortOrder })}
        >
          Сбросить даты
        </button>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "flex-end",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "12px 16px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 500,
  },
  input: {
    padding: "7px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 13,
    background: "#fff",
    color: "#111827",
  },
  reset: {
    padding: "7px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 13,
    background: "#fff",
    color: "#6b7280",
    cursor: "pointer",
    alignSelf: "flex-end",
  },
};
