import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';

describe('Register Component', () => {
  test('renders registration form with all fields and buttons', () => {
    render(<Register />);

    expect(screen.getByText(/Регистрация/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Ваше имя/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/example@mail.com/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/••••••••/i)).toHaveLength(2); 

    expect(screen.getByRole('button', { name: /Зарегистрироваться/i })).toBeInTheDocument();

    expect(screen.getByText(/Войти/i)).toBeInTheDocument();
  });

  test('allows user to fill in all form fields', () => {
    render(<Register />);

    const nameInput = screen.getByPlaceholderText(/Ваше имя/i);
    const emailInput = screen.getByPlaceholderText(/example@mail.com/i);
    const passwordInput = screen.getAllByPlaceholderText(/••••••••/i)[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText(/••••••••/i)[1];

    fireEvent.change(nameInput, { target: { value: 'Иван Иванов' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    expect(nameInput).toHaveValue('Иван Иванов');
    expect(emailInput).toHaveValue('ivan@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  test('shows error if passwords do not match', async () => {
    render(<Register />);

    const passwordInput = screen.getAllByPlaceholderText(/••••••••/i)[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText(/••••••••/i)[1];
    const submitButton = screen.getByRole('button', { name: /Зарегистрироваться/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Пароли не совпадают/i)).toBeInTheDocument();
    });
  });

  test('shows error if password is too short', async () => {
    render(<Register />);

    const nameInput = screen.getByPlaceholderText(/Ваше имя/i);
    const emailInput = screen.getByPlaceholderText(/example@mail.com/i);
    const passwordInput = screen.getAllByPlaceholderText(/••••••••/i)[0];
    const confirmPasswordInput = screen.getAllByPlaceholderText(/••••••••/i)[1];
    const submitButton = screen.getByRole('button', { name: /Зарегистрироваться/i });

    fireEvent.change(nameInput, { target: { value: 'Иван' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Пароль должен быть не менее 8 символов/i)).toBeInTheDocument();
    });
  });

});