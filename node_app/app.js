const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'testdb'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
  connection.query('CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)', (err) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('Table "people" created successfully!');
  });
});

app.get('/', (req, res) => {
  const name = 'Full Cycle';
  connection.query('INSERT INTO people (name) VALUES (?)', [name], (err) => {
    if (err) {
      console.error('Error inserting into database:', err);
      res.status(500).send('Server Error');
      return;
    }

    connection.query('SELECT name FROM people', (err, results) => {
      if (err) {
        console.error('Error fetching from database:', err);
        res.status(500).send('Server Error');
        return;
      }

      let response = '<h1>Full Cycle Rocks!</h1>';
      response += '<ul>';
      results.forEach(row => {
        response += `<li>${row.name}</li>`;
      });
      response += '</ul>';

      res.send(response);
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
