const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config();

// Connect Database

const connectDB = async () => {

    
    try {
        mongoose.connect(
            process.env.DB_URL,
            { 
              useNewUrlParser: true,
              useUnifiedTopology: true
            }
        );
        console.log("Connected DB");
    } catch (error) {
        
        console.log(error);
        process.exit(1);
    }
}

connectDB();

// set view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
// config 
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: "adgjmptw", 
    cookie: { maxAge: 60000 }}));

app.get('/login', (req, res) => {


    const user = new User({

        name: "DatBui",
        method: "DEFAULT"

    });

    //console.log(user.validateSync().errors['method'].properties.message)

    res.render('Login', {
       css: 'login' 
    });

});

app.get('/register', (req, res) => {


    const user = new User({

        name: "DatBui",
        method: "DEFAULT"

    });

    //console.log(user.validateSync().errors['method'].properties.message)

    res.render('Register', {
       css: 'register' 
    });

});


app.listen(process.env.PORT | 3000, () => {


    console.log("Server is running!");

});