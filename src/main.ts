import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:4000',
      'https://localhost:4000',
      'http://84.166.18.6:4000'
    ],
    credentials: true
  })
);

// connectToDatabase();

app.get('/', (req, res) => {
  res.send(`Hello World! It's me, the server.`);
});

// app.use('/me', meRoute);
// app.use('/shop', shopRoute);
// app.use('/game', gameRoute);

// app.get('/user/:id', authenticate, async (req, res) => {
//   const targetUser = await getUserById(req.params.id);
//   if (!targetUser) return res.status(404);

//   res.json(toPublicUserData(targetUser));
// });

app.listen(process.env.PORT, () => {
  return console.log('💻', 'Server is listening on port', process.env.PORT);
});
