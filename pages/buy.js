import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MetaData from "../components/MetaData";
import NavigationBar from "../components/NavigationBar";
import styles from "../styles/Home.module.css";
import Cart from "../components/Cart";
import Checkout from "../components/Checkout";

export default function buy() {
  const [orderId, setOrderId] = useState(undefined);

  const router = useRouter();
  const { id } = router.query;

  return (
    <div className={styles.container}>
      <MetaData />
      <NavigationBar />
      <main className={styles.main}>
        {orderId ? (
          <Checkout orderId={orderId} setOrderId={setOrderId} />
        ) : (
          <Cart serviceId={id} setOrderId={setOrderId} />
        )}
      </main>
    </div>
  );
}
