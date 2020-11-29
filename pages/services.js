import React, { useState, useEffect } from "react";
import FadeIn from "react-fade-in";
import ExpandableList from "../components/ExpandableList";
import Loader from "../components/Loader";
import MetaData from "../components/MetaData";
import NavigationBar from "../components/NavigationBar";
import { getServices } from "../cms";
import styles from "../styles/Home.module.css";

export default function services() {
  const [servicesArr, setServicesArr] = useState([]);

  useEffect(async () => {
    const response = await getServices();
    setServicesArr(...servicesArr, response);
  }, []);

  return (
    <div className={styles.container}>
      <MetaData />
      <NavigationBar />
      <main className={styles.main}>
        {servicesArr[0] ? (
          <FadeIn delay={500}>
            <div className={styles["flex-grid"]}>
              {servicesArr.map((serviceCategory) => (
                <ExpandableList
                  key={serviceCategory.id}
                  list={serviceCategory.services}
                  listTitle={serviceCategory.name}
                />
              ))}
            </div>
          </FadeIn>
        ) : (
          <Loader />
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
