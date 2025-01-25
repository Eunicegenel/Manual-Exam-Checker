const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import path module

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ManualChecker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected to ManualChecker');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Define Score Schema
const scoreSchema = new mongoose.Schema({
    examName: { type: String, required: true },
    score: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const Score = mongoose.model('Score', scoreSchema);

// Serve static files (Frontend)
app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Index.html'));
});

// Save Score API
app.post('/save-score', async (req, res) => {
    const { examName, score } = req.body;

    if (!examName || !score) {
        return res.status(400).send({ message: 'Exam name and score are required.' });
    }

    try {
        const newScore = new Score({ examName, score });
        await newScore.save();
        res.status(200).send({ message: 'Score saved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error saving score.' });
    }
});

// Fetch Scores API
app.get('/get-scores', async (req, res) => {
    try {
        const scores = await Score.find().sort({ date: -1 }); // Fetch scores sorted by date (latest first)
        res.status(200).send(scores);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error fetching scores.' });
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
