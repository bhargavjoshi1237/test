
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const Redis = require('ioredis');
const middlewares = require('./middlewares');
const api = require('./api');

const app = express();
const client = new Redis("redis://default:553e61e7c64649478d1ff784688c052b@correct-stud-36874.upstash.io:36874");

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/login/:key/:val', async (req, res) => {
    const { key } = req.params;
    const { val } = req.params;

    try {
        // Fetch the value from Redis
        const value = await client.get(key);
        
        if (value === null) {
            res.status(404).send('Key not found in Redis');
        } else {
            if(value === val)
            {
                const randomNum = Math.floor(1000000000 + Math.random() * 9000000000);
            
                // Set the random number in Redis
                await client.set(randomNum.toString(), key, 'EX', 604800);
                
                // Send the random number as the response
                res.json(randomNum.toString());  
            }
            else{
                res.json(false)
            }
        }
    } catch (error) {
        console.error('Error fetching from Redis:', error);
        res.status(500).send('Error fetching from Redis');
    }
});

app.get('/signup/:id/:pass', async (req, res) => {
    const { id } = req.params;

    const { pass } = req.params;

    try {
        // Check if the username already exists
        const existingUser = await client.get(id);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Generate a random access token
        const accessToken = Math.floor(1000000000 + Math.random() * 9000000000);

        // Store the username and password in Redis (assuming you want to store it for authentication purposes)
        await client.set(id, pass);

        // Set the access token in Redis with a TTL of 7 days
        await client.set(accessToken.toString(), id, 'EX', 604800);

        // Return the access token as the response
        res.json({ accessToken });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/acc/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Fetch the username associated with the token from Redis
        const username = await client.get(token);

        if (username) {
            res.json({ username });
        } else {
            res.status(404).json({ error: 'Token not found or expired' });
        }
    } catch (error) {
        console.error('Error fetching username from Redis:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/', (req, res) => {

 res.json("Helllo")   
  });

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
