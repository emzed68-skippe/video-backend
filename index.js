import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check (REQUIRED)
app.get("/health", (req, res) => {
  res.send("ok");
});

// Fake job store (MVP)
const jobs = new Map();

// Create job
app.post("/jobs", (req, res) => {
  const { topic, format } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic required" });
  }

  const id = crypto.randomUUID();
  jobs.set(id, { id, status: "processing" });

  // Simulate processing
  setTimeout(() => {
    jobs.set(id, {
      id,
      status: "completed",
      output: {
        videoUrl:
          "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4"
      }
    });
  }, 4000);

  res.json({ jobId: id });
});

// Poll job
app.get("/jobs/:id", (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: "Not found" });
  res.json(job);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
