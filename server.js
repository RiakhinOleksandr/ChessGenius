import express from 'express'; 
import {getUser, createUser, getRandomPuzzle } from "./server/bd.js";

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

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
}); 