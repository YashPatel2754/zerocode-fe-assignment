// client/src/pages/Chat.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import History from './History';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('history')) || [];
    setMessages(stored);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', question: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    localStorage.setItem('history', JSON.stringify(newMessages));

    // https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium
    try {
      const res = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: { text: input } })
      });

      const data = await res.json();
      const botText = Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : "Sorry, I didn’t get that.";
      const botMsg = { sender: 'bot', answer: botText };

      const finalMessages = [...messages, userMsg, botMsg];
      setMessages(finalMessages);
      localStorage.setItem("history", JSON.stringify(finalMessages));

    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMsg = { sender: 'bot', answer: "Bot error. Please try again later." };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setInput('');
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-gray-900 text-center text-lg font-semibold text-red-500">
        Please login to access the chat.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: History */}
        <div className="w-1/4 border-r overflow-y-auto bg-gray-100 dark:bg-gray-800">
          <History />
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div key={index}>
                <div className="text-right text-blue-600">You: {msg.question}</div>
                <div className="text-left text-green-600">Bot: {msg.answer}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center p-4 border-t bg-gray-50 dark:bg-gray-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded border dark:bg-gray-700 dark:text-white"
            />
            <button onClick={startListening} className="ml-2 px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600">
              🎤
            </button>
            <button onClick={handleSend} className="ml-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;