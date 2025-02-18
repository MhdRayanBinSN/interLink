import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { eventsRouter } from './routes/events.js';
import { usersRouter } from './routes/users.js';
import { authRouter } from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/users', authenticateToken, usersRouter);

// Error handling
app.use(errorHandler);

app.get('/', (req, res) => {
  res.json({ message: 'Tech Events API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});