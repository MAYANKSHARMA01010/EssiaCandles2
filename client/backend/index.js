const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 5002;

app.use(cors({
  origin: '*', // ✅ allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // ✅ also include Authorization
}));

app.use(express.json());

// ✅ Correct way to mount routes
app.use('/api/users', userRoutes);

// ✅ Home route (GET)
app.get('/', (req, res) => {
  res.status(200).send('🚀 Backend server is running fine!');
});

// ❌ Reject all other non-GET methods on "/"
app.all('/', (req, res) => {
  res.status(403).json({ message: '🚫 Forbidden: You are not allowed to access this route using this method' });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected via Sequelize');
    await sequelize.sync({ force: false });
    console.log('✅ All models are synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } 
  catch (error) {
    console.error('& Sequelize DB connection error:', error);
  }
})();
