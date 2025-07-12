const express = require('express');
const router = express.Router();
const ExampleController = require('../controllers/exampleController');
const ChatController = require('../controllers/chatController');
const MemoryController = require('../controllers/memoryController');

const exampleController = new ExampleController();
const chatController = new ChatController();
const memoryController = new MemoryController();

router.get('/examples', exampleController.getAllExamples);
router.post('/examples', exampleController.createExample);
router.get('/examples/:id', exampleController.getExampleById);
router.put('/examples/:id', exampleController.updateExample);
router.delete('/examples/:id', exampleController.deleteExample);

// 👇 Your new assistant routes
router.post('/chat', chatController.handleChat);
router.get('/notes', memoryController.getNotes);
router.get('/reminders', memoryController.getReminders);

module.exports = router;
