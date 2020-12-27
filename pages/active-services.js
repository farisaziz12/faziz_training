import React, { useState, useEffect } from "react";
import FadeIn from "react-fade-in";
import { motion, AnimateSharedLayout } from "framer-motion";
import Loader from "../components/Loader";
import { useRouter } from "next/router";
import ListItem from "../components/ListItem";
import MetaData from "../components/MetaData";
import NavigationBar from "../components/NavigationBar";
import { auth } from "../config/auth-config";
import { getActiveServices } from "../cms";
import styles from "../styles/Home.module.css";

export default function activeServices() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeServices, setActiveServices] = useState([]);
  const router = useRouter();

  useEffect(async () => {
    try {
      const user = await auth.getCurrentUser();
      if (user) {
        setLoggedIn(true);
        setActiveServices(await getActiveServices());
      } else {
        setLoggedIn(false);
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      router.push("/login");
    }
  }, []);

  return (
    <div className={styles.container}>
      <MetaData />
      <NavigationBar />
      <main className={styles.main}>
        <h1>Active Services</h1>
        {activeServices[0] ? (
          <FadeIn delay={500}>
            <div className={styles["flex-grid"]}>
              {activeServices.map((activeService) => (
                <AnimateSharedLayout key={activeService.id}>
                  <motion.ul layout initial={{ borderRadius: 25 }}>
                    <ListItem
                      key={activeService.id}
                      content={activeService}
                      type="active-service"
                    />
                  </motion.ul>
                </AnimateSharedLayout>
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
