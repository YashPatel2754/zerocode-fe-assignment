import React from 'react';
import { useState, useEffect } from 'react';

const History = () => {
  const [stored, setStored] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    setStored(history);
  }, []);

  const handleClear = () => {
    localStorage.removeItem('history');
    setStored([]);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700 dark:text-white">Chat History</h2>
        {stored.length > 0 && (
          <button
            onClick={handleClear}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Clear History
          </button>
        )}
      </div>
      <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-150px)]">
        {stored.map((msg, i) => (
          <li key={i} className="text-sm dark:text-gray-300">
            You: {msg.question} <br /> Bot: {msg.answer}
          </li>
        ))}
        {stored.length === 0 && (
          <li className="text-center text-gray-500 dark:text-gray-400">No history available.</li>
        )}
      </ul>
    </div>
  );

};

export default History;