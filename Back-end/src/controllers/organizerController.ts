import { Request, Response } from "express";
import { Organizer } from "../models/Organizer";

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