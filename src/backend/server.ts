import express from "express";
import cors from "cors";
import todoRoutes from "./routes";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use("/todos", todoRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Todo API server running on http://localhost:${PORT}`);
});

export default app;
