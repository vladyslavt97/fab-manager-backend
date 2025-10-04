export const eventReminder = {
  template: ({ name, concertDetails }: { name: string; concertDetails: any }) => /*html*/ `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Festival Academy Budapest – Event Reminder</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f9f9f9;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
              
              <tr>
                <td style="padding:30px; text-align:left; font-size:16px; color:#333; line-height:1.6;">
                  <p>Dear <strong>${name}</strong>,</p>
                  <p>Here are the details of your upcoming event:</p>
                </td>
              </tr>

              <!-- Event Details -->
              <tr>
                <td style="padding:20px 30px; font-size:14px; color:#444;">
                  <strong>${concertDetails.title}</strong><br/>
                  Start: ${new Date(concertDetails.start).toLocaleString("en-GB")}<br/>
                  End: ${new Date(concertDetails.end).toLocaleString("en-GB")}<br/>
                  Venue: ${concertDetails.venue || "TBA"}<br/>
                  Participants: ${Array.isArray(concertDetails.participants) ? concertDetails.participants.join(", ") : "TBA"}<br/>
                  Programme: ${Array.isArray(concertDetails.programme) ? concertDetails.programme.join(", ") : "TBA"}
                </td>
              </tr>

              <tr>
                <td style="padding:20px 30px; font-size:16px; color:#333;">
                  <p>See you soon!</p>
                  <p><strong>Festival Academy Budapest</strong></p>
                </td>
              </tr>

              <tr>
                <td style="background:#f1f1f1; padding:20px; text-align:center; font-size:13px; color:#777;">
                  This is an automated reminder. For any questions, contact
                  <a href="mailto:festivalacademy@fab-manager.online" style="color:#7b2cbf;">festivalacademy@fab-manager.online</a>.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
};
