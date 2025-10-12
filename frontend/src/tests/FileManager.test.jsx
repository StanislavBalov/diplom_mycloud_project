import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store'; // ← правильный импорт из store/index.js
import FileManager from './FileManager';

// Мокаем API, если нужно (опционально)
// jest.mock('../api');

describe('FileManager Component', () => {
  test('renders file manager header', () => {
    render(
      <Provider store={store}>
        <FileManager />
      </Provider>
    );

    // Проверяем, что заголовок отображается
    expect(screen.getByText(/Моё хранилище/i)).toBeInTheDocument();

    // Проверяем наличие dropzone (по тексту или роли)
    expect(
      screen.getByText(/Перетащите файлы сюда или кликните для выбора/i)
    ).toBeInTheDocument();
  });

  test('displays empty state when no files', () => {
    render(
      <Provider store={store}>
        <FileManager />
      </Provider>
    );

    // Если в сторе нет файлов — должна быть надпись "Папка пуста"
    // (после обновления UI — мы добавили этот блок)
    expect(screen.queryByText(/Папка пуста/i)).toBeInTheDocument();
  });

  // Пример асинхронного теста — если будешь мокать загрузку файлов
  /*
  test('loads and displays files', async () => {
    render(
      <Provider store={store}>
        <FileManager />
      </Provider>
    );

    // Ждём появления файла (если мокаем API и добавляем файлы в стор)
    await waitFor(() => {
      expect(screen.getByText('example.txt')).toBeInTheDocument();
    });
  });
  */
});