const { OpenAI } = require('openai');
const { Chat, Note, Reminder } = require('../db');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class ChatController {
  async handleChat(req, res) {
    const { message } = req.body;

    const SYSTEM_PROMPT = `
You are an AI assistant. Classify the user's intent from the message.
Possible intents:
1. chat
2. reminder
3. note
Respond with JSON like:
{ "intent": "...", "data": { ... } }
User: "${message}"
`;

    try {
      const intentResult = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: SYSTEM_PROMPT }],
      });

      const parsed = JSON.parse(intentResult.choices[0].message.content);
      let reply = "";

      if (parsed.intent === "note") {
        await Note.create({ content: parsed.data.text });
        reply = `📝 Note added: ${parsed.data.text}`;
      } else if (parsed.intent === "reminder") {
        await Reminder.create({ text: parsed.data.text, time: parsed.data.time });
        reply = `⏰ Reminder set for ${parsed.data.time}: ${parsed.data.text}`;
      } else {
        const chatReply = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        });
        reply = chatReply.choices[0].message.content;
      }

      await Chat.create({ user: message, bot: reply });
      res.json({ reply });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to process message." });
    }
  }
}

module.exports = ChatController;
