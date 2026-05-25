import type { JournalEntry } from "../types";
import dayjs from "dayjs";

interface Props {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entry: JournalEntry) => void;
}

export function JournalTable({ entries, onEdit, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <div style={styles.empty}>
        Записей не найдено. Добавьте первую запись.
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Дата</th>
            <th style={styles.th}>Вид работ</th>
            <th style={styles.th}>Объём</th>
            <th style={styles.th}>Исполнитель</th>
            <th style={{ ...styles.th, width: 100 }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={entry.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td style={styles.td}>
                {dayjs(entry.date).format("DD.MM.YYYY")}
              </td>
              <td style={styles.td}>{entry.workType.name}</td>
              <td style={styles.td}>
                {entry.volume} {entry.unit}
              </td>
              <td style={styles.td}>{entry.executorName}</td>
              <td style={{ ...styles.td, textAlign: "center" }}>
                <button
                  style={styles.editBtn}
                  onClick={() => onEdit(entry)}
                  title="Редактировать"
                >
                  ✏️
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => onDelete(entry)}
                  title="Удалить"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    overflowX: "auto",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  th: {
    padding: "12px 14px",
    textAlign: "left",
    background: "#f3f4f6",
    color: "#374151",
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "11px 14px",
    color: "#111827",
    verticalAlign: "middle",
    borderBottom: "1px solid #f3f4f6",
  },
  rowEven: { background: "#fff" },
  rowOdd: { background: "#fafafa" },
  empty: {
    padding: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 14,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
  },
  editBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    padding: "2px 4px",
    marginRight: 4,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    padding: "2px 4px",
  },
};
