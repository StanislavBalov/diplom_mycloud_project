import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store'; 
import Login from './Login';

describe('Login Component', () => {
  test('renders login form with all fields and buttons', () => {
    render(
        <Login />
    );

    expect(screen.getByText(/Вход в аккаунт/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/логин или email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Войти/i })).toBeInTheDocument();

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

});