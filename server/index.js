import { fetch, Headers, Request } from 'fetch-h2';
globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.Request = Request;
import { Blob } from 'fetch-blob';
globalThis.Blob = Blob;


// import fetch from 'node-fetch';
// globalThis.fetch = fetch;


import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { Chat, Note, Reminder } from './db.js';

dotenv.config();

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  const SYSTEM_PROMPT = `
You are an AI assistant. Classify the user's intent from the message.
Possible intents:
1. chat (normal conversation)
2. reminder (like: remind me at 5PM to call)
3. note (like: add note buy milk)

Respond in this JSON format:
{
  "intent": "...",
  "data": { ... }
}
User: "${message}"
`;

  try {
    const intentResult = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: SYSTEM_PROMPT }],
    });

    const intentJSON = intentResult.choices[0].message.content;
    const parsed = JSON.parse(intentJSON);

    let reply = "";

    if (parsed.intent === "note") {
      await Note.create({ content: parsed.data.text });
      reply = `📝 Note added: ${parsed.data.text}`;
    } else if (parsed.intent === "reminder") {
      await Reminder.create({ text: parsed.data.text, time: parsed.data.time });
      reply = `⏰ Reminder set for ${parsed.data.time}: ${parsed.data.text}`;
    } else {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      });
      reply = completion.choices[0].message.content;
    }

    await Chat.create({ user: message, bot: reply });
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error parsing or responding." });
  }
});

app.listen(5001, () => console.log('Server running on http://localhost:5001'));

