const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'airtribe'
});

// Connect to MySQL
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Airtribe API!');
});

// Create course API
app.post('/courses', (req, res) => {
    const { instructor_id, name, max_seats, start_date } = req.body;

    // Insert the new record
    const sql = 'INSERT INTO courses (instructor_id, name, max_seats, start_date) VALUES (?, ?, ?, ?)';
    connection.query(sql, [instructor_id, name, max_seats, start_date], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                // Handle duplicate entry error
                res.status(400).json({ message: `Duplicate entry: Course '${name}' already exists for instructor ${instructor_id}` });
            } else {
                console.error('Error creating course:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            res.json({ id: result.insertId, instructor_id, name, max_seats, start_date });
        }
    });
});

// Update course details API
app.put('/courses/:identifier', (req, res) => {
    const identifier = req.params.identifier;
    const { name, max_seats, start_date, instructor_id } = req.body;

    let sql;
    let sqlParams;

    if (!isNaN(identifier)) {
        // If identifier is numeric, treat it as ID
        sql = 'UPDATE courses SET instructor_id=?, name=?, max_seats=?, start_date=? WHERE id=?';
        sqlParams = [instructor_id, name, max_seats, start_date, identifier];
    } else {
        // If identifier is a string, treat it as name
        sql = 'UPDATE courses SET instructor_id=?, max_seats=?, start_date=? WHERE name=?';
        sqlParams = [instructor_id, max_seats, start_date, identifier];
    }

    connection.query(sql, sqlParams, (err, result) => {
        if (err) {
            console.error('Error updating course:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Course not found' });
            } else {
                res.json({ message: 'Course updated successfully' });
            }
        }
    });
});

// Course registration API
app.post('/leads', (req, res) => {
    const { course_id, name, email, phone_number, linkedin_profile } = req.body;
    const sql = 'INSERT INTO leads (course_id, name, email, phone_number, linkedin_profile, status) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [course_id, name, email, phone_number, linkedin_profile, 'Waitlist'], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                // Handle duplicate entry error
                res.status(400).json({ message: `Duplicate entry: Lead already exists for course ${course_id} with email ${email}` });
            } else {
                console.error('Error registering lead:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            res.json({ id: result.insertId, course_id, name, email, phone_number, linkedin_profile, status: 'Waitlist' });
        }
    });
});

// Update lead API
app.put('/leads/:identifier', (req, res) => {
    const identifier = req.params.identifier;
    const { status } = req.body;

    let sql;
    let sqlParams;

    if (identifier.includes('@')) {
        // If identifier contains '@', treat it as an email
        sql = 'UPDATE leads SET status=? WHERE email=?';
        sqlParams = [status, identifier];
    } else {
        // Treat identifier as ID
        sql = 'UPDATE leads SET status=? WHERE id=?';
        sqlParams = [status, identifier];
    }

    connection.query(sql, sqlParams, (err, result) => {
        if (err) {
            console.error('Error updating lead:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Lead not found' });
            } else {
                res.json({ message: 'Lead updated successfully' });
            }
        }
    });
});

// Lead search API
app.get('/leads', (req, res) => {
    const { name, phoneNumber, status } = req.query;
    let sql = 'SELECT * FROM leads WHERE 1 = 1';
    const params = [];

    if (name) {
        sql += ' AND name LIKE ?';
        params.push(`%${name}%`);
    }

    if (phoneNumber) {
        sql += ' AND phone_number LIKE ?';
        params.push(`%${phoneNumber}%`);
    }

    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }

    connection.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error searching leads:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
});


// Add comment API
app.post('/comments', (req, res) => {
    const { lead_id, instructor_id, comment } = req.body;

    // Check if the lead exists
    connection.query('SELECT * FROM leads WHERE id = ?', [lead_id], (err, result) => {
        if (err) {
            console.error('Error checking lead:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (result.length === 0) {
                // If lead doesn't exist, return a 404 response
                res.status(404).json({ message: 'Lead not found' });
            } else {
                // Insert the comment
                const sql = 'INSERT INTO comments (lead_id, instructor_id, comment) VALUES (?, ?, ?)';
                connection.query(sql, [lead_id, instructor_id, comment], (err, result) => {
                    if (err) {
                        console.error('Error adding comment:', err);
                        res.status(500).json({ message: 'Internal server error' });
                    } else {
                        res.json({ id: result.insertId, lead_id, instructor_id, comment });
                    }
                });
            }
        }
    });
});

// Get all courses API
app.get('/all-courses', (req, res) => {
    const sql = 'SELECT * FROM courses';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching courses:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
});

// Get all leads API
app.get('/all-leads', (req, res) => {
    const sql = 'SELECT * FROM leads';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching leads:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
});

// Get all comments API
app.get('/all-comments', (req, res) => {
    const sql = 'SELECT * FROM comments';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching comments:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
});
