import { useState, useCallback } from "react";
import { api, type EntriesFilter } from "./api/client";
import { useEntries } from "./hooks/useEntries";
import { useWorkTypes } from "./hooks/useWorkTypes";
import { JournalTable } from "./components/JournalTable";
import { EntryForm } from "./components/EntryForm";
import { FilterBar } from "./components/FilterBar";
import { Modal } from "./components/Modal";
import type { JournalEntry } from "./types";

export default function App() {
  const [filter, setFilter] = useState<EntriesFilter>({ sortOrder: "desc" });
  const { entries, loading, error, reload } = useEntries(filter);
  const workTypes = useWorkTypes();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JournalEntry | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = useCallback(
    async (values: Parameters<typeof api.createEntry>[0]) => {
      await api.createEntry(values);
      setShowForm(false);
      reload();
      showToast("Запись добавлена");
    },
    [reload]
  );

  const handleUpdate = useCallback(
    async (values: Parameters<typeof api.updateEntry>[1]) => {
      if (!editing) return;
      await api.updateEntry(editing.id, values);
      setEditing(null);
      reload();
      showToast("Запись обновлена");
    },
    [editing, reload]
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await api.deleteEntry(deleteTarget.id);
      setDeleteTarget(null);
      reload();
      showToast("Запись удалена");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <h1 style={styles.heading}>Журнал работ</h1>
            <p style={styles.subheading}>Строительный объект</p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowForm(true)}>
            + Добавить запись
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <FilterBar filter={filter} onChange={setFilter} />

        <div style={styles.countRow}>
          {!loading && (
            <span style={styles.count}>
              Записей: {entries.length}
            </span>
          )}
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        {loading ? (
          <div style={styles.loading}>Загрузка...</div>
        ) : (
          <JournalTable
            entries={entries}
            onEdit={(e) => setEditing(e)}
            onDelete={(e) => setDeleteTarget(e)}
          />
        )}
      </main>

      {/* Create modal */}
      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <EntryForm
          workTypes={workTypes}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <EntryForm
            workTypes={workTypes}
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        {deleteTarget && (
          <div style={styles.confirmBox}>
            <h2 style={styles.confirmTitle}>Удалить запись?</h2>
            <p style={styles.confirmText}>
              <strong>{deleteTarget.workType.name}</strong> от{" "}
              {new Date(deleteTarget.date).toLocaleDateString("ru-RU")} —{" "}
              {deleteTarget.executorName}
            </p>
            <div style={styles.confirmActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
              >
                Отмена
              </button>
              <button
                style={styles.dangerBtn}
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    padding: "0 24px",
  },
  headerInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "18px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
  },
  subheading: {
    margin: "2px 0 0",
    fontSize: 13,
    color: "#9ca3af",
  },
  addBtn: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  countRow: { minHeight: 20 },
  count: { fontSize: 13, color: "#6b7280" },
  loading: {
    padding: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 14,
  },
  errorBanner: {
    padding: "12px 16px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 8,
    color: "#dc2626",
    fontSize: 14,
  },
  confirmBox: { display: "flex", flexDirection: "column", gap: 16 },
  confirmTitle: { margin: 0, fontSize: 18, fontWeight: 600, color: "#111827" },
  confirmText: { margin: 0, fontSize: 14, color: "#374151" },
  confirmActions: { display: "flex", justifyContent: "flex-end", gap: 10 },
  cancelBtn: {
    padding: "9px 20px",
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 14,
    cursor: "pointer",
  },
  dangerBtn: {
    padding: "9px 20px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    bottom: 24,
    right: 24,
    background: "#111827",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 8,
    fontSize: 14,
    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    zIndex: 2000,
  },
};
