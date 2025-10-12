import React, { useState } from 'react';
import { postJson } from '../api';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaSignInAlt } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { darkMode } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErr('Введите логин и пароль');
      return;
    }

    setIsLoading(true);
    setErr(null);

    try {
      const { res, body } = await postJson('/auth/login/', { username, password });
      if (res.ok) {
        toast.success('Вход выполнен успешно!');
        nav('/files');
      } else {
        setErr(body.detail || 'Неверный логин или пароль');
        toast.error('Ошибка входа');
      }
    } catch (error) {
      setErr('Ошибка подключения к серверу');
      toast.error('Сервер недоступен');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary px-4 py-8 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaSignInAlt className="text-5xl text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-theme-primary">MyCloud</h1>
          <p className="text-theme-secondary mt-2">Войдите, чтобы получить доступ к файлам</p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-8 border border-theme">
          <h2 className="text-2xl font-bold text-center text-theme-primary mb-6">Вход в аккаунт</h2>

          {err && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              <strong>Ошибка:</strong> {err}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-theme-primary mb-2">
                <FaUser className="inline mr-2 text-gray-500 dark:text-gray-400" />
                Логин или Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-theme rounded-lg bg-bg-primary text-theme-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Введите ваш логин или email"
                required
                autoComplete="username"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-theme-primary mb-2">
                <FaLock className="inline mr-2 text-gray-500 dark:text-gray-400" />
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-theme rounded-lg bg-bg-primary text-theme-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Вход...
                </>
              ) : (
                <>
                  <FaSignInAlt className="mr-2" />
                  Войти
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-theme-secondary text-sm">
              Нет аккаунта?{' '}
              <a href="/register" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">
                Зарегистрироваться
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-theme-secondary text-xs">
          © 2025 MyCloud. Все права защищены.
        </div>
      </div>
    </div>
  );
}