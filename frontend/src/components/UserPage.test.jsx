import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom';
import UserPage from './UserPage';

// Create a mock instance of axios
const mock = new MockAdapter(axios);

describe('UserPage Component', () => {
  beforeEach(() => {
    // Mock the API responses
    mock.onGet('http://localhost:5000/api/users/testuser').reply(200, {
      id: 1,
      username: 'testuser',
      profile_picture: 'http://example.com/profile.jpg',
      bio: 'This is a test bio',
      favorite_genres: ['Action', 'Comedy'],
      top_movies: [1, 2, 3, 4, 5],
      recommendations: [1, 2],
    });

    mock.onGet('http://localhost:5000/api/watchlist/1').reply(200, [
      { movie_id: 1, title: 'Movie 1', poster: '/path1.jpg' },
      { movie_id: 2, title: 'Movie 2', poster: '/path2.jpg' },
    ]);

    mock.onGet('https://api.themoviedb.org/3/movie/1').reply(200, {
      id: 1,
      title: 'Movie 1',
      poster_path: '/path1.jpg',
    });

    mock.onGet('https://api.themoviedb.org/3/movie/2').reply(200, {
      id: 2,
      title: 'Movie 2',
      poster_path: '/path2.jpg',
    });

    mock.onGet('https://api.themoviedb.org/3/movie/3').reply(200, {
      id: 3,
      title: 'Movie 3',
      poster_path: '/path3.jpg',
    });

    mock.onGet('https://api.themoviedb.org/3/movie/4').reply(200, {
      id: 4,
      title: 'Movie 4',
      poster_path: '/path4.jpg',
    });

    mock.onGet('https://api.themoviedb.org/3/movie/5').reply(200, {
      id: 5,
      title: 'Movie 5',
      poster_path: '/path5.jpg',
    });

    mock.onPost('http://localhost:5000/api/recommendations/remove').reply(200);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should render without errors', async () => {
    render(
      <Router>
        <UserPage />
      </Router>
    );

    // Wait for the user data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    });

    // Check that the profile picture is rendered
    expect(screen.getByAltText(/testuser's profile/i)).toBeInTheDocument();

    // Check that the bio is rendered
    expect(screen.getByText(/This is a test bio/i)).toBeInTheDocument();

    // Check that the favorite genres are rendered
    expect(screen.getByText(/Favorite Genres: Action, Comedy/i)).toBeInTheDocument();

    // Check that the top movies are rendered
    expect(screen.getByText(/1. Movie 1/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Movie 2/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Movie 3/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Movie 4/i)).toBeInTheDocument();
    expect(screen.getByText(/5. Movie 5/i)).toBeInTheDocument();

    // Check that the recommendations are rendered
    expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
    expect(screen.getByText(/Movie 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Movie 2/i)).toBeInTheDocument();

    // Check that the currently watching movie is rendered
    expect(screen.getByText(/Currently Watching/i)).toBeInTheDocument();
    expect(screen.getByText(/Movie 1/i)).toBeInTheDocument();

    // Check that the up next movie is rendered
    expect(screen.getByText(/Up Next/i)).toBeInTheDocument();
    expect(screen.getByText(/Movie 2/i)).toBeInTheDocument();
  });

  it('should open and close the modal', async () => {
    render(
      <Router>
        <UserPage />
      </Router>
    );

    // Wait for the user data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    });

    // Open the modal
    fireEvent.click(screen.getAllByText(/Movie 1/i)[0]);
    expect(screen.getByText(/Movie Info/i)).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Movie Info/i)).not.toBeInTheDocument();
    });
  });

  it('should remove a recommendation', async () => {
    render(
      <Router>
        <UserPage />
      </Router>
    );

    // Wait for the user data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
    });

    // Remove a recommendation
    fireEvent.click(screen.getAllByText(/Remove/i)[0]);
    await waitFor(() => {
      expect(screen.queryByText(/Movie 1/i)).not.toBeInTheDocument();
    });
  });
});