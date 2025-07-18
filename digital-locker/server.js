const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/digital-locker',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log('Connected to MongoDB'))
.catch((err)=> console.log(err));

app.use('/api',authRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

