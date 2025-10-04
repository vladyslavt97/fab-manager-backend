export const welcome = {
    template: ({ name, concerts }) => /*html*/ `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Welcome to Festival Academy Budapest</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f9f9f9;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
              
              <!-- Welcome -->
              <tr>
                <td style="padding:30px; text-align:left; font-size:16px; color:#333; line-height:1.6;">
                  <p style="margin:0 0 15px 0;">Dear <strong>${name}</strong>,</p>
                  <p style="margin:0 0 15px 0;">
                    We are glad to welcome you at the <strong>Festival Academy Budapest 2026</strong>.
                  </p>
                  <p style="margin:0 0 15px 0;">
                    We are pleased to share with you the schedule of the upcoming festival. Here are all the concerts, programs, and the musician partners that you will be playing with.
                  </p>
                  <p style="margin:0 0 15px 0;">
                    Every evening before a concert, rehearsal, or masterclass day, you will receive a reminder with the program for the upcoming day. If there are changes to the schedule, we will notify you separately.
                  </p>
                </td>
              </tr>

              <!-- Concerts -->
              <tr>
                <td style="padding:20px 30px;">
                  ${concerts && concerts.length
        ? concerts.map(c => `
                        <table width="100%" cellpadding="6" cellspacing="0" border="0" style="margin-bottom:20px; border:1px solid #ddd; border-radius:6px; font-size:14px; color:#444;">
                          <tr><td colspan="2" style="font-weight:bold; color:#7b2cbf;">${c.title}</td></tr>
                          <tr><td style="font-weight:bold;">Start:</td><td>${c.start}</td></tr>
                          <tr><td style="font-weight:bold;">End:</td><td>${c.end}</td></tr>
                          <tr><td style="font-weight:bold;">Festival Blocker:</td><td>${c.festivalBlocker}</td></tr>
                          <tr><td style="font-weight:bold;">Event Type:</td><td>${c.eventType}</td></tr>
                          <tr><td style="font-weight:bold;">Participants:</td><td>${c.participants}</td></tr>
                          <tr><td style="font-weight:bold;">Venue:</td><td>${c.venue}</td></tr>
                          <tr><td style="font-weight:bold;">Programme:</td><td>${c.programme}</td></tr>
                          <tr><td style="font-weight:bold;">Break:</td><td>${c.break}</td></tr>
                          <tr><td style="font-weight:bold;">Last Edited:</td><td>${c.lastEdited}</td></tr>
                        </table>
                      `).join("")
        : "<p>No concerts scheduled at the moment.</p>"}
                </td>
              </tr>

              <!-- Closing -->
              <tr>
                <td style="padding:20px 30px; font-size:16px; color:#333; line-height:1.6;">
                  <p style="margin:0 0 15px 0;">With warmest regards,</p>
                  <p style="margin:0; font-weight:bold; color:#7b2cbf;">Festival Academy Budapest</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f1f1f1; padding:20px; text-align:center; font-size:13px; color:#777;">
                  This is an automated message. If you have questions, please reach out to 
                  <a href="mailto:festivalacademy@fab-manager.online" style="color:#7b2cbf; text-decoration:none;">festivalacademy@fab-manager.online</a>.
                  <br /><br />
                  © ${new Date().getFullYear()} Festival Academy Budapest – All rights reserved
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
