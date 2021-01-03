import React, { useState, useEffect } from "react";
import FadeIn from "react-fade-in";
import { getUser, getUpcomingAthleteClasses, getClasses } from "../cms";
import { getToday, generateKey } from "../functions";
import ExpandableList from "./ExpandableList";
import Loader from "./Loader";
import styles from "../styles/Home.module.css";

const initialDateRange = {
  start: getToday().toString("yyyy-MM-dd"),
  end: getToday().addDays(6).toString("yyyy-MM-dd"),
};

export default function UpcomingClasses({ userId }) {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [dateRange, setDateRange] = useState(initialDateRange);

  useEffect(async () => {
    const user = await getUser(userId);
    setUser(user);
  }, []);

  useEffect(async () => {
    const classesData = await getClasses(dateRange.start, dateRange.end);
    const upcomingClasses = getUpcomingAthleteClasses(classesData, userId);
    setLoading(false);
    setClasses(upcomingClasses);
  }, [user, dateRange]);

  const renderUpcomingClasses = () => {
    if (classes[0]) {
      if (loading) {
        return <Loader />;
      } else {
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
      }
    } else {
      return <h2 className={styles.center}>None</h2>;
    }
  };

  return <div>{renderUpcomingClasses()}</div>;
}
