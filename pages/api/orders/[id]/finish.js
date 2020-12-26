import fetch from "isomorphic-fetch";
import { url, paths } from "../../../../cms/network";

const handleFinishOrder = async (req, res) => {
  try {
    const { id } = req.query;
    const order = await fetch(url + paths.orders + "/" + id);
    const orderData = await order.json();

    const response = await fetch(
      `https://sandbox-merchant.revolut.com/api/1.0/orders/${orderData.data.payment.id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REVOLUT_API_KEY}`,
        },
      }
    );

    res.status(response.status);

    const payment = await response.json();
    const isCompleted = payment.state === "COMPLETED";
    const isFailed = payment.state === "FAILED";

    await fetch(url + paths.orders + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          ...orderData.data,
          isCompleted,
          isFailed,
          payment,
        },
      }),
    });

    res.json({ id: orderData.id, isCompleted, isFailed });
  } catch (error) {
    console.error(error);
    res.json({
      error: "Status check failed",
    });
  }
};

export default handleFinishOrder;
