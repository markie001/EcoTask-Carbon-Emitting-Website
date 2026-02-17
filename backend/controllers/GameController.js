import User from "../models/User.js";

export const getPoints = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = await User.findByPk(req.user.id, { attributes: ['points'] });
        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }

        res.status(200).json({ points: user.points });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const redeemReward = async (req, res) => {
    try {
        // if (!req.user) {
        //     return res.status(404).json({ error:"Unauthorized",message: "Login to redeem rewards" });
        // }
        const user = await User.findByPk(req.user.id);
        const { pointsToRedeem } = req.body;
        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }

        if (user.points < pointsToRedeem) {
            return res.status(400).json({ message: "Insufficient points" });
        }
        await user.update({ points: user.points - pointsToRedeem });
        res.status(200).json({ message: "Reward redeemed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }    
};

export const updatePoints = async (req, res) => {
    try {
        const { pointsToAdd } = req.body;
        if (!pointsToAdd || pointsToAdd < 0) {
            return res.status(400).json({ message: "Invalid pointsToAdd value" });
        }
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }
        await user.update({ points: user.points + pointsToAdd });
        res.status(200).json({ message: "Points updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};