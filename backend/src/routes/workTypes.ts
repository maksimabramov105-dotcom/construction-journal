import { Router } from "express";
import { prisma } from "../db";

export const workTypesRouter = Router();

workTypesRouter.get("/", async (_req, res) => {
  try {
    const workTypes = await prisma.workType.findMany({
      orderBy: { name: "asc" },
    });
    res.json(workTypes);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
