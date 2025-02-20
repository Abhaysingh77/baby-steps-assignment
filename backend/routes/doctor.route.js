import express from "express";
import { getDoctors, getDoctorSlots, createDoctor } from "../controllers/doctor.controller.js";

const router = express.Router();

router.get("/", getDoctors);
router.get("/:id/slots", getDoctorSlots);
router.post("/", createDoctor); 

export default router;
