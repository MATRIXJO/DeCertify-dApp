// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const ipfsRoutes = require('./routes/ipfs');
const Sentry = require("@sentry/node");

// Load environment variables from .env file
dotenv.config();

// Initialize Sentry only if DSN is available
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'production',
  });
}

// Connect to MongoDB
connectDB();

const app = express();

// Add Sentry request handler only if DSN is available
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.requestHandler());
}

// Middleware
// Enable CORS for all origins (adjust for production)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User-related routes (organizations, requests)
app.use('/api/ipfs', ipfsRoutes); // IPFS related routes

// Basic route for testing server
app.get('/', (req, res) => {
  res.send('deCertify Backend API is running...');
});

// Add Sentry error handler only if DSN is available
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

