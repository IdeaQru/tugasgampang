const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'school'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Fetch all courses for the dropdown menu
app.get('/courses', (req, res) => {
  const query = `SELECT id, course_name FROM courses`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching courses');
    } else {
      res.json(results);
    }
  });
});

// Fetch all students and their courses
app.get('/students-courses', (req, res) => {
  const query = `
    SELECT students.id, students.name, courses.course_name 
    FROM students
    JOIN courses ON students.course_id = courses.id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// Add a new student
app.post('/add-student', (req, res) => {
  const { name, course_id } = req.body;
  const query = `INSERT INTO students (name, course_id) VALUES (?, ?)`;

  db.query(query, [name, course_id], (err, result) => {
    if (err) {
      res.status(500).send('Error inserting data');
    } else {
      res.json({ message: 'Student added successfully' });
    }
  });
});

// Add a new course
app.post('/add-course', (req, res) => {
  const { course_name } = req.body;
  const query = `INSERT INTO courses (course_name) VALUES (?)`;

  db.query(query, [course_name], (err, result) => {
    if (err) {
      res.status(500).send('Error inserting data');
    } else {
      res.json({ message: 'Course added successfully' });
    }
  });
});

// Edit a student
app.put('/edit-student/:id', (req, res) => {
  const { id } = req.params;
  const { name, course_id } = req.body;
  const query = `UPDATE students SET name = ?, course_id = ? WHERE id = ?`;

  db.query(query, [name, course_id, id], (err, result) => {
    if (err) {
      res.status(500).send('Error updating data');
    } else {
      res.json({ message: 'Student updated successfully' });
    }
  });
});

// Delete a student
app.delete('/delete-student/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM students WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send('Error deleting data');
    } else {
      res.json({ message: 'Student deleted successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
