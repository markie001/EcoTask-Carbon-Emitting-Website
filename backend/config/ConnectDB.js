import { sequelize } from '../models/index.js';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connected!');
        await sequelize.sync({ alter: true });
        console.log('Database synced.');
    } catch (err) {
        console.error('Unable to connect to MySQL:', err);
    }
};

export default connectDB;
