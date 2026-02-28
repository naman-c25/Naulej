import mongoose from "mongoose";
const paymentDetailsSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PaymentDetails = mongoose.model("PaymentDetails", paymentDetailsSchema);
export default PaymentDetails;
