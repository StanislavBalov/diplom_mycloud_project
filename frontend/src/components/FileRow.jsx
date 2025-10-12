import React, { useState } from "react";
import api from "../api";
import { useDispatch } from "react-redux";
import { removeFile, updateFile } from "../store/filesSlice";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaCheck,
  FaTimes,
  FaLink,
  FaTrash,
  FaCopy,
  FaFile,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

export default function FileRow({ file }) {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.original_name || file.name);
  const [newComment, setNewComment] = useState(file.comment || "");

  async function deleteFile() {
    if (!window.confirm(`Удалить файл "${file.original_name}"?`)) return;
    try {
      await api.delete(`/storage/files/${file.id}/`);
      dispatch(removeFile(file.id));
      toast.success("Файл удалён");
    } catch (err) {
      toast.error("Ошибка при удалении файла");
      console.error(err);
    }
  }

  async function renameFile() {
    if (!newName.trim()) {
      toast.error("Имя файла не может быть пустым");
      return;
    }
    try {
      const res = await api.put(`/storage/files/${file.id}/rename/`, {
        new_name: newName,
      });
      dispatch(updateFile(res.data));
      toast.success("Файл переименован");
      setIsRenaming(false);
    } catch (err) {
      toast.error("Ошибка при переименовании");
      console.error(err);
    }
  }

  async function updateComment() {
    try {
      const res = await api.put(`/storage/files/${file.id}/comment/`, {
        comment: newComment,
      });
      dispatch(updateFile(res.data));
      toast.success("Комментарий обновлён");
    } catch (err) {
      toast.error("Ошибка при обновлении комментария");
      console.error(err);
    }
  }

  async function copyLink() {
    try {
      const res = await api.post(`/storage/files/${file.id}/share/`);
      const url = `${window.location.origin}/storage/public/${res.data.token}/`;
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована в буфер обмена", {
        icon: <FaLink className="text-purple-500" />,
      });
    } catch (err) {
      toast.error("Ошибка при генерации ссылки");
      console.error(err);
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Б";
    const k = 1024;
    const sizes = ["Б", "КБ", "МБ", "ГБ"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <tr className="border-b border-theme hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <FaFile className="mr-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={renameFile}
              onKeyPress={(e) => e.key === "Enter" && renameFile()}
              className="border border-theme rounded px-2 py-1 bg-bg-primary text-theme-primary w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <span className="font-medium text-theme-primary">{file.original_name}</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-theme-primary">
        {formatFileSize(file.size)}
      </td>
      <td className="px-6 py-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onBlur={updateComment}
          onKeyPress={(e) => e.key === "Enter" && updateComment()}
          className="border border-theme rounded px-2 py-1 bg-bg-primary text-theme-primary text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full max-w-xs"
          placeholder="Добавить комментарий"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-theme-secondary text-sm">
        {formatDate(file.uploaded_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
        {isRenaming ? (
          <>
            <button
              onClick={renameFile}
              className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 rounded transition"
              title="Сохранить"
            >
              <FaCheck size={16} />
            </button>
            <button
              onClick={() => {
                setIsRenaming(false);
                setNewName(file.original_name || file.name);
              }}
              className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 rounded transition"
              title="Отменить"
            >
              <FaTimes size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsRenaming(true)}
              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded transition"
              title="Переименовать"
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={copyLink}
              className="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 rounded transition"
              title="Скопировать публичную ссылку"
            >
              <FaLink size={16} />
            </button>
            <button
              onClick={deleteFile}
              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded transition"
              title="Удалить файл"
            >
              <FaTrash size={16} />
            </button>
          </>
        )}
      </td>
    </tr>
  );
}