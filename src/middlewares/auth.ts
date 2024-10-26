import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { Request, Response, NextFunction } from 'express';
import { UnathorizedException } from "../exceptions/unauthorizedException";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return next(new UnathorizedException('Unauthorized', ErrorCode.Unauthorized));
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        const user = await prismaClient.user.findFirst({ where: { id: payload.id } }) as 
                { id: number; uuid: string; name: string; email: string; password: string; 
                createdAt: Date; updatedAt: Date; } | undefined;
        if (!token) {
            return next(new UnathorizedException('Unauthorized', ErrorCode.Unauthorized));
        }
        req.user = user;
        next()
    
        
    } catch (error) {
        return next(new UnathorizedException('Unauthorized', ErrorCode.Unauthorized));
    }
};

export default authMiddleware;