import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

const API_KEY = '8feb4db25b7185d740785fc6b6f0e850'; // Replace with your API key
const BASE_URL = 'https://api.themoviedb.org/3';

const MovieCollage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      let allMovies = [];
      let totalPosters = 0;
      let page = 1;

      while (totalPosters < 30) {
        try {
          const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
            params: { api_key: API_KEY, page },
          });

          allMovies = [...allMovies, ...response.data.results];
          const posters = allMovies.filter(movie => movie.poster_path);
          totalPosters = posters.length;

          if (totalPosters >= 30) {
            const uniquePosters = Array.from(new Map(posters.map(movie => [movie.id, movie])).values());
            setMovies(uniquePosters.slice(0, 30));
            console.log('Movies fetched:', uniquePosters.slice(0, 30)); // Add this line
            return;
          }

          page += 1;
        } catch (error) {
          console.error('Error fetching movies:', error);
          break;
        }
      }
    };

    fetchRandomMovies();
  }, []);

  return (
    <div className="movie-collage">
      {movies.map((movie) => {
        const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        console.log(imageUrl); // Log the image URL
        return (
          <img
            key={movie.id}
            src={imageUrl}
            alt={movie.title}
            className="collage-image"
          />
        );
      })}
    </div>
  );
};

export default MovieCollage;