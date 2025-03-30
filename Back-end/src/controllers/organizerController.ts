import { Request, Response } from "express";
import { Organizer } from "../models/Organizer";
import bcrypt from "bcrypt-ts";
import jwt from "jsonwebtoken";

interface IRegisterRequest extends Request {
  body: {
    name:string;
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

export const currentUser = async (req : Request,res : Response) => {
    res.json(req.user)
   // res.json({ message: "current user" })
}

export const getOrganizerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizerId = req.user.id;
    
    // Get organizer profile from database (excluding password)
    const organizer = await Organizer.findById(organizerId).select('-password');
    
    if (!organizer) {
      res.status(404).json({
        success: false,
        error: 'Organizer profile not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: organizer
    });
  } catch (error) {
    console.error('Error fetching organizer profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve organizer profile'
    });
  }
};

export const updateOrganizerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizerId = req.user.id;
    
    // Fields that can be updated
    const {
      name,
      organizationName,
      email,
      phone,
      website,
      bio,
      address,
      position,
      languages,
      eventTypes,
      bankDetails,
      socialLinks
    } = req.body;
    
    // Find organizer and update - cast to proper type
    const organizer = await Organizer.findById(organizerId) as any;
    
    if (!organizer) {
      res.status(404).json({
        success: false,
        error: 'Organizer not found'
      });
      return;
    }
    
    // Update fields if provided
    if (name) organizer.name = name;
    if (organizationName) organizer.organizationName = organizationName;
    if (email) organizer.email = email;
    if (phone) organizer.phone = phone;
    if (website !== undefined) organizer.website = website;
    if (bio !== undefined) organizer.bio = bio;
    if (address !== undefined) organizer.address = address;
    if (position !== undefined) organizer.position = position;
    if (languages) organizer.languages = languages;
    if (eventTypes) organizer.eventTypes = eventTypes;
    if (bankDetails !== undefined) organizer.bankDetails = bankDetails;
    if (socialLinks) organizer.socialLinks = socialLinks;
    
    // Save the updated organizer
    await organizer.save();
    
    // Return updated organizer (without password)
    const updatedOrganizer = await Organizer.findById(organizerId).select('-password');
    
    res.status(200).json({
      success: true,
      data: updatedOrganizer
    });
  } catch (error) {
    console.error('Error updating organizer profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update organizer profile'
    });
  }
};
