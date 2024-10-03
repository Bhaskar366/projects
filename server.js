const express = require('express');
const mysql = require(`mysql2`);
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('---> Server Started..');
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000, \nAccess server with http://localhost:3000`);
});

//create a connection to mysql database

const db = mysql.createConnection({
    host: `localhost`,
    user: `root`,
    password: `mysql`,
    database: `new_db`

});

//connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the databse:', err.stack);
        return;
    }
    console.log(`connected to the database: ${db.config.database}`);
});

//server status
app.get(`/`, (req, res) => {
    res.send(`server is Ready...`);
});

//get all users
app.get(`/users`, (req, res) => {
    db.query(`SELECT * FROM users`, (err, results) => {
        if (err) {
            return res.status(500).send(`Database query failed`);
        }
        res.json(results);
    });
});

//post a new user
app.post(`/users`, (req, res) => {
    if (!req.body.name) {
        return res.status(400).send('Name is required');
    }
    const newUser = {
        name: req.body.name
    };

    db.query(`INSERT INTO users SET ?`, newUser, (err, result) => {
        if (err) {
            return res.status(500).send(`Database insert failed`);
        }
        newUser.id = result.insertId; //get the inserted ID
        res.status(201).json(newUser);
    });
});