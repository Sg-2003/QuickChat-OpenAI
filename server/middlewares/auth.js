import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "Not authorized, User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
}
