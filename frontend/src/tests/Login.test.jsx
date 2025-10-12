import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store'; // Используем обновлённый store
import Login from './Login';

// Если Login будет использовать Redux (например, dispatch(login)), раскомментируй Provider
// Пока в Login нет dispatch — можно без Provider

describe('Login Component', () => {
  test('renders login form with all fields and buttons', () => {
    render(
      // Пока Login не использует Redux — Provider не обязателен
      // Но если ты добавишь dispatch(login) — раскомментируй:
      // <Provider store={store}>
        <Login />
      // </Provider>
    );

    // Проверяем заголовок
    expect(screen.getByText(/Вход в аккаунт/i)).toBeInTheDocument();

    // Проверяем поля ввода по placeholder или aria-label
    expect(screen.getByPlaceholderText(/логин или email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();

    // Проверяем кнопку входа
    expect(screen.getByRole('button', { name: /Войти/i })).toBeInTheDocument();

    // Проверяем ссылку на регистрацию
    expect(screen.getByText(/Зарегистрироваться/i)).toBeInTheDocument();
  });

  test('allows user to fill in form fields', () => {
    render(<Login />);

    const usernameInput = screen.getByPlaceholderText(/логин или email/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  // Пример асинхронного теста — если ты подключишь Redux и dispatch(login)
  /*
  test('submits form and redirects on successful login', async () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText(/логин или email/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole('button', { name: /Войти/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Ждём редиректа или изменения состояния
    await waitFor(() => {
      // Например, проверяем, что появилось уведомление об успехе
      expect(screen.getByText(/Вход выполнен успешно!/i)).toBeInTheDocument();
    });
  });
  */
});