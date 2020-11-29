const sgMail = require("@sendgrid/mail");
const { escape } = require("html-escaper");
sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const { senderName, senderEmail, subject, messageBody } = req.body;

  try {
    sendEmail(senderName, senderEmail, subject, messageBody);
    res.statusCode = 200;
    res.end(JSON.stringify({ status: "Message Sent" }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ status: "Error Sending Message" }));
  }
}

const sendEmail = (senderName, senderEmail, subject, body) => {
  const msg = {
    to: process.env.NEXT_PUBLIC_RECEIVE_EMAIL,
    from: process.env.NEXT_PUBLIC_SEND_EMAIL,
    subject: `PT ENQUIRY FROM ${senderName + " @ " + senderEmail}`,
    text: `Subject: ${subject}`,
    html: `<p>${escape(body)}</p></br>
    <a href="mailto:${escape(senderEmail)}">Respond</a>`,
  };

  return sgMail.send(msg);
};
