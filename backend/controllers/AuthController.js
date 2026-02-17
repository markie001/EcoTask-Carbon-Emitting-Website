import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Footprint from '../models/Footprint.js';
import GuestCache from '../services/GuestCache.js';
import { sendVerificationMail, sendResetPasswordMail } from '../config/nodemailer.js';
import dotenv from 'dotenv';
dotenv.config();


const register = async (req, res) => {
    const { name, email, password, ip } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        // checking if exists;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (GuestCache[ip]) {
            const guestData = GuestCache[ip];
            await Footprint.create({
                userId: user.id,
                transport: guestData.transportEmissions,
                energy: guestData.energyEmissions,
                food: guestData.foodEmissions,
                shopping: guestData.shoppingEmissions,
                total: guestData.total,
                date: new Date(),
            });

            delete GuestCache[ip];
        }

        // Code to send verification mail on register step
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        await user.update({ verificationToken: token });
        await sendVerificationMail(email, token);
        
        res.status(201).json({ message: "User registered succesfully." });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const login = async (req, res) => { 
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        };

        if(!user.verified){
            return res.status(400).json({ message: "Please verify your email first" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        
        return res.json({ success: true, token , user, message: `Login successful Token : ${token}` });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const verifyEmail = async (req, res) => { 
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) { 
            return res.status(404).json({
                success: false,
                message: "Invalid token"
            });
        }
        await user.update({ verified: true, verificationToken: null });

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            error: "Invalid Token",
            message: error.message
        })
    }
};

const forgotPassword = async (req, res) => { 
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ success: false, message: "User not found" });



        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        await user.update({ resetPasswordToken: resetToken });

        await sendResetPasswordMail(email, resetToken);

        res.json({success: true, message: "Reset password link sent to mail successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
const resetPassword = async (req, res) => { 
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { email: decoded.email } });
        if (!user) {
            return res.status(404).json({ error: "User not found", message: error.message });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await user.update({ password: hashedPassword, resetPasswordToken: null });

        res.json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export default { register , login, verifyEmail, resetPassword, forgotPassword };