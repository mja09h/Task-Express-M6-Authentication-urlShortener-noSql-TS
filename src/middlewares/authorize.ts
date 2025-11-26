import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../../types/http";
import dotenv from "dotenv";
dotenv.config();

export function authorize(req: Request, res: Response, next: NextFunction) {
    try {
        const request = req as CustomRequest;
        const header = request.header("authorization");
        const [scheme, token] = header?.split(" ") ?? [];

        if (scheme !== "Bearer" || !token) {
            res.status(401).json({ message: "Unauthorized" });
        }

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
        ) as JwtPayload;
        request.user = {
            id: payload.id,
            role: payload.role,
        };
        next();
    } catch (error) {
        res.status(401).json({ message: "Error authorizing user" });
    }
};