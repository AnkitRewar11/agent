const { Note, Reminder } = require('../db');

class MemoryController {
  async getNotes(req, res) {
    try {
      const notes = await Note.find().sort({ createdAt: -1 });
      res.json(notes);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  }

  async getReminders(req, res) {
    try {
      const reminders = await Reminder.find().sort({ createdAt: -1 });
      res.json(reminders);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch reminders' });
    }
  }
}

module.exports = MemoryController;
