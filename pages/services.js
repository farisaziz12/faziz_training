import React, { useState, useEffect } from "react";
import FadeIn from "react-fade-in";
import ExpandableList from "../components/ExpandableList";
import Loader from "../components/Loader";
import MetaData from "../components/MetaData";
import NavigationBar from "../components/Navigation/NavigationBar";
import { getServices } from "../cms";
import styles from "../styles/Home.module.css";

export default function services() {
  const [servicesArr, setServicesArr] = useState([]);

  useEffect(async () => {
    const response = await getServices();
    const sortedResp = response.sort(
      (prev, curr) => curr.services.length - prev.services.length
    );

    setServicesArr(...servicesArr, sortedResp);
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
                  type="service"
                />
              ))}
            </div>
          </FadeIn>
        ) : (
          <Loader />
        )}
      </main>

      <footer className={styles.footer}>
        <p>Powered by WOD-WITH-FARIS</p>
      </footer>
    </div>
  );
}
