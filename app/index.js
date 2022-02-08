const express = require('express');
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/User');
const fetch = require('node-fetch');

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

app.use(express.static(__dirname + '/public'));
// config 
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: "adgjmptw", 
    cookie: { maxAge: 60000 }}));

app.get('/login', (req, res) => {


    
    //console.log(user.validateSync().errors['method'].properties.message)

    res.render('Login', {
       css: 'login' 
    });

});

app.get('/login/github', (req, res) => {

    const redirect_uri = "http://localhost:3000/login/github/callback";
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`
  );
});


async function getAccessToken({ code, client_id, client_secret }) {
    const request = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code
      })
    });
    const text = await request.text();
    const params = new URLSearchParams(text);
    return params.get("access_token");
}

async function fetchGitHubUser(token) {
    const request = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: "token " + token
      }
    });
    return await request.json();
}

app.get("/login/github/callback", async (req, res) => {
    const code = req.query.code;
    const access_token = await getAccessToken({ code, client_id, client_secret });
    const user = await fetchGitHubUser(access_token);
    if (user) {
        
        res.send(user);
    } else {
        res.send("Login did not succeed!");
    }
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