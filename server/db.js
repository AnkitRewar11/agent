import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ MongoDB connected successfully');
});


const ChatSchema = new mongoose.Schema({
  user: String,
  bot: String,
  timestamp: { type: Date, default: Date.now },
});

const NoteSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const ReminderSchema = new mongoose.Schema({
  text: String,
  time: String,
  createdAt: { type: Date, default: Date.now }
});

export const Chat = mongoose.model('Chat', ChatSchema);
export const Note = mongoose.model('Note', NoteSchema);
export const Reminder = mongoose.model('Reminder', ReminderSchema);

mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connected successfully');
});
console.log("🧪 MONGO_URL = ", process.env.MONGO_URL);

