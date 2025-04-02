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
      console.log('Token received:', token.substring(0, 15) + '...');
    }
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Not authorized, no token'
      });
      return;
    }
    
    try {
      // Check route path to determine which secret to use
      const isOrganizerRoute = req.originalUrl.includes('/organizer') || 
                              req.originalUrl.includes('/events/update') || 
                              req.originalUrl.includes('/getOrganizerEventById');
      
      // Use different secrets based on route
      let secret;
      let decoded;
      
      if (isOrganizerRoute) {
        // For organizer routes
        secret = process.env.ACCESS_TOKEN_SECRET || 'your-organizer-secret-key';
        console.log('Using organizer secret for', req.originalUrl);
        
        decoded = jwt.verify(token, secret);
        
        if (decoded && (decoded as any).user) {
          req.user = (decoded as any).user;
        } else {
          throw new Error('Invalid token structure');
        }
      } else {
        // For user routes
        secret = process.env.JWT_SECRET || 'your-user-secret-key';
        console.log('Using user secret for', req.originalUrl);
        
        decoded = jwt.verify(token, secret);
        
        if (decoded && (decoded as any).id) {
          // For user tokens that have the user ID directly in payload
          req.user = { id: (decoded as any).id };
        } else {
          throw new Error('Invalid token structure');
        }
      }
      
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({
        success: false,
        error: 'Token verification failed - please login again'
      });
      return;
    }
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
    return;
  }
};