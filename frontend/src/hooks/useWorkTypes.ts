import { useState, useEffect } from "react";
import { api } from "../api/client";
import type { WorkType } from "../types";

export function useWorkTypes() {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);

  useEffect(() => {
    api.getWorkTypes().then(setWorkTypes).catch(console.error);
  }, []);

  return workTypes;
}
