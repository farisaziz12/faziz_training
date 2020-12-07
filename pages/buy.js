import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FadeIn from "react-fade-in";
import Button from "react-bootstrap/Button";
import MetaData from "../components/MetaData";
import NavigationBar from "../components/NavigationBar";
import { getServiceDetails } from "../cms";
import { post } from "../network";
import styles from "../styles/Home.module.css";

export default function buy() {
  const [cart, setCart] = useState([]);

  const router = useRouter();
  const { id } = router.query;

  useEffect(async () => {
    if (id) {
      try {
        const service = await getServiceDetails(id);
        setCart([...cart, service]);
      } catch (error) {
        console.error(error);
      }
    }
  }, [id]);

  return (
    <div className={styles.container}>
      <MetaData />
      <NavigationBar />
      <main className={styles.main}></main>
    </div>
  );
}
