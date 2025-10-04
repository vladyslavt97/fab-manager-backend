import express from "express";
import cors from "cors";
import { Resend } from "resend";
import "dotenv/config";
import { welcome } from "./EmailTemplates/ET-Welcome.js";
import { eventReminder } from "./EmailTemplates/ET-EventReminder.js";
import { MongoClient, ObjectId } from "mongodb";

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

    const html = welcome.template({
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

app.post("/reminder_to_all_event_participants", async (req, res) => {
  try {
    const { eventDetails } = req.body;
    console.log("eventDetails: ", eventDetails);
    

    // connect to DB
    await client.connect();
    const db = client.db("FestivalAcademyBudapest");

    // fetch all participants by _id
    const participantsData = await db
      .collection("artists_and_students")
      .find({ _id: { $in: eventDetails.participants.map((id) => new ObjectId(id)) } })
      .toArray();
    console.log("participantsData: ", participantsData);
    
    if (!participantsData.length) {
      return res.status(404).json({ success: false, error: "No matching participants found" });
    }

    // build emails to send
    const results = [];
    for (const person of participantsData) {
      if (!person.email) {
        console.warn(`Skipping ${person.fullName}, no email found`);
        continue;
      }

      const html = eventReminder.template({
        name: person.fullName,
        occupation: person.occupation.join(", "),
        languages: person.languages.join(", "),
      });

      try {
        const data = await resend.emails.send({
          from: "Fab Manager <noreply@fab-manager.online>",
          to: person.email,
          subject: "🎶 Festival Academy Budapest – Event Reminder",
          html,
        });

        results.push({ email: person.email, success: true, data });
      } catch (err) {
        console.error(`Failed to send email to ${person.email}:`, err);
        results.push({ email: person.email, success: false, error: err });
      }
    }

    res.json({ success: true, sent: results });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
