const connection = require('../database/db');

exports.createCourse = (req, res) => {
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
    res.end( 
        'Connect FrontEnd',
         'To test this API, you can use the following command:\n' +
                     'curl -X POST http://localhost:3001/courses -H "Content-Type: application/json" -d \'{"instructor_id": 1, "name": "Introduction to Programming Language", "max_seats": 50, "start_date": "2024-04-01"}\''
    );
};

exports.updateCourse = (req, res) => {
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
};

exports.getAllCourses = (req, res) => {
    const sql = 'SELECT * FROM courses';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching courses:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
};
