import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, 
  appointmentType: { type: String, required: true },
  patientName: { type: String, required: true },
  notes: { type: String }, 
});

export const Appointment = mongoose.model("Appointment", AppointmentSchema);

