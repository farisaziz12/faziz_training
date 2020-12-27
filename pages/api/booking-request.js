const sgMail = require("@sendgrid/mail");
import fetch from "isomorphic-fetch";
const { escape } = require("html-escaper");
import { dateParse } from "../../functions";
import { url, paths } from "../../cms/network";

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const { time, date, additionalDetails, id } = req.body;

  try {
    const activeService = await fetch(url + paths.activeServices + "/" + id);
    const activeServiceDetails = await activeService.json();
    const { service, athlete } = activeServiceDetails;
    const senderName = athlete.first_name + " " + athlete.last_name;
    const messageBody = {
      amount_left: activeServiceDetails.amount_left,
      time,
      date,
      additionalDetails,
      ...service,
    };

    await sendEmail(senderName, athlete.email, "Booking Request", messageBody);
    updateAmount(id, activeServiceDetails.amount_left);
    res.statusCode = 200;
    res.end(JSON.stringify({ status: "Message Sent" }));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ status: "Error Sending Message" }));
  }
}

const updateAmount = async (id, prevAmount) => {
  await fetch(url + paths.activeServices + "/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount_left: (prevAmount -= 1),
    }),
  });
};

const sendEmail = (senderName, senderEmail, subject, body) => {
  const msg = {
    to: process.env.NEXT_PUBLIC_RECEIVE_EMAIL,
    from: process.env.NEXT_PUBLIC_SEND_EMAIL,
    subject: `BOOKING REQUEST FROM ${senderName + " @ " + senderEmail}`,
    text: `Subject: ${subject}`,
    html: `<p>Service: ${escape(body.name)}</p></br>
    <p>Amount Left (before token reduction): ${escape(
      body.amount_left
    )}</p></br>
    <p>Note: 1 Token has been automatically deducted</p></br>
    <p>Requested Date and Time: ${escape(dateParse(body.date))} @ ${escape(
      body.time
    )}</p></br>
    <p>Additional Details: ${
      body.additionalDetails ? escape(body.additionalDetails) : " none"
    }</p></br>
    <a href="mailto:${escape(senderEmail)}">Respond</a>`,
  };

  return sgMail.send(msg);
};
