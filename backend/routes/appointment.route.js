import express from "express";
import { getAppointments, getAppointmentById, createAppointment, deleteAppointment, updateAppointment } from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.post("/", createAppointment);
router.put("/:id", updateAppointment); 
router.delete("/:id", deleteAppointment);

export default router;
