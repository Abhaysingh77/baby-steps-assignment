import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

connectDB().then(() => {
    app.get('/', (req, res) => {
        res.send('server is up 👌');
    });

    app.listen(PORT, console.log(`Server running on port ${PORT}`));
})




