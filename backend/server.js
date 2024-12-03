const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'https://frontend-ciagacfte-steven-waines-projects.vercel.app',
  'https://frontend-two-amber-88.vercel.app',
  'http://localhost:3000', // For local testing
];

// Use Helmet to set security-related HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://vercel.live"],
      connectSrc: ["'self'", "https://vercel.live"],
      imgSrc: ["'self'", "data:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
}));

// Use CORS middleware with dynamic origin
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.options('*', cors()); // Handle preflight requests
app.use(express.json());

// Parse the service account key from the environment variable
let serviceAccountKey;
try {
  serviceAccountKey = JSON.parse(process.env.GCLOUD_KEY);
} catch (error) {
  console.error('Failed to parse GCLOUD_KEY:', error);
  process.exit(1); // Exit the process with an error code
}


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