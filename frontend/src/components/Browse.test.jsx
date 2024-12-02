import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Browse from './Browse';

describe('Browse Component', () => {
  const mockMovies = [
    { id: 1, title: 'Movie 1', poster_path: '/path1.jpg' },
    { id: 2, title: 'Movie 2', poster_path: '/path2.jpg' },
  ];

  const mockGenres = [{ id: 1, name: 'Genre 1' }];

  it('should render without errors', () => {
    render(<Browse searchResults={[]} genreMovies={[]} genres={[]} selectedGenre={null} openModal={jest.fn()} />);
    expect(screen.getByText(/Select a Genre/i)).toBeInTheDocument();
    expect(screen.getByText(/Search Movies/i)).toBeInTheDocument();
  });


});