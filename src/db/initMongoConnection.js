import mongoose from 'mongoose';

const DB_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority&appName=Cluster0`;

export async function initMongoConnection() {
  try {
    await mongoose.connect(DB_URL);
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}
