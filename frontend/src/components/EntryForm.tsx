import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { JournalEntry } from "../types";
import type { WorkType } from "../types";

const schema = z.object({
  date: z.string().min(1, "Укажите дату"),
  workTypeId: z.coerce.number().int().positive("Выберите вид работ"),
  volume: z.coerce.number().positive("Объём должен быть больше 0"),
  unit: z.string().min(1, "Укажите единицу измерения"),
  executorName: z.string().min(1, "Укажите ФИО исполнителя"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  workTypes: WorkType[];
  initial?: JournalEntry;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

const UNITS = ["м³", "м²", "м.п.", "т", "шт", "компл."];

export function EntryForm({ workTypes, initial, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          date: initial.date.slice(0, 10),
          workTypeId: initial.workTypeId,
          volume: initial.volume,
          unit: initial.unit,
          executorName: initial.executorName,
        }
      : { unit: "м³" },
  });

  useEffect(() => {
    if (initial) {
      reset({
        date: initial.date.slice(0, 10),
        workTypeId: initial.workTypeId,
        volume: initial.volume,
        unit: initial.unit,
        executorName: initial.executorName,
      });
    }
  }, [initial, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <form onSubmit={submit} style={styles.form}>
      <h2 style={styles.title}>{initial ? "Редактировать запись" : "Новая запись"}</h2>

      <label style={styles.label}>
        Дата выполнения *
        <input type="date" {...register("date")} style={styles.input} />
        {errors.date && <span style={styles.error}>{errors.date.message}</span>}
      </label>

      <label style={styles.label}>
        Вид работ *
        <select {...register("workTypeId")} style={styles.input}>
          <option value="">— выберите —</option>
          {workTypes.map((wt) => (
            <option key={wt.id} value={wt.id}>
              {wt.name}
            </option>
          ))}
        </select>
        {errors.workTypeId && <span style={styles.error}>{errors.workTypeId.message}</span>}
      </label>

      <div style={styles.row}>
        <label style={{ ...styles.label, flex: 1 }}>
          Объём *
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("volume")}
            style={styles.input}
          />
          {errors.volume && <span style={styles.error}>{errors.volume.message}</span>}
        </label>

        <label style={{ ...styles.label, flex: 1 }}>
          Единица *
          <select {...register("unit")} style={styles.input}>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {errors.unit && <span style={styles.error}>{errors.unit.message}</span>}
        </label>
      </div>

      <label style={styles.label}>
        ФИО исполнителя *
        <input type="text" {...register("executorName")} style={styles.input} placeholder="Иванов Иван Иванович" />
        {errors.executorName && <span style={styles.error}>{errors.executorName.message}</span>}
      </label>

      <div style={styles.actions}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn} disabled={isSubmitting}>
          Отмена
        </button>
        <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 14,
    color: "#374151",
    fontWeight: 500,
  },
  input: {
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 14,
    color: "#111827",
    background: "#fff",
    outline: "none",
  },
  error: {
    color: "#dc2626",
    fontSize: 12,
  },
  row: {
    display: "flex",
    gap: 12,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  submitBtn: {
    padding: "9px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "9px 20px",
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
};
