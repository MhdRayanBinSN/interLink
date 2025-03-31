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
    // Get token from header
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Not authorized, no token'
      });
      return;
    }
    
    try {
      // Check if this is an organizer route OR an event creation route
      const isOrganizerRoute = req.originalUrl.includes('/organizer');
      const isEventCreationRoute = req.originalUrl.includes('/events/createEvent');
      
      // Use organizer secret for both organizer routes AND event creation
      const secret = (isOrganizerRoute || isEventCreationRoute) 
        ? process.env.ACCESS_TOKEN_SECRET as string
        : process.env.JWT_SECRET || 'supersecretkey';
      
      // Verify token
      const decoded = jwt.verify(token, secret);
      
      // Add user to request
      if (isOrganizerRoute || isEventCreationRoute) {
        req.user = (decoded as any).user;
      } else {
        req.user = await User.findById((decoded as any).id);
      }
      
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
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