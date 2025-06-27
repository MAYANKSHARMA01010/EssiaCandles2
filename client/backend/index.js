const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 5002;

// ✅ CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',        // Frontend origin
  credentials: true,                      // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200               // For legacy browsers
}));

// ✅ Preflight OPTIONS handler (recommended for full compatibility)
app.options('*', cors());

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use('/api/users', userRoutes);

// ✅ Home route
app.get('/', (req, res) => {
  res.status(200).send('🚀 Backend server is running fine!');
});

// ❌ Block non-GET methods on "/"
app.all('/', (req, res) => {
  res.status(403).json({ message: '🚫 Forbidden: You are not allowed to access this route using this method' });
});

// ✅ Start Server
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected via Sequelize');
    await sequelize.sync({ force: false });
    console.log('✅ All models are synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Sequelize DB connection error:', error);
  }
})();
