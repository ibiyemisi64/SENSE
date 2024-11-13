import express from 'express';
import authRoutes from './routes/authRoutes.js';

const app = express();

// for parsing JSON requests
app.use(express.json());

// Set up routes
app.use('/auth', authRoutes); // Handles authentication routes (registration, login etc.)

// Catch-all route for unhandled requests
app.get('/', (req, res) => {
    res.send('Welcome to the backend API');
});

export default app;