import mongoose from "mongoose";

const itineraryDaySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    category: {
      type: String,
      enum: ["trekking", "cultural", "wildlife", "pilgrimage", "day-tour", "adventure"],
      required: true,
    },
    durationDays: { type: Number, required: true, min: 1 },
    difficulty: { type: String, enum: ["easy", "moderate", "hard"], default: "moderate" },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "NPR" },
    groupSizeMax: { type: Number, default: 10 },
    itinerary: [itineraryDaySchema],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    images: [{ type: String }], // image URLs; local placeholder paths for now
    status: { type: String, enum: ["active", "inactive", "draft"], default: "draft" },
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
