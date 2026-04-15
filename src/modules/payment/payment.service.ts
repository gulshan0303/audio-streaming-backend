import { razorpay } from "../../config/razorpay";
import { prisma } from "../../config/db";

export const createOrder = async (userId: string, amount: number) => {
  const order = await razorpay.orders.create({
    amount: amount * 100, // paisa
    currency: "INR",
  });

  await prisma.payment.create({
    data: {
      userId,
      razorpayOrderId: order.id,
      amount,
      currency: "INR",
      status: "created",
    },
  });

  return order;
};
