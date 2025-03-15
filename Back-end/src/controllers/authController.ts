import express from 'express';
import bcrypt from 'bcrypt-ts';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Function to register a new user
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { fullName, email, password, phone, dob, attendeeType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already in use'
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      dob,
      attendeeType
    });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'supersecret', {
      expiresIn: '30d'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        attendeeType: user.attendeeType
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error registering user'
    });
  }
};

// Function to login a user
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'supersecret', {
      expiresIn: '30d'
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        attendeeType: user.attendeeType
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error logging in'
    });
  }
};