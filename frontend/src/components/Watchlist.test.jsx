import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import Watchlist from './Watchlist';

// Create a mock instance of axios
const mock = new MockAdapter(axios);

describe('Watchlist Component', () => {
  beforeEach(() => {
    // Mock the API responses
    mock.onGet('http://localhost:5000/api/watchlist').reply(200, [
      { movie_id: 1, title: 'Movie 1', poster: '/path1.jpg' },
      { movie_id: 2, title: 'Movie 2', poster: '/path2.jpg' },
    ]);

    mock.onPut('http://localhost:5000/api/watchlist/currently-watching/1').reply(200);
    mock.onPut('http://localhost:5000/api/watchlist/next-up/2').reply(200);
    mock.onDelete('http://localhost:5000/api/watchlist/remove/1').reply(200);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should render without errors', async () => {
    render(
      <Router>
        <Watchlist />
      </Router>
    );

    // Wait for the watchlist data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Your Watchlist/i)).toBeInTheDocument();
    });

    // Check that the movies are rendered
    expect(screen.getByText(/Movie 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Movie 2/i)).toBeInTheDocument();
  });

  it('should remove a movie from the watchlist', async () => {
    render(
      <Router>
        <Watchlist />
      </Router>
    );

    // Wait for the watchlist data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Your Watchlist/i)).toBeInTheDocument();
    });

    // Remove a movie from the watchlist
    fireEvent.click(screen.getAllByText(/Remove/i)[0]);
    await waitFor(() => {
      expect(screen.queryByText(/Movie 1/i)).not.toBeInTheDocument();
    });
  });

  it('should set a movie as currently watching', async () => {
    render(
      <Router>
        <Watchlist />
      </Router>
    );

    // Wait for the watchlist data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Your Watchlist/i)).toBeInTheDocument();
    });

    // Set a movie as currently watching
    fireEvent.click(screen.getAllByText(/Currently Watching/i)[0]);
    await waitFor(() => {
      expect(screen.getByText(/Remove from Currently Watching/i)).toBeInTheDocument();
    });
  });

  it('should set a movie as next up', async () => {
    render(
      <Router>
        <Watchlist />
      </Router>
    );

    // Wait for the watchlist data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Your Watchlist/i)).toBeInTheDocument();
    });

    // Set a movie as next up
    fireEvent.click(screen.getAllByText(/Next Up/i)[0]);
    await waitFor(() => {
      expect(screen.getByText(/Remove from Next Up/i)).toBeInTheDocument();
    });
  });
});