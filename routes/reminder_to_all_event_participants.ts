import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import { eventReminder } from "../EmailTemplates/ET-EventReminder.js";
import { Resend } from "resend";

const router = express.Router();

const client = new MongoClient(process.env.MONGODB_URI!);
const resend = new Resend(process.env.API_KEY);

router.post("/", async (req, res) => {
  try {
    const { eventDetails } = req.body;
    console.log("eventDetails: ", eventDetails);
    

    // connect to DB
    await client.connect();
    const db = client.db("FestivalAcademyBudapest");

    // fetch all participants by _id
    const participantsData = await db
      .collection("artists_and_students")
      .find({ _id: { $in: eventDetails.participants.map((id:number) => new ObjectId(id)) } })
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