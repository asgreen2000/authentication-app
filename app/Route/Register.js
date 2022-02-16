const app = (require('express'))()
const User = require('../models/User');
const UserQuery = require('../utils/UserQuery');

app.get('/register', (req, res) => {

    //console.log(user.validateSync().errors['method'].properties.message)

    res.render('Register', {
       css: 'register',
       errorMsg: req.session.errorMsg 
    });
    req.session.destroy();
});

app.post('/register', async (req, res) => {

    
    const username = req.body.username;
    const password = req.body.password;
    
    try {

        const existed = await UserQuery.findUserByUsername(username);
        
        if (existed) {
            req.session.errorMsg = "Username already exists!";
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
        req.session.errorMsg = "Errors occurred!";
        res.redirect('/register');
    }
   


});


module.exports = app;

