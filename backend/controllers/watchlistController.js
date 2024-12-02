const pool = require('../db');

// Add to watchlist
const addToWatchlist = async (req, res) => {
  const { movieId, title, poster } = req.body;
  const userId = req.user.id; // Use the authenticated user's ID

  try {
    console.log('Adding to watchlist:', { userId, movieId, title, poster });

    // Check if the movie already exists in the database
    const movieCheck = await pool.query('SELECT * FROM movies WHERE id = $1', [movieId]);
    if (movieCheck.rows.length === 0) {
      // Insert the movie into the movies table if it doesn't exist
      await pool.query(
        'INSERT INTO movies (id, title, thumbnail) VALUES ($1, $2, $3)',
        [movieId, title, poster]
      );
    }

    // Add the movie to the watchlist
    const result = await pool.query(
      'INSERT INTO watchlist (user_id, movie_id, title, poster) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, movieId, title, poster]
    );
    console.log('Added to watchlist:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
};

// Remove from watchlist
const removeFromWatchlist = async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id; // Use the authenticated user's ID

  try {
    console.log('Removing from watchlist:', { userId, movieId });
    await pool.query('DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2', [userId, movieId]);
    res.status(204).send();
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
};

// Get watchlist
const getWatchlist = async (req, res) => {
  const userId = req.user.id; // Use the authenticated user's ID

  try {
    console.log('Fetching watchlist for user:', userId);
    const result = await pool.query('SELECT * FROM watchlist WHERE user_id = $1', [userId]);
    console.log('Fetched watchlist:', result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

// Set Currently Watching
const setCurrentlyWatching = async (req, res) => {
  const userId = req.user.id;
  const { movieId } = req.params;

  try {
    console.log('Setting currently watching:', { userId, movieId });
    // Reset currently watching for all movies
    await pool.query('UPDATE watchlist SET currently_watching = false WHERE user_id = $1', [userId]);

    // Set currently watching for the selected movie
    await pool.query('UPDATE watchlist SET currently_watching = true, "order" = 1 WHERE user_id = $1 AND movie_id = $2', [userId, movieId]);

    // Update the order of other movies
    await pool.query('UPDATE watchlist SET "order" = "order" + 1 WHERE user_id = $1 AND movie_id != $2', [userId, movieId]);

    res.status(200).json({ message: 'Currently watching updated' });
  } catch (err) {
    console.error('Error setting currently watching:', err);
    res.status(500).json({ error: 'Failed to set currently watching' });
  }
};

// Set Next Up
const setNextUp = async (req, res) => {
  const userId = req.user.id;
  const { movieId } = req.params;

  try {
    console.log('Setting next up:', { userId, movieId });
    // Reset next up for all movies
    await pool.query('UPDATE watchlist SET next_up = false WHERE user_id = $1', [userId]);

    // Set next up for the selected movie
    await pool.query('UPDATE watchlist SET next_up = true, "order" = 2 WHERE user_id = $1 AND movie_id = $2', [userId, movieId]);

    // Update the order of other movies
    await pool.query('UPDATE watchlist SET "order" = "order" + 1 WHERE user_id = $1 AND movie_id != $2 AND "order" >= 2', [userId, movieId]);

    res.status(200).json({ message: 'Next up updated' });
  } catch (err) {
    console.error('Error setting next up:', err);
    res.status(500).json({ error: 'Failed to set next up' });
  }
};

// Fetch watchlist by user ID
const getWatchlistByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    console.log('Fetching watchlist for user ID:', userId);
    const result = await pool.query('SELECT * FROM watchlist WHERE user_id = $1', [userId]);
    console.log('Fetched watchlist:', result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching watchlist:', err);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  getWatchlistByUserId,
  removeFromWatchlist,
  setCurrentlyWatching,
  setNextUp,
};