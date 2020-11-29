import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import MetaData from "../components/MetaData";
import NavigationBar from "../components/NavigationBar";
import { auth } from "../config/auth-config";
import { signUpAthlete } from "../cms";
import styles from "../styles/Home.module.css";

export default function createAccount() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const router = useRouter();

  const handleSignup = (e) => {
    e.preventDefault();
    try {
      auth.signUp(email, password, passwordConfirmation).then((user) => {
        if (user.email) {
          signUpAthlete(firstName, lastName, user.email, birthdate)
            .then((resp) => resp.json())
            .then((user) => {
              if (user) {
                router.push("/");
              }
            });
        } else {
          throw new Error("Something went wrong");
        }
      });
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <div className={styles.container}>
      <MetaData />
      <NavigationBar />
      <main className={styles.main}>
        <Form style={{ minWidth: "300px" }} onSubmit={handleSignup}>
          <Form.Group controlId="formBasicFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="John"
              className={styles["p-text"]}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Smith"
              className={styles["p-text"]}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@gmail.com"
              className={styles["p-text"]}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicBirthdate">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              className={styles["p-text"]}
              onChange={(e) =>
                setBirthdate(new Date(e.target.value).toISOString())
              }
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="password"
              className={styles["p-text"]}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Text className="text-muted">Minimum 6 characters.</Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="confirm password"
              className={styles["p-text"]}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </Form.Group>
          <Button
            disabled={
              email && password.length >= 6 && passwordConfirmation
                ? false
                : true
            }
            variant="primary"
            type="submit"
          >
            Create Account
          </Button>
        </Form>
        <Button
          onClick={() => router.push("/login")}
          style={{ marginTop: "5%", letterSpacing: "0.5px" }}
          variant="secondary"
        >
          Have an account? Login here
        </Button>
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
