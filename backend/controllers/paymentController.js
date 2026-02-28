import { razorpayInstance } from "../config/razorpay.js";
import crypto from "crypto";
import Student from "../models/studentModel.js";
import Developer from "../models/developer.js";
import PaymentDetails from "../models/payment.js";

export const createOrder = async (req, res) => {
  try {
    const { price } = await Developer.findOne().select("price -_id");
    console.log(price);
    const options = {
      amount: Number(price * 100),
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount,
    } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await Student.findByIdAndUpdate(userId, {
        $set: { "basicDetails.isPremium": true },
      });
      await PaymentDetails.create({
        studentId: userId,
        amount: amount,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
      res.json({ success: true, message: "Payment Verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
