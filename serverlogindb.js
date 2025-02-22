const express = require(`express`);
const bodyParser = require(`body-parser`);
const mysql = require(`mysql2`);
const path = require(`path`);
const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(3000, () => {
    console.log(`Server is running on port 3000, access server with http://localhost:3000`);
});

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: `mysql`,
    database: `new_db`
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error(`Error connecting to the database:`, err.stack);
        return;
    }
    console.log(`Connected to the database: ${db.config.database}`);
});

// Serve the login.html file when accessing the root URL
app.get(`/`, (req, res) => {
    res.sendFile(path.join(__dirname, `public`, `login1.html`));
});

// Login route
app.post(`/login`, (req, res) => {
    const { username, password } = req.body;

    // Query to check if the username and password match in the database
    const sql = `SELECT * FROM login WHERE username = ? AND password = ?`;
    +
        db.query(sql, [username, password], (err, results) => {
            if (err) {
                return res.status(500).send('Database query failed');
            }

            if (results.length > 0) {
                res.send(`Welcome, ${username}!`);
            } else {
                res.status(401).send(`Invalid username or password`);
            }
        });
});

// Route to fetch students
app.get(`/students`, (req, res) => {
    const sql = `SELECT * FROM enroll`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Route to register a new student
app.post(`/register`, (req, res) => {
    const { name, email, phone, course, city, education } = req.body;
    const sql = `INSERT INTO enroll (name, email, phone, course, city, education) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, email, phone, course, city, education], (err, result) => {
        if (err) throw err;
        res.send(`Student registered successfully!`);
    });
});