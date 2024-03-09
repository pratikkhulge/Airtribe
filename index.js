const express = require('express');
const bodyParser = require('body-parser');
const courseRoutes = require('./courses/courseRoutes');
const leadRoutes = require('./leads/leadRoutes');
const commentRoutes = require('./comments/commentRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/courses', courseRoutes);
app.use('/leads', leadRoutes);
app.use('/comments', commentRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Airtribe API!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
});
