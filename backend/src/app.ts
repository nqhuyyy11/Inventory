import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes (sẽ thêm sau)
// import adminRoutes from './modules/admin/routes';
// import posRoutes from './modules/salesperson_pos/routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
// app.use('/api/admin', adminRoutes);
// app.use('/api/pos', posRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
