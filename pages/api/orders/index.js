import fetch from "isomorphic-fetch";
import { generateTotal, generateCartDescription } from "../../../functions";
import { url, paths } from "../../../cms/network";

const calculateTotal = (cart) => {
  return {
    description: generateCartDescription(cart.cart_items),
    amount: generateTotal(cart.cart_items, 100),
    currency: "CHF",
  };
};

const createNewOrder = async (userId, cartData, total, payload, res) => {
  try {
    const response = await fetch(
      `https://merchant.revolut.com/api/1.0/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_REVOLUT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    res.status(response.status);

    const payment = await response.json();
    const order = await fetch(url + paths.orders, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        athlete: userId,
        data: {
          payment,
          isCompleted: false,
          isFailed: false,
          cart: cartData,
          total,
        },
      }),
    });

    const createdOrder = await order.json();
    return createdOrder;
  } catch (error) {
    console.error(error);
    res.json({
      error: "Order creation failed",
    });
    return null;
  }
};

const handleCreateOrder = async (req, res) => {
  try {
    const { cartId, userId, savedOrderId } = req.body;
    const cart = await fetch(url + paths.carts + "/" + cartId);
    const cartData = await cart.json();
    let savedOrderData = undefined;
    const total = calculateTotal(cartData);

    const payload = {
      ...total,
    };

    try {
      const savedOrder = await fetch(url + paths.orders + "/" + savedOrderId);
      savedOrderData = await savedOrder.json();
    } catch (error) {
      console.error(error);
    }

    if (savedOrderData && savedOrderId) {
      const {
        amount: prevAmount,
        description: prevDesc,
      } = savedOrderData.data.total;

      if (prevAmount === total.amount && prevDesc === total.description) {
        const response = await fetch(
          `https://merchant.revolut.com/api/1.0/orders`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_REVOLUT_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        res.status(response.status);

        const payment = await response.json();
        const order = await fetch(url + paths.orders + "/" + savedOrderId, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            athlete: userId,
            data: {
              payment,
              isCompleted: false,
              isFailed: false,
              cart: cartData,
              total,
            },
          }),
        });

        const updatedOrder = await order.json();

        res.json({ id: updatedOrder.id });
      } else {
        const createdOrder = await createNewOrder(
          userId,
          cartData,
          total,
          payload,
          res
        );
        res.json({ id: createdOrder.id });
      }
    } else {
      const createdOrder = await createNewOrder(
        userId,
        cartData,
        total,
        payload,
        res
      );
      res.json({ id: createdOrder.id });
    }
  } catch (error) {
    console.error(error);
    res.json({
      error: "Order creation failed",
    });
  }
};

export default handleCreateOrder;
