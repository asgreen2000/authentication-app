const app = (require('express'))()
const User = require('../models/User');
const UserQuery = require('../utils/UserQuery');
const bcrypt = require ('bcrypt');
require('dotenv').config();

app.get('/register', (req, res) => {

    //console.log(user.validateSync().errors['method'].properties.message)

    res.render('Register', {
       css: 'register',
       regMsg: req.session.regMsg 
    });
    req.session.destroy();
});

app.post('/register', async (req, res) => {

    try {

        const username = req.body.username;
        
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUND));
        const password = bcrypt.hashSync(req.body.password, salt);
        const existed = await UserQuery.findUserByUsername(username);
        
        if (existed) {
            req.session.regMsg = "Username already exists!";
            res.redirect('/register');
        }
        else {
            const user = User({
                username: username,
                password: password
            });
            
            const data = await user.save();
            req.session._id = data._id;
            req.session.isLogged = true;
            res.redirect('/profile');
        }
    } catch (error) {
        req.session.regMsg = "Errors occurred!";
        console.log(error)
        res.redirect('/register');
    }
   


});


module.exports = app;

