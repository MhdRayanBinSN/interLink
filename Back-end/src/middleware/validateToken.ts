import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

interface UserPayload {
    user: {
        username: string;
        id: string;
    }
}

interface AuthRequest extends Request {
    user?: UserPayload['user'];
}

const validateToken = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string;
    const authHeader = req.headers.authorization || req.headers.Authorization as string;

    if (authHeader?.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        
        jwt.verify(
            token, 
            process.env.ACCESS_TOKEN_SECRET as string, 
            (err: jwt.VerifyErrors | null, decoded: any) => {
                if (err) {
                    res.status(401);
                    throw new Error("User is not authorized");
                }
                req.user = decoded.user;
                next();
            }
        );
    } else {
        res.status(401);
        throw new Error("Token is missing");
    }
});

export default validateToken;