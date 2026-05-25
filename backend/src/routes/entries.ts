import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db";

export const entriesRouter = Router();

const EntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  workTypeId: z.number().int().positive(),
  volume: z.number().positive(),
  unit: z.string().min(1).max(20),
  executorName: z.string().min(1).max(200),
});

entriesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo, sortOrder } = req.query;

    const where: Record<string, unknown> = {};
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom as string);
      if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo as string);
    }

    const entries = await prisma.journalEntry.findMany({
      where,
      include: { workType: true },
      orderBy: { date: sortOrder === "asc" ? "asc" : "desc" },
    });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

entriesRouter.post("/", async (req: Request, res: Response) => {
  const parsed = EntrySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const { date, workTypeId, volume, unit, executorName } = parsed.data;
    const entry = await prisma.journalEntry.create({
      data: {
        date: new Date(date),
        workTypeId,
        volume,
        unit,
        executorName,
      },
      include: { workType: true },
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

entriesRouter.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = EntrySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const { date, workTypeId, volume, unit, executorName } = parsed.data;
    const entry = await prisma.journalEntry.update({
      where: { id },
      data: {
        date: new Date(date),
        workTypeId,
        volume,
        unit,
        executorName,
      },
      include: { workType: true },
    });
    res.json(entry);
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "P2025") {
      res.status(404).json({ error: "Entry not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

entriesRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    await prisma.journalEntry.delete({ where: { id } });
    res.status(204).send();
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "P2025") {
      res.status(404).json({ error: "Entry not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});
