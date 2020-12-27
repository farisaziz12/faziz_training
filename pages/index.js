import { useState, useEffect } from "react";
import Intro from "../components/Intro";
import MetaData from "../components/MetaData";
import NavigationBar from "../components/NavigationBar";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowIntro(true);
    }, 1000);
  });

  return (
    <div className={styles.container}>
      <MetaData />
      <NavigationBar />
      <main className={styles.main}>
        <Intro showIntro={showIntro} />
      </main>

      <footer className={styles.footer}>
        <p>Powered by WOD-WITH-FARIS</p>
      </footer>
    </div>
  );
}
