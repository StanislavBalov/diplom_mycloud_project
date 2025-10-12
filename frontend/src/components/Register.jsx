import React, { useState } from 'react';
import { postJson } from '../api';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaUserPlus } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const usernameRe = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
const passwordReUpper = /[A-Z]/;
const passwordReDigit = /\d/;
const passwordReSpecial = /[^A-Za-z0-9]/;
const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function Register() {
  const { darkMode } = useTheme();
  const [data, setData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  function validate() {
    const e = {};
    if (!usernameRe.test(data.username)) {
      e.username = 'Логин: 4–20 символов, латинские буквы и цифры, первый символ — буква';
    }
    if (!emailRe.test(data.email)) {
      e.email = 'Неверный формат email';
    }
    const p = data.password;
    if (p.length < 6) {
      e.password = 'Пароль должен содержать минимум 6 символов';
    }
    if (!passwordReUpper.test(p)) {
      e.password = (e.password ? e.password + '; ' : '') + 'заглавную букву';
    }
    if (!passwordReDigit.test(p)) {
      e.password = (e.password ? e.password + '; ' : '') + 'цифру';
    }
    if (!passwordReSpecial.test(p)) {
      e.password = (e.password ? e.password + '; ' : '') + 'спецсимвол';
    }
    if (e.password && !p.length < 6) {
      e.password = 'Пароль должен содержать: ' + e.password;
    }
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) {
      toast.error('Проверьте поля формы');
      return;
    }

    setIsLoading(true);
    setServerMsg(null);

    try {
      const { res, body } = await postJson('/auth/register/', data);
      if (res.ok) {
        toast.success('Регистрация успешна! Переходим к входу...');
        setServerMsg('Пользователь создан. Через несколько секунд вы будете перенаправлены.');
        setTimeout(() => nav('/login'), 1500);
      } else {
        setServerMsg(body.detail || 'Ошибка регистрации');
        toast.error('Ошибка регистрации');
      }
    } catch (error) {
      setServerMsg('Ошибка подключения к серверу');
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
            <FaUserPlus className="text-5xl text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-theme-primary">MyCloud</h1>
          <p className="text-theme-secondary mt-2">Создайте аккаунт, чтобы получить доступ к файлам</p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-8 border border-theme">
          <h2 className="text-2xl font-bold text-center text-theme-primary mb-6">Регистрация</h2>

          {serverMsg && (
            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 text-sm">
              <strong>Информация:</strong> {typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg)}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-theme-primary mb-2">
                <FaUser className="inline mr-2 text-gray-500 dark:text-gray-400" />
                Логин
              </label>
              <input
                id="username"
                type="text"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                className="w-full px-4 py-3 border border-theme rounded-lg bg-bg-primary text-theme-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="john_doe"
                required
                autoComplete="username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-theme-primary mb-2">
                <FaIdCard className="inline mr-2 text-gray-500 dark:text-gray-400" />
                Полное имя
              </label>
              <input
                id="full_name"
                type="text"
                value={data.full_name}
                onChange={(e) => setData({ ...data, full_name: e.target.value })}
                className="w-full px-4 py-3 border border-theme rounded-lg bg-bg-primary text-theme-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Иван Иванов"
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-theme-primary mb-2">
                <FaEnvelope className="inline mr-2 text-gray-500 dark:text-gray-400" />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full px-4 py-3 border border-theme rounded-lg bg-bg-primary text-theme-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="example@mail.com"
                required
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-theme-primary mb-2">
                <FaLock className="inline mr-2 text-gray-500 dark:text-gray-400" />
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="w-full px-4 py-3 border border-theme rounded-lg bg-bg-primary text-theme-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Регистрация...
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" />
                  Зарегистрироваться
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-theme-secondary text-sm">
              Уже есть аккаунт?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">
                Войти
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