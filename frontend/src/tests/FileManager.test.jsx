import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store'; 
import FileManager from './FileManager';

describe('FileManager Component', () => {
  test('renders file manager header', () => {
    render(
      <Provider store={store}>
        <FileManager />
      </Provider>
    );

    expect(screen.getByText(/Моё хранилище/i)).toBeInTheDocument();

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

    expect(screen.queryByText(/Папка пуста/i)).toBeInTheDocument();
  });

});