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
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Serve React app for any non-API route (React Router fallback)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to database
  await connectDB();
  
  // Seed initial data if database is empty
  await seedData();

  app.listen(PORT, () => {
    console.log(`\n🪐 [SERVER RUNNING]: Studora server started on port ${PORT}`);
    console.log(`📡 [API URL]: http://localhost:${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start Studora server:', err);
});
