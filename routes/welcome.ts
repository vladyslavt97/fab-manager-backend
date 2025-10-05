import express from "express";
import { welcome } from "../EmailTemplates/ET-Welcome.js";
import { Resend } from "resend";
import { mongoDbBasicQuery } from "../utils/mongodb.js";

const router = express.Router();

const resend = new Resend(process.env.API_KEY);

router.get("/", async (req, res) => {
  try {
    const db = await mongoDbBasicQuery();

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

export default router;