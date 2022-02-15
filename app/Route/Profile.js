const app = (require('express'))()
const UserQuery = require('../utils/UserQuery');

app.get('/profile', async (req, res) => {

    if (req.session.isLogged === undefined || req.session.isLogged === false)
    {
      res.redirect('/login')
    }
    else {
        
      const user = await UserQuery.findUser(req.session._id);
    
      res.render('Profile', {
        css: 'profile',
        user: user
      });
    }
  
  });

module.exports = app;