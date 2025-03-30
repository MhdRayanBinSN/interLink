import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Log headers for debugging
    console.log('Auth headers:', req.headers.authorization);
    
    let token;
    
    // Check header for token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      // Log token for debugging (in development only)
      console.log('Token extracted:', token);
    }
    
    // Make sure token exists
    if (!token) {
      console.log('No token provided');
      res.status(401).json({
        success: false,
        error: 'Not authorized, no token'
      });
      return;
    }
    
    try {
      // Determine which secret to use based on the route
      const isOrganizerRoute = req.originalUrl.includes('/organizer');
      const secret = isOrganizerRoute 
        ? process.env.ACCESS_TOKEN_SECRET as string
        : process.env.JWT_SECRET || 'supersecretkey';
      
      // Verify token
      const decoded = jwt.verify(token, secret);
      
      // Add user to request
      if (isOrganizerRoute) {
        req.user = (decoded as any).user;
      } else {
        req.user = await User.findById((decoded as any).id);
      }
      
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};