const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('----> Server Started..');
});

let users = [
    { id: 1, name: 'Bhaskar' },
    { id: 2, name: 'Varun' }
];

//get all users
app.get('/users', (req, res) => {
    res.json(users);
});

//Start the Server
app.listen(3000, () => {
    console.log('Server is running on port 3000,\nAccess server with http://localhost:3000');
});