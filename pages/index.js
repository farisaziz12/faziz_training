import Head from "next/head";
import { useState, useEffect } from "react";
import Intro from "../components/Intro";
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
      <Head>
        <title>FAZIZ TRAINING</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Intro showIntro={showIntro} />
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
