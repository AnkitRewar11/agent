// /client/src/App.js
import React, { useState } from 'react';
import axios from 'axios';


function App() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };
  
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };
  
  const sendMessage = async () => {
    try {
      const res = await axios.post('http://localhost:5001/chat', { message: input });
      const reply = res.data.reply;
      setChat([...chat, { user: input, bot: reply }]);
      setInput('');
      speak(reply);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🧠 My AI Assistant</h1>
      <div>
        {chat.map((c, i) => (
          <div key={i}>
            <b>You:</b> {c.user} <br />
            <b>Bot:</b> {c.bot}
            <hr />
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <button onClick={startListening}>🎤 Speak</button>
    </div>
  );
}

export default App;
