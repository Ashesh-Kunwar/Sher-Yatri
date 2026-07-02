import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    country: { type: String, trim: true },
    notes: { type: String, default: "" }, // internal admin notes, not shown to customer
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
