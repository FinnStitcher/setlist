const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 1934;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/setlist-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(PORT, () => console.log('http://localhost:' + PORT));