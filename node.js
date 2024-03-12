const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 4000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'manish',
    database: 'Todo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.query('SELECT * FROM Contracter WHERE email = ?', [email]);

        connection.release();

        if (rows.length > 0) {
            const user = rows[0];

            if (ispasswordvalidation) {
                req.session.userId = user.id;

                res.redirect('/blank.html');
                return;
            } else {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error signing in user:", error);
        res.status(500).json({ success: false, message: `Error signing in user: ${error.message}` });
    }
});


app.get('/blank page.html', (req, res) => {
    res.sendFile(__dirname + '/blank page.html');
});

app.get('/blank.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/blank.css');
});

app.get('/todo.html', (req, res) => {
    res.sendFile(__dirname + '/todo.html');
});

app.get('/todo.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/todo.css');
});

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
