import express from 'express';

const app = express();
const PORT = 3003; // Using a different port to avoid conflicts

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <h1>Test Server is Running</h1>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/api/test">/api/test</a> - Test endpoint</li>
      <li><a href="/api/health">/api/health</a> - Health check</li>
    </ul>
  `);
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Test server is working!', 
    timestamp: new Date().toISOString() 
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.path
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`🔍 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
