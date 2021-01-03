import { useState, useEffect } from "react";
import FadeIn from "react-fade-in";
import { useRouter } from "next/router";
import { getUser } from "../cms";
import Loader from "../components/Loader";
import MetaData from "../components/MetaData";
import NavigationBar from "../components/Navigation/NavigationBar";
import UpcomingClasses from "../components/UpcomingClasses";
import styles from "../styles/Home.module.css";

export default function Profile() {
  const [user, setUser] = useState(undefined);
  const router = useRouter();

  useEffect(async () => {
    try {
      const userInfo = await getUser();
      if (userInfo) {
        setUser(userInfo);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      router.push("/login");
    }
  }, []);

  const renderMain = () => {
    if (user) {
      return (
        <div>
          <h1 className={styles.center}>
            {user.first_name} {user.last_name}
          </h1>
          <h1 className={styles.center} style={{ marginTop: "15%" }}>
            Upcoming Classes
          </h1>
          <UpcomingClasses userId={user.id} />
        </div>
      );
    } else {
      return <Loader></Loader>;
    }
  };

  return (
    <div className={styles.container}>
      <MetaData />
      <NavigationBar />
      <main className={styles.main}>
        <FadeIn delay={500}>{renderMain()}</FadeIn>
      </main>
      <footer className={styles.footer}>
        <p>Powered by WOD-WITH-FARIS</p>
      </footer>
    </div>
  );
}
