import dotenv from 'dotenv';
import express from 'express';
import { connectToDatabase } from './database/database';
import {
  getNextReward,
  getUnlockedRewards,
  unlockNextReward
} from './reward-controller';

dotenv.config();
const app = express();
app.use(express.json());

connectToDatabase();

// Determine if the password is correct
app.use((req, res, next) => {
  const password = req.query.password;
  if (password !== 'miffy') {
    return res
      .status(401)
      .json({ error: `Invalid password '${req.query.password}'` });
  }
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Password is correct' });
});

// Return the next reward
app.get('/next', async (req, res) => {
  const nextReward = await getNextReward();
  if (!nextReward) return res.status(404).json({ message: 'No rewards found' });
  return res.status(200).json(nextReward);
});

// Unlock the next reward
app.get('/unlock', async (req, res) => {
  const nextReward = await getNextReward();
  // Round hoursUntilNextReward to the nearest tenth
  const secondsUntilNextReward =
    (nextReward.availableOnDate.getTime() - Date.now()) / 1000;

  return (await unlockNextReward())
    ? res.status(200).json({ message: 'Unlocked next reward' })
    : res.status(404).json({
        message: `Could not unlock next reward (wait ${
          Math.floor(secondsUntilNextReward / 60 / 6) / 10
        } hours)`,
        timeLeft: secondsUntilNextReward
      });
});

// Collection
app.get('/collection', async (req, res) => {
  const unlockedRewards = await getUnlockedRewards();
  return res.status(200).json(unlockedRewards);
});

app.listen(process.env.PORT, () => {
  return console.log('💻', 'Server is listening on port', process.env.PORT);
});
