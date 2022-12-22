if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError'); // need to look if needs to download something
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users');
const winningRoutes = require('./routes/winnings');
const reviewRoutes = require('./routes/reviews');
const MongoDBStore = require('connect-mongo');

mongoose.set('strictQuery', false); // this added after trying to deploy, maybe need to put in other place!!!!!

const dbUrl = process.env.DB_URL; //'mongodb://localhost:27017/konkursi';  - this for development cloud database Atlas



mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(express.static('public')); // added middleware for adding static images from imgs folder in publis!!!

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'; // process.env.SECRET;  - this for production ; 'thisshouldbeabettersecret!' - this for development;

//this below in the production phase
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

//this below in the production phase
store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    store,
    name: 'session',  //random name needed to be decided, security issues
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,   //when production, needs to have below -  secure: true? 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());


// //here lines 87 - 136 (everything about content security needs to be checked before production)
// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
//     "https://res.cloudinary.com/dfjnipy1g/"
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
//     "https://cdn.jsdelivr.net/",
//     "https://res.cloudinary.com/dfjnipy1g/"
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
//     "https://res.cloudinary.com/dfjnipy1g/"
// ];
// const fontSrcUrls = ["https://res.cloudinary.com/dfjnipy1g/"];

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/dfjnipy1g/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//             mediaSrc: [ "https://res.cloudinary.com/dfjnipy1g/" ],
//             childSrc: [ "blob:" ]
//         },
//     })
// );

//below here for login sessions, authenticate is automatic passport method. 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes)
app.use('/laimesti', winningRoutes)
app.use('/laimesti/:id/atsauksmes', reviewRoutes)

app.get('/programma', (req, res) => {
    res.render('programma')
})

app.get('/:par-:ka-:laimet', (req, res) => {
    res.render('laimet')
})

app.get('/', (req, res) => {
    res.render('home');
});

//Error handler for wrong urls, this below will only run if nothing else has matched first above. 
app.all('*', (req, res, next) => {
    next(new ExpressError('Lapa netika atrasta', 404))
})

//here below we set our error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Kaut kas nogāja greizi!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
}) 