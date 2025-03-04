const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.route');
const portfolioRoutes = require('./routes/portfolio.route');
const stockRoutes = require('./routes/stock.route');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/stocks', stockRoutes);


app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));