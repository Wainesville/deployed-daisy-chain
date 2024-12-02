import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';
import { loginUser } from '../api';

// Mock the loginUser function
jest.mock('../api', () => ({
  loginUser: jest.fn(),
}));

describe('Login Component', () => {
  const handleLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    render(
      <Router>
        <Login handleLogin={handleLogin} />
      </Router>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('should display an error message on failed login', async () => {
    loginUser.mockRejectedValueOnce(new Error('Login failed'));

    render(
      <Router>
        <Login handleLogin={handleLogin} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login failed. Please check your credentials./i)).toBeInTheDocument();
    });
  });

  it('should call handleLogin and navigate on successful login', async () => {
    const mockResponse = {
      user: { username: 'testuser' },
    };
    loginUser.mockResolvedValueOnce(mockResponse);

    render(
      <Router>
        <Login handleLogin={handleLogin} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith(mockResponse);
    });
  });
});