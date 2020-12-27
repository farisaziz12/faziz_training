import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import MetaData from "../components/MetaData";
import NavigationBar from "../components/NavigationBar";
import { auth } from "../config/auth-config";
import styles from "../styles/Home.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await auth.login(email, password);
      if (user.email) {
        router.back();
      }
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <div className={styles.container}>
      <MetaData />
      <NavigationBar />
      <main className={styles.main}>
        <Form style={{ minWidth: "300px" }} onSubmit={handleLogin}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@gmail.com"
              className={styles["p-text"]}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted">
              If you have a wod-with-faris account you can login using that.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="password"
              className={styles["p-text"]}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button
            disabled={email && password ? false : true}
            variant="primary"
            type="submit"
          >
            Login
          </Button>
        </Form>
        <Button
          onClick={() => router.push("/create-account")}
          style={{ marginTop: "5%", letterSpacing: "0.5px" }}
          variant="secondary"
        >
          Don't have an account? Create one here
        </Button>
      </main>

      <footer className={styles.footer}>
        <p>Powered by WOD-WITH-FARIS</p>
      </footer>
    </div>
  );
}
