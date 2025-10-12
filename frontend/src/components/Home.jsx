import React from 'react';
import { FaCloud, FaUpload, FaDownload, FaEdit, FaLink, FaFolder } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { darkMode } = useTheme();

  return (
    <div className="min-h-screen bg-bg-primary p-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16 px-4 bg-card rounded-2xl shadow-lg border border-theme">
          <div className="mb-6">
            <FaCloud className="text-6xl text-blue-500 dark:text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-theme-primary mb-4">
              My<span className="text-blue-600 dark:text-blue-400">Cloud</span>
            </h1>
            <p className="text-xl text-theme-secondary max-w-2xl mx-auto leading-relaxed">
              Простое и удобное облачное хранилище для ваших файлов. Загружайте, скачивайте, делитесь — всё в одном месте.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/files"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Перейти к файлам
            </a>
            <a
              href="/login"
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Войти
            </a>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <FaUpload className="text-3xl text-green-500" />,
              title: "Загрузка файлов",
              desc: "Перетащите файлы или выберите их через диалог — загрузка начнётся мгновенно.",
            },
            {
              icon: <FaDownload className="text-3xl text-blue-500" />,
              title: "Скачивание",
              desc: "Скачивайте файлы в один клик — быстро и без ограничений.",
            },
            {
              icon: <FaEdit className="text-3xl text-yellow-500" />,
              title: "Переименование",
              desc: "Изменяйте имена файлов прямо в таблице — изменения сохраняются автоматически.",
            },
            {
              icon: <FaLink className="text-3xl text-purple-500" />,
              title: "Публичные ссылки",
              desc: "Генерируйте ссылки для скачивания — делитесь файлами с кем угодно.",
            },
            {
              icon: <FaFolder className="text-3xl text-indigo-500" />,
              title: "Организация",
              desc: "В будущем — папки, сортировка и поиск для удобного управления.",
            },
            {
              icon: <FaCloud className="text-3xl text-cyan-500" />,
              title: "Доступ откуда угодно",
              desc: "Работайте с файлами на любом устройстве — достаточно браузера и интернета.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-card rounded-xl shadow border border-theme hover:shadow-md transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-theme-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-theme-secondary text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-theme-secondary text-sm">
          © 2025 MyCloud. Все права защищены.
        </div>
      </div>
    </div>
  );
}