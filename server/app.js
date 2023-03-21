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

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  const path = require('path');

  app.use(express.static(path.resolve(__dirname, 'dist')));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

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
