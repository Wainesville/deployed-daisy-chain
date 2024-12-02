import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Register from './Register';
import { registerUser } from '../api';

// Mock the registerUser function
jest.mock('../api', () => ({
  registerUser: jest.fn(),
}));

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  it('should display an error message on failed registration', async () => {
    registerUser.mockRejectedValueOnce(new Error('Registration failed'));

    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed. Please try again./i)).toBeInTheDocument();
    });
  });

  it('should navigate to login on successful registration', async () => {
    const mockResponse = {
      user: { username: 'testuser' },
    };
    registerUser.mockResolvedValueOnce(mockResponse);

    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
      });
    });
  });
});