const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Serve static files from current directory
app.use(express.static(path.join(__dirname), {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// Secure backend route for Gemini AI
app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt } = req.body;
        const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCwmEBt-Aij0NwTuqqCp5gzz9R3O8VvjnQ'; // Fallback for local testing
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        // Dynamically import node-fetch (since we are on node 18, we have global fetch, but if we need a library we'd use it. Node 18 has native fetch)
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        res.json({ result: data.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error('Gemini Backend Error:', error);
        res.status(500).json({ error: error.message || 'Failed to communicate with AI' });
    }
});

// Fallback to index.html for SPA-like behavior
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`StudyPal is running on port ${PORT}`);
});
