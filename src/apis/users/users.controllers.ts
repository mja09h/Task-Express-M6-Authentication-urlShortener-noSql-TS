import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
dotenv.config();

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, password: hashedPassword });
        const token = jwt.sign({ 
            id: newUser._id }, 
            JWT_SECRET, 
            { expiresIn: "1d" });

        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password as string);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ 
            id: user._id }, 
            JWT_SECRET, 
            { expiresIn: "1d" });

        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().populate("urls");

        res.status(201).json(users);
    } catch (err) {
        next(err);
    }
};