import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

   const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-200 dark:bg-gray-900 px-4 py-2 flex justify-between items-center border-b">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">ChatBot</h1>
      <div className="flex items-center gap-4">
         <button onClick={handleLogout} className="btn">Logout</button>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;