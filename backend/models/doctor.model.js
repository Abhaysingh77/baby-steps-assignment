import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workingHours: {
    start: { type: String, required: true }, 
    end: { type: String, required: true }, 
  },
  specialization: { type: String }, 
});

export const Doctor = mongoose.model("Doctor", DoctorSchema);
