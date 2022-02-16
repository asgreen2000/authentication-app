const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const LoginRoute = require('./Route/Login');
const ProfileRoute = require('./Route/Profile');
const RegisterRoute = require('./Route/Register');

require('dotenv').config();


const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;

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
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static(__dirname + '/public'));
// config 
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: "adgjmptw", 
    cookie: { maxAge: 60000 }}));


app.use(LoginRoute);
app.use(ProfileRoute);
app.use(RegisterRoute);





app.listen(process.env.PORT | 3000, () => {


    console.log("Server is running!");

});