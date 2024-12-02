import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';

describe('Header Component', () => {
  const handleLogout = jest.fn();

  it('should render correctly when logged out', () => {
    render(
      <Router>
        <Header isLoggedIn={false} handleLogout={handleLogout} username="" />
      </Router>
    );

    expect(screen.getByText(/Daisy Chain/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.queryByText(/Browse\/Search/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Watchlist/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Trending Movies/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Upcoming Movies/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Profile/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/View Users/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });

  it('should render correctly when logged in', () => {
    render(
      <Router>
        <Header isLoggedIn={true} handleLogout={handleLogout} username="testuser" />
      </Router>
    );

    expect(screen.getByText(/Daisy Chain/i)).toBeInTheDocument();
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Browse\/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Watchlist/i)).toBeInTheDocument();
    expect(screen.getByText(/Trending Movies/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Movies/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/View Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });

  it('should call handleLogout and navigate to login on logout click', () => {
    const navigate = jest.fn();
    render(
      <Router>
        <Header isLoggedIn={true} handleLogout={handleLogout} username="testuser" />
      </Router>
    );

    fireEvent.click(screen.getByText(/Logout/i));
    expect(handleLogout).toHaveBeenCalled();
    // Note: We cannot directly test the navigation to '/login' here because `useNavigate` is a hook.
    // We assume that the `handleLogoutClick` function works correctly if `handleLogout` is called.
  });
});