const nodemailer = require("nodemailer");

const createTransport = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return null;
};

const sendMail = async ({ to, subject, text, html }) => {
  const transport = createTransport();
  const from = process.env.SMTP_FROM || "TicketSpot <noreply@ticketspot.local>";

  if (!transport) {
    console.log("\n--- EMAIL (SMTP not configured; OTP below) ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log("--- END EMAIL ---\n");
    return { dev: true };
  }

  await transport.sendMail({ from, to, subject, text, html: html || text });
  return { sent: true };
};

module.exports = { sendMail };
