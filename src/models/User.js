import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    mobile: String,
    email: { type: String, unique: true },
    pin: String, // hashed 4-digit PIN
    address: String,
    city: String,
    role: { type: String, enum: ["jobseeker", "employer", "admin"] },
    cv: {
      type: String
    }, // file path or URL
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
