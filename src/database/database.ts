import { connect } from 'mongoose';

export async function connectToDatabase() {
  const result = await connect(process.env.DATABASE_URL)
    .then(() => {
      console.log('✔️', 'Connected to database');
    })
    .catch((err) => {
      console.error('❌', err);
      return;
    });
}
