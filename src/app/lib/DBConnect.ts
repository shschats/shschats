import mongoose from 'mongoose';

let conn: mongoose.Connection | null = null;

export async function dbConnect() {
  if (conn !== null) {
    console.log('Connected to existing DB');
    return conn;
  }

  const conString = process.env.MONGO_URL!;

  try {
    await mongoose.connect(conString);

    conn = mongoose.connection;
    console.log('New connection to DB established');
    return conn;
  } catch (error) {
    console.error('Error connecting to DB:', error);
    throw error;
  }
}
