const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

require('dotenv/config');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect(`mongodb+srv://doougui:${process.env.DATABASE_PASS}@cluster0-i7hyt.mongodb.net/week10?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);