const mongoose = require("mongoose");

const {LOGIN_METHOD} = require('../utils/ConstData');

const UserSchema = new mongoose.Schema(
  { 
    name: {
      type: String,
      min: 3,
      max: 20
    },
    username: {
      type: String,
      min: 3,
      max: 20,
      unique: true,
      required: () => {
          return this.method == LOGIN_METHOD.DF
      }
    },
    email: {
      type: String,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      min: 6,
      required: () => {
        return this.method == LOGIN_METHOD.DF
      }
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      max: 15,
    },
    bio: {
        type: String,
        max: 5000,
    }
    ,
    method: {
        type: String,
        enum: {
            values: [LOGIN_METHOD.FB, LOGIN_METHOD.GG, LOGIN_METHOD.GIT, LOGIN_METHOD.TT, LOGIN_METHOD.DF],
            message: '{VALUE} is not supported'
        },
        default: LOGIN_METHOD.DF
    },
    methodID: {
        type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);