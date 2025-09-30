import express from "express";
import cors from "cors";
import { Resend } from "resend";
import "dotenv/config";
import { templates } from "./EmailTemplates/templates.js";
import { MongoClient } from "mongodb";

const app = express();
const resend = new Resend(process.env.API_KEY);
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
// connect to MongoDB
const client = new MongoClient(process.env.MONGODB_URI);

app.get("/send", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("FestivalAcademyBudapest");
    const rawConcerts = await db.collection("schedule").find({}).toArray();

    const concerts = rawConcerts.map((c) => ({
      title: c.title || "Untitled Event",
      start: c.start ? new Date(c.start).toLocaleString("en-GB") : "TBA",
      end: c.end ? new Date(c.end).toLocaleString("en-GB") : "TBA",
      festivalBlocker: c.festivalBlocker ? "Yes" : "No",
      eventType: c.eventType || "General",
      participants: Array.isArray(c.participants) && c.participants.length
        ? c.participants.join(", ")
        : "TBA",
      venue: c.venue && c.venue.trim() !== "" ? c.venue : "TBA",
      programme: Array.isArray(c.programme) && c.programme.length
        ? c.programme.join(", ")
        : "TBA",
      break: c.break ? "Yes" : "No",
      lastEdited: Array.isArray(c.lastEdited) && c.lastEdited.length
        ? `${c.lastEdited.length} edits`
        : "—",
    }));
    console.log("yes: ", concerts);

    const html = templates.welcome({
      name: "Vlad",
      concerts: concerts,
    });

    const data = await resend.emails.send({
      from: "Fab Manager <noreply@fab-manager.online>",
      to: "vladyslav.tsurkanenko@hotmail.com",
      subject: "🎶 Welcome to Festival Academy Budapest",
      html,
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ success: false, error });
  }
});

app.post("/funny", async (req, res) => {
  try{
    const { word } = req.body;
    console.log("😂 Funny word received:", word);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ success: false, error });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
