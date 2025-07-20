const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS setup for your frontend
const corsOptions = {
  origin: 'https://digitallocker-front-end.onrender.com', // ✅ your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));  // ✅ Enable CORS with options
app.use(express.json());     // Parse JSON body

// ✅ MongoDB connection
mongoose.connect('mongodb+srv://manojvasanth57986:GahB4n19kPeehbST@digital-locker.zurrnqp.mongodb.net/?retryWrites=true&w=majority&appName=digital-locker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log(err));

// ✅ Routes
app.use('/api', authRoutes);

// ✅ Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
