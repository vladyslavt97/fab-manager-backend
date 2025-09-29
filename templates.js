// templates.js
export const templates = {
  welcome: ({ name, concerts }) => /*html*/ `
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
                <td style="padding:30px; text-align:center;">
                  <h1 style="margin:0; font-size:26px; font-weight:bold; color:#7b2cbf;">
                    🎶 Welcome to Festival Academy Budapest
                  </h1>
                  <p style="margin:20px 0; font-size:16px; color:#333; line-height:1.6;">
                    Dear ${name},<br /><br />
                    We are delighted to welcome you to the <strong>Festival Academy Budapest</strong> community. 
                    Here are some of our upcoming concerts:
                  </p>
                </td>
              </tr>

              <!-- Concerts -->
              <tr>
                <td style="padding:20px 30px;">
                  ${
                    concerts && concerts.length
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
                      : "<p>No concerts scheduled at the moment.</p>"
                  }
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:20px; text-align:center;">
                  <a href="https://fab-manager.online"
                     style="background:#7b2cbf; color:#fff; padding:14px 28px; font-size:16px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
                     Explore All Concerts
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f1f1f1; padding:20px; text-align:center; font-size:13px; color:#777;">
                  © ${new Date().getFullYear()} Festival Academy Budapest – All rights reserved<br />
                  <a href="https://fab-manager.online" style="color:#7b2cbf; text-decoration:none;">fab-manager.online</a>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `,
};
