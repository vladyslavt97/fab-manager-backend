import express from "express";
import { Resend } from "resend";

const router = express.Router();

const resend = new Resend(process.env.API_KEY);
const TEST_EMAIL_INTERVAL_MINUTES = 30;
const TEST_EMAIL_RECIPIENT = "vladyslavt97@gmail.com";
const TEST_EMAIL_SENDER = "Fab Manager <noreply@fab-manager.online>";

let intervalId: NodeJS.Timeout | null = null;
let lastRun: Date | null = null;
let schedulerStartedAt: Date | null = null;

const logPrefix = "[TestEmailScheduler]";

const ensureSchedulerRunning = () => {
  if (intervalId) {
    return;
  }

  if (!TEST_EMAIL_RECIPIENT) {
    console.warn(`${logPrefix} TEST_EMAIL_RECIPIENT env var missing, scheduler not started.`);
    return;
  }

  const intervalMs = TEST_EMAIL_INTERVAL_MINUTES * 60 * 1000;

  schedulerStartedAt = new Date();

  const runJob = async () => {
    const runAt = new Date();
    lastRun = runAt;
    console.log(`${logPrefix} Triggering test email at ${runAt.toISOString()}`);

    try {
      const response = await resend.emails.send({
        from: TEST_EMAIL_SENDER,
        to: TEST_EMAIL_RECIPIENT,
        subject: "FAB Manager scheduler heartbeat",
        html: `
          <main style="font-family: Arial, sans-serif; padding: 24px;">
            <h1>FAB Manager Scheduler Test</h1>
            <p>This email was sent automatically to confirm the 30-minute scheduler is alive.</p>
            <p><strong>Run timestamp:</strong> ${runAt.toISOString()}</p>
            <p>Adjust your scheduler settings in <code>TEST_EMAIL_INTERVAL_MINUTES</code>, <code>TEST_EMAIL_RECIPIENT</code>, and <code>TEST_EMAIL_SENDER</code>.</p>
          </main>
        `,
      });

      console.log(`${logPrefix} Email sent. Response id: ${response || "unknown"}`);
    } catch (error) {
      console.error(`${logPrefix} Failed to send test email`, error);
    }
  };

  console.log(`${logPrefix} Starting scheduler (interval ${TEST_EMAIL_INTERVAL_MINUTES} minutes).`);
  intervalId = setInterval(runJob, intervalMs);
};

ensureSchedulerRunning();

const nextRun = () => {
  if (!intervalId) {
    return null;
  }

  const base = lastRun ?? schedulerStartedAt;
  if (!base) {
    return null;
  }

  return new Date(base.getTime() + TEST_EMAIL_INTERVAL_MINUTES * 60 * 1000);
};

router.get("/", (_req, res) => {
  ensureSchedulerRunning();

  res.json({
    success: !!intervalId && !!TEST_EMAIL_RECIPIENT,
    intervalMinutes: TEST_EMAIL_INTERVAL_MINUTES,
    recipient: TEST_EMAIL_RECIPIENT ?? null,
    lastRun: lastRun ? lastRun.toISOString() : null,
    nextEstimatedRun: nextRun()?.toISOString() ?? null,
    message: TEST_EMAIL_RECIPIENT
      ? `${logPrefix} scheduler active`
      : `${logPrefix} Provide TEST_EMAIL_RECIPIENT env var to activate scheduler.`,
  });
});

router.post("/trigger-now", async (_req, res) => {
  if (!TEST_EMAIL_RECIPIENT) {
    return res.status(400).json({
      success: false,
      error: "TEST_EMAIL_RECIPIENT env var missing. Scheduler/trigger disabled.",
    });
  }

  try {
    const runAt = new Date();
    console.log(`${logPrefix} Manual trigger at ${runAt.toISOString()}`);
    lastRun = runAt;

    const response = await resend.emails.send({
      from: TEST_EMAIL_SENDER,
      to: TEST_EMAIL_RECIPIENT,
      subject: "FAB Manager manual scheduler trigger",
      html: `
        <main style="font-family: Arial, sans-serif; padding: 24px;">
          <h1>Manual Scheduler Trigger</h1>
          <p>This email confirms that the manual trigger endpoint was hit.</p>
          <p><strong>Run timestamp:</strong> ${runAt.toISOString()}</p>
        </main>
      `,
    });

    console.log(`${logPrefix} Manual email sent. Response id: ${response || "unknown"}`);

    res.json({ success: true, id: response ?? null });
  } catch (error) {
    console.error(`${logPrefix} Manual trigger failed`, error);
    res.status(500).json({ success: false, error });
  }
});

export default router;
