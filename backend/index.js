import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import doctorRoutes from './routes/doctor.route.js';
import appointmentRoutes from './routes/appointment.route.js';
import cors from 'cors';


dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


connectDB().then(() => {
    app.get('/', (req, res) => {
        res.send('server is up 👌');
    });

    app.use('/api/doctors', doctorRoutes);
    app.use('/api/appointments', appointmentRoutes);
    
    app.listen(PORT, console.log(`Server running on port ${PORT}`));

})




