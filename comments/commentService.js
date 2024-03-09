const connection = require('../database/db');

exports.addComment = (req, res) => {
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
                // Check if a comment already exists for the given lead_id and instructor_id
                connection.query('SELECT * FROM comments WHERE lead_id = ? AND instructor_id = ?', [lead_id, instructor_id], (commentErr, commentResult) => {
                    if (commentErr) {
                        console.error('Error checking comment:', commentErr);
                        res.status(500).json({ message: 'Internal server error' });
                    } else {
                        if (commentResult.length > 0) {
                            // If comment exists, update it
                            const updateSql = 'UPDATE comments SET comment = ? WHERE lead_id = ? AND instructor_id = ?';
                            connection.query(updateSql, [comment, lead_id, instructor_id], (updateErr, updateResult) => {
                                if (updateErr) {
                                    console.error('Error updating comment:', updateErr);
                                    res.status(500).json({ message: 'Internal server error' });
                                } else {
                                    res.json({ message: 'Comment updated successfully' });
                                }
                            });
                        } else {
                            // If comment doesn't exist, insert it
                            const insertSql = 'INSERT INTO comments (lead_id, instructor_id, comment) VALUES (?, ?, ?)';
                            connection.query(insertSql, [lead_id, instructor_id, comment], (insertErr, insertResult) => {
                                if (insertErr) {
                                    console.error('Error adding comment:', insertErr);
                                    res.status(500).json({ message: 'Internal server error' });
                                } else {
                                    res.json({ message: 'Comment added successfully' });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
};

exports.getAllComments = (req, res) => {
    const sql = 'SELECT * FROM comments';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching comments:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
};
