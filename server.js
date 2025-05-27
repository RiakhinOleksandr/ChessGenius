import express from 'express'; 
import {getUser, createUser, getRandomPuzzle, setPuzzleSolved, getRandomPuzzles, blitzPuzzlesPlayed, 
    seriesPuzzlesPlayed, getBestPuzzleSolvers, getBestBlitzPuzzleSolvers, getBestSeriesPuzzleSolvers } from "./server/bd.js";

const app = express(); 
const port = process.env.PORT || 4000; 

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});
app.use(express.json())

app.post('/api/login', async (req, res) => {
    let { login, password } = req.body;
    let rows = await getUser(login, password);
    res.json(rows);
});

app.post('/api/register', async (req, res) => {
    let { login, password } = req.body;
    let rows = await createUser(login, password);
    res.json(rows);
});

app.post('/api/puzzle', async (req, res) => {
    let { userId, userRating } = req.body;
    let puzzle = await getRandomPuzzle(userId, userRating);
    res.json(puzzle);
});

app.post('/api/puzzle-solved', async (req, res) => {
    let { userId, puzzleId, userRating, puzzleRating, solved } = req.body;
    let puzzle = await setPuzzleSolved(userId, puzzleId, userRating, puzzleRating, solved);
    res.json(puzzle);
});

app.post('/api/puzzles', async (req, res) => {
    let { startRating, incrementRating, n } = req.body;
    let puzzle = await getRandomPuzzles(startRating, incrementRating, n);
    res.json(puzzle);
});

app.post('/api/blitz-solved', async (req, res) => {
    let { userId, result } = req.body;
    let puzzle = await blitzPuzzlesPlayed(userId, result);
    res.json(puzzle);
});

app.post('/api/series-solved', async (req, res) => {
    let { userId, result } = req.body;
    let puzzle = await seriesPuzzlesPlayed(userId, result);
    res.json(puzzle);
});

app.post('/api/best-puzzle', async (req, res) => {
    let { n } = req.body;
    let puzzle = await getBestPuzzleSolvers(n);
    res.json(puzzle);
});

app.post('/api/best-blitz', async (req, res) => {
    let { n } = req.body;
    let puzzle = await getBestBlitzPuzzleSolvers(n);
    res.json(puzzle);
});

app.post('/api/best-series', async (req, res) => {
    let { n } = req.body;
    let puzzle = await getBestSeriesPuzzleSolvers(n);
    res.json(puzzle);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
}); 