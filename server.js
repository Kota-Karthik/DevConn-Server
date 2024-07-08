const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes=require('./routes/chatRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();
dotenv.config();
connectDB();

// Enable CORS for requests from http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use("/user", userRoutes);
app.use("/chat",chatRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`.yellow.bold);
});
