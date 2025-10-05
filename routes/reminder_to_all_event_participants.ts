import express from "express";
import { eventReminder } from "../EmailTemplates/ET-EventReminder.js";
import { Resend } from "resend";
import { getIdentitiesByIdsList, mongoDbBasicQuery } from "../utils/mongodb.js";

const router = express.Router();

const resend = new Resend(process.env.API_KEY);

router.post("/", async (req, res) => {
  try {
    const { eventDetails } = req.body;
    console.log("eventDetails: ", eventDetails);

    // fetch all participants by _id
    const db = await mongoDbBasicQuery();
    const participantsData = await getIdentitiesByIdsList(db, eventDetails.participants);
    
    if (!participantsData.length) {
      return res.status(404).json({ success: false, error: "No matching participants found" });
    }

    // Replace participant IDs with their full names for email template
    const participantNames = eventDetails.participants.map((participantId: string) => {
      const participant = participantsData.find(
        (p: any) => p._id.toString() === participantId.toString()
      );
      return participant ? participant.fullName : participantId; // fallback to ID if not found
    });

    // Optional: replace it inside eventDetails for template usage
    eventDetails.participants = participantNames;

    // build emails to send
    const results = [];
    for (const person of participantsData) {
      if (!person.email) {
        console.warn(`Skipping ${person.fullName}, no email found`);
        continue;
      }
      console.log("eventDetails: ", eventDetails);
      
      const html = eventReminder.template({
        name: person.fullName,
        concertDetails: eventDetails
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
    if (error instanceof Error) {
      console.error("Resend error:", error.message);
      res.status(500).json({ success: false, error: error.message });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  }
});

export default router;