import { Doctor } from "../models/doctor.model.js";
import { Appointment } from "../models/appointment.model.js";

// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get available slots for a doctor on a specific date
export const getDoctorSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ error: "Date is required" });

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    const { start, end } = doctor.workingHours;
    const startTime = new Date(`${date}T${start}:00`);
    const endTime = new Date(`${date}T${end}:00`);

    // Fetch existing appointments
    const appointments = await Appointment.find({
      doctorId: id,
      date: { $gte: startTime, $lt: endTime },
    });

    let availableSlots = [];
    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      const isBooked = appointments.some((appt) =>
        currentTime >= appt.date && currentTime < new Date(appt.date.getTime() + appt.duration * 60000)
      );

      if (!isBooked) availableSlots.push(currentTime.toISOString());

      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    res.json({ availableSlots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new doctor
export const createDoctor = async (req, res) => {
    try {
      const { name, workingHours, specialization } = req.body;
  
      // Validate request
      if (!name || !workingHours?.start || !workingHours?.end) {
        return res.status(400).json({ error: "Name and working hours are required" });
      }
  
      // Create doctor
      const newDoctor = new Doctor({
        name,
        workingHours,
        specialization,
      });
  
      await newDoctor.save();
      res.status(201).json(newDoctor);
      
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};


  