const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const cors = require('cors');

const usersRouter = require('./routes/users');
const organizationRouter = require('./routes/organization');
const subjectRouter = require('./routes/subject');
const uploadRouter = require('./routes/upload');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/organization', organizationRouter);
app.use('/api/subject', subjectRouter);
app.use('/api/upload', uploadRouter);

const port = process.env.PORT || 3090;
const server = app.listen(port, () => {
    console.log(`-------------------------------------------------------`)
    console.log(`  NodeJS Backend Server started on port ${port}`)
    console.log(`-------------------------------------------------------`)
});