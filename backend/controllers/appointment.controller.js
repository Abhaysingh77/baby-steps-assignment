import  { Appointment } from "../models/appointment.model.js"
import { Doctor } from "../models/doctor.model.js";

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctorId");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific appointment
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("doctorId");
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    const appointmentDate = new Date(date);

    // Check for conflicts
    const overlappingAppointments = await Appointment.find({
      doctorId,
      date: { $lt: new Date(appointmentDate.getTime() + duration * 60000), $gte: appointmentDate },
    });


    if (overlappingAppointments.length > 0) {
      return res.status(400).json({ error: "Time slot not available" });
    }

    const newAppointment = new Appointment({
      doctorId,
      date: appointmentDate,
      duration,
      appointmentType,
      patientName,
      notes,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//update selected appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, duration, appointmentType, patientName, notes } = req.body;

    // Find the existing appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if the new time slot is available for this doctor
    const doctor = await Doctor.findById(appointment.doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check for overlapping appointments (excluding the current one)
    const overlappingAppointment = await Appointment.findOne({
      doctorId: appointment.doctorId,
      date: new Date(date),
      _id: { $ne: id }, // Exclude the current appointment
    });

    if (overlappingAppointment) {
      return res.status(400).json({ error: "Time slot already booked" });
    }

    // Update the appointment details
    appointment.date = new Date(date);
    appointment.duration = duration;
    appointment.appointmentType = appointmentType;
    appointment.patientName = patientName;
    appointment.notes = notes || appointment.notes;

    await appointment.save();
    res.json({ message: "Appointment updated successfully", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
