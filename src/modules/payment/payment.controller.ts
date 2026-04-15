import { Request, Response } from "express";
import { sendResponse } from "../../common/utils/response";
import { createOrder } from "./payment.service";

export const createOrderController = async (req: Request, res: Response) => {
  const userId: string = req.user.id!;

  const { plan } = req.body;

  const amount = plan === "monthly" ? 199 : 1999;

  const order = await createOrder(userId, amount);

  return sendResponse(res, order);
};

import crypto from "crypto";

export const razorpayWebhook = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const signature = req.headers["x-razorpay-signature"];

  const expected = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== expected) {
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    await prisma.payment.update({
      where: { razorpayOrderId: payment.order_id },
      data: {
        razorpayPaymentId: payment.id,
        status: "success",
      },
    });

    // 🔥 Activate subscription
    await prisma.subscription.create({
      data: {
        userId: payment.notes.userId,
        plan: "monthly",
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  res.status(200).json({ status: "ok" });
};
