const express = require('express');
const redis = require('redis');

// Create an Express app
const app = express();
const port = 3000;

// Create a Redis client
const redisClient = redis.createClient();

// Endpoint to fetch a key from Redis
app.get('/:key', (req, res) => {
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
