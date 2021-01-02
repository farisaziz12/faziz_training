import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useRouter } from "next/router";
import { post } from "../network";
import { minBookDate } from "../functions";
import {
  getActiveServiceDetails,
  checkBooking,
  handleClass,
  checkClassPasses,
} from "../cms";
import styles from "../styles/Home.module.css";

export const EnquireButton = (loggedInState, id) => {
  const router = useRouter();
  return (
    <Button
      className={styles.center}
      onClick={() => router.push(`/contact-form?id=${id}`)}
    >
      Enquire
    </Button>
  );
};

export const BuyButton = (loggedInState, id) => {
  const router = useRouter();
  return (
    <Button
      variant="success"
      className={styles.center}
      onClick={() => router.push(loggedInState ? `/buy?id=${id}` : "/login")}
    >
      Buy
    </Button>
  );
};

export const LinkButton = (loggedInState, id, link) => {
  return (
    <a href={link} target="_blank">
      <Button variant="success" className={styles.center}>
        Link
      </Button>
    </a>
  );
};

export const PTBookButton = (loggedInState, id, link) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [text, setText] = useState("");
  const [noSessions, setNoSessions] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(async () => {
    const activeService = await getActiveServiceDetails(id);
    if (activeService.amount_left <= 0) {
      setNoSessions(true);
    }
  }, []);

  const handleSubmit = () => {
    try {
      post("/api/booking-request", {
        time,
        date,
        additionalDetails: text,
        id,
      }).then((resp) => {
        if (resp.status === 200) {
          const response = resp.json();
          console.log(response);
          setSuccess(true);
          setTimeout(handleClose, 8000);
        } else {
          setError(true);
        }
      });
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const renderBody = () => {
    if (success && !error) {
      return (
        <Alert variant="success">
          Booking Requested! You will be contacted within the next 24h with a
          confirmation.
        </Alert>
      );
    } else if (!success && error) {
      return (
        <Alert variant="danger">
          Oops. Something went wrong. Please try again or contact{" "}
          <a href="mailto:faziztraining@gmail.com">faziztraining@gmail.com</a>
        </Alert>
      );
    } else {
      return (
        <Form className={styles.checkout}>
          <Form.Group controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              className={styles["p-text"]}
              type="date"
              min={minBookDate()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicTime">
            <Form.Label>Time</Form.Label>
            <Form.Control
              className={styles["p-text"]}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="Form.ControlTextarea1">
            <Form.Label>Special Request / Additional Details</Form.Label>
            <Form.Control
              className={styles["p-text"]}
              value={text}
              onChange={(e) => setText(e.target.value)}
              as="textarea"
              rows={3}
            />
          </Form.Group>
        </Form>
      );
    }
  };

  return (
    <>
      <Button variant="success" className={styles.center} onClick={handleShow}>
        Request PT Session
      </Button>
      <Modal
        style={{ color: "black" }}
        centered
        backdrop="static"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles["p-text"]}>
          Input your desired date and time to request a booking. If there is the
          availability you will receive a confirmation within 24 hours
        </Modal.Body>
        {renderBody()}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            disabled={date && time && !error && !noSessions ? false : true}
            variant="primary"
            onClick={handleSubmit}
          >
            {noSessions ? "No Sessions" : "Request Booking"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const ClassBookButton = (loggedInState, id, link) => {
  const [isBooked, setIsBooked] = useState(false);
  const [canBook, setCanBook] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkBooking(id).then(setIsBooked);
    checkClassPasses().then((passes) => setCanBook(passes.available));
  }, [loggedInState]);

  const handleBookClass = () => {
    handleClass(id, "book").then((bookingResp) => {
      if (bookingResp) {
        setIsBooked(true);
      }
    });
  };

  const handleCancelClass = () => {
    handleClass(id, "cancel").then((cancellationResp) => {
      if (cancellationResp) {
        setIsBooked(false);
      }
    });
  };

  const renderButton = () => {
    if (isBooked) {
      return (
        <Button
          variant="danger"
          className={styles.center}
          onClick={handleCancelClass}
        >
          Cancel Booking
        </Button>
      );
    } else if (!isBooked && canBook) {
      return (
        <Button
          variant="success"
          className={styles.center}
          onClick={handleBookClass}
        >
          Book Class
        </Button>
      );
    } else if (!isBooked && !canBook) {
      return (
        <Button
          variant="warning"
          className={styles.center}
          onClick={() => router.push("/services")}
        >
          Buy Class Passes
        </Button>
      );
    } else {
      return (
        <Button variant="secondary" className={styles.center} disabled={true}>
          Loading...
        </Button>
      );
    }
  };

  return <>{renderButton()}</>;
};
