const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/', taskRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// DB Bağlantısı
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
