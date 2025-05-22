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