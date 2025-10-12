import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCloud, FaBars, FaTimes, FaFolder, FaShieldAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { darkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/files", label: "Файлы", icon: <FaFolder /> },
    { to: "/admin", label: "Админ", icon: <FaShieldAlt /> },
    { to: "/login", label: "Вход", icon: <FaSignInAlt /> },
    { to: "/register", label: "Регистрация", icon: <FaUserPlus /> },
  ];

  return (
    <nav className="bg-card shadow-sm border-b border-theme sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaCloud className="text-2xl text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-theme-primary">MyCloud</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="px-3 py-2 rounded-md text-sm font-medium text-theme-secondary hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center"
              >
                <span className="mr-1">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-theme-secondary hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Открыть меню</span>
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-theme">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="block px-3 py-2 rounded-md text-base font-medium text-theme-secondary hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}