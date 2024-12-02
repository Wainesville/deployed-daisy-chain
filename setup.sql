
### setup.sql

```sql
-- Drop existing tables if they exist
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS review_likes CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS watchlist CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    bio TEXT,
    profile_picture VARCHAR(255),
    profile_visibility BOOLEAN DEFAULT TRUE,
    favorite_genres TEXT[],
    top_movies INTEGER[],
    recommendations INTEGER[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create movies table
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255)
);

-- Create recommendations table
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    movie_id INTEGER,
    recommended_by INTEGER,
    recommended_to INTEGER,
    movie_title VARCHAR(255)
);

-- Create watchlist table
CREATE TABLE watchlist (
    user_id INTEGER NOT NULL REFERENCES users(id),
    movie_id INTEGER NOT NULL REFERENCES movies(id),
    PRIMARY KEY (user_id, movie_id)
);

-- Insert example data into users table
INSERT INTO users (username, password, email, bio, profile_picture, favorite_genres, top_movies, recommendations)
VALUES
('john_doe', 'password123', 'john@example.com', 'Movie enthusiast', 'https://example.com/john.jpg', '{"Action", "Comedy"}', '{1, 2}', '{1, 2}'),
('jane_doe', 'password123', 'jane@example.com', 'Love watching movies', 'https://example.com/jane.jpg', '{"Drama", "Horror"}', '{3, 4}', '{3, 4}');

-- Insert example data into movies table
INSERT INTO movies (title, thumbnail)
VALUES
('Inception', 'https://example.com/inception.jpg'),
('The Dark Knight', 'https://example.com/dark_knight.jpg'),
('Interstellar', 'https://example.com/interstellar.jpg'),
('The Matrix', 'https://example.com/matrix.jpg');

-- Insert example data into recommendations table
INSERT INTO recommendations (user_id, title, content, movie_id, recommended_by, recommended_to, movie_title)
VALUES
(1, 'Great Movie', 'You should watch Inception', 1, 1, 2, 'Inception'),
(2, 'Must Watch', 'The Dark Knight is amazing', 2, 2, 1, 'The Dark Knight');

-- Insert example data into watchlist table
INSERT INTO watchlist (user_id, movie_id)
VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4);