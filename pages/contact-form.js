import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Lottie from "react-lottie";
import FadeIn from "react-fade-in";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import MetaData from "../components/MetaData";
import NavigationBar from "../components/NavigationBar";
import { getServiceDetails } from "../cms";
import { post } from "../network";
import { defaultOption } from "../functions";
import mailSend from "../lotties/mail-send.json";
import errorCone from "../lotties/error-cone.json";
import styles from "../styles/Home.module.css";

export default function contactForm() {
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [senderName, setSenderName] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(async () => {
    if (id) {
      try {
        const service = await getServiceDetails(id);
        setSubject(service.name);
      } catch (error) {
        console.error(error);
      }
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      post("/api/contact-form-email", {
        senderName,
        senderEmail,
        subject,
        messageBody,
      }).then((resp) => {
        if (resp.status === 200) {
          setSuccess(true);
          setSubmitted(true);
          setTimeout(() => {
            router.push("/services");
          }, 6000);
        } else {
          handleError("Error");
        }
      });
    } catch (error) {
      handleError(error);
    }

    const handleError = (error) => {
      setSubmitted(true);
      console.error(error);
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    };
  };

  return (
    <div className={styles.container}>
      <MetaData />
      <NavigationBar />
      <main className={styles.main}>
        <h1>Contact Form</h1>
        {submitted ? (
          success ? (
            <FadeIn delay={200}>
              <Lottie
                options={defaultOption(mailSend)}
                height={200}
                width={200}
              />
              <h1>Message Sent!</h1>
            </FadeIn>
          ) : (
            <FadeIn delay={200}>
              <Lottie
                options={defaultOption(errorCone)}
                height={200}
                width={200}
              />
              <h1>Whoops. Something went wrong. Please try again</h1>
            </FadeIn>
          )
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                type="text"
                placeholder="John Smith"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput2">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                type="email"
                placeholder="name@example.com"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                type="text"
                value={subject}
                placeholder="Personal Training"
                onChange={(e) => setSubject(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Message</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                placeholder="Please provide as many details as possible related to the subject of your enquiry"
                as="textarea"
                rows={5}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
              />
            </Form.Group>
            <Button
              disabled={senderEmail ? false : true}
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
            <Form.Text className="text-muted">
              Your enquiry will be responded to via the email you have provided
              within 24-48 hours
            </Form.Text>
          </Form>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://wod-with-faris.web.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by WOD-WITH-FARIS
        </a>
      </footer>
    </div>
  );
}
