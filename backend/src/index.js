const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

require('dotenv/config');

const app = express();

mongoose.connect(`mongodb+srv://doougui:${process.env.DATABASE_PASS}@cluster0-i7hyt.mongodb.net/week10?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(express.json());
app.use(routes);

app.listen(3333);