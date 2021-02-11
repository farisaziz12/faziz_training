import React, { useState, useEffect } from "react";
import FadeIn from "react-fade-in";
import ExpandableList from "../components/ExpandableList";
import Loader from "../components/Loader";
import MetaData from "../components/MetaData";
import NavigationBar from "../components/Navigation/NavigationBar";
import { getClasses } from "../cms";
import { generateKey, generateClassList, getToday } from "../functions";
import styles from "../styles/Home.module.css";

const initialDateRange = {
  start: getToday().toString("yyyy-MM-dd"),
  end: getToday().addDays(6).toString("yyyy-MM-dd"),
};

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(initialDateRange);

  useEffect(async () => {
    try {
      const classesData = await getClasses(dateRange.start, dateRange.end);
      const classesArr = generateClassList(classesData);
      setClasses(classesArr);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [dateRange]);

  const renderClasses = () => {
    if (classes[0] && !loading) {
      return (
        <FadeIn delay={500}>
          <div className={styles["flex-grid"]}>
            {classes.map((classData) => (
              <ExpandableList
                key={generateKey()}
                listTitle={classData.date}
                list={classData.classes}
                type="classes"
              />
            ))}
          </div>
        </FadeIn>
      );
    } else if (loading) {
      return <Loader />;
    } else if (!loading) {
      return <h1>None</h1>;
    }
  };

  return (
    <div className={styles.container}>
      <MetaData />
      <NavigationBar />
      <main className={styles.main}>{renderClasses()}</main>

      <footer className={styles.footer}>
        <p>Powered by WOD-WITH-FARIS</p>
      </footer>
    </div>
  );
}
