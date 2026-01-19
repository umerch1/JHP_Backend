import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: String,
    location: String,
    salary: String,
    description: String,
    attachment: String, // file path in uploads/
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applicants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
