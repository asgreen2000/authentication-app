const app = (require('express'))()
const User = require('../models/User');
const fetch = require('node-fetch');
const {LOGIN_METHOD} = require('../utils/ConstData');
const UserQuery = require('../utils/UserQuery');
const bcrypt = require ('bcrypt');
require('dotenv').config();


const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;

app.get('/login', (req, res) => {

    //console.log(user.validateSync().errors['method'].properties.message)
    if (req.session.isLogged) {
        res.redirect('/profile')
    }
    else 
    res.render('Login', {
       css: 'login',
       logMsg: req.session.logMsg
    });

});

app.get('/logout', (req, res) => {

    //console.log(user.validateSync().errors['method'].properties.message)
    req.session.destroy();

    res.redirect('/login');
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


const findGitHubUser = async (githubID) => {

    try {
        const user = User.findOne({'method': LOGIN_METHOD.GIT, 'methodID': githubID});
        return user
    } catch (error) {
        return null;
    }
}

app.get("/login/github/callback", async (req, res) => {
    const code = req.query.code;
    const access_token = await getAccessToken({ code, client_id, client_secret });
    const github_user = await fetchGitHubUser(access_token);
    
    
    if (!github_user) {
        
        res.redirect('/login');
        //res.send(user);
       
    } else {

        const user = await findGitHubUser(github_user.id);
        req.session.isLogged = true;
        
        // if this is the first time you login with this account, system will create a new user in db
        if (!user)
        {
            const newUser = User({
                name: github_user.name,
                avatarUrl: github_user.avatar_url,
                method: LOGIN_METHOD.GIT,
                methodID: github_user.id
            });

            const data = await newUser.save();
            
            req.session._id = data._id;
        } else {

            req.session._id = user._id;
        }
        res.redirect('/profile');
    }
});


app.post('/login', async (req, res) => {

    try {
        const username = req.body.username;
        const password = req.body.password;
        const foundUser = await UserQuery.findUserByUsername(username);

        if (!foundUser) {
            req.session.logMsg = "User doesn't exist!";
            res.redirect('/login');
        }
        else if(!bcrypt.compareSync(password, foundUser.password)){
            req.session.logMsg = "Wrong password!";
            res.redirect('/login');
        }
        else {
            req.session._id = foundUser._id;
            req.session.isLogged = true;
            res.redirect('/profile');
        }
    } catch (error) {
        
    }


});


module.exports = app;