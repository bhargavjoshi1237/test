const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const redis = require('redis');
require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();
const redisClient = redis.createClient();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/x/:key', (req, res) => {
  const { key } = req.params;

  // Fetch the value from Redis
  redisClient.get(key, (err, value) => {
      if (err) {
          console.error('Error fetching from Redis:', err);
          res.status(500).send('Error fetching from Redis');
      } else if (value === null) {
          res.status(404).send('Key not found in Redis');
      } else {
          res.send(value);
      }
  });
});

app.get('/', (req, res) => {

 res.json("Helllo")   
  });

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
