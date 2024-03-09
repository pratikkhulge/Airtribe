const connection = require('../database/db');

exports.registerLead = (req, res) => {
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
};

exports.updateLead = (req, res) => {
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
};

exports.searchLeads = (req, res) => {
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
};

exports.getAllLeads = (req, res) => {
    const sql = 'SELECT * FROM leads';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching leads:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
};
