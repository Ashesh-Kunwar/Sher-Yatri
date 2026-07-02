import mongoose from "mongoose";

const paymentRecordSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, default: "manual" }, // e.g. "cash", "bank transfer", "esewa" later
    date: { type: Date, default: Date.now },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    travelDate: { type: Date },
    numberOfPeople: { type: Number, required: true, min: 1, default: 1 },
    status: {
      type: String,
      enum: ["inquiry", "contacted", "confirmed", "completed", "cancelled"],
      default: "inquiry",
    },
    totalPrice: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["unpaid", "partial", "paid"], default: "unpaid" },
    paymentRecords: [paymentRecordSchema],
    source: {
      type: String,
      enum: ["website", "phone", "walk-in", "whatsapp", "other"],
      default: "website",
    },
    internalNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
