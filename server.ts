import express from "express";
import cors from "cors";
import "dotenv/config";
import reminderRoute from "./routes/reminder_to_all_event_participants.js";
import welcomeRoute from "./routes/welcome.js";
import testEmailSchedulerRoute from "./routes/testEmailScheduler.js";

const app = express();
const PORT = 3001;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://fab-manager.online"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

//routes
app.use("/welcome", welcomeRoute);
app.use("/reminder_to_all_event_participants", reminderRoute);
app.use("/test_email_scheduler", testEmailSchedulerRoute);

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
