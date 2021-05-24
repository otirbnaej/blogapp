const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const admin = require('./routes/admin');
const main = require('./routes/main');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Categoria');
const Categoria = mongoose.model('categorias');

// CONFIGURATION
// Sessão
app.use(session({
    secret: "DJFAPLSCXMAW",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    // Dropdown
    Categoria.find().lean()
    .then((categoria) => {
        res.locals.categories = categoria;
    });

    next();
});

// Body parser
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

// Handlebars
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Mongoose
mongoose.connect("mongodb://localhost/blogapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>
    console.log("Connection stablished")
);

// Public API
app.use(express.static(path.join(__dirname, "public")));
// ------------------------------------------------//

// Rotas
app.use('/', main);
app.use('/admin', admin);

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});