const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const routes = require('./routes');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

require('dotenv').config();

const store = new session.MemoryStore();
const sessionObj = {
    secret: process.env.SECRET,
    cookie: {
        maxAge: 2592000000
    },
    resave: false,
    saveUninitialized: false,
    store: store
};

const app = express();
const PORT = process.env.PORT || 1999;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'src')));
app.use(session(sessionObj));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/setlist-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(PORT, () => console.log('http://localhost:' + PORT));