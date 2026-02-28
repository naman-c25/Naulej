import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentController.js";
const router = express.Router();
import Developer from "../models/developer.js";

router.post("/order", createOrder);
router.post("/verify", verifyPayment);

router.get("/premium-price", async (req, res) => {
  try {
    const { price } = await Developer.findOne().select("price -_id");
    res.json({ price });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
