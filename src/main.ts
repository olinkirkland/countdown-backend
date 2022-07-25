import dotenv from 'dotenv';
import express from 'express';
import { connectToDatabase } from './database/database';

dotenv.config();
const app = express();
app.use(express.json());

connectToDatabase();
const rewards = ['food', 'drink', 'tickets', 'cash'];

app.get('/', (req, res) => {
  res.send(`Hello! It's me, the server.`);
});

app.get('/rewards', auth, (req, res) => {
  res.json({ rewards: rewards });
});

app.get('/unlock', auth, async (req, res) => {});

app.listen(process.env.PORT, () => {
  return console.log('💻', 'Server is listening on port', process.env.PORT);
});

function auth(req, res, next) {
  // Check url queries for password '534820'
  const password = req.query.password;
  if (password !== 534820) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  next();
}
