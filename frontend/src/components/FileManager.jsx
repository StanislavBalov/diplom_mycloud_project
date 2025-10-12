import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import api from "../api";
import { useDispatch, useSelector } from "react-redux";
import { setFiles, addFile } from "../store/filesSlice";
import FileRow from "./FileRow";
import { useTheme } from "../context/ThemeContext";
import {
  FaFolder,
  FaUpload,
  FaSync,
  FaCloudUploadAlt,
  FaFile,
} from "react-icons/fa";

const FileManager = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const files = useSelector((s) => s.files.list);
  const [uploadProgress, setUploadProgress] = useState({});
  const [currentPath, setCurrentPath] = useState("/");

  async function loadFiles() {
    try {
      const res = await api.get("/storage/files/");
      dispatch(setFiles(res.data));
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else {
        toast.error("Ошибка загрузки списка файлов");
        console.error(err);
      }
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);

    try {
      await api.post("/storage/files/upload/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress((prev) => ({ ...prev, [file.name]: percent }));
        },
      });
      setUploadProgress((prev) => {
        const newState = { ...prev };
        delete newState[file.name];
        return newState;
      });
      toast.success(`Файл "${file.name}" успешно загружен`);
      loadFiles();
    } catch (err) {
      setUploadProgress((prev) => {
        const newState = { ...prev };
        delete newState[file.name];
        return newState;
      });
      toast.error(`Ошибка загрузки файла "${file.name}"`);
      console.error(err);
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(uploadFile);
    },
    multiple: true,
  });

  const renderBreadcrumbs = () => {
    const parts = currentPath.split("/").filter((part) => part.length > 0);
    const breadcrumbs = parts.map((part, index) => {
      const pathUpToHere = "/" + parts.slice(0, index + 1).join("/");
      return (
        <span key={index} className="flex items-center">
          <button
            onClick={() => setCurrentPath(pathUpToHere)}
            className="text-blue-500 hover:underline font-medium focus:outline-none flex items-center dark:text-blue-400"
          >
            <FaFolder className="mr-1 text-yellow-600 dark:text-yellow-400" size={14} />
            {part}
          </button>
          {index < parts.length - 1 && (
            <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
          )}
        </span>
      );
    });

    return (
      <div className="flex items-center flex-wrap gap-x-1 text-sm mb-4">
        <button
          onClick={() => setCurrentPath("/")}
          className="text-blue-500 hover:underline font-medium focus:outline-none flex items-center dark:text-blue-400"
          aria-label="Home"
        >
          <FaFolder className="mr-1 text-yellow-600 dark:text-yellow-400" size={14} />
          Home
        </button>
        {breadcrumbs.length > 0 && (
          <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
        )}
        {breadcrumbs}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-theme-primary flex items-center mb-2">
            <FaFolder className="mr-2 text-yellow-600 dark:text-yellow-400" />
            Моё хранилище
          </h2>
          {renderBreadcrumbs()}
        </div>

        <button
          onClick={loadFiles}
          className="p-2 rounded bg-theme-secondary text-theme-primary hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center"
          aria-label="Обновить"
        >
          <FaSync />
        </button>
      </div>

      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition mb-6 flex flex-col items-center justify-center ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-theme bg-bg-secondary"
        }`}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="text-4xl text-gray-500 dark:text-gray-400 mb-3" />
        {isDragActive ? (
          <p className="text-theme-primary font-medium">
            Отпустите файлы для загрузки...
          </p>
        ) : (
          <p className="text-theme-secondary">
            Перетащите файлы сюда или кликните для выбора
          </p>
        )}
      </div>

      {files.length > 0 ? (
        <div className="bg-card rounded-lg shadow overflow-hidden border border-theme">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-theme">
              <thead className="bg-bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    <FaFile className="inline mr-1" /> Имя
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Размер
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Комментарий
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Загружен
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-theme-secondary uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme">
                {files.map((f) => (
                  <FileRow key={f.id} file={f} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg border border-theme">
          <FaFolder className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-4 text-lg font-medium text-theme-primary">Папка пуста</h3>
          <p className="mt-2 text-theme-secondary">
            Загрузите файлы, перетащив их в область выше
          </p>
        </div>
      )}

      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-8 p-4 bg-card rounded-lg border border-theme">
          <h3 className="font-medium text-theme-primary mb-4 flex items-center">
            <FaUpload className="mr-2" /> Загрузка файлов
          </h3>
          <div className="space-y-3">
            {Object.entries(uploadProgress).map(([name, percent]) => (
              <div key={name} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-theme-primary truncate max-w-xs">{name}</span>
                  <span className="text-theme-secondary">{percent}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;