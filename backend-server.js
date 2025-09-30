// server.js - Node.js Express Backend for Precision Agriculture Demo
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const csv = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// CSV Writer setup
const csvWriter = csv({
  path: 'analysis_results.csv',
  header: [
    { id: 'filename', title: 'Filename' },
    { id: 'timestamp', title: 'Timestamp' },
    { id: 'classification', title: 'Classification' }
  ],
  append: true
});

// Initialize CSV file with headers if it doesn't exist
if (!fs.existsSync('analysis_results.csv')) {
  fs.writeFileSync('analysis_results.csv', 'Filename,Timestamp,Classification\n');
}

// Google Sheets Configuration (Optional)
// To enable Google Sheets integration:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable Google Sheets API
// 4. Create credentials (Service Account)
// 5. Download credentials.json and place in project root
// 6. Share your Google Sheet with the service account email
// 7. Set GOOGLE_SHEETS_ID in .env file

let sheets = null;
let auth = null;

// Initialize Google Sheets API (if credentials available)
async function initGoogleSheets() {
  try {
    if (fs.existsSync('./credentials.json')) {
      const credentials = JSON.parse(fs.readFileSync('./credentials.json'));
      auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      sheets = google.sheets({ version: 'v4', auth });
      console.log('✅ Google Sheets API initialized successfully');
      return true;
    } else {
      console.log('ℹ️  No credentials.json found. Google Sheets integration disabled.');
      console.log('   Results will be saved to CSV only.');
      return false;
    }
  } catch (error) {
    console.error('❌ Error initializing Google Sheets:', error.message);
    return false;
  }
}

// Save to Google Sheets
async function saveToGoogleSheets(data) {
  if (!sheets) return false;
  
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      console.log('ℹ️  GOOGLE_SHEETS_ID not set in environment variables');
      return false;
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'Sheet1!A:C',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[data.filename, data.timestamp, data.classification]]
      }
    });
    
    console.log('✅ Data saved to Google Sheets');
    return true;
  } catch (error) {
    console.error('❌ Error saving to Google Sheets:', error.message);
    return false;
  }
}

// Mock AI Classification (simulates disease detection)
function mockAIClassification() {
  const classifications = ['Healthy', 'Mild Infection', 'Severe Infection'];
  const weights = [0.5, 0.3, 0.2]; // 50% healthy, 30% mild, 20% severe
  
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < classifications.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return classifications[i];
    }
  }
  
  return classifications[0];
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Precision Agriculture API is running',
    googleSheets: sheets !== null
  });
});

// Upload and analyze image
app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI classification
    const classification = mockAIClassification();
    
    const result = {
      id: Date.now(),
      filename: req.file.originalname,
      storedFilename: req.file.filename,
      timestamp: new Date().toISOString(),
      classification: classification,
      imageUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size
    };

    // Save to CSV
    await csvWriter.writeRecords([{
      filename: result.filename,
      timestamp: result.timestamp,
      classification: result.classification
    }]);
    console.log('✅ Data saved to CSV');

    // Save to Google Sheets (if available)
    await saveToGoogleSheets(result);

    res.json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ 
      error: 'Failed to process image',
      message: error.message 
    });
  }
});

// Get all analysis results
app.get('/api/results', (req, res) => {
  try {
    if (!fs.existsSync('analysis_results.csv')) {
      return res.json({ results: [] });
    }

    const csvContent = fs.readFileSync('analysis_results.csv', 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    // Skip header and parse data
    const results = lines.slice(1).map((line, index) => {
      const [filename, timestamp, classification] = line.split(',');
      return {
        id: index,
        filename: filename,
        timestamp: timestamp,
        classification: classification
      };
    }).reverse(); // Most recent first

    res.json({ results: results });

  } catch (error) {
    console.error('Error reading results:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve results',
      message: error.message 
    });
  }
});

// Get statistics
app.get('/api/statistics', (req, res) => {
  try {
    if (!fs.existsSync('analysis_results.csv')) {
      return res.json({ 
        total: 0,
        healthy: 0,
        mildInfection: 0,
        severeInfection: 0
      });
    }

    const csvContent = fs.readFileSync('analysis_results.csv', 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    const stats = {
      total: lines.length - 1, // Exclude header
      healthy: 0,
      mildInfection: 0,
      severeInfection: 0
    };

    lines.slice(1).forEach(line => {
      const classification = line.split(',')[2];
      if (classification === 'Healthy') stats.healthy++;
      else if (classification === 'Mild Infection') stats.mildInfection++;
      else if (classification === 'Severe Infection') stats.severeInfection++;
    });

    res.json(stats);

  } catch (error) {
    console.error('Error calculating statistics:', error);
    res.status(500).json({ 
      error: 'Failed to calculate statistics',
      message: error.message 
    });
  }
});

// Delete all results (for testing)
app.delete('/api/results', (req, res) => {
  try {
    // Reset CSV file
    fs.writeFileSync('analysis_results.csv', 'Filename,Timestamp,Classification\n');
    
    // Delete uploaded images
    const uploadDir = './uploads';
    if (fs.existsSync(uploadDir)) {
      fs.readdirSync(uploadDir).forEach(file => {
        fs.unlinkSync(path.join(uploadDir, file));
      });
    }

    res.json({ success: true, message: 'All results deleted' });

  } catch (error) {
    console.error('Error deleting results:', error);
    res.status(500).json({ 
      error: 'Failed to delete results',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Initialize and start server
async function startServer() {
  await initGoogleSheets();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   POST /api/analyze - Upload and analyze image`);
    console.log(`   GET  /api/results - Get all results`);
    console.log(`   GET  /api/statistics - Get statistics`);
    console.log(`   DELETE /api/results - Delete all results\n`);
  });
}

startServer();