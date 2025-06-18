// client/src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* Simple Navigation for Access */}
      <nav className="flex justify-center gap-4 p-4 bg-gray-100 dark:bg-gray-800">
        {!user && (
          <>
            <Link className="text-blue-600 dark:text-blue-400 font-semibold" to="/login">Login</Link>
            <Link className="text-blue-600 dark:text-blue-400 font-semibold" to="/register">Register</Link>
          </>
        )}
        {user && (
          <Link className="text-blue-600 dark:text-blue-400 font-semibold" to="/chat">ChatBot</Link>
        )}
      </nav>

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/chat" />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
        <Route path="*" element={<div className="p-8 text-center text-xl">404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
};

export default App;