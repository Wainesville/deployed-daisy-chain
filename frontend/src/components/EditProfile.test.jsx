import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import EditProfile from './EditProfile';
import { BrowserRouter as Router } from 'react-router-dom';

// Create a mock instance of axios
const mock = new MockAdapter(axios);

describe('EditProfile Component', () => {
  beforeEach(() => {
    // Mock the API responses
    mock.onGet('http://localhost:5000/api/users/profile').reply(200, {
      username: 'testuser',
      profile_picture: 'http://example.com/profile.jpg',
      bio: 'This is a test bio',
      favorite_genres: ['Action', 'Comedy'],
      top_movies: [1, 2, 3, 4, 5],
    });

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

    mock.onGet('https://api.themoviedb.org/3/genre/movie/list').reply(200, {
      genres: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Comedy' },
        { id: 3, name: 'Drama' },
      ],
    });
  });

  afterEach(() => {
    mock.reset();
  });

  it('should render without errors', async () => {
    render(
      <Router>
        <EditProfile />
      </Router>
    );

    // Wait for the profile data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
    });

    // Check that the profile picture is rendered
    expect(screen.getByAltText(/Profile/i)).toBeInTheDocument();

    // Check that the bio is rendered
    expect(screen.getByText(/This is a test bio/i)).toBeInTheDocument();

    // Check that the favorite genres are rendered
    expect(screen.getByLabelText(/Action/i)).toBeChecked();
    expect(screen.getByLabelText(/Comedy/i)).toBeChecked();
    expect(screen.getByLabelText(/Drama/i)).not.toBeChecked();

    // Check that the top movies are rendered
    expect(screen.getByText(/1. Movie 1/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Movie 2/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Movie 3/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Movie 4/i)).toBeInTheDocument();
    expect(screen.getByText(/5. Movie 5/i)).toBeInTheDocument();
  });

  it('should update the profile picture', async () => {
    render(
      <Router>
        <EditProfile />
      </Router>
    );

    // Wait for the profile data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
    });

    // Update the profile picture
    const profilePictureInput = screen.getByLabelText(/Profile Picture URL/i);
    fireEvent.change(profilePictureInput, { target: { value: 'http://example.com/new-profile.jpg' } });

    // Check that the profile picture is updated
    expect(profilePictureInput.value).toBe('http://example.com/new-profile.jpg');
  });

  it('should update the bio', async () => {
    render(
      <Router>
        <EditProfile />
      </Router>
    );

    // Wait for the profile data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
    });

    // Update the bio
    const bioTextarea = screen.getByLabelText(/Bio/i);
    fireEvent.change(bioTextarea, { target: { value: 'This is an updated bio' } });

    // Check that the bio is updated
    expect(bioTextarea.value).toBe('This is an updated bio');
  });

  it('should update the favorite genres', async () => {
    render(
      <Router>
        <EditProfile />
      </Router>
    );

    // Wait for the profile data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
    });

    // Update the favorite genres
    const dramaCheckbox = screen.getByLabelText(/Drama/i);
    fireEvent.click(dramaCheckbox);

    // Check that the favorite genres are updated
    expect(dramaCheckbox).toBeChecked();
  });

  it('should update the top movies', async () => {
    render(
      <Router>
        <EditProfile />
      </Router>
    );

    // Wait for the profile data to be loaded
    await waitFor(() => {
      expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
    });

    // Update the top movies
    const searchInput = screen.getByPlaceholderText(/Search for movie 1/i);
    fireEvent.change(searchInput, { target: { value: 'New Movie' } });
    fireEvent.click(screen.getByText(/Search/i));

    // Mock the search results
    mock.onGet('https://api.themoviedb.org/3/search/movie').reply(200, {
      results: [
        { id: 6, title: 'New Movie', poster_path: '/newpath.jpg' },
      ],
    });

    // Wait for the search results to be loaded
    await waitFor(() => {
      expect(screen.getByText(/New Movie/i)).toBeInTheDocument();
    });

    // Add the new movie to the top movies
    fireEvent.click(screen.getByText(/Add/i));

    // Check that the top movies are updated
    expect(screen.getByText(/1. New Movie/i)).toBeInTheDocument();
  });
});