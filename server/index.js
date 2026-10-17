import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRouter from './routes/api.js';
import { seedInitialData } from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRouter);

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Loan Management System API (ប្រព័ន្ធគ្រប់គ្រងប្រាក់កម្ចី)',
    version: '1.0.0',
    documentation: '/api/system/status',
    flowchart: 'Start -> Register Customer -> Submit Application -> Review -> Approved? (Yes/No) -> Create Loan -> Generate Schedule -> Disburse Loan -> Customer Makes Payment -> Fully Paid? (Yes/No) -> Close Loan -> End'
  });
});

// Start Server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Loan Management Server is running on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
