const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, subject, text, html }) => {
  console.log("RESEND KEY:", process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: "TicketSpot <onboarding@resend.dev>", // temp sender
      to,
      subject,
      text,
      html: html || text,
    });

    return { sent: true };
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};

module.exports = { sendMail };