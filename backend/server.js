const express = require('express');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const { format } = require('util');
const authenticate = require('./middleware/authenticate'); // Adjust path if needed
require('dotenv').config();

console.log('Type of authenticate:', typeof authenticate);

const app = express();
const port = process.env.PORT || 5000;

// List of allowed origins
const allowedOrigins = [
  'https://frontend-70v5vmwct-steven-waines-projects.vercel.app',
  'https://frontend-hcc1dvs37-steven-waines-projects.vercel.app'
];

// Use CORS middleware with dynamic origin
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());

// Parse the service account key from the environment variable
const serviceAccountKey = JSON.parse(process.env.GCLOUD_KEY);

// Configure Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  credentials: serviceAccountKey,
});
const bucket = storage.bucket(process.env.GCLOUD_BUCKET_NAME);

// Configure multer to use Google Cloud Storage for storage
const upload = multer({
  storage: multer.memoryStorage(),
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const blob = bucket.file(Date.now().toString() + '-' + req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: req.file.mimetype,
    predefinedAcl: 'publicRead',
  });

  blobStream.on('error', (err) => {
    console.error('Blob stream error:', err);
    res.status(500).send({ error: 'Failed to upload file.' });
  });

  blobStream.on('finish', () => {
    const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    res.status(200).send({ fileUrl: publicUrl });
  });

  blobStream.end(req.file.buffer);
});

// Import Routes
const authRoutes = require('./routes/auth');
const watchlistRoutes = require('./routes/watchlistRoutes');
const movieRoutes = require('./routes/movieRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const userRoutes = require('./routes/userRoutes'); // Ensure userRoutes is imported
const recommendationRoutes = require('./routes/recommendationRoutes'); // Add this line

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', authenticate, watchlistRoutes); // Ensure authentication middleware is used
app.use('/api/movies', movieRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', userRoutes); // Ensure userRoutes is used
app.use('/api/recommendations', authenticate, recommendationRoutes); // Add this line

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});