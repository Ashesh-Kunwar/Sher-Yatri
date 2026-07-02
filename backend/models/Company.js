import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, default: "Sher Yatri" },
    tagline: { type: String, default: "Every Journey Has a Story." },
    description: { type: String, default: "Discover Nepal. Explore the World." },
    logoUrl: { type: String, default: "" },
    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    registration: {
      ntbNumber: { type: String, default: "" },
      nattaNumber: { type: String, default: "" },
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// This collection is meant to hold exactly one document (the company's own settings).
export default mongoose.model("Company", companySchema);
