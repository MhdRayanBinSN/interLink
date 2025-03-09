import { Request, Response } from "express";
import { Organizer } from "../models/Organizer";
import bcrypt from "bcrypt-ts";
import jwt from "jsonwebtoken";

interface IRegisterRequest extends Request {
  body: {
    organizationName: string;
    organizationType: string;
    contactPerson: string;
    email: string;
    phone: string;
    password: string;
    userId: string;
    website?: string;
  }
}

export const registerOrganizer = async (req: IRegisterRequest, res: Response): Promise<void> => {
    console.log('Registration request received:', req.body); // Add this line
    try {
        const organizer = await Organizer.create(req.body);
        console.log('Organizer created:', organizer); // Add this line
        res.status(201).json({
            success: true,
            data: organizer
        });
    } catch (error: any) {
        console.error('Registration error:', error); // Add this line
        res.status(500).json({
            success: false,
            error: error.message || 'Registration failed'
        });
    }
};

export const loginOrganizer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, password } = req.body;

        // Validate input
        if (!userId || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are mandatory"
            });
            return;
        }

        // Find organizer and explicitly select the password field
        const organizer = await Organizer.findOne({ userId }).select('+password');
        
        if (!organizer || !organizer.password) {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }

        // Verify password
        try {
            const isValidPassword = await bcrypt.compare(password, organizer.password);
            
            if (!isValidPassword) {
                res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
                return;
            }

            // Generate token
            const accessToken = jwt.sign(
                {
                    user: {
                        username: organizer.userId,
                        id: organizer._id,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: "15m" }
            );

            res.status(200).json({
                success: true,
                accessToken
            });

        } catch (bcryptError) {
            console.error('Password comparison error:', bcryptError);
            res.status(500).json({
                success: false,
                message: "Error verifying credentials"
            });
        }

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
/*
export const currentUser = async (req : Request,res : Response) => {
    res.json(req.user)
   // res.json({ message: "current user" })
}
*/