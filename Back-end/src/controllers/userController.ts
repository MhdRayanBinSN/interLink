import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}
import bcrypt from "bcrypt-ts";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    console.log('Registration request received:', req.body); 
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'Email already in use'
            });
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create user with hashed password
        const userData = {
            ...req.body,
            password: hashedPassword
        };

        const user = await User.create(userData);
        
        // Remove password from response
        const userResponse: Partial<typeof user> = user.toObject();
        delete userResponse.password;
        
        console.log('User created successfully'); 
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '30d' }
        );
        
        res.status(201).json({
            success: true,
            token,
            data: userResponse
        });
    } catch (error: any) {
        console.error('Registration error:', error); 
        
        // Provide more specific error messages
        if (error.name === 'ValidationError') {
            // Mongoose validation error
            const errors = Object.values(error.errors).map((err: any) => err.message);
            res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
            return;
        }
        
        res.status(500).json({
            success: false,
            error: error.message || 'Registration failed'
        });
    }
};

// Add login function
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Please provide both email and password'
            });
            return;
        }
        
        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');
        
        // Check if user exists
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
            return;
        }
        
        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
            return;
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '30d' }
        );
        
        // Remove sensitive data before sending response
        const userResponse: Partial<typeof user> = user.toObject();
        delete userResponse.password;
        
        res.status(200).json({
            success: true,
            token,
            data: userResponse
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
        })
    }
};

// Add this function to your existing userController.ts
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        // req.user.id comes from the auth middleware
        const userId = req.user.id;
        
        // Find the user and exclude password
        const user = await User.findById(userId)
            .select('-password');
            
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false
        });
    }
}

// Add this function for updating the profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        
        // Fields that can be updated
        const {
            fullName,
            phone,
            bio,
            interests,
            githubProfile,
            linkedinProfile,
            organization,
            specialization
        } = req.body;
        
        // Build the update object
        const updateData: any = {};
        
        if (fullName) updateData.fullName = fullName;
        if (phone) updateData.phone = phone;
        if (bio) updateData.bio = bio;
        if (interests) updateData.interests = interests;
        
        // Add custom fields to the user profile
        if (githubProfile || linkedinProfile || organization || specialization) {
            updateData.profileDetails = updateData.profileDetails || {};
            if (githubProfile) updateData.profileDetails.githubProfile = githubProfile;
            if (linkedinProfile) updateData.profileDetails.linkedinProfile = linkedinProfile;
            if (organization) updateData.profileDetails.organization = organization;
            if (specialization) updateData.profileDetails.specialization = specialization;
        }
        
        // Update user with new data
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error: any) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error updating profile'
        });
    }
}

// Add this to your userController.ts file
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        error: 'Please provide both current and new passwords'
      });
      return;
    }
    
    // Find user with password
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }
    
    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
      return;
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user with new password
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error: any) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error changing password'
    });
  }
};

// Add this to your userController.ts file
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }
    
    // Handle profile picture upload
    let profilePicture = user.profilePicture;
    if (req.file) {
      // Handle file upload logic here
      // This depends on your file storage solution (local, S3, etc.)
      profilePicture = `/uploads/${req.file.filename}`;
    }
    
    // Parse interests from JSON string if it exists
    let interests = user.interests;
    if (req.body.interests) {
      try {
        interests = JSON.parse(req.body.interests);
      } catch (error) {
        console.error('Error parsing interests:', error);
      }
    }
    
    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: req.body.fullName || user.fullName,
        phone: req.body.phone || user.phone,
        bio: req.body.bio,
        organization: req.body.organization,
        specialization: req.body.specialization,
        githubProfile: req.body.githubProfile,
        linkedinProfile: req.body.linkedinProfile,
        interests: interests,
        profilePicture: profilePicture
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      
      res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Error updating profile'
    });
  }
};

// Add this to your userController.ts file

export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // If middleware passed, token is valid
    // Return user data
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error verifying token'
    });
  }
};