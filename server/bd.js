import {Pool} from "pg";
import bcrypt from "bcrypt";

const client = new Pool({
  user: 'pro100sasha',
  host: 'localhost',
  database: 'chess',
  password: '123456789',
  port: 5432,
});

export async function getUser(login, password){
    let res = await client.query(
        "SELECT * FROM users WHERE login = $1",
        [login]
    );

    if (res.rows.length === 0) {
        return { error: "Невірний логін або пароль" };
    }

    let user = res.rows[0];
    let isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        return { user };
    } 
    else {
        return { error: "Невірний логін або пароль" };
    }
}

export async function createUser(login, password, admin=false){
    let user = await client.query(
        "SELECT * FROM users WHERE login = $1",
        [login]
    );

    if (user.rows.length === 0) {
        let today = new Date().toISOString().split('T')[0];
        const hashedPassword = await bcrypt.hash(password, 10);
        let res = await client.query(
            "INSERT INTO users (login, password, registration_date, admin) VALUES ($1, $2, $3, $4) ON CONFLICT(login) DO NOTHING RETURNING *;",
            [login, hashedPassword, today, admin]
        );
        return res.rows;
    }
    else{
        return {error: "Користувач з таким логіном вже існує"};
    }
}

export async function getRandomPuzzle(id, rating){
    let [solvedPuzzleIds, allPossiblePuzzles] = await Promise.all([
        client.query(
        "SELECT puzzle_id FROM puzzles_solved WHERE user_id=$1 AND solved;",
        [id]),
        client.query(
        "SELECT puzzle_id, fen, moves, rating, themes FROM puzzles WHERE rating BETWEEN $1 AND $2;",
        [Math.floor(rating - 400), Math.ceil(rating + 400)])
    ]);
    solvedPuzzleIds = solvedPuzzleIds.rows.flatMap(obj => Object.values(obj));
    let allPossiblePuzzlesIds = allPossiblePuzzles.rows.flatMap(obj => Object.values(obj)[0]);
    allPossiblePuzzlesIds = allPossiblePuzzlesIds.filter((item) => !solvedPuzzleIds.includes(item));
    if(allPossiblePuzzlesIds.length > 0){
        let puzzle_id_choiced = allPossiblePuzzlesIds[Math.floor(Math.random() * allPossiblePuzzlesIds.length)];
        let puzzle_choiced = allPossiblePuzzles.rows.find(u => u.puzzle_id === puzzle_id_choiced);
        return puzzle_choiced;
    }
    else{
        return {error: "Не знайдено невирішених задач"}
    }
}

export async function setPuzzleSolved(userId, puzzleId, userRating, puzzleRating, solved){
    let e = 1 / (1 + 10^((puzzleRating - userRating) / 400));
    let s = solved ? 1 : 0;
    let k;
    if(userRating > 2500){
        k = 10;
    }
    else if(userRating > 1500){
        k = 20;
    }
    else{
        k = 40;
    }
    let increment = k * (s - e)
    let newUserRating = userRating + increment;
    if (newUserRating <= 150){
        newUserRating = 150;
        increment = newUserRating - userRating;
    }
    else if(newUserRating >= 3400){
        newUserRating = 3400;
        increment = newUserRating - userRating;
    }
    let ins = client.query(
        "INSERT INTO puzzles_solved (user_id, puzzle_id, solved) VALUES ($1, $2, $3);",
        [userId, puzzleId, solved]
    );
    let res = await client.query(
        "UPDATE users SET puzzle_rating = puzzle_rating + $1, puzzles_solved = puzzles_solved + 1 WHERE user_id = $2 RETURNING *;",
        [increment, userId]
    );
    if(res.rows.length > 0){
        return res.rows;
    }
    else{
        return {error: "Щось пішло не так"};
    }
}