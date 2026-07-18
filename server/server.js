require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const seedData = require('./config/mockData');

const app = express();

// Configure CORS to accept client connection
app.use(cors({
  origin: '*', // Allow all origins for testing
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (if any)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const eventRoutes = require('./routes/events');
const resourceRoutes = require('./routes/resources');
const communityRoutes = require('./routes/community');
const aiRoutes = require('./routes/ai');
const certificationRoutes = require('./routes/certifications');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/certifications', certificationRoutes);

// Base route for server status
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Studora API Server",
    status: "online"
  });
});

// Ensure all unhandled API routes return JSON (not Express default HTML like Cannot GET/POST)
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found', status: 404 });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database
  await connectDB();

  // Seed initial data if database is empty
  await seedData();

  const startListening = (port) => {
    const server = app.listen(port, () => {
      console.log(`\n🪐 [SERVER RUNNING]: Studora server started on port ${port}`);
      console.log(`📡 [API URL]: http://localhost:${port}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} in use, trying next port...`);
        startListening(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  };

  startListening(PORT);
};

startServer().catch(err => {
  console.error('Failed to start Studora server:', err);
});
