import express from 'express';
import { body, param } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// Mock database
let events = [
  {
    id: '1',
    title: 'React Summit 2024',
    description: 'The biggest React conference in Europe',
    date: new Date('2024-06-15'),
    location: 'Amsterdam, Netherlands',
    category: 'conference',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    organizer: {
      id: '1',
      name: 'Tech Events Inc',
      email: 'info@techevents.com',
    },
    price: 599,
    capacity: 1000,
    registeredCount: 750,
  }
];

// Get all events
router.get('/', (req, res) => {
  res.json(events);
});

// Get single event
router.get('/:id', param('id').isString(), validateRequest, (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
});

// Create event
router.post('/',
  authenticateToken,
  [
    body('title').isString().trim().notEmpty(),
    body('description').isString().trim().notEmpty(),
    body('date').isISO8601(),
    body('location').isString().trim().notEmpty(),
    body('category').isIn(['conference', 'hackathon', 'bootcamp']),
    body('price').isNumeric(),
    body('capacity').isInt({ min: 1 }),
  ],
  validateRequest,
  (req, res) => {
    const newEvent = {
      id: Date.now().toString(),
      ...req.body,
      organizer: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
      registeredCount: 0,
    };
    events.push(newEvent);
    res.status(201).json(newEvent);
  }
);

// Update event
router.put('/:id',
  authenticateToken,
  [
    param('id').isString(),
    body('title').optional().isString().trim().notEmpty(),
    body('description').optional().isString().trim().notEmpty(),
    body('date').optional().isISO8601(),
    body('location').optional().isString().trim().notEmpty(),
    body('category').optional().isIn(['conference', 'hackathon', 'bootcamp']),
    body('price').optional().isNumeric(),
    body('capacity').optional().isInt({ min: 1 }),
  ],
  validateRequest,
  (req, res) => {
    const eventIndex = events.findIndex(e => e.id === req.params.id);
    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[eventIndex];
    if (event.organizer.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    events[eventIndex] = { ...event, ...req.body };
    res.json(events[eventIndex]);
  }
);

// Delete event
router.delete('/:id',
  authenticateToken,
  param('id').isString(),
  validateRequest,
  (req, res) => {
    const eventIndex = events.findIndex(e => e.id === req.params.id);
    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[eventIndex];
    if (event.organizer.id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    events = events.filter(e => e.id !== req.params.id);
    res.status(204).send();
  }
);

// Register for event
router.post('/:id/register',
  authenticateToken,
  param('id').isString(),
  validateRequest,
  (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    event.registeredCount++;
    res.json({ message: 'Successfully registered for event' });
  }
);

export { router as eventsRouter };