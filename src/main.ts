import dotenv from 'dotenv';
import express from 'express';
import { prompt } from './ai';
import { connectToDatabase } from './database/database';
import {
  getNextReward,
  getUnlockedRewards,
  setFavorite,
  unlockNextReward
} from './reward-controller';

dotenv.config();
const app = express();
app.use(express.json());

// Use cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

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

// /favorite?password=miffy&index=123&favorite=true
app.get('/favorite', async (req, res) => {
  const index = parseInt(req.query.index as string, 10);
  if (isNaN(index)) {
    return res.status(400).json({ error: 'Invalid index' });
  }

  const isFavorite = req.query.favorite == 'true';
  await setFavorite(index, isFavorite);
  const unlockedRewards = await getUnlockedRewards();
  return res.status(200).json(unlockedRewards);
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

// Fortune
app.post('/fortune', async (req, res) => {
  try {
    const questionsAndCards = req.body;

    const reading = (
      await prompt(
        `A person asks a fortune teller for a tarot card reading. The fortune teller asks three questions.` +
          questionsAndCards.questions
            .map((question: string, index: number) => {
              return `\n${index + 1}. ${question}`;
            })
            .join('\n') +
          `\nThen, the person chooses three cards, representing their past, present, and future.` +
          questionsAndCards.cards
            .map((card: string, index: number) => {
              return `\nThe ${
                index === 0 ? 'past' : index === 1 ? 'present' : 'future'
              } is ${card}.`;
            })
            .join('\n') +
          `\nWrite a 6-10 sentence monologue from the fortune teller explaining to the person how the cards the person has chosen are related to their answers to the questions.` +
          `\nEnd the monologue with a prediction for the person's future. Use line breaks. Do not put quotation marks around the monologue.`
      )
    ).trim();

    console.log(reading);

    return res.status(200).json(reading);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Invalid prompt' });
  }
});

app.listen(process.env.PORT, () => {
  return console.log('💻', 'Server is listening on port', process.env.PORT);
});
