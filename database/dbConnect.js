import { Schema, model } from "mongoose";

const faqSchema = new Schema(
  {
    question: { type: String, required: true, unique: true },
    answer: { type: String, required: true },
    category: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model("FAQ", faqSchema);
