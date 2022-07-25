import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectToDatabase } from './database/database';

dotenv.config();
const app = express();
app.use(express.json());

// Handle password
app.use((req, res, next) => {
  const password = req.query.password;
  if (password !== 'miffy') {
    return res
      .status(401)
      .json({ error: `Invalid password '${req.query.password}'` });
  }
  next();
});

connectToDatabase();
const rewards = ['food', 'drink', 'tickets', 'cash'];

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Password is correct' });
});

app.get('/rewards', (req, res) => {
  res.json({ rewards: rewards });
});

app.get('/unlock', async (req, res) => {});

app.listen(process.env.PORT, () => {
  return console.log('💻', 'Server is listening on port', process.env.PORT);
});
