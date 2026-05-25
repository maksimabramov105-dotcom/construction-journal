import express from "express";
import cors from "cors";
import { entriesRouter } from "./routes/entries";
import { workTypesRouter } from "./routes/workTypes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/entries", entriesRouter);
app.use("/api/work-types", workTypesRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
