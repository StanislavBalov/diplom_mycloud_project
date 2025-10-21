import React, { useEffect, useState } from 'react';
import { getJson, del } from '../api';
import { FaUser, FaEnvelope, FaShieldAlt, FaTrash, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    setErr(null);
    try {
      const { res, body } = await getJson('/auth/users/');
      if (res.ok) {
        setUsers(body);
      } else if (res.status === 403) {
        setErr('Доступ запрещён: недостаточно прав администратора');
      } else {
        setErr(`Ошибка загрузки: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      setErr('Не удалось подключиться к серверу');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);
  
  async function removeUser(id, username) {
    if (!window.confirm(`Вы уверены, что хотите удалить пользователя "${username}"?`)) return;

    try {
      const { res } = await del(`/auth/users/${id}/`);
      if (res.ok) {
        toast.success(`Пользователь "${username}" удалён`);
        loadUsers();
      } else {
        toast.error('Не удалось удалить пользователя');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
      console.error(error);
    }
  }

  const handleReload = () => {
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-theme-primary flex items-center">
            <FaShieldAlt className="mr-2 text-red-600 dark:text-red-400" />
            Администрирование — Пользователи
          </h2>
          <button
            onClick={handleReload}
            className="p-2 rounded bg-theme-secondary text-theme-primary hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center"
            aria-label="Обновить"
          >
            <FaSync className={`${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {err && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
            <FaExclamationTriangle className="text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800 dark:text-red-200">Ошибка</h3>
              <p className="text-red-700 dark:text-red-300 text-sm">{err}</p>
            </div>
          </div>
        )}

        {loading && !err && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="overflow-x-auto bg-card rounded-lg shadow border border-theme">
            <table className="min-w-full divide-y divide-theme">
              <thead className="bg-bg-secondary">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <FaUser className="inline mr-1" /> Логин
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Имя
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <FaEnvelope className="inline mr-1" /> Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <FaShieldAlt className="inline mr-1" /> Админ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">
                      {u.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                      {u.full_name || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                      {u.email || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.is_administrator
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {u.is_administrator ? 'Да' : 'Нет'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => removeUser(u.id, u.username)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center transition"
                        aria-label={`Удалить пользователя ${u.username}`}
                      >
                        <FaTrash className="mr-1" /> Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && users.length === 0 && !err && (
          <div className="text-center py-10 bg-card rounded-lg border border-theme">
            <FaUser className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-theme-primary">Пользователи не найдены</h3>
            <p className="mt-1 text-sm text-theme-secondary">Список пользователей пуст.</p>
          </div>
        )}
      </div>
    </div>
  );
}