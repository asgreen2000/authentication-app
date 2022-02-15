const User = require('../models/User');
const mongoose = require('mongoose');

const findUser = async (_id) => {

    
   
    try {

        const objectID = new mongoose.Types.ObjectId(_id);
        
        const user = User.findOne({_id: objectID});
        
        return user;
    } catch (error) {
        
        console.log(error)
        return null
    }
}

module.exports = {findUser}