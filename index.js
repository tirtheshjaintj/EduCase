const express = require('express');
const dotenv = require('dotenv');
const schoolRoutes = require('./routes/school.routes');

dotenv.config();

const app = express();
app.use(express.json());

// API Routes
app.use('/api/schools', schoolRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
