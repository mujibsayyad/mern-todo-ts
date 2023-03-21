require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const crudRoutes = require('./routes/crudRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', crudRoutes);

app.listen(PORT, () => {
  mongoose.connect(process.env.DB);
  mongoose.connection
    .once('open', () => {
      console.log('Mongoose Connection Established');
    })
    .on('error', (err) => {
      if (err) console.log(`Mongoose Connection Error: ${err}`);
    });

  console.log(`Server listening on ${PORT}`);
});
